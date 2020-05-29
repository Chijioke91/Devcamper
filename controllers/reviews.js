const { Review, Bootcamp } = require('../models');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

// @desc get all Reviews
// @route GET /api/v1/reviews
// @route GET /api/v1/bootcamps/:bootcampId/reviews
// @access public
exports.getReviews = asyncHandler(async (req, res, next) => {
  if (req.params.bootcampId) {
    const reviews = await Review.find({ bootcamp: req.params.bootcampId });
    return res
      .status(200)
      .json({ success: true, count: reviews.length, data: reviews });
  } else {
    return res.status(200).json(res.advancedResults);
  }
});

// @desc get a single review Reviews
// @route GET /api/v1/reviews/:id
// @access public
exports.getReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id).populate({
    path: 'bootcamp',
    select: 'name description',
  });

  if (!review) {
    return next(
      new ErrorResponse(`No Review Found with the ID ${req.params.id}`, 404)
    );
  }

  res.status(200).json({ success: true, data: review });
});

// @desc add a Review
// @route POST /api/v1/bootcamps/:bootcampId/reviews
// @access private
exports.addReview = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId;
  req.body.user = req.user.id;
  const bootcamp = await Bootcamp.findById(req.params.bootcampId);

  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `Bootcamp with ID ${req.params.bootcampId} Not Found`,
        404
      )
    );
  }

  const review = await Review.create(req.body);

  res.status(201).json({ success: true, data: review });
});

// @desc Update a Review
// @route PUT /api/v1/reviews/:id
// @access private
exports.updateReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(
      new ErrorResponse(`Review with ID ${req.params.id} Not Found`, 404)
    );
  }

  // enusre that review is owned by user or the user is an admin
  if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`Not Authorized to update this route`, 401));
  }

  const updates = Object.keys(req.body);

  updates.forEach((upd) => (review[upd] = req.body[upd]));

  await review.save();

  res.status(200).json({ success: true, data: review });
});

// @desc Delete a Review
// @route DELETE /api/v1/reviews/:id
// @access private
exports.deleteReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(
      new ErrorResponse(`Review with ID ${req.params.id} Not Found`, 404)
    );
  }

  // enusre that review is owned by user or the user is an admin
  if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`Not Authorized to access this route`, 401));
  }

  await review.remove();

  res.status(200).json({ success: true, data: {} });
});
