const { sendError, StatusCodes } = require("../helpers/response.helper");
const { extractToken, verifyToken } = require("../utils/jwt.util");
const { User, Role } = require("../db/models");
const { Op } = require("sequelize");

const authenticate = (req, res, next) => {
  try {
    const token = extractToken(req);

    if (!token) {
      return sendError(
        res,
        "Token missing (Authorization header or cookie required)",
        StatusCodes.UNAUTHORIZED
      );
    }
    try {
      const decoded = verifyToken(token);
      req.user = decoded; // id, email, role etc.
      return next();
    } catch (err) {
      console.warn("JWT verification failed:", err?.message ?? err);

      // Token expired
      if (err?.name === "TokenExpiredError") {
        return sendError(
          res,
          "Authentication token expired",
          StatusCodes.UNAUTHORIZED
        );
      }

      // Invalid token
      if (err?.name === "JsonWebTokenError") {
        return sendError(
          res,
          "Invalid authentication token",
          StatusCodes.UNAUTHORIZED
        );
      }

      //  Fallback
      return sendError(res, "Authentication failed", StatusCodes.UNAUTHORIZED);
    }
  } catch (err) {
    console.error("Auth middleware error:", err);
    return sendError(
      res,
      "Internal server error",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

const authenticateAdmin = async (req, res, next) => {
  const userId = req.user.id;

  const user = await User.findOne({
    where: { id: userId },
    include: [
      {
        model: Role,
        as: "role",
        where: {
          name: {
            [Op.in]: ["ADMIN", "SUPER ADMIN"],
          },
        },
      },
    ],
  });

  if(!user) sendError(res, 'Only Admins are allowed on this route', StatusCodes.UNAUTHORIZED);
  req.user = user;

  next();
};

module.exports = { authenticate, authenticateAdmin };
