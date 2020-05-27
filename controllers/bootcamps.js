const path = require('path');
const { Bootcamp } = require('../models');
const asyncHandler = require('../middleware/async');
const geocoder = require('../utils/geocoder');
const ErrorResponse = require('../utils/errorResponse');

// @desc get all bootcamps
// @route GET /api/v1/bootcamps
// @access public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc get a single boootcamp
// @route GET /api/v1/bootcamps/:id
// @access public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    return next(new ErrorResponse(`Bootcamp Not Found`, 404));
  }

  res.status(200).json({ success: true, data: bootcamp });
});

// @desc create a boootcamp
// @route POST /api/v1/bootcamps
// @access private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.create(req.body);

  res.status(201).json({ success: true, data: bootcamp });
});

// @desc Update a boootcamp
// @route PUT /api/v1/bootcamps/:id
// @access private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);

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
  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    return next(new ErrorResponse(`Bootcamp Not Found`, 404));
  }

  await bootcamp.remove();

  res.status(200).json({ success: true, data: {} });
});

// @desc get boootcamps within a radius
// @route GET /api/v1/bootcamps/radius/:zipcode/:distance
// @access private
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;
  const loc = await geocoder.geocode(zipcode);

  const lng = loc[0].longitude;
  const lat = loc[0].latitude;

  // calculate the radius

  // divide distance by radius of earth to get radius

  // radius of earth === 6378km

  const radius = distance / 6378;

  const bootcamps = await Bootcamp.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });

  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps,
  });
});

// @desc Upload photo for a boootcamp
// @route PUT /api/v1/bootcamps/:id/photo
// @access private
exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    return next(new ErrorResponse(`Bootcamp Not Found`, 404));
  }

  if (!req.files) {
    return next(new ErrorResponse(`Please upload a file`, 400));
  }

  const upload = req.files.upload;

  if (!upload.mimetype.startsWith('image')) {
    return next(new ErrorResponse('Please upload an image file', 400));
  }

  if (upload.size > process.env.MAX_FILE_UPLOAD) {
    return next(new ErrorResponse(`Please upload a file less than 1MB`));
  }

  // create a custom file name to avoid
  upload.name = `photo_${bootcamp._id}${path.parse(upload.name).ext}`;

  upload.mv(`${process.env.FILE_UPLOAD_PATH}/${upload.name}`, async (err) => {
    if (err) {
      console.log(err);
      return next(new ErrorResponse(`Problem Uploading File`, 500));
    }
    await Bootcamp.findByIdAndUpdate(req.params.id, { photo: upload.name });

    res.status(200).json({ success: true, data: upload.name });
  });
});
