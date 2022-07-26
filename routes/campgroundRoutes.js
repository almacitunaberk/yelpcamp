const express = require('express');
const isLoggedIn = require('../middleware/isLoggedIn');
const isAuthor = require('../middleware/isAuthor');
const {
  getAllCampgrounds,
  createNewCampground,
  getCampgroundById,
  editCampgroundById,
  deleteCampgroundById,
  getNewCampgroundPage,
} = require('../controllers/campgroundControllers');
const router = express.Router();

router.route('/').get(getAllCampgrounds).post(isLoggedIn, createNewCampground);

router.get('/new', isLoggedIn, getNewCampgroundPage);

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

router
  .route('/:id')
  .get(getCampgroundById)
  .put(isLoggedIn, isAuthor, editCampgroundById)
  .delete(isLoggedIn, isAuthor, deleteCampgroundById);

router.get('/:id/edit', isLoggedIn, isAuthor, editCampgroundById);

module.exports = router;
