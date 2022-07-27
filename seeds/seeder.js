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
  for (let i = 0; i < 300; i++) {
    const randCity = Math.floor(Math.random() * 1000);
    const city = cities[randCity];
    const price = Math.floor(Math.random() * 30) + 10;
    const camp = new CampgroundModel({
      location: `${city.city}, ${city.state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      image: `https://source.unsplash.com/collection/483251`,
      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores amet praesentium vitae iusto hic ullam!',
      price,
      author: '62dfc49cdede2f0ae8e92a0d',
      geometry: {
        type: 'Point',
        coordinates: [city.longitude, city.latitude],
      },
    });
    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
