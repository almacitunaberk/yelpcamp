const express = require('express');
const morgan = require('morgan');
const ejsMate = require('ejs-mate');
const connectDB = require('./config/db');
const methodOverride = require('method-override');
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

app.get('/campgrounds', async (req, res) => {
  const campgrounds = await CampgroundModel.find({});
  res.render('campgrounds/index', { campgrounds });
});

app.get('/campgrounds/new', (req, res) => {
  res.render('campgrounds/new');
});

app.post('/campgrounds', async (req, res) => {
  const campground = req.body.campground;
  const camp = new CampgroundModel(...campground);
  await camp.save();
  res.redirect('/campgrounds');
});

app.get('/campgrounds/:id', async (req, res) => {
  const campground = await CampgroundModel.findById(req.params.id);
  res.render('campgrounds/show', { campground });
});

app.get('/campgrounds/:id/edit', async (req, res) => {
  const campground = await CampgroundModel.findById(req.params.id);
  res.render('campgrounds/edit', { campground });
});

app.put('/campgrounds/:id', async (req, res) => {
  const campground = req.body.campground;
  await CampgroundModel.findOneAndUpdate(req.params.id, {
    title: campground.title,
    location: campground.location,
  });
  res.redirect(`/campgrounds/${req.params.id}`);
});

app.delete('/campgrounds/:id', async (req, res) => {
  await CampgroundModel.findOneAndDelete(req.params.id);
  res.redirect('/campgrounds');
});

app.listen(3000, () => {
  console.log('Server is running on 3000');
});
