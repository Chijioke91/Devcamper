const router = require('express').Router({ mergeParams: true });
const { Course } = require('../models');
const advancedReults = require('../middleware/advancedResults');

const {
  getCourses,
  getCourse,
  addCourse,
  updateCourse,
  deleteCourse,
} = require('../controllers/courses');

const { protect, authorize } = require('../middleware/auth');

router
  .route('/')
  .get(
    advancedReults(Course, {
      path: 'bootcamp',
      select: 'name description',
    }),
    getCourses
  )
  .post(protect, authorize('publisher', 'admin'), addCourse);

router
  .route('/:id')
  .get(getCourse)
  .put(protect, authorize('publisher', 'admin'), updateCourse)
  .delete(protect, authorize('publisher', 'admin'), deleteCourse);

module.exports = router;
