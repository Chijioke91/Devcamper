const router = require('express').Router();
const { Bootcamp } = require('../models');

const {
  getBootcamp,
  getBootcamps,
  createBootcamp,
  deleteBootcamp,
  updateBootcamp,
  getBootcampsInRadius,
  bootcampPhotoUpload,
} = require('../controllers/bootcamps');

// fetch other resource routes
const courseRouter = require('./courses');
const advancedResults = require('../middleware/advancedResults');

// add courses route to bootcamp to fetch courses for a particular bootcamp
router.use('/:bootcampId/courses', courseRouter);

router.get('/radius/:zipcode/:distance', getBootcampsInRadius);

router
  .route('/')
  .get(advancedResults(Bootcamp, 'courses'), getBootcamps)
  .post(createBootcamp);

router.route('/:id/photo').put(bootcampPhotoUpload);

// :lng/:lat/:distance

router
  .route('/:id')
  .get(getBootcamp)
  .put(updateBootcamp)
  .delete(deleteBootcamp);

// router.get('/radius/:lng/:lat/:distance', getBootcampsInRadius);

module.exports = router;
