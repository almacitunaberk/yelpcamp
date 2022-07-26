const express = require('express');
const isLoggedIn = require('../middleware/isLoggedIn');
const isReviewOwner = require('../middleware/isReviewOwner');
const { postNewReview, getAllReviews, deleteReview } = require('../controllers/reviewControllers');

const router = express.Router({ mergeParams: true });

router.route('/').get(getAllReviews).post(isLoggedIn, postNewReview);

router.route('/:review_id').delete(isLoggedIn, isReviewOwner, deleteReview);

module.exports = router;
