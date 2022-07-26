const UserModel = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');

module.exports.getRegisterPage = (req, res) => {
  res.render('users/register');
};

module.exports.registerNewUser = catchAsync(async (req, res, next) => {
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
});

module.exports.getLoginPage = (req, res) => {
  res.render('users/login');
};

module.exports.loginUser = (req, res) => {
  req.flash('success', 'Logged in successfully!');
  let redirectTo = req.session.returnTo || '/campgrounds';
  delete req.session.returnTo;
  console.log(redirectTo);
  if (req.session.body.review) {
    res.redirect(307, redirectTo);
  } else {
    res.redirect(redirectTo);
  }
};

module.exports.logoutUser = (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash('success', 'Hope to see you again!');
    res.redirect('/campgrounds');
  });
};
