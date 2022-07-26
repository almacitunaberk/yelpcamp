const express = require('express');
const passport = require('passport');
const {
  getRegisterPage,
  registerNewUser,
  getLoginPage,
  loginUser,
  logoutUser,
} = require('../controllers/userControllers');

const router = express.Router();

router.route('/register').get(getRegisterPage).post(registerNewUser);

router
  .route('/login')
  .get(getLoginPage)
  .post(
    passport.authenticate('local', {
      failureFlash: true,
      failureRedirect: '/login',
      keepSessionInfo: true,
    }),
    loginUser
  );

router.route('/logout').post(logoutUser);

module.exports = router;
