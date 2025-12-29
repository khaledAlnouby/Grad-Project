// backend/controllers/ratingController.js
const Rating = require('../models/rating');
const User = require('../models/user');

const createRating = async (req, res) => {
  try {
    const { toUser, score, comment } = req.body;
    const fromUser = req.user._id;

    const rating = new Rating({ fromUser, toUser, score, comment });
    await rating.save();
    
    await updateAverageRatingForUser(toUser); // Update average rating

    res.status(201).json(rating);
  } catch (error) {
    res.status(500).json({ message: 'Error creating rating', error });
  }
};

const getRatingsForUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const ratings = await Rating.find({ toUser: userId }).populate('fromUser', 'firstName lastName');

    res.status(200).json(ratings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching ratings', error });
  }
};

const getAverageRatingForUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const ratings = await Rating.find({ toUser: userId });

    const totalScore = ratings.reduce((acc, rating) => acc + rating.score, 0);
    const averageRating = ratings.length > 0 ? (totalScore / ratings.length) : 0;

    res.status(200).json({ averageRating });
  } catch (error) {
    res.status(500).json({ message: 'Error calculating average rating', error });
  }
};

const updateAverageRatingForUser = async (userId) => {
  const ratings = await Rating.find({ toUser: userId });

  const totalScore = ratings.reduce((acc, rating) => acc + rating.score, 0);
  const averageRating = ratings.length > 0 ? (totalScore / ratings.length) : 0;

  await User.findByIdAndUpdate(userId, { averageRating });
};

module.exports = {
    createRating,
    getRatingsForUser,
    getAverageRatingForUser
};
/*
// backend/controllers/ratingController.js
const Rating = require('../models/rating');

const createRating = async (req, res) => {
  try {
    const { toUser, skill, score, comment } = req.body;
    const fromUser = req.user._id;

    const rating = new Rating({ fromUser, toUser, skill, score, comment });
    await rating.save();

    res.status(201).json(rating);
  } catch (error) {
    res.status(500).json({ message: 'Error creating rating', error });
  }
};

const getRatingsForUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const ratings = await Rating.find({ toUser: userId }).populate('fromUser', 'firstName lastName').populate('skill', 'name');

    const groupedRatings = ratings.reduce((acc, rating) => {
      const skillName = rating.skill.name;
      if (!acc[skillName]) {
        acc[skillName] = [];
      }
      acc[skillName].push(rating);
      return acc;
    }, {});

    res.status(200).json(groupedRatings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching ratings', error });
  }
};

const getAverageRatingForUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const ratings = await Rating.find({ toUser: userId });

    const totalScore = ratings.reduce((acc, rating) => acc + rating.score, 0);
    const averageRating = ratings.length > 0 ? (totalScore / ratings.length) : 0;

    res.status(200).json({ averageRating });
  } catch (error) {
    res.status(500).json({ message: 'Error calculating average rating', error });
  }
};

module.exports = {
    createRating,
    getRatingsForUser,
    getAverageRatingForUser
};
*/
/*

*/