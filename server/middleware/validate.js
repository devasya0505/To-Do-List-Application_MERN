const { validationResult } = require('express-validator');
const ApiError = require('../utils/ApiError');

/**
 * Validation Middleware
 * Wraps express-validator's validationResult and throws a structured ApiError
 * if there are any validation failures.
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const extractedErrors = errors.array().map((err) => ({
      field: err.path,
      message: err.msg,
    }));

    throw ApiError.badRequest('Validation failed', extractedErrors);
  }

  next();
};

module.exports = validate;
