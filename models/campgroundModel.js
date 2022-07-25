const mongoose = require('mongoose');
const ReviewModel = require('./reviewModel');
const campgroundSchema = new mongoose.Schema({
  title: String,
  image: String,
  price: Number,
  description: String,
  location: String,
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Review',
    },
  ],
});

campgroundSchema.post('findOneAndDelete', async function (doc) {
  if (doc) {
    console.log('DOC', doc);
    await ReviewModel.deleteMany({
      _id: {
        $in: doc.reviews,
      },
    });
  } else {
    console.log('ELSE');
  }
});

const CampgroundModel = mongoose.model('Campground', campgroundSchema);

module.exports = CampgroundModel;
