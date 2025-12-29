// frontend/src/components/ChatRoom.js
import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { BsPerson, BsCameraVideoFill } from 'react-icons/bs';
import { jwtDecode } from 'jwt-decode';
import { format } from 'date-fns';
import { io } from 'socket.io-client';
import '../assets/styles/ChatRoom.css';
import VideoCall from './VideoCall';

const ChatRoom = ({ chatId }) => {
    const [chat, setChat] = useState(null);
    const [message, setMessage] = useState('');
    const [showVideoCall, setShowVideoCall] = useState(false);
    const messagesEndRef = useRef(null);
    const socketRef = useRef();

    const token = sessionStorage.getItem('token');
    const decodedToken = jwtDecode(token);
    const userId = decodedToken.userId;

    useEffect(() => {
        const fetchChat = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/chat/${chatId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setChat(response.data);
                markMessagesAsSeen(response.data);
            } catch (error) {
                console.error('Error fetching chat:', error);
            }
        };

        fetchChat();
    }, [chatId, token]);

    useEffect(() => {
        socketRef.current = io('http://localhost:5000', {
            query: { token }
        });

        socketRef.current.on('newMessage', (newMessage) => {
            if (newMessage.chatId === chatId) {
                setChat((prevChat) => ({
                    ...prevChat,
                    messages: [...prevChat.messages, newMessage.message]
                }));
                scrollToBottom();
                markMessagesAsSeen({ _id: chatId });
            }
        });

        socketRef.current.on('messagesMarkedAsSeen', ({ chatId: seenChatId, userId: seenByUserId }) => {
            if (seenChatId === chatId && seenByUserId !== userId) {
                setChat((prevChat) => ({
                    ...prevChat,
                    messages: prevChat.messages.map(message => ({
                        ...message,
                        seen: message.sender._id === userId ? true : message.seen
                    }))
                }));
            }
        });

        return () => {
            socketRef.current.disconnect();
        };
    }, [chatId, token, userId]);

    useEffect(() => {
        if (chat) {
            scrollToBottom();
        }
    }, [chat]);

    const handleSendMessage = async () => {
        const newMessage = {
            _id: Date.now(),
            sender: { _id: userId },
            message,
            timestamp: new Date().toISOString(),
            seen: false
        };

        setChat((prevChat) => ({
            ...prevChat,
            messages: [...prevChat.messages, newMessage]
        }));
        setMessage('');
        scrollToBottom();

        try {
            await axios.post('http://localhost:5000/api/chat/send', {
                chatId,
                message
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const markMessagesAsSeen = async (chat) => {
        try {
            await axios.post('http://localhost:5000/api/chat/mark-seen', {
                chatId: chat._id
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
        } catch (error) {
            console.error('Error marking messages as seen:', error);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleProfileClick = () => {
        console.log('Profile icon clicked');
    };

    const handleVideoCall = () => {
        setShowVideoCall(!showVideoCall);
    };

    if (!chat) return <div>Loading...</div>;

    const sender = chat.participants.find(participant => participant._id !== userId);
    const currentUser = chat.participants.find(participant => participant._id === userId);

    const groupedMessages = chat.messages.reduce((acc, message) => {
        const messageDate = new Date(message.timestamp);
        const formattedDate = format(messageDate, 'MMM d, yyyy');
        if (!acc[formattedDate]) {
            acc[formattedDate] = [];
        }
        acc[formattedDate].push(message);
        return acc;
    }, {});

    return (
        <div className="chatroom">
            <div className="chatroom-header">
                <h1>{sender.firstName} {sender.lastName}</h1>
                <div className="header-icons">
                    <button className="icon-button" onClick={handleVideoCall}>
                        <BsCameraVideoFill className="icon" />
                    </button>
                    <button className="icon-button" onClick={handleProfileClick}>
                        <BsPerson className="icon" />
                    </button>
                </div>
            </div>
            <div className="messages">
                {Object.keys(groupedMessages).map(date => (
                    <div key={date}>
                        <div className="message-date">{date}</div>
                        {groupedMessages[date].map(msg => (
                            <div key={msg._id} className={`message ${msg.sender._id === userId ? 'sent' : 'received'}`}>
                                <div className="message-content">{msg.message}</div>
                                <div className="message-timestamp">
                                    {format(new Date(msg.timestamp), 'h:mm a')}
                                    {msg.sender._id === userId && (
                                        <span className="message-status">{msg.seen ? '✓✓' : '✓'}</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <div className="message-form">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            handleSendMessage();
                        }
                    }}
                />
                <button onClick={handleSendMessage}>Send</button>
            </div>
            {showVideoCall && <VideoCall room={chatId} user={currentUser} onClose={() => setShowVideoCall(false)} />}
        </div>
    );
};

export default ChatRoom;
