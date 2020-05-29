const crypto = require('crypto');
const { User } = require('../models');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const sendEmail = require('../utils/sendEmail');

// @desc Register a user
// @route POST /api/v1/auth/register
// @access public
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    role,
  });

  sendTokenResponse(user, 201, res);
});

// @desc Login a user
// @route POST /api/v1/auth/login
// @access public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(
      new ErrorResponse(
        'Please provide the right Authentication Credentials',
        400
      )
    );
  }

  // check user
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return next(new ErrorResponse('Invalid Credentials', 401));
  }

  // check for password match
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse('Invalid Credentials', 401));
  }

  sendTokenResponse(user, 200, res);

  // const token = user.getAuthToken();

  // res.status(200).json({
  //   success: true,
  //   token,
  // });
});

// @desc get currently logged in user
// @route POST /api/v1/auth/me
// @access private
exports.getMe = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    success: true,
    data: req.user,
  });
});

// @desc Update a user detail
// @route PUT /api/v1/auth/details
// @access private
exports.updateDetails = asyncHandler(async (req, res, next) => {
  const allowedUpdates = ['name', 'email'];
  const updates = Object.keys(req.body);
  const validUpdate = updates.every((upd) => allowedUpdates.includes(upd));

  if (!validUpdate) {
    return next(new ErrorResponse('Invalid Update', 403));
  }

  updates.forEach((upd) => (req.user[upd] = req.body[upd]));

  await req.user.save();

  res.status(200).json({
    success: true,
    data: req.user,
  });
});
// @desc Update Password
// @route PUT /api/v1/auth/updatepassword
// @access private
exports.updatePassword = asyncHandler(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user.id).select('+password');

  if (!(await user.matchPassword(currentPassword))) {
    return next(new ErrorResponse('Incorrect Password', 401));
  }

  user.password = newPassword;

  await user.save();

  sendTokenResponse(user, 200, res);
});

// @desc password reset route
// @route POST /api/v1/auth/forgotpassword
// @access public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return next(new ErrorResponse('There is no user with that email', 404));
  }

  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  // create url
  const resetUrl = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/auth/resetpassword/${resetToken}`;

  const message = `You are receiving this email because you (or someone) has requested that their password be reset. Please make a PUT request to the ${resetUrl}`;

  try {
    await sendEmail({
      email,
      subject: 'Password Reset',
      message,
    });
    return res.status(200).json({ success: true, data: 'Email Delivered' });
  } catch (e) {
    console.log(e);

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorResponse(`Error Sending Email`, 500));
  }
});

// @desc RESET PASSWORD
// @route POST /api/v1/auth/resetpassword/:resettoken
// @access private
exports.resetPassword = asyncHandler(async (req, res, next) => {
  // get the hashed token
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resettoken)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ErrorResponse(`Invalid Token`, 500));
  }

  // set new password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sendTokenResponse(user, 200, res);
});

// helper method for passing jwt to cookie and then send response
const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getAuthToken();

  // cookie options
  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  // set secure when in production
  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  res.status(statusCode).cookie('token', token, options).json({
    success: true,
    token,
  });
};
