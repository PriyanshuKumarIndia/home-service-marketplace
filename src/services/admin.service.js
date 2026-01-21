const { Booking, Service, User, BookingLog, BookingProviderAction, sequelize } = require("../db/models");
const { Op } = require("sequelize");
const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/jwt.util");

const getAllBookings = async (query) => {
    try {
        const page = Number.parseInt(query.page, 10) || 1;
        const limit = Number.parseInt(query.limit, 10) || 10;
        const offset = (page - 1) * limit;

        const where = {};
        const serviceWhere = {};
        const customerWhere = {};
        const providerWhere = {};

        if (query.status) where.status = query.status;
        if (query.customer_id) where.customer_id = query.customer_id;
        if (query.provider_id) where.provider_id = query.provider_id;
        if (query.service_id) where.service_id = query.service_id;

        if (query.date_from && query.date_to) {
            where.scheduled_date = {
                [Op.between]: [new Date(query.date_from), new Date(query.date_to)]
            };
        }

        if (query.search) {
            serviceWhere.name = { [Op.iLike]: `%${query.search}%` };
        }

        if (query.customer_search) {
            customerWhere.name = { [Op.iLike]: `%${query.customer_search}%` };
        }

        if (query.provider_search) {
            providerWhere.name = { [Op.iLike]: `%${query.provider_search}%` };
        }

        const { rows, count } = await Booking.findAndCountAll({
            where,
            include: [
                {
                    model: User,
                    as: 'customer',
                    where: Object.keys(customerWhere).length ? customerWhere : undefined,
                    required: true,
                    attributes: ['id', 'name', 'email']
                },
                {
                    model: User,
                    as: 'provider',
                    where: Object.keys(providerWhere).length ? providerWhere : undefined,
                    required: false,
                    attributes: ['id', 'name', 'email']
                },
                {
                    model: Service,
                    as: 'service',
                    where: Object.keys(serviceWhere).length ? serviceWhere : undefined,
                    required: true,
                    attributes: ['id', 'name', 'description', 'price']
                }
            ],
            limit,
            offset,
            order: [["created_at", "DESC"]],
        });

        return {
            code: 1,
            message: "Bookings fetched successfully",
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
        console.error("Admin Get All Bookings Error:", error);
        throw error;
    }
};

// Force update any booking status (admin override)
const forceUpdateBookingStatus = async (bookingId, payload, adminId) => {
    const transaction = await sequelize.transaction();
    try {
        const booking = await Booking.findByPk(bookingId, { transaction });
        if (!booking) {
            return { code: 0, message: "Booking not found" };
        }

        const { status, provider_id, reason } = payload;
        const oldStatus = booking.status;

        if (status) booking.status = status;
        if (provider_id !== undefined) booking.provider_id = provider_id;
        if (reason) booking.reason = reason;

        await booking.save({ transaction });

        await BookingLog.create({
            booking_id: booking.id,
            log: {
                status_from: oldStatus,
                status_to: status || oldStatus,
                reason: reason || "Admin override",
                admin_action: true
            },
            changed_by: adminId,
        }, { transaction });

        await transaction.commit();
        return {
            code: 1,
            message: "Booking updated successfully by admin",
            data: booking,
        };
    } catch (error) {
        await transaction.rollback();
        console.error("Admin Force Update Booking Error:", error);
        throw error;
    }
};

// Assign provider to booking (admin action)
const assignProvider = async (bookingId, providerId, adminId) => {
    const transaction = await sequelize.transaction();
    try {
        const booking = await Booking.findByPk(bookingId, { transaction });
        if (!booking) {
            return { code: 0, message: "Booking not found" };
        }

        const provider = await User.findByPk(providerId, { transaction });
        if (!provider) {
            return { code: 0, message: "Provider not found" };
        }

        const oldProviderId = booking.provider_id;
        const oldStatus = booking.status;

        booking.provider_id = providerId;
        booking.status = "ASSIGNED";
        await booking.save({ transaction });

        await BookingLog.create({
            booking_id: booking.id,
            log: {
                status_from: oldStatus,
                status_to: "ASSIGNED",
                provider_from: oldProviderId,
                provider_to: providerId,
                admin_action: true
            },
            changed_by: adminId,
        }, { transaction });

        await transaction.commit();
        return {
            code: 1,
            message: "Provider assigned successfully",
            data: booking,
        };
    } catch (error) {
        await transaction.rollback();
        console.error("Admin Assign Provider Error:", error);
        throw error;
    }
};

// Cancel any booking (admin override)
const cancelBooking = async (bookingId, reason, adminId) => {
    const transaction = await sequelize.transaction();
    try {
        const booking = await Booking.findByPk(bookingId, { transaction });
        if (!booking) {
            return { code: 0, message: "Booking not found" };
        }

        if (booking.status === "CANCELLED") {
            return { code: 0, message: "Booking is already cancelled" };
        }

        const oldStatus = booking.status;
        booking.status = "CANCELLED";
        booking.reason = reason || "Cancelled by admin";
        await booking.save({ transaction });

        await BookingLog.create({
            booking_id: booking.id,
            log: {
                status_from: oldStatus,
                status_to: "CANCELLED",
                reason: reason || "Cancelled by admin",
                admin_action: true
            },
            changed_by: adminId,
        }, { transaction });

        await transaction.commit();
        return {
            code: 1,
            message: "Booking cancelled successfully",
            data: booking,
        };
    } catch (error) {
        await transaction.rollback();
        console.error("Admin Cancel Booking Error:", error);
        throw error;
    }
};

// Get booking statistics for admin dashboard
const getBookingStats = async (query) => {
    try {
        const dateFilter = {};
        if (query.date_from && query.date_to) {
            dateFilter.scheduled_date = {
                [Op.between]: [new Date(query.date_from), new Date(query.date_to)]
            };
        }

        const stats = await Promise.all([
            Booking.count({ where: { ...dateFilter, status: "PENDING" } }),
            Booking.count({ where: { ...dateFilter, status: "ASSIGNED" } }),
            Booking.count({ where: { ...dateFilter, status: "IN_PROGRESS" } }),
            Booking.count({ where: { ...dateFilter, status: "COMPLETED" } }),
            Booking.count({ where: { ...dateFilter, status: "CANCELLED" } }),
            Booking.count({ where: dateFilter }),
            Booking.sum('price', { where: { ...dateFilter, status: "COMPLETED" } })
        ]);

        return {
            code: 1,
            message: "Booking statistics fetched successfully",
            data: {
                pending: stats[0],
                assigned: stats[1],
                in_progress: stats[2],
                completed: stats[3],
                cancelled: stats[4],
                total: stats[5],
                revenue: stats[6] || 0
            },
        };
    } catch (error) {
        console.error("Admin Get Booking Stats Error:", error);
        throw error;
    }
};

// Get booking logs for audit trail
const getBookingLogs = async (bookingId) => {
    try {
        const logs = await BookingLog.findAll({
            where: { booking_id: bookingId },
            include: [
                {
                    model: User,
                    as: 'changedBy',
                    attributes: ['id', 'name', 'email'],
                    required: false
                }
            ],
            order: [["created_at", "DESC"]],
        });

        return {
            code: 1,
            message: "Booking logs fetched successfully",
            data: logs,
        };
    } catch (error) {
        console.error("Admin Get Booking Logs Error:", error);
        throw error;
    }
};

// Delete booking (hard delete - admin only)
const deleteBooking = async (bookingId, adminId) => {
    const transaction = await sequelize.transaction();
    try {
        const booking = await Booking.findByPk(bookingId, { transaction });
        if (!booking) {
            return { code: 0, message: "Booking not found" };
        }

        // Delete related logs and actions first
        await BookingLog.destroy({ where: { booking_id: bookingId }, transaction });
        await BookingProviderAction.destroy({ where: { booking_id: bookingId }, transaction });

        // Delete the booking
        await booking.destroy({ transaction });

        await transaction.commit();
        return {
            code: 1,
            message: "Booking deleted successfully",
        };
    } catch (error) {
        await transaction.rollback();
        console.error("Admin Delete Booking Error:", error);
        throw error;
    }
};

// Bulk update bookings - but did't added the route for this in admin.route.js (I will do later because of time constraint)
const bulkUpdateBookings = async (bookingIds, payload, adminId) => {
    const transaction = await sequelize.transaction();
    try {
        const { status, provider_id, reason } = payload;

        const bookings = await Booking.findAll({
            where: { id: { [Op.in]: bookingIds } },
            transaction
        });

        if (bookings.length === 0) {
            return { code: 0, message: "No bookings found" };
        }

        const updates = [];
        for (const booking of bookings) {
            const oldStatus = booking.status;
            const oldProviderId = booking.provider_id;

            if (status) booking.status = status;
            if (provider_id !== undefined) booking.provider_id = provider_id;
            if (reason) booking.reason = reason;

            await booking.save({ transaction });

            await BookingLog.create({
                booking_id: booking.id,
                log: {
                    status_from: oldStatus,
                    status_to: status || oldStatus,
                    provider_from: oldProviderId,
                    provider_to: provider_id || oldProviderId,
                    reason: reason || "Bulk update by admin",
                    admin_action: true
                },
                changed_by: adminId,
            }, { transaction });

            updates.push(booking.id);
        }

        await transaction.commit();
        return {
            code: 1,
            message: `${updates.length} bookings updated successfully`,
            data: { updated_booking_ids: updates },
        };
    } catch (error) {
        await transaction.rollback();
        console.error("Admin Bulk Update Bookings Error:", error);
        throw error;
    }
};

// only admins can login using this service
const adminLogin = async (payload) => {
    try {
        const { email, password } = payload;
        const adminRoleNames = ["ADMIN", "SUPER ADMIN"];
        const adminRoles = await Role.findAll({
            where: {
                name: {
                    [Op.in]: adminRoleNames,
                },
            },
        });
        const adminRoleIds = adminRoles.map(role => role.id);

        const user = await User.findOne({
            where: { email, isActive: true, role_id: { [Op.in]: adminRoleIds } },
            attributes: ['id', 'email', 'isActive', 'password'],
        });

        if (!user) {
            return { code: 0, message: "Invalid email" };
        }
        const accountStatus = user.isActive;

        if (!accountStatus) {
            return {
                code: 0,
                message: "Account is inactive. Please verify your email or contact admin.",
                data: null
            }
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return { code: 0, message: "Wrong password" };
        }

        const token = generateToken(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        return {
            code: 1,
            message: "Login successful",
            data: {
                id: user.id,
                name: user.name,
                email: user.email,
                token,
            },
        };
    } catch (error) {
        console.error("Login Service Error:", error);
        throw error;
    }
};

module.exports = {
    getAllBookings,
    forceUpdateBookingStatus,
    assignProvider,
    cancelBooking,
    getBookingStats,
    getBookingLogs,
    deleteBooking,
    bulkUpdateBookings,
    adminLogin
};