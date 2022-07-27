const catchAsync = require('../utils/catchAsync');
const dotenv = require('dotenv');
dotenv.config();
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const geocoder = mbxGeocoding({ accessToken: process.env.MAPBOX_TOKEN });
const CampgroundModel = require('../models/campgroundModel');
const ReviewModel = require('../models/reviewModel');

module.exports.getAllCampgrounds = catchAsync(async (req, res) => {
  const campgrounds = await CampgroundModel.find({});
  res.render('campgrounds/index', { campgrounds });
});

module.exports.createNewCampground = catchAsync(async (req, res, next) => {
  const geoData = await geocoder
    .forwardGeocode({
      query: req.body.campground.location,
      limit: 1,
    })
    .send();
  const campground = req.body.campground;
  const camp = new CampgroundModel({
    title: campground.title,
    location: campground.location,
    price: campground.price,
    description: campground.description,
    image: campground.image,
    author: req.user._id.valueOf(),
    geometry: geoData.body.features[0].geometry,
  });
  await camp.save();
  req.flash('success', 'Successfully created a new campground!');
  res.redirect(`/campgrounds/${camp._id}`);
});

module.exports.getCampgroundById = catchAsync(async (req, res, next) => {
  const campground = await CampgroundModel.findById(req.params.id).populate('reviews').populate('author');
  let reviews = await Promise.all(
    campground.reviews.map(async (id) => {
      const review = await ReviewModel.findById(id).populate('owner');
      return review;
    })
  );
  campground.reviews = reviews;
  res.render('campgrounds/show', { campground });
});

module.exports.editCampgroundPageById = catchAsync(async (req, res) => {
  const _campground = await CampgroundModel.findById(req.params.id);
  res.render('campgrounds/edit', { campground: _campground });
});

module.exports.editCampgroundById = catchAsync(async (req, res) => {
  const newCampground = req.body.campground;
  await CampgroundModel.findOneAndUpdate(req.params.id, {
    title: newCampground.title,
    location: newCampground.location,
    price: newCampground.price,
    description: newCampground.description,
    image: newCampground.image,
  });
  res.redirect(`/campgrounds/${req.params.id}`);
});

module.exports.deleteCampgroundById = catchAsync(async (req, res) => {
  await CampgroundModel.findByIdAndDelete(req.params.id);
  res.redirect('/campgrounds');
});

module.exports.getNewCampgroundPage = (req, res) => {
  res.render('campgrounds/new');
};
