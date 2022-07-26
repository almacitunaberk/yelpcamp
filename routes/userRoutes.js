const express = require('express');
const catchAsync = require('../utils/catchAsync');
const UserModel = require('../models/userModel');
const passport = require('passport');
const isLoggedIn = require('../middleware/isLoggedIn');

const router = express.Router();

router.get('/register', (req, res) => {
  res.render('users/register');
});

router.post(
  '/register',
  catchAsync(async (req, res, next) => {
    try {
      const { email, username, password } = req.body;
      const user = new UserModel({
        email,
        username,
      });
      const newUser = await UserModel.register(user, password);
      req.login(newUser, (err) => {
        if (err) {
          req.flash('error', err.message);
          return next(err);
        }
        req.flash('success', 'Welcome to YelpCamp');
        res.redirect('/campgrounds');
      });
    } catch (err) {
      req.flash('error', err.message);
      res.redirect('/register');
    }
  })
);

router.get('/login', (req, res) => {
  res.render('users/login');
});

router.post(
  '/login',
  passport.authenticate('local', {
    failureFlash: true,
    failureRedirect: '/login',
    keepSessionInfo: true,
  }),
  (req, res) => {
    req.flash('success', 'Logged in successfully!');
    const redirectTo = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectTo);
  }
);

router.post('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash('success', 'Hope to see you again!');
    res.redirect('/campgrounds');
  });
});

module.exports = router;
