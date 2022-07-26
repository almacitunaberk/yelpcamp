const CampgroundModel = require('../models/campgroundModel');

const isAuthor = async (req, res, next) => {
  const camp = await CampgroundModel.findById(req.params.id);
  if (!camp.author._id.equals(req.user._id)) {
    req.flash('error', 'You do not have permission!');
    return res.redirect(`/campgrounds/${req.params.id}`);
  }
  next();
};

module.exports = isAuthor;
