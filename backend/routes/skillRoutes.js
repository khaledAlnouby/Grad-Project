// backend/routes/skillRoutes.js
const express = require('express');
const { getSkillSuggestions, searchUsersBySkill, addSkill } = require('../controllers/skillController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/suggestions', getSkillSuggestions);
router.get('/search/:skillName', protect, searchUsersBySkill);
router.post('/', addSkill);

module.exports = router;
