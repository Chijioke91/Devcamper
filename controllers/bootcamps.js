const { BootCamp } = require('../models');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc get all bootcamps
// @route GET /api/v1/bootcamps
// @access public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  const bootcamps = await BootCamp.find();
  res
    .status(200)
    .json({ success: true, count: bootcamps.length, data: bootcamps });
});

// @desc get a single boootcamp
// @route GET /api/v1/bootcamps/:id
// @access public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await BootCamp.findById(req.params.id);

  if (!bootcamp) {
    return next(new ErrorResponse(`Bootcamp Not Found`, 404));
  }

  res.status(200).json({ success: true, data: bootcamp });
});

// @desc create a boootcamp
// @route POST /api/v1/bootcamps
// @access private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await BootCamp.create(req.body);

  res.status(201).json({ success: true, data: bootcamp });
});

// @desc Update a boootcamp
// @route PUT /api/v1/bootcamps/:id
// @access private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await BootCamp.findById(req.params.id);

  if (!bootcamp) {
    return next(new ErrorResponse(`Bootcamp Not Found`, 404));
  }

  const updates = Object.keys(req.body);

  updates.forEach((update) => (bootcamp[update] = req.body[update]));

  await bootcamp.save();

  res.status(200).json({ success: true, data: bootcamp });
});

// @desc Delete a boootcamp
// @route DELETE /api/v1/bootcamps/:id
// @access private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await BootCamp.findById(req.params.id);

  if (!bootcamp) {
    return next(new ErrorResponse(`Bootcamp Not Found`, 404));
  }

  await bootcamp.remove();

  res.status(200).json({ success: true, data: {} });
});
