// @desc get all bootcamps
// @route GET /api/v1/bootcamps
// @access public
exports.getBootcamps = (req, res, next) => {
  res.status(200).json({ msg: 'All Bootcamps' });
};

// @desc get a single boootcamp
// @route GET /api/v1/bootcamps/:id
// @access public
exports.getBootcamp = (req, res, next) => {
  res.status(200).json({ msg: 'get single bootcamp' });
};

// @desc create a boootcamp
// @route POST /api/v1/bootcamps
// @access private
exports.createBootcamp = (req, res, next) => {
  res.status(200).json({ msg: 'create bootcamp' });
};

// @desc Update a boootcamp
// @route PUT /api/v1/bootcamps/:id
// @access private
exports.updateBootcamp = (req, res, next) => {
  res.status(200).json({ msg: 'update bootcamp' });
};

// @desc Delete a boootcamp
// @route DELETE /api/v1/bootcamps/:id
// @access private
exports.deleteBootcamp = (req, res, next) => {
  res.status(200).json({ msg: 'Delete bootcamp' });
};
