const { verify } = require("jsonwebtoken");
const { middleware } = require("../helpers/validation.helper");
const {
  userSchemas,
  commonSchemas,
  roleSchemas,
  serviceSchemas,
  bookingSchemas
} = require("../helpers/validation.schemas");

const validateRequest = (schema, source = "body") => {
  return middleware(schema, source);
};

const validateUser = {
  register: validateRequest(userSchemas.register),
  verifyOtp: validateRequest(userSchemas.verifyOtp),
  login: validateRequest(userSchemas.login),
  update: validateRequest(userSchemas.update),
  id: validateRequest(commonSchemas.id, "params"),
};

const validateCommon = {
  pagination: validateRequest(commonSchemas.pagination, "query"),
  id: validateRequest(commonSchemas.id, "params"),
};

const validateRole = {
  add: validateRequest(roleSchemas.addRole),
  update: validateRequest(roleSchemas.update),
};

const validateService = {
  add: validateRequest(serviceSchemas.add),
};

const validateBooking = {
  create: validateRequest(bookingSchemas.create),
};

module.exports = {
  validateRequest,
  validateUser,
  validateCommon,
  validateRole,
  validateService,
  validateBooking
};
