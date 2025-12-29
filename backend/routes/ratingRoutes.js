// backend/routes/ratingRoutes.js
const express = require('express');
const { createRating, getRatingsForUser, getAverageRatingForUser } = require('../controllers/ratingController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/rate', protect, createRating);
router.get('/:userId', getRatingsForUser);
router.get('/average/:userId', getAverageRatingForUser);

module.exports = router;
