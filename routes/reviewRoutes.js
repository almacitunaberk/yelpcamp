const express = require('express');
const catchAsync = require('../utils/catchAsync');
const CampgroundModel = require('../models/campgroundModel');
const ReviewModel = require('../models/reviewModel');
const router = express.Router({ mergeParams: true });

router.post(
  '/',
  catchAsync(async (req, res, next) => {
    const { rating, body } = req.body.review;
    const campground = await CampgroundModel.findById(req.params.id);
    console.log(req.params.id);
    console.log(campground);
    const review = new ReviewModel({
      rating,
      body,
    });
    await review.save();
    campground.reviews.push(review);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

router.get(
  '/',
  catchAsync(async (req, res, next) => {
    const campground = await CampgroundModel.findById(req.params.id);
    const reviews = await Promise.all(
      campground.reviews.map(async (id) => {
        return await ReviewModel.findById(id);
      })
    );
    res.send(reviews);
  })
);

router.delete(
  '/:review_id',
  catchAsync(async (req, res, next) => {
    await CampgroundModel.findByIdAndUpdate(req.params.id, { $pull: { reviews: req.params.review_id } });
    await ReviewModel.findOneAndDelete(req.params.review_id);
    res.redirect(`/campgrounds/${req.params.id}`);
  })
);

module.exports = router;
