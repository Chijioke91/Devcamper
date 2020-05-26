const ErrorResponse = require('../utils/errorResponse');

const errorHandler = (err, req, res, next) => {
  let error = { ...err };

  console.log(err);

  // check for cast error (wrong id)
  if (err.name === 'CastError') {
    const message = `Resource With ID ${err.value} Not Found`;
    error = new ErrorResponse(message, 404);
  }

  // check for duplicate fields on create of resource
  if (err.code === 11000) {
    const message = `Duplicate fields Entered`;
    error = new ErrorResponse(message, 400);
  }

  // check for validation errors
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((val) => val.message);
    error = new ErrorResponse(message, 400);
  }

  res
    .status(error.statusCode || 500)
    .json({ success: false, error: error.message });
};

module.exports = errorHandler;
