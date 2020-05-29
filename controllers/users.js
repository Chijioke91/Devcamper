const { User } = require('../models');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

// @desc Get all users
// @route GET /api/v1/auth/users
// @access private/admin
exports.getUsers = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc Get a single user
// @route GET /api/v1/auth/users/:id
// @access private/admin
exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc Create a user
// @route POST /api/v1/auth/users
// @access private/admin
exports.createUser = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);

  res.status(201).json({ success: true, data: user });
});

// @desc Update a user
// @route POST /api/v1/auth/users/:id
// @access private/admin
exports.updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  const updates = Object.keys(req.body);

  updates.forEach((upd) => (user[upd] = req.body[upd]));

  await user.save();

  res.status(200).json({ success: true, data: user });
});

// @desc Delete a user
// @route DELETE /api/v1/auth/users/:id
// @access private/admin
exports.deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  await user.remove();

  res.status(200).json({ success: true, data: {} });
});
