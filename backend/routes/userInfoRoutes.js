// backend/routes/userInfoRoutes.js
const express = require('express');
const { getUserProfile, getUserProfileById, getCollaborators, updateBasicInfo, updateProfilePhoto, updateCoverPhoto, updatePersonalInfo, updateEducationalInfo } = require('../controllers/userInfoController');
const upload  = require('../middleware/uploadMiddleware');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/profile', protect, getUserProfile);
router.get('/profile/:id', getUserProfileById);
router.get('/collaborators', protect, getCollaborators);
router.put('/basic', protect, updateBasicInfo);
router.put('/profilePhoto', protect, upload.single('profilePhoto'), updateProfilePhoto);
router.put('/coverPhoto', protect, upload.single('coverPhoto'), updateCoverPhoto);
router.put('/personal', protect, updatePersonalInfo);
router.put('/educational', protect, updateEducationalInfo);

module.exports = router;

