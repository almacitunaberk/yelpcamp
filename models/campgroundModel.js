const mongoose = require('mongoose');

const campgroundSchema = new mongoose.Schema({
  title: String,
  price: String,
  description: String,
  location: String,
});

const CampgroundModel = mongoose.model('Campground', campgroundSchema);

module.exports = CampgroundModel;
