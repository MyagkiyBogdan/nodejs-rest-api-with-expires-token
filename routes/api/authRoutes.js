const express = require('express');
const router = express.Router();

const {
  loginController,
  signupController,
  logoutController,
  currentController,
} = require('../../controllers/authController');

router.post('/signup', signupController);
router.post('/login', loginController);
router.get('/logout', logoutController);
router.get('/get', currentController);

module.exports = router;
