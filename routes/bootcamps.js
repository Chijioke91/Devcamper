const router = require('express').Router();

const {
  getBootcamp,
  getBootcamps,
  createBootcamp,
  deleteBootcamp,
  updateBootcamp,
  getBootcampsInRadius,
} = require('../controllers/bootcamps');

router.get('/radius/:zipcode/:distance', getBootcampsInRadius);

router.route('/').get(getBootcamps).post(createBootcamp);

router.route('/').get(getBootcamps);

// :lng/:lat/:distance

router
  .route('/:id')
  .get(getBootcamp)
  .put(updateBootcamp)
  .delete(deleteBootcamp);

// router.get('/radius/:lng/:lat/:distance', getBootcampsInRadius);

module.exports = router;
