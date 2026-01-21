const Joi = require("joi");
const serviceTypes = require('../constants/serviceType.constant');

// required
const userSchemas = {
  register: Joi.object({
    email: Joi.string().email().lowercase().trim().required(),
    password: Joi.string()
      .min(8)
      .max(15)
      .required()
      .pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{8,15}$/)
      .messages({
        "string.empty": "Password is required",
        "string.min": "Password must be at least 8 characters",
        "string.max": "Password must be at most 15 characters",
        "string.pattern.base":
          "Password must contain uppercase, lowercase, number and special character",
      }),
  }),

  verifyOtp: Joi.object({
    user_id: Joi.number().required(),
    otp: Joi.string().required(),
  }),

  registrationOtpVerify: Joi.object({
    user_id: Joi.string().uuid().required(),
    otp: Joi.string().required(),
  }),

  login: Joi.object({
    email: Joi.string().email().lowercase().required().trim(),
    password: Joi.string().min(2).max(15).required().trim(),
  }),

  forgotpassword: Joi.object({
    user_id: Joi.string().uuid().required(),
    otp: Joi.string().required(),
    newPassword: Joi.string()
      .min(8)
      .max(15)
      .required()
      .pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{8,15}$/)
      .messages({
        "string.empty": "New password is required",
        "string.min": "New password must be at least 8 characters",
        "string.max": "New password must be at most 15 characters",
        "string.pattern.base":
          "New password must contain uppercase, lowercase, number and special character",
      }),

    confirmPassword: Joi.string()
      .valid(Joi.ref("newPassword"))
      .required()
      .messages({
        "any.only": "Confirm password must match new password",
        "any.required": "Confirm password is required",
      }),
  }),
};

// required
const commonSchemas = {
  id: Joi.object({
    id: Joi.number().required(),
  }),

  pagination: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    search: Joi.string().optional(),
  }),
};

// required
const roleSchemas = {
  addRole: Joi.object({
    name: Joi.string().trim().uppercase().min(2).max(50).required(),
    status: Joi.boolean().optional(),
  }),
  update: Joi.object({
    name: Joi.string().min(2).max(50).required().lowercase(),
  }),
};

const serviceSchemas = {
  add: Joi.object({
    name: Joi.string().trim().min(2).max(100).required(),
    type: Joi.string().valid(...Object.keys(serviceTypes)).required(),
    price: Joi.number().positive().min(10).max(1000000).required(),
  })
}

const bookingSchemas = {
  create: Joi.object({
    customer_id: Joi.number().required(),
    provider_id: Joi.number().required(),
    service_id: Joi.number().required(),
    scheduled_date: Joi.date().greater('now').required(),
    price: Joi.number().positive().required(),
  })
}



module.exports = {
  userSchemas,
  commonSchemas,
  roleSchemas,
  serviceSchemas,
  bookingSchemas
};
