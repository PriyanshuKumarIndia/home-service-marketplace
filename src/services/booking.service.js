const { Booking, Service, User, BookingLog, BookingProviderAction, sequelize } = require("../db/models");
const { Op } = require("sequelize");

const createBooking = async (payload) => {
    try {
        const { customer_id, service_id, scheduled_date, price } = payload;
        const scheduledDate = new Date(scheduled_date);
        const existingBooking = await Booking.findOne({
            where: {
                customer_id,
                service_id,
                scheduled_date: scheduledDate,
                status: "PENDING"
            }
        });

        if (existingBooking) {
            return {
                code: 0,
                message: "Pending booking already exists for this user and service on the selected date.",
            };
        }

        const servise = await Service.findByPk(service_id);
        if (!servise) {
            return {
                code: 0,
                message: "Service not found",
            };
        }

        if (servise.price != price) {
            return {
                code: 0,
                message: `Price mismatch. The correct price for this service is ${servise.price}.`,
            };
        }

        const booking = await Booking.create({
            customer_id,
            service_id,
            scheduled_date: scheduledDate,
            price,
            status: "PENDING",
        });

        return {
            code: 1,
            message: "Booking created successfully",
            data: booking,
        };
    } catch (error) {
        console.error("Booking creation failed: ", error);
        throw error;
    }
};

const getBookingById = async (id) => {
    try {
        const booking = await Booking.findOne({
            where: { id },
            include: [
                { model: User, as: 'customer', required: true, attributes: ['id', 'name', 'email'] },
                { model: User, as: 'provider', required: false, attributes: ['id', 'name', 'email'] },
                { model: Service, as: 'service', required: true, attributes: ['id', 'name', 'description'] }
            ],
        });
        if (!booking) {
            return {
                code: 0,
                message: "Booking not found",
            };
        }
        return {
            code: 1,
            message: "Booking fetched successfully",
            data: booking,
        };
    } catch (error) {
        console.error("Error fetching booking by ID: ", error);
        throw error;
    }
};

const getAllBookingList = async (query) => {
    try {
        const page = Number.parseInt(query.page, 10) || 1;
        const limit = Number.parseInt(query.limit, 10) || 10;
        const offset = (page - 1) * limit;

        const serviceWhere = {};
        const where = {};
        
        const rejectedBookings = BookingProviderAction.findAll({
            where: { provider_id: query.providerId, action: 'REJECTED' },
            attributes: ['booking_id']
        });
        const rejectedBookingIds = (await rejectedBookings).map(rb => rb.booking_id);
        if (rejectedBookingIds.length > 0) 
            where.id = { [Op.notIn]: rejectedBookingIds };

        if (query.status) {
            where.status = query.status;
        }

        if (query.customer_id) {
            where.customer_id = query.customer_id;
        }


        if (query.provider_id) {

            where.provider_id = query.provider_id;
        }

        if (query.search) {
            serviceWhere.name = { [Op.iLike]: `%${query.search}%` }
        }

        const { rows, count } = await Booking.findAndCountAll({
            where,
            include: [
                { model: User, as: 'customer', required: true, attributes: ['id', 'name', 'email'] },
                { model: User, as: 'provider', required: false, attributes: ['id', 'name', 'email'] },
                { model: Service, as: 'service', where: serviceWhere, required: true, attributes: ['id', 'name', 'description'] }
            ],

            limit,
            offset,
            order: [["created_at", "DESC"]],
        });

        return {
            code: 1,
            message: "Service list fetched successfully",
            data: {
                list: rows,
                pagination: {
                    total: count,
                    page,
                    limit,
                    totalPages: Math.ceil(count / limit),
                },
            },
        };
    } catch (error) {
        console.error("Get Booking List Error:", error);
        return {
            code: 0,
            message: "Failed to fetch bookings",
            errors: error,
        };
    }
};

const updateBooking = async (id, payload) => {
    const transaction = await sequelize.transaction();
    try {
        const booking = await Booking.findByPk(id, { transaction });
        if (!booking) {
            return {
                code: 0,
                message: "Booking not found",
            };
        }
        const { status, provider_id, reason, scheduled_date, service_id } = payload;

        if (status) booking.status = status;
        if (provider_id) booking.provider_id = provider_id;
        if (reason) booking.reason = reason;
        if (scheduled_date) booking.scheduled_date = new Date(scheduled_date);
        if (service_id) booking.service_id = service_id;
        await booking.save({ transaction });

        await transaction.commit();
        return {
            code: 1,
            message: "Booking updated successfully",
            data: booking,
        };
    } catch (error) {
        console.error("Booking update failed: ", error);
        await transaction.rollback();
        throw error;
    }
};

const assignProviderToBooking = async (bookingId, providerId) => {
    const transaction = await sequelize.transaction();
    try {
        const booking = await Booking.findByPk(bookingId, { transaction });
        if (!booking) {
            return {
                code: 0,
                message: "Booking not found",
            };
        }
        if (booking.status !== "PENDING") {
            return {
                code: 0,
                message: "Only pending bookings can be assigned to a provider",
            };
        }
        const log = {
            status_from: booking.status,
            status_to: "ASSIGNED",
        }
        booking.status = "ASSIGNED";
        booking.provider_id = providerId;

        await BookingLog.create({
            booking_id: booking.id,
            log,
            changed_by: providerId,
        }, { transaction });

        await booking.save({ transaction });
        await transaction.commit();
        return {
            code: 1,
            message: "Provider assigned to booking successfully",
            data: booking,
        };
    } catch (error) {
        console.error("Assign provider to booking failed: ", error);
        await transaction.rollback();
        throw error;
    }
};

const updateToInProgress = async (bookingId, providerId) => {
    const transaction = await sequelize.transaction();
    try {
        const booking = await Booking.findByPk(bookingId, { transaction });
        if (!booking) {
            return {
                code: 0,
                message: "Booking not found",
            };
        }
        if (booking.provider_id !== providerId) {
            return {
                code: 0,
                message: "Only assigned provider can update the booking status",
            };
        }
        if (booking.status !== "ASSIGNED") {
            return {
                code: 0,
                message: "Only assigned bookings can be updated to in-progress",
            };
        }
        const log = {
            status_from: booking.status,
            status_to: "IN_PROGRESS",
        }
        booking.status = "IN_PROGRESS";
        await BookingLog.create({
            booking_id: booking.id,
            log,
            changed_by: providerId,
        }, { transaction });
        await booking.save({ transaction });
        await transaction.commit();
        return {
            code: 1,
            message: "Booking status updated to in-progress successfully",
            data: booking,
        };
    } catch (error) {
        console.error("Update booking to in-progress failed: ", error);
        await transaction.rollback();
        throw error;
    }
};

const updateToCompleted = async (bookingId, providerId) => {
    const transaction = await sequelize.transaction();
    try {
        const booking = await Booking.findByPk(bookingId, { transaction });
        if (!booking) {
            return {
                code: 0,
                message: "Booking not found",
            };
        }
        if (booking.provider_id !== providerId) {
            return {
                code: 0,
                message: "Only assigned provider can update the booking status",
            };
        }
        if (booking.status !== "IN_PROGRESS") {
            return {
                code: 0,
                message: "Only in-progress bookings can be updated to completed",
            };
        }
        const log = {
            status_from: booking.status,
            status_to: "COMPLETED",
        }
        booking.status = "COMPLETED";
        await BookingLog.create({
            booking_id: booking.id,
            log,
            changed_by: providerId,
        }, { transaction });
        await BookingProviderAction.create({
            booking_id: booking.id,
            providerId,
            action: 'COMPLETED',
        }, { transaction });
        await booking.save({ transaction });
        await transaction.commit();
        return {
            code: 1,
            message: "Booking status updated to completed successfully",
            data: booking,
        };
    } catch (error) {
        console.error("Update booking to completed failed: ", error);
        await transaction.rollback();
        throw error;
    }
};

const cancelBooking = async (payload) => {
    const transaction = await sequelize.transaction();
    try {
        const { booking_id, reason, cancelled_by } = payload;
        const booking = await Booking.findByPk(booking_id, { transaction });
        if (!booking) {
            return {
                code: 0,
                message: "Booking not found",
            };
        }
        let status = "CANCELLED";

        if (booking.status === "COMPLETED" || booking.status === "CANCELLED") {
            return {
                code: 0,
                message: "Completed or Cancelled booking cannot be cancelled",
            };
        }

        if (booking.provider_id === cancelled_by) {
            if (booking.status !== "ASSIGNED")
                return {
                    code: 0,
                    message: "Only assigned bookings can be cancelled by provider",
                };

            status = "PENDING";
            const log = {
                status_from: booking.status,
                status_to: status,
                reason: reason || "Cancelled"
            }
            await BookingLog.create({
                booking_id: booking.id,
                log,
                changed_by: booking.provider_id,
            }, { transaction });
        } else if (cancelled_by === booking.customer_id) {
            const log = {
                status_from: booking.status,
                status_to: status,
                reason: reason || "Cancelled"
            }
            await BookingLog.create({
                booking_id: booking.id,
                log,
                changed_by: booking.customer_id,
            }, { transaction });
        } else {
            return {
                code: 0,
                message: "Only assigned provider or customer can cancel the booking",
            };
        }

        booking.status = status;
        if (reason) booking.reason = reason;
        await booking.save({ transaction });

        await transaction.commit();
        return {
            code: 1,
            message: "Booking cancelled successfully",
            data: booking,
        };
    } catch (error) {
        console.error("Booking cancellation failed: ", error);
        await transaction.rollback();
        throw error;
    }
};

const rejectBookingByProvider = async (payload) => {
    const transaction = await sequelize.transaction();
    try {
        const { booking_id, provider_id } = payload;
        const booking = await Booking.findByPk(booking_id, { transaction });
        if (!booking) {
            return {
                code: 0,
                message: "Booking not found",
            };
        }

        if (booking.status !== "PENDING") {
            return {
                code: 0,
                message: "Only pending bookings can be rejected",
            };
        }

        const log = {
            status: 'Booking rejected by provider',
        }
        await BookingLog.create({
            booking_id: booking.id,
            log,
            changed_by: provider_id,
        }, { transaction });

        await BookingProviderAction.create({
            booking_id: booking.id,
            provider_id,
            action: 'REJECTED',
        }, { transaction });
        await transaction.commit();
        return {
            code: 1,
            message: "Booking rejected successfully",
            data: booking,
        };
    } catch (error) {
        console.error("Rejecting booking failed:", error);
        await transaction.rollback();
        throw error;
    }
};

module.exports = {
    createBooking,
    getBookingById,
    getAllBookingList,
    updateBooking,
    assignProviderToBooking,
    updateToInProgress,
    updateToCompleted,
    cancelBooking,
    rejectBookingByProvider
};