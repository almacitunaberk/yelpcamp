const express = require('express');
const morgan = require('morgan');
const ejsMate = require('ejs-mate');
const connectDB = require('./config/db');
const methodOverride = require('method-override');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const mongoose = require('mongoose');
const CampgroundModel = require('./models/campgroundModel');
const path = require('path');
const app = express();

app.engine('ejs', ejsMate);
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.use(morgan('tiny'));

connectDB();

app.set('view engine', 'ejs');
app.set('views directory', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
  res.render('home');
});

app.get(
  '/campgrounds',
  catchAsync(async (req, res) => {
    const campgrounds = await CampgroundModel.find({});
    res.render('campgrounds/index', { campgrounds });
  })
);

app.get('/campgrounds/new', (req, res) => {
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

app.post(
  '/campgrounds',
  catchAsync(async (req, res, next) => {
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
  })
);

app.get(
  '/campgrounds/:id',
  catchAsync(async (req, res) => {
    const campground = await CampgroundModel.findById(req.params.id);
    console.log(campground);
    res.render('campgrounds/show', { campground });
  })
);

app.get(
  '/campgrounds/:id/edit',
  catchAsync(async (req, res) => {
    const campground = await CampgroundModel.findById(req.params.id);
    res.render('campgrounds/edit', { campground });
  })
);

app.put(
  '/campgrounds/:id',
  catchAsync(async (req, res) => {
    const campground = req.body.campground;
    console.log('HIT');
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

app.delete(
  '/campgrounds/:id',
  catchAsync(async (req, res) => {
    await CampgroundModel.findOneAndDelete(req.params.id);
    res.redirect('/campgrounds');
  })
);

app.all('*', (req, res, next) => {
  next(new ExpressError('Not Found', 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = 'Something went wrong!';
  res.render('./error', { err });
});

app.listen(3000, () => {
  console.log('Server is running on 3000');
});
