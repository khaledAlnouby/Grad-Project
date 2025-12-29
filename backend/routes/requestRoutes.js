// backend/routes/requestRoutes.js
const express = require('express');
const { sendRequest, getRequests, updateRequestStatus, endCollaboration, blockUser } = require('../controllers/requestController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/send', protect, sendRequest);
router.get('/', protect, getRequests);
router.put('/status', protect, updateRequestStatus);
router.post('/end-collaboration', protect, endCollaboration);
router.post('/block', protect, blockUser);

module.exports = router;
