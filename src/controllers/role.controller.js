const roleService = require("../services/role.service");
const { sendSuccess, sendError, StatusCodes } = require("../helpers/response.helper");

const createRole = async (req, res) => {
    try {
        const result = await roleService.addRole(req.body);

        if (result.code === 0) {
            return sendError(res, result.message, StatusCodes.UNPROCESSABLE_ENTITY, result.errors || []);
        }

        return sendSuccess(res, result.message, StatusCodes.CREATED, result.data);

    } catch (error) {
        console.error("Create Role Controller Error:", error);
        return sendError(res, "Internal server error", StatusCodes.INTERNAL_SERVER_ERROR, error);
    }
};


const getRoleDropdown = async (req, res) => {
    try {
        const result = await roleService.getAllRoles();

        if (result.code === 0) {
            return sendError(res, result.message, StatusCodes.UNPROCESSABLE_ENTITY, result.errors || []);
        }

        return sendSuccess(res, result.message, StatusCodes.OK, result.data);
    } catch (error) {
        console.error("Get Role Dropdown Controller Error:", error);
        return sendError(res, "Internal server error", StatusCodes.INTERNAL_SERVER_ERROR, error);
    }
};

const destroyRole = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await roleService.deleteRole(id);

        if (result.code === 0) {
            return sendError(res, result.message, StatusCodes.UNPROCESSABLE_ENTITY, result.errors || []);
        }

        return sendSuccess(res, result.message, StatusCodes.OK, result.data);
    } catch (error) {
        console.error("Delete Role Controller Error:", error);
        return sendError(res, "Internal server error", StatusCodes.INTERNAL_SERVER_ERROR, error);
    }
};

const updateRole = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await roleService.updateRole(id, req.body);

        if (result.code === 0) {
            return sendError(res, result.message, StatusCodes.UNPROCESSABLE_ENTITY, result.errors || []);
        }

        return sendSuccess(res, result.message, StatusCodes.OK, result.data);
    } catch (error) {
        console.error("Update Role Controller Error:", error);
        return sendError(res, "Internal server error", StatusCodes.INTERNAL_SERVER_ERROR, error);
    }
};

const getRoleList = async (req, res) => {
    try {
        const result = await roleService.getAllRoleList(req.query);

        if (result.code === 0) {
            return sendError(res, result.message, StatusCodes.UNPROCESSABLE_ENTITY, result.errors || []);
        }
        return sendSuccess(res, result.message, StatusCodes.OK, result.data);
    } catch (error) {
        console.error("Get Role List Controller Error:", error);
        return sendError(res, "Internal server error", StatusCodes.INTERNAL_SERVER_ERROR, error);
    }
};

module.exports = {
    createRole,
    getRoleDropdown,
    destroyRole,
    updateRole,
    getRoleList
};



