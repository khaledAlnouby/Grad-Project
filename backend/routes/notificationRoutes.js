// backend/routes/notificationRoutes.js
const express = require('express');
const router = express.Router();
const { getNotifications, markAllAsRead, getUnreadNotificationCount } = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getNotifications);
router.post('/mark-all-as-read', protect, markAllAsRead);
router.get('/unreadCount', protect, getUnreadNotificationCount);

module.exports = router;
