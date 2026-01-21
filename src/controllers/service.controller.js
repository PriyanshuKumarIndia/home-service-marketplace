const service = require("../services/service.service");
const { sendSuccess, sendError, StatusCodes } = require("../helpers/response.helper");

const createService = async (req, res) => {
    try {
        const result = await service.addService(req.body);

        if (result.code === 0) {
            return sendError(res, result.message, StatusCodes.UNPROCESSABLE_ENTITY, result.errors || []);
        }

        return sendSuccess(res, result.message, StatusCodes.CREATED, result.data);

    } catch (error) {
        console.error("Create Service Controller Error:", error);
        return sendError(res, "Internal server error", StatusCodes.INTERNAL_SERVER_ERROR, error);
    }
};

const destroyService = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await service.deleteService(id);

        if (result.code === 0) {
            return sendError(res, result.message, StatusCodes.UNPROCESSABLE_ENTITY, result.errors || []);
        }

        return sendSuccess(res, result.message, StatusCodes.OK, result.data);
    } catch (error) {
        console.error("Delete Service Controller Error:", error);
        return sendError(res, "Internal server error", StatusCodes.INTERNAL_SERVER_ERROR, error);
    }
};

const getServiceList = async (req, res) => {
    try {
        const result = await service.getAllServiceList(req.query);

        if (result.code === 0) {
            return sendError(res, result.message, StatusCodes.UNPROCESSABLE_ENTITY, result.errors || []);
        }
        return sendSuccess(res, result.message, StatusCodes.OK, result.data);
    } catch (error) {
        console.error("Get Service List Controller Error:", error);
        return sendError(res, "Internal server error", StatusCodes.INTERNAL_SERVER_ERROR, error);
    }
};

const getServiceTypeDropdown = async (req, res) => {
    try {
        const result = await service.getServiceTypeDropdown();
        if (result.code === 0) {
            return sendError(res, result.message, StatusCodes.UNPROCESSABLE_ENTITY, result.errors || []);
        }
        return sendSuccess(res, "Service Types fetched successfully", StatusCodes.OK, result.data);
    } catch (error) {
        console.error("Get Service Type Dropdown Controller Error:", error);
        return sendError(res, "Internal server error", StatusCodes.INTERNAL_SERVER_ERROR, error);
    }
};

module.exports = {
    createService,
    destroyService,
    getServiceList,
    getServiceTypeDropdown
};



