// frontend/src/components/Notifications.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NotificationCard from './NotificationCard';
import '../assets/styles/NotificationCard.css';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await axios.get('/api/notifications', {
                    headers: {
                        Authorization: `Bearer ${sessionStorage.getItem('token')}`
                    }
                });
                setNotifications(response.data.notifications);
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
        };

        const markAllAsRead = async () => {
            try {
                await axios.post('/api/notifications/mark-all-as-read', {}, {
                    headers: {
                        Authorization: `Bearer ${sessionStorage.getItem('token')}`
                    }
                });
                // Update notifications state to reflect they are all read
                setNotifications(prevNotifications => 
                    prevNotifications.map(notification => ({ ...notification, isRead: true }))
                );
            } catch (error) {
                console.error('Error marking notifications as read:', error);
            }
        };

        fetchNotifications();
        markAllAsRead();
    }, []);

    return (
        <div className="notifications">
            <h2 className="notifications-header">Notifications</h2>
            <ul className="notifications-list">
                {notifications.map(notification => (
                    <NotificationCard key={notification._id} notification={notification} />
                ))}
            </ul>
        </div>
    );
};

export default Notifications;


/*
// frontend/src/components/Notifications.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await axios.get('/api/notifications', {
                    headers: {
                        Authorization: `Bearer ${sessionStorage.getItem('token')}`
                    }
                });
                setNotifications(response.data.notifications);
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
        };

        fetchNotifications();
    }, []);

    return (
        <div className="notifications">
            <h2>Notifications</h2>
            <ul>
                {notifications.map(notification => (
                    <li key={notification._id}>{notification.message}</li>
                ))}
            </ul>
        </div>
    );
};

export default Notifications;
*/