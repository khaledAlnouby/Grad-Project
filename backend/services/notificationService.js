// backend/services/notificationService.js
const Notification = require('../models/notification');

const createNotification = async (userId, senderId, message, io) => {
    try {
        const notification = new Notification({ user: userId, sender: senderId, message });
        await notification.save();

        // Emit real-time notification to a specific user
        io.to(userId).emit('newNotification', { userId, message });
    } catch (error) {
        console.error('Error creating notification:', error);
    }
};

module.exports = { createNotification };
