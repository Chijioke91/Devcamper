const { BootCamp } = require('../models');
const ErrorResponse = require('../utils/errorResponse');

// @desc get all bootcamps
// @route GET /api/v1/bootcamps
// @access public
exports.getBootcamps = async (req, res, next) => {
  try {
    const bootcamps = await BootCamp.find();
    res
      .status(200)
      .json({ success: true, count: bootcamps.length, data: bootcamps });
  } catch (e) {
    res.status(400).json({ success: false, msg: e.message });
  }
};

// @desc get a single boootcamp
// @route GET /api/v1/bootcamps/:id
// @access public
exports.getBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await BootCamp.findById(req.params.id);

    if (!bootcamp) {
      return next(new ErrorResponse(`Bootcamp Not Found`, 404));
    }

    res.status(200).json({ success: true, data: bootcamp });
  } catch (e) {
    // res.status(400).json({ success: false, msg: e.message });
    next(new ErrorResponse(`Bootcamp Not Found`, 404));
  }
};

// @desc create a boootcamp
// @route POST /api/v1/bootcamps
// @access private
exports.createBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await BootCamp.create(req.body);

    res.status(201).json({ success: true, data: bootcamp });
  } catch (e) {
    res.status(400).json({
      success: false,
      msg: e.message,
    });
  }
};

// @desc Update a boootcamp
// @route PUT /api/v1/bootcamps/:id
// @access private
exports.updateBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await BootCamp.findById(req.params.id);

    if (!bootcamp) {
      return res
        .status(404)
        .json({ success: false, msg: 'Bootcamp Not Found' });
    }

    const updates = Object.keys(req.body);

    updates.forEach((update) => (bootcamp[update] = req.body[update]));

    await bootcamp.save();

    res.status(200).json({ success: true, data: bootcamp });
  } catch (e) {
    res.status(400).json({ success: false, msg: e.message });
  }
};

// @desc Delete a boootcamp
// @route DELETE /api/v1/bootcamps/:id
// @access private
exports.deleteBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await BootCamp.findById(req.params.id);

    if (!bootcamp) {
      return res
        .status(404)
        .json({ success: false, msg: 'Bootcamp Not Found' });
    }

    await bootcamp.remove();

    res.status(200).json({ success: true, data: {} });
  } catch (e) {
    res.status(400).json({ success: false, msg: e.message });
  }
};
