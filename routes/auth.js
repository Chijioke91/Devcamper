const router = require('express').Router();

const {
  register,
  login,
  getMe,
  forgotPassword,
  resetPassword,
  updateDetails,
  updatePassword,
} = require('../controllers/auth');
const { protect } = require('../middleware/auth');

router.route('/register').post(register);

router.route('/login').post(login);

router.route('/me').get(protect, getMe);

router.route('/details').put(protect, updateDetails);

router.put('/updatepassword', protect, updatePassword);

router.route('/forgotpassword').get(forgotPassword);

router.put('/resetpassword/:resettoken', resetPassword);

module.exports = router;
