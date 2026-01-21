const { Op } = require("sequelize");
const { Service } = require("../db/models");
const serviceTypes = require("../constants/serviceType.constant");

// add service api
const addService = async (payload) => {
    try {
        const { name, type, price, description } = payload;
        const slug = name.toUpperCase().replaceAll(/\s+/g, '_');
        // Duplicate service check
        const existingService = await Service.findOne({
            where: { slug },
        });

        if (existingService) {
            return { code: 0, message: "Service already exists", };
        }

        // Create service
        const service = await Service.create({
            name,
            slug,
            type,
            price,
            description,
            status: true
        });

        return {
            code: 1,
            message: "Service created successfully",
            data: service,
        };
    } catch (error) {
        console.error("Add Service Service Error:", error);
        return {
            code: 0,
            message: "Internal server error",
            errors: error
        };
    }
};

// delete service api
const deleteService = async (id) => {
    try {
        // Service exist check
        const service = await Service.findByPk(id);
        if (!service) {
            return {
                code: 0,
                message: "Service not found",
            };
        }
        // Soft delete 
        await service.destroy();

        return {
            code: 1,
            message: "Service deleted successfully",
        };
    } catch (error) {
        console.error("Delete Service Service Error:", error);
        return {
            code: 0,
            message: "Internal server error",
            errors: error,
        };
    }
};

// getAll Service list api
const getAllServiceList = async (query) => {
    try {
        const page = Number.parseInt(query.page, 10) || 1;
        const limit = Number.parseInt(query.limit, 10) || 10;
        const offset = (page - 1) * limit;

        const where = { status: true };

        if (query.search) {
            where.name = { [Op.iLike]: `%${query.search}%` }
        }

        const { rows, count } = await Service.findAndCountAll({
            where,
            attributes: ['id', 'name', 'type', 'price', 'description'],
            limit,
            offset,
            order: [["name", "ASC"]],
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
        console.error("Get Service List Error:", error);
        return {
            code: 0,
            message: "Failed to fetch services",
            errors: error,
        };
    }
};

const getServiceTypeDropdown = async () => {
    try {
        const data = Object.keys(serviceTypes).map(key => ({
            label: serviceTypes[key],
            value: key
        }))
        return {
            code: 1, 
            message: "Service types fetched successfully",
            data
        };
    } catch (error) {
        console.error("Get Service dropdown Error:", error);
        return {
            code: 0,
            message: "Failed to fetch Service Types",
            errors: error,
        };
    }
}

module.exports = {
    addService,
    deleteService,
    getAllServiceList,
    getServiceTypeDropdown
}