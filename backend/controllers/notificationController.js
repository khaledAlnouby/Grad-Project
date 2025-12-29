// backend/controllers/notificationController.js
const Notification = require('../models/notification');

const getNotifications = async (req, res) => {
    try {
        // Find notifications, sorted by createdAt timestamp descending
        // Populate the 'sender' field from the User model with 'firstName', 'lastName', and 'profilePhoto'
        const notifications = await Notification.find({ user: req.user.id })
            .sort({ createdAt: -1 })
            .populate('sender', 'firstName lastName profilePhoto');
        
        res.status(200).json({ notifications });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

const markAllAsRead = async (req, res) => {
    try {
        await Notification.updateMany({ user: req.user.id, isRead: false }, { $set: { isRead: true } });

        res.status(200).json({ message: 'Notifications marked as read' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

const getUnreadNotificationCount = async (req, res) => {
    try {
        // Count the number of notifications for the user where isRead is false
        const count = await Notification.countDocuments({ user: req.user.id, isRead: false });
        
        res.status(200).json({ count });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

module.exports = { getNotifications, markAllAsRead, getUnreadNotificationCount };