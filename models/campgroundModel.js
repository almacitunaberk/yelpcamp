const mongoose = require('mongoose');
const ReviewModel = require('./reviewModel');
const campgroundSchema = new mongoose.Schema(
  {
    title: String,
    image: String,
    price: Number,
    description: String,
    location: String,
    geometry: {
      type: {
        type: String,
        enum: ['Point'],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review',
      },
    ],
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
  }
);

campgroundSchema.virtual('properties.popUpMarkup').get(function () {
  return `<a href='/campgrounds/${this._id}'><h3>${this.title}</h3></a>
  <p>${this.description.substring(0.2)}...</p>`;
});

campgroundSchema.post('findOneAndDelete', async function (doc) {
  if (doc) {
    await ReviewModel.deleteMany({
      _id: {
        $in: doc.reviews,
      },
    });
  }
});

const CampgroundModel = mongoose.model('Campground', campgroundSchema);

module.exports = CampgroundModel;
