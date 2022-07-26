const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  campgrounds: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Campground',
    },
  ],
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);
