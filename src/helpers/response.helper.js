const { StatusCodes } = require('http-status-codes');

const sendResponse = (res, success, message, statusCode, data = null) => {
  const response = {
    success,
    message,
  };

  if (data !== null) response.data = data;

  return res.status(statusCode).json(response);
};

const sendSuccess = (res, message, statusCode = StatusCodes.OK, data = null) => {
  return sendResponse(res, true, message, statusCode, data);
};

const sendError = (res, message, statusCode = StatusCodes.INTERNAL_SERVER_ERROR, errors = []) => {
  const response = {
    success: false,
    message,
    timestamp: new Date().toISOString()
  };

  if (errors) response.errors = errors;

  return res.status(statusCode).json(response);
};

module.exports = {
  StatusCodes,
  sendSuccess,
  sendError
};