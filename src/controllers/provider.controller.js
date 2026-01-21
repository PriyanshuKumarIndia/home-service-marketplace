const providerService = require("../services/provider.service");
const {
  sendSuccess,
  sendError,
  StatusCodes,
} = require("../helpers/response.helper");

const register = async (req, res) => {
  try {
    const result = await providerService.registerProvider(req.body);

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
    console.error("Register provider Controller Error:", error);
    return sendError(
      res,
      "Internal server error",
      StatusCodes.INTERNAL_SERVER_ERROR,
      error?.message
    );
  }
};

const getVerifiedProviders = async (req, res) => {
  try {
    const result = await providerService.getVerifiedProviders();
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
    const result = await providerService.providerLogin(req.body);

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
  getVerifiedProviders,
  login,
};
