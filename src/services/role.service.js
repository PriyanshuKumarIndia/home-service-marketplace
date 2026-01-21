const { Op } = require("sequelize");
const { Role } = require("../db/models");

// add role api
const addRole = async (payload) => {
    try {
        const { name } = payload;
        // Duplicate role check
        const existingRole = await Role.findOne({
            where: { name },
        });

        if (existingRole) {
            return { code: 0, message: "Role already exists", };
        }

        // Create role
        const role = await Role.create({
            name: name
        });

        return {
            code: 1,
            message: "Role created successfully",
            data: role,
        };
    } catch (error) {
        console.error("Add Role Service Error:", error);
        return {
            code: 0,
            message: "Internal server error",
            errors: error
        };
    }
};

// dowpdown role api
const getAllRoles = async () => {
    try {
        const roles = await Role.findAll({
            where: {
                name: {
                    [Op.ne]: "SUPER ADMIN",
                },
            },
        });

        return {
            code: 1,
            message: "Role dropdown fetched successfully",
            data: roles,
        };
    } catch (error) {
        console.error("Get Role Dropdown Error:", error);
        return {
            code: 0, message: "Failed to fetch roles", errors: error,
        };
    }
};

// delete role api
const deleteRole = async (id) => {
    try {
        // Role exist check
        const role = await Role.findByPk(id);
        if (!role) {
            return {
                code: 0,
                message: "Role not found",
            };
        }

        if (role.name === "SUPERADMIN") {
            return {
                code: 0,
                message: "SUPERADMIN role cannot be deleted",
            };
        }
        // Soft delete 
        await role.destroy();

        return {
            code: 1,
            message: "Role deleted successfully",
        };
    } catch (error) {
        console.error("Delete Role Service Error:", error);
        return {
            code: 0,
            message: "Internal server error",
            errors: error,
        };
    }
};

//update role api
const updateRole = async (id, payload) => {
    try {
        const { name } = payload;

        // Check role exists
        const role = await Role.findByPk(id);

        if (!role) {
            return {
                code: 0,
                message: "Role not found",
            };
        }
        if (role.name === "SUPERADMIN") {
            return {
                code: 0,
                message: "SUPERADMIN role cannot be updated",
            };
        }
        // Duplicate name check
        if (name) {
            const existingRole = await Role.findOne({
                where: {
                    name,
                    id: { [Op.ne]: id },
                },
            });

            if (existingRole) {
                return {
                    code: 0,
                    message: "Role name already exists",
                };
            }
        }

        // Update role
        await role.update(
            { name: name ?? role.name },
            {
                where: { id: role.id }
            }
        );

        return {
            code: 1,
            message: "Role updated successfully",
            data: role,
        };
    } catch (error) {
        console.error("Update Role Service Error:", error);
        return {
            code: 0,
            message: "Internal server error",
            errors: error,
        };
    }
};

// getAll Role list api
const getAllRoleList = async (query) => {
    try {
        const page = Number.parseInt(query.page, 10) || 1;
        const limit = Number.parseInt(query.limit, 10) || 10;
        const offset = (page - 1) * limit;

        const where = {
            [Op.and]: [
                { name: { [Op.ne]: "SUPER ADMIN" } }
            ]
        };

        if (query.search) {
            where[Op.and].push({
                name: { [Op.iLike]: `%${query.search}%` }
            });
        }

        const { rows, count } = await Role.findAndCountAll({
            where,
            limit,
            offset,
            order: [["created_at", "DESC"]],
        });

        return {
            code: 1,
            message: "Role list fetched successfully",
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
        console.error("Get Role List Error:", error);
        return {
            code: 0,
            message: "Failed to fetch roles",
            errors: error,
        };
    }
};

module.exports = {
    addRole,
    getAllRoles,
    deleteRole,
    updateRole,
    getAllRoleList
}