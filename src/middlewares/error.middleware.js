const { sendError, StatusCodes } = require('../helpers/response.helper');

const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
};

const errorHandler = (err, _req, res, _next) => {
    const statusCode = res.statusCode === 200 ? StatusCodes.INTERNAL_SERVER_ERROR : res.statusCode;
    const errors = process.env.NODE_ENV === 'development' ? [err.stack] : [];
    return sendError(res, err.message, statusCode, errors);
};

module.exports = { notFound, errorHandler };