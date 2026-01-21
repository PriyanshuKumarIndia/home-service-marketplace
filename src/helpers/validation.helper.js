const { sendError, StatusCodes } = require('./response.helper');

function formatJoiError(error) {
  const errors = {};
  
  error.details.forEach(detail => {
    const field = detail.path.join('.');
    errors[field] = detail.message.replaceAll('"', '');
  });
  
  return {
    success: false,
    message: 'Validation failed',
    errors
  };
}

function validate(schema, data, options = {}) {
  const { error, value } = schema.validate(data, {
    abortEarly: false,
    allowUnknown: false,
    stripUnknown: true,
    ...options
  });

  if (error) {
    return formatJoiError(error);
  }

  return {
    success: true,
    data: value
  };
}

function middleware(schema, source = 'body') {
  return (req, res, next) => {
    const data = req[source];
    const result = validate(schema, data);
    
    if (!result.success) {
        return sendError(res, result.message, StatusCodes.UNPROCESSABLE_ENTITY, result.errors);
    }
    
    req[source] = result.data;
    next();
  };
}

module.exports = {
  formatJoiError,
  validate,
  middleware
};