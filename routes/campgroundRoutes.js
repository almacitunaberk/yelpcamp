const express = require('express');
const catchAsync = require('../utils/catchAsync');
const isLoggedIn = require('../middleware/isLoggedIn');
const CampgroundModel = require('../models/campgroundModel');
const ReviewModel = require('../models/reviewModel');
const router = express.Router();

router.get(
  '/',
  catchAsync(async (req, res) => {
    const campgrounds = await CampgroundModel.find({});
    res.render('campgrounds/index', { campgrounds });
  })
);

router.get('/new', isLoggedIn, (req, res) => {
  res.render('campgrounds/new');
});

/* The following is the same with the other version using catchAsync higher order function.
app.post('/campgrounds', (req, res, next) => {
  (async (req, res, next) => {
    const campground = req.body.campground;
    const camp = new CampgroundModel({
      title: campground.title,
      location: campground.location,
      price: campground.location,
      description: campground.description,
      image: campground.image,
    });
    await camp.save();
    res.redirect('/campgrounds');
  })(req, res, next).catch(next);
});
*/

router.post(
  '/',
  isLoggedIn,
  catchAsync(async (req, res, next) => {
    const campground = req.body.campground;
    const camp = new CampgroundModel({
      title: campground.title,
      location: campground.location,
      price: campground.price,
      description: campground.description,
      image: campground.image,
    });
    await camp.save();
    req.flash('success', 'Successfully created a new campground!');
    res.redirect(`/campgrounds/${camp._id}`);
  })
);

router.get(
  '/:id',
  catchAsync(async (req, res, next) => {
    const campground = await CampgroundModel.findById(req.params.id).populate('reviews');
    res.render('campgrounds/show', { campground });
  })
);

router.get(
  '/:id/edit',
  isLoggedIn,
  catchAsync(async (req, res) => {
    const campground = await CampgroundModel.findById(req.params.id);
    res.render('campgrounds/edit', { campground });
  })
);

router.put(
  '/:id',
  catchAsync(async (req, res) => {
    const campground = req.body.campground;
    await CampgroundModel.findOneAndUpdate(req.params.id, {
      title: campground.title,
      location: campground.location,
      price: campground.price,
      description: campground.description,
      image: campground.image,
    });
    res.redirect(`/campgrounds/${req.params.id}`);
  })
);

router.delete(
  '/:id',
  catchAsync(async (req, res) => {
    await CampgroundModel.findByIdAndDelete(req.params.id);
    res.redirect('/campgrounds');
  })
);

module.exports = router;
