const ErrorResponse = require('../utils/errorResponse');

module.exports = (err, req, res, next) => {
  let error = { ...err };

  console.log(err, err.name);

  error.message = err.message;

  if (err.name === 'CastError') {
    const message = `Resource Not Found`;
    error = new ErrorResponse(message, 404);
  }

  // duplicate fields error
  if (err.code === 11000) {
    const message = 'Duplicate fields entered';
    error = new ErrorResponse(message, 400);
  }

  // validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((val) => val.message);
    error = new ErrorResponse(message, 400);
  }

  res
    .status(error.statusCode || 500)
    .json({ success: false, error: error.message || 'Server Error' });
};
