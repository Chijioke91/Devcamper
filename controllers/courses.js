const { Course } = require('../models');
const asyncHandler = require('../middleware/async');
const geocoder = require('../utils/geocoder');

// @desc get all Courses
// @route GET /api/v1/courses
// @route GET /api/v1/bootcamps/:bootcampId/courses
// @access public
exports.getCourses = asyncHandler(async (req, res, next) => {
  let query;

  if (req.params.bootcampId) {
    query = Course.find({ bootcamp: req.params.bootcampId });
  } else {
    query = Course.find().populate({
      path: 'bootcamp',
      select: 'name description',
    });
  }

  const courses = await query;

  res.status(200).json({ succes: true, count: courses.length, data: courses });
});

// @desc get all Courses
// @route GET /api/v1/courses/:id
// @access public
