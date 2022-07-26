const ReviewModel = require('../models/reviewModel');
const mongoose = require('mongoose');
const connectDB = require('../config/db');

connectDB();

const deleteReviews = async () => {
  await ReviewModel.deleteMany();
};

deleteReviews().then(() => {
  console.log('DELETED');
  mongoose.connection.close();
});
