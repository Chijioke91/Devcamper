const jwt = require('jsonwebtoken');
const asyncHandler = require('./async');
const { User } = require('../models');
const ErrorResponse = require('../utils/errorResponse');

exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  const { authorization } = req.headers;

  if (authorization && authorization.startsWith('Bearer')) {
    token = authorization.replace('Bearer ', '');
  }

  // else if (req.cookies.token) {
  //   token = req.cookies.token;
  // }

  if (!token) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }

  try {
    const decoded = jwt.decode(token, process.env.JWT_SECRET);

    console.log(decoded);

    req.user = await User.findById(decoded.id);

    next();
  } catch (e) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }
});

// assign roles
exports.authorize = (...roles) => (req, user, next) => {
  if (!roles.includes(req.user.role)) {
    return next(
      new ErrorResponse(
        `User role ${req.user.role} is not authorized to access this route`,
        403
      )
    );
  }
  next();
};
