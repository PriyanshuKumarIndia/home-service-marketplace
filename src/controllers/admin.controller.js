const adminService = require("../services/admin.service");
const { sendSuccess, sendError, StatusCodes } = require("../helpers/response.helper");

const getAllBookings = async (req, res) => {
    try {
        const result = await adminService.getAllBookings(req.query);
        
        if (result.code === 0) {
            return sendError(res, result.message, StatusCodes.UNPROCESSABLE_ENTITY, result.errors || []);
        }
        
        return sendSuccess(res, result.message, StatusCodes.OK, result.data);
    } catch (error) {
        console.error("Admin Get All Bookings Controller Error:", error);
        return sendError(res, "Internal server error", StatusCodes.INTERNAL_SERVER_ERROR, error?.message);
    }
};

const forceUpdateBookingStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const adminId = req.user?.id; // Assuming admin ID comes from auth middleware
        
        const result = await adminService.forceUpdateBookingStatus(id, req.body, adminId);
        
        if (result.code === 0) {
            return sendError(res, result.message, StatusCodes.UNPROCESSABLE_ENTITY, result.errors || []);
        }
        
        return sendSuccess(res, result.message, StatusCodes.OK, result.data);
    } catch (error) {
        console.error("Admin Force Update Booking Controller Error:", error);
        return sendError(res, "Internal server error", StatusCodes.INTERNAL_SERVER_ERROR, error?.message);
    }
};

const assignProvider = async (req, res) => {
    try {
        const { booking_id, provider_id } = req.body;
        const adminId = req.user?.id;
        
        const result = await adminService.assignProvider(booking_id, provider_id, adminId);
        
        if (result.code === 0) {
            return sendError(res, result.message, StatusCodes.UNPROCESSABLE_ENTITY, result.errors || []);
        }
        
        return sendSuccess(res, result.message, StatusCodes.OK, result.data);
    } catch (error) {
        console.error("Admin Assign Provider Controller Error:", error);
        return sendError(res, "Internal server error", StatusCodes.INTERNAL_SERVER_ERROR, error?.message);
    }
};

const cancelBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const { reason } = req.body;
        const adminId = req.user?.id;
        
        const result = await adminService.cancelBooking(id, reason, adminId);
        
        if (result.code === 0) {
            return sendError(res, result.message, StatusCodes.UNPROCESSABLE_ENTITY, result.errors || []);
        }
        
        return sendSuccess(res, result.message, StatusCodes.OK, result.data);
    } catch (error) {
        console.error("Admin Cancel Booking Controller Error:", error);
        return sendError(res, "Internal server error", StatusCodes.INTERNAL_SERVER_ERROR, error?.message);
    }
};

const getBookingStats = async (req, res) => {
    try {
        const result = await adminService.getBookingStats(req.query);
        
        if (result.code === 0) {
            return sendError(res, result.message, StatusCodes.UNPROCESSABLE_ENTITY, result.errors || []);
        }
        
        return sendSuccess(res, result.message, StatusCodes.OK, result.data);
    } catch (error) {
        console.error("Admin Get Booking Stats Controller Error:", error);
        return sendError(res, "Internal server error", StatusCodes.INTERNAL_SERVER_ERROR, error?.message);
    }
};

const getBookingLogs = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await adminService.getBookingLogs(id);
        
        if (result.code === 0) {
            return sendError(res, result.message, StatusCodes.UNPROCESSABLE_ENTITY, result.errors || []);
        }
        
        return sendSuccess(res, result.message, StatusCodes.OK, result.data);
    } catch (error) {
        console.error("Admin Get Booking Logs Controller Error:", error);
        return sendError(res, "Internal server error", StatusCodes.INTERNAL_SERVER_ERROR, error?.message);
    }
};

const deleteBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const adminId = req.user?.id;
        
        const result = await adminService.deleteBooking(id, adminId);
        
        if (result.code === 0) {
            return sendError(res, result.message, StatusCodes.UNPROCESSABLE_ENTITY, result.errors || []);
        }
        
        return sendSuccess(res, result.message, StatusCodes.OK, result.data);
    } catch (error) {
        console.error("Admin Delete Booking Controller Error:", error);
        return sendError(res, "Internal server error", StatusCodes.INTERNAL_SERVER_ERROR, error?.message);
    }
};

const bulkUpdateBookings = async (req, res) => {
    try {
        const { booking_ids, ...updateData } = req.body;
        const adminId = req.user?.id;
        
        if (!booking_ids || !Array.isArray(booking_ids) || booking_ids.length === 0) {
            return sendError(res, "booking_ids array is required", StatusCodes.BAD_REQUEST, []);
        }
        
        const result = await adminService.bulkUpdateBookings(booking_ids, updateData, adminId);
        
        if (result.code === 0) {
            return sendError(res, result.message, StatusCodes.UNPROCESSABLE_ENTITY, result.errors || []);
        }
        
        return sendSuccess(res, result.message, StatusCodes.OK, result.data);
    } catch (error) {
        console.error("Admin Bulk Update Bookings Controller Error:", error);
        return sendError(res, "Internal server error", StatusCodes.INTERNAL_SERVER_ERROR, error?.message);
    }
};

const login = async (req, res) => {
    try {        
        const result = await adminService.adminLogin(req.body);
        
        if (result.code === 0) {
            return sendError(res, result.message, StatusCodes.UNPROCESSABLE_ENTITY, result.errors || []);
        }
        
        return sendSuccess(res, result.message, StatusCodes.OK, result.data);
    } catch (error) {
        console.error("Admin Login Controller Error:", error);
        return sendError(res, "Internal server error", StatusCodes.INTERNAL_SERVER_ERROR, error?.message);
    }
}

module.exports = {
    getAllBookings,
    forceUpdateBookingStatus,
    assignProvider,
    cancelBooking,
    getBookingStats,
    getBookingLogs,
    deleteBooking,
    bulkUpdateBookings,
    login
};