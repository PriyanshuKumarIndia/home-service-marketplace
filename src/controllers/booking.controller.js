const bookingService = require("../services/booking.service");
const { sendSuccess, sendError, StatusCodes, } = require("../helpers/response.helper");

const createBooking = async (req, res) => {
    try {
        const result = await bookingService.createBooking(req.body);

        if (result.code === 0) {
            return sendError(
                res,
                result.message,
                StatusCodes.UNPROCESSABLE_ENTITY,
                result.errors?.message || []
            );
        }

        return sendSuccess(res, result.message, StatusCodes.CREATED, result.data);
    } catch (error) {
        console.error("Booking Controller create Error:", error);
        return sendError(
            res,
            "Internal server error",
            StatusCodes.INTERNAL_SERVER_ERROR,
            error?.message
        );
    }
};

const getBookingDetailsById = async (req, res) => {
    try {
        const result = await bookingService.getBookingById(req.params.id);
        return sendSuccess(res, result.message, StatusCodes.CREATED, result.data);
    } catch (error) {
        console.error("Error fetching booking details: ", error);
        return sendError(
            res,
            "Internal server error",
            StatusCodes.INTERNAL_SERVER_ERROR,
            error?.message
        );
    }
};

const getAllBookingList = async (req, res) => {
    try {
        const result = await bookingService.getAllBookingList(req.query);

        if (result.code === 0) {
            return sendError(res, result.message, StatusCodes.UNPROCESSABLE_ENTITY, result.errors || []);
        }
        return sendSuccess(res, result.message, StatusCodes.OK, result.data);
    } catch (error) {
        console.error("Get Booking List Controller Error:", error);
        return sendError(res, "Internal server error", StatusCodes.INTERNAL_SERVER_ERROR, error);
    }
};

const getPendingBookings = async (req, res) => {
    try {
        const { providerId } = req.body;
        if (!providerId) {
            return sendError(res, "providerId is required", StatusCodes.BAD_REQUEST, []);
        }
        const result = await bookingService.getAllBookingList({ status: 'PENDING', providerId, ...req.query });

        if (result.code === 0) {
            return sendError(res, result.message, StatusCodes.UNPROCESSABLE_ENTITY, result.errors || []);
        }
        return sendSuccess(res, result.message, StatusCodes.OK, result.data);
    } catch (error) {
        console.error("Get pending bookings Controller Error:", error);
        return sendError(res, "Internal server error", StatusCodes.INTERNAL_SERVER_ERROR, error);
    }
};

const assignProviderToBooking = async (req, res) => {
    try {
        const { booking_id, provider_id } = req.body;
        const result = await bookingService.assignProviderToBooking(booking_id, provider_id);

        if (result.code === 0) {
            return sendError(res, result.message, StatusCodes.UNPROCESSABLE_ENTITY, result.errors || []);
        }
        return sendSuccess(res, result.message, StatusCodes.OK, result.data);
    } catch (error) {
        console.error("Assign provider to booking Controller Error:", error);
        return sendError(res, "Internal server error", StatusCodes.INTERNAL_SERVER_ERROR, error);
    }
};

const updateBookingToProgress = async (req, res) => {
    try {
        const { booking_id, provider_id } = req.body;
        const result = await bookingService.updateToInProgress(booking_id, provider_id);
        if (result.code === 0) {
            return sendError(res, result.message, StatusCodes.UNPROCESSABLE_ENTITY, result.errors || []);
        }
        return sendSuccess(res, result.message, StatusCodes.OK, result.data);
    } catch (error) {
        console.error("Update booking status Controller Error:", error);
        return sendError(res, "Internal server error", StatusCodes.INTERNAL_SERVER_ERROR, error);
    }
};

const updateBookingToCompleted = async (req, res) => {
    try {
        const { booking_id, provider_id } = req.body;
        const result = await bookingService.updateToCompleted(booking_id, provider_id);
        if (result.code === 0) {
            return sendError(res, result.message, StatusCodes.UNPROCESSABLE_ENTITY, result.errors || []);
        }
        return sendSuccess(res, result.message, StatusCodes.OK, result.data);
    } catch (error) {
        console.error("Update booking to completed Controller Error:", error);
        return sendError(res, "Internal server error", StatusCodes.INTERNAL_SERVER_ERROR, error);
    }
};

const cancelBooking = async (req, res) => {
    try {
        const result = await bookingService.cancelBooking(req.body);
        if (result.code === 0) {
            return sendError(res, result.message, StatusCodes.UNPROCESSABLE_ENTITY, result.errors || []);
        }
        return sendSuccess(res, result.message, StatusCodes.OK, result.data);
    } catch (error) {
        console.error("Cancel booking Controller Error:", error);
        return sendError(res, "Internal server error", StatusCodes.INTERNAL_SERVER_ERROR, error);
    }
};

const rejectBooking = async (req, res) => {
    try {
        const result = await bookingService.rejectBookingByProvider(req.body);
        if (result.code === 0) {
            return sendError(res, result.message, StatusCodes.UNPROCESSABLE_ENTITY, result.errors || []);
        }
        return sendSuccess(res, result.message, StatusCodes.OK, result.data);
    } catch (error) {
        console.error("Reject booking Controller Error:", error);
        return sendError(res, "Internal server error", StatusCodes.INTERNAL_SERVER_ERROR, error);
    }
};

module.exports = {
    createBooking,
    getBookingDetailsById,
    getAllBookingList,
    getPendingBookings,
    assignProviderToBooking,
    updateBookingToProgress,
    updateBookingToCompleted,
    cancelBooking,
    rejectBooking
};
