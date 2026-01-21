const userService = require("../services/user.service");
const {
  sendSuccess,
  sendError,
  StatusCodes,
} = require("../helpers/response.helper");

const register = async (req, res) => {
  try {
    const result = await userService.registerUser(req.body);

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
    console.error("Register User Controller Error:", error);
    return sendError(
      res,
      "Internal server error",
      StatusCodes.INTERNAL_SERVER_ERROR,
      error?.message
    );
  }
};

const verifyOtp = async (req, res) => {
  try {
    let result = await userService.verifyRegistrationOtp(req.body);

    if (result.code === 0) {
      return sendError(
        res,
        result.message,
        StatusCodes.UNPROCESSABLE_ENTITY,
        result.errors || []
      );
    }

    result = await userService.toggleUserStatus(req.body, true);

    if (result.code === 0) {
      return sendError(
        res,
        result.message,
        StatusCodes.UNPROCESSABLE_ENTITY,
        result.errors?.message || []
      );
    }

    return sendSuccess(res, result.message, StatusCodes.ACCEPTED, result.data);
  } catch (error) {
    console.error("Otp verification failed: ", error);
    return sendError(
      res,
      "Internal server error",
      StatusCodes.INTERNAL_SERVER_ERROR,
      error?.message
    );
  }
};

const getVerifiedUsers = async (req, res) => {
  try {
    const result = await userService.getVerifiedUsers();

    return sendSuccess(res, result.message, StatusCodes.CREATED, result.data);
  } catch (error) {
    console.error("Error fetching verified sellers: ", error);
    return sendError(
      res,
      "Internal server error",
      StatusCodes.INTERNAL_SERVER_ERROR,
      error?.message
    );
  }
};

const login = async (req, res) => {
  try {
    const result = await userService.login(req.body);

    if (result.code === 0) {
      return sendError(
        res,
        result.message,
        StatusCodes.UNPROCESSABLE_ENTITY,
        result.errors || []
      );
    }

    return sendSuccess(res, result.message, StatusCodes.OK, result.data);
  } catch (error) {
    console.error("Create User Controller Error:", error);
    return sendError(
      res,
      "Internal server error",
      StatusCodes.INTERNAL_SERVER_ERROR,
      error
    );
  }
};

module.exports = {
  register,
  verifyOtp,
  getVerifiedUsers,
  login,
};
