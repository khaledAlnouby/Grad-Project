 // frontend/src/context/NotificationContext.js
import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';

const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

const NotificationProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const audioRef = useRef(null);  // Reference to the audio element

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        if (token) {
            connectSocket(token);
        }

        // Disconnect socket when component unmounts
        return () => {
            if (socket) socket.disconnect();
        };
    }, []);

    const connectSocket = (token) => {
        if (!token) return;

        // Establish socket connection
        const newSocket = io('http://localhost:5000', {
            query: { token }
        });

        setSocket(newSocket);

        const fetchNotifications = async () => {
            try {
                const response = await axios.get('/api/notifications', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const fetchedNotifications = response.data.notifications;
                setNotifications(fetchedNotifications);
                setUnreadCount(fetchedNotifications.filter(n => !n.isRead).length);
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
        };

        fetchNotifications();

        // Listen for new notifications from the socket
        newSocket.on('newNotification', (notification) => {
            setNotifications((prevNotifications) => [...prevNotifications, notification]);
            setUnreadCount(prevCount => prevCount + 1);
            playNotificationSound();  // Play sound when a new notification is received
        });

        // Handle socket disconnection
        newSocket.on('disconnect', () => {
            console.log('User disconnected:', newSocket.id);
        });

        // Handle socket reconnection
        newSocket.on('reconnect', () => {
            console.log('User reconnected:', newSocket.id);
            fetchNotifications();
        });
    };

    const playNotificationSound = () => {
        if (audioRef.current) {
            audioRef.current.play();
        }
    };

    const resetNotifications = () => {
        setNotifications(notifications.map(notification => ({ ...notification, isRead: true })));
        setUnreadCount(0);
    };

    return (
        <NotificationContext.Provider value={{ notifications, unreadCount, resetNotifications, connectSocket }}>
            {children}
            <audio ref={audioRef} src="/notification.mp3" />
        </NotificationContext.Provider>
    );
};

export default NotificationProvider;
