const isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.session.body = req.body;
    req.flash('error', 'You must be logged in');
    return res.redirect(307, '/login');
  }
  next();
};

module.exports = isLoggedIn;
