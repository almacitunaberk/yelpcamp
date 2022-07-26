const ReviewModel = require('../models/reviewModel');

const isReviewOwner = async (req, res, next) => {
  const review = await ReviewModel.findById(req.params.review_id);
  if (!review.owner._id.equals(req.user._id)) {
    req.flash('error', 'You do not have the permission!');
    return res.redirect(`/campgrounds/${req.params.id}`);
  }
  next();
};

module.exports = isReviewOwner;
