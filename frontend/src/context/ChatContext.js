// frontend/src/context/ChatContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';

const ChatContext = createContext();

export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        if (token) {
            connectSocket(token);
        }

        return () => {
            if (socket) socket.disconnect();
        };
    }, []);

    const connectSocket = (token) => {
        if (!token) return;

        const newSocket = io('http://localhost:5000', {
            query: { token }
        });

        setSocket(newSocket);

        newSocket.on('newMessage', (message) => {
            setChats(prevChats => {
                const updatedChats = prevChats.map(chat => {
                    if (chat._id === message.chatId) {
                        chat.messages.push(message);
                    }
                    return chat;
                });
                if (selectedChat && selectedChat._id === message.chatId) {
                    setSelectedChat({ ...selectedChat, messages: [...selectedChat.messages, message] });
                }
                return updatedChats;
            });
        });

        newSocket.on('disconnect', () => {
            console.log('User disconnected:', newSocket.id);
        });

        newSocket.on('reconnect', () => {
            console.log('User reconnected:', newSocket.id);
        });
    };

    const fetchChats = async () => {
        const token = sessionStorage.getItem('token');
        try {
            const response = await axios.get('/api/chat', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setChats(response.data);
        } catch (error) {
            console.error('Error fetching chats:', error);
        }
    };

    const sendMessage = async (chatId, message) => {
        const token = sessionStorage.getItem('token');
        try {
            await axios.post('/api/chat/send', { chatId, message }, {
                headers: { Authorization: `Bearer ${token}` }
            });
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    return (
        <ChatContext.Provider value={{ chats, selectedChat, setSelectedChat, fetchChats, sendMessage, socket }}>
            {children}
        </ChatContext.Provider>
    );
};
