const router = require('express').Router({ mergeParams: true });
const { User } = require('../models');

const {
  getUser,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} = require('../controllers/users');

const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');

// add authoize and protect middlewares
router.use(protect);
router.use(authorize('admin'));

router.route('/').get(advancedResults(User), getUsers).post(createUser);

router.route('/:id').get(getUser).put(updateUser).delete(deleteUser);

module.exports = router;
