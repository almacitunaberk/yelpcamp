const CampgroundModel = require('../models/campgroundModel');
const ReviewModel = require('../models/reviewModel');
const catchAsync = require('../utils/catchAsync');

module.exports.postNewReview = catchAsync(async (req, res, next) => {
  const { rating, body } = req.body.review || req.session.body.review;
  const campground = await CampgroundModel.findById(req.params.id);
  const review = new ReviewModel({
    rating,
    body,
    owner: req.user._id.valueOf(),
  });
  await review.save();
  campground.reviews.push(review);
  await campground.save();
  res.redirect(`/campgrounds/${campground._id}`);
});

module.exports.getAllReviews = catchAsync(async (req, res, next) => {
  const campground = await CampgroundModel.findById(req.params.id);
  const reviews = await Promise.all(
    campground.reviews.map(async (id) => {
      return await ReviewModel.findById(id);
    })
  );
  res.send(reviews);
});

module.exports.deleteReview = catchAsync(async (req, res, next) => {
  await CampgroundModel.findByIdAndUpdate(req.params.id, { $pull: { reviews: req.params.review_id } });
  await ReviewModel.findOneAndDelete(req.params.review_id);
  res.redirect(`/campgrounds/${req.params.id}`);
});
