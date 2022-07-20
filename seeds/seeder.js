const mongoose = require('mongoose');
const CampgroundModel = require('../models/campgroundModel');
const connectDB = require('../config/db');
const cities = require('./cities');
const { decriptors, places, descriptors } = require('./seedHelpers');

connectDB();

const sample = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};

const seedDB = async () => {
  await CampgroundModel.deleteMany();
  for (let i = 0; i < 50; i++) {
    const randCity = Math.floor(Math.random() * 1000);
    const city = cities[randCity];
    const camp = new CampgroundModel({
      location: `${city.city}, ${city.state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
    });
    await camp.save();
  }
};

seedDB();
