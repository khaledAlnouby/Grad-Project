// frontend/src/components/ChatsList.js
// frontend/src/components/ChatsList.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Fix import statement
import axios from 'axios';
import '../assets/styles/ChatsList.css';

const ChatsList = ({ onSelectChat }) => {
    const [chatrooms, setChatrooms] = useState([]);
    const navigate = useNavigate();

    // Retrieve and decode the JWT token from session storage
    const token = sessionStorage.getItem('token');
    const decodedToken = jwtDecode(token);
    const currentUserId = decodedToken.userId;

    useEffect(() => {
        const fetchChatrooms = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/chat', {
                    headers: {
                        Authorization: `Bearer ${sessionStorage.getItem('token')}`
                    }
                });
                setChatrooms(response.data);
            } catch (error) {
                console.error('Error fetching chatrooms:', error);
            }
        };

        fetchChatrooms();
    }, []);

    const handleChatroomClick = (chatId) => {
        onSelectChat(chatId);
        // If you want to navigate to a different route, you can use navigate
        // navigate(`/chat/${chatId}`);
    };

    return (
        <div className="chat-page">
            <h1>Chats</h1>
            <ul className="chat-list">
                {chatrooms.map(chat => {
                    const lastMessage = chat.messages.length > 0 ? chat.messages[chat.messages.length - 1] : null;
                    const otherParticipant = chat.participants.find(p => p._id !== currentUserId);
                    const senderName = lastMessage && lastMessage.sender._id === currentUserId 
                        ? 'You' 
                        : lastMessage ? `${lastMessage.sender.firstName} ${lastMessage.sender.lastName}` : '';

                    return (
                        <li key={chat._id} className="chat-item" onClick={() => handleChatroomClick(chat._id)}>
                            <img src={otherParticipant.profilePhoto} alt={`${otherParticipant.firstName}'s profile`} className="profile-photo" />
                            <div className="chat-info">
                                <div className="chat-participant">{otherParticipant.firstName} {otherParticipant.lastName}</div>
                                <div className="chat-last-message">
                                    {lastMessage ? `${senderName}: ${lastMessage.message}` : 'No messages yet'}
                                </div>
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default ChatsList;





/*
// frontend/src/pages/ChatPage.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../assets/styles/ChatPage.css'; // Create this CSS file for styling

const ChatPage = () => {
    const [chatrooms, setChatrooms] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchChatrooms = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/chat', {
                    headers: {
                        Authorization: `Bearer ${sessionStorage.getItem('token')}`
                    }
                });
                setChatrooms(response.data);
            } catch (error) {
                console.error('Error fetching chatrooms:', error);
            }
        };

        fetchChatrooms();
    }, []);

    const handleChatroomClick = (chatId) => {
        navigate(`/chat/${chatId}`);
    };

    return (
        <div className="chat-page">
            <h1>Chats</h1>
            <ul className="chat-list">
                {chatrooms.map(chat => {
                    const lastMessage = chat.messages[chat.messages.length - 1];
                    const otherParticipant = chat.participants.find(p => p._id !== sessionStorage.getItem('userId'));

                    return (
                        <li key={chat._id} className="chat-item" onClick={() => handleChatroomClick(chat._id)}>
                            <img src={otherParticipant.profilePhoto} alt={`${otherParticipant.firstName}'s profile`} className="profile-photo" />
                            <div className="chat-info">
                                <div className="chat-participant">{otherParticipant.firstName} {otherParticipant.lastName}</div>
                                <div className="chat-last-message">{lastMessage ? `${lastMessage.sender.firstName}: ${lastMessage.message}` : 'No messages yet'}</div>
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default ChatPage;
*/

/*
// frontend/src/pages/ChatPage.js
import React from 'react';
import Chat from '../components/Chat';

const ChatPage = () => {
    return (
        <div>
            <h1>Chats</h1>
            <Chat />
        </div>
    );
};

export default ChatPage;
*/

/*
// frontend/src/pages/ChatPage.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ChatPage = () => {
    const [chats, setChats] = useState([]);

    useEffect(() => {
        const fetchChats = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/chat', {
                    headers: {
                        Authorization: `Bearer ${sessionStorage.getItem('token')}`
                    }
                });
                setChats(response.data);
            } catch (error) {
                console.error('Error fetching chats:', error);
            }
        };

        fetchChats();
    }, []);

    const handleSendMessage = async (chatId, message) => {
        try {
            await axios.post('http://localhost:5000/api/chat/send', {
                chatId,
                message
            }, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('token')}`
                }
            });
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    return (
        <div>
            {chats.map(chat => (
                <div key={chat._id}>
                    <h3>Chat with {chat.participants.map(p => `${p.firstName} ${p.lastName}`).join(', ')}</h3>
                    <ul>
                        {chat.messages.map(msg => (
                            <li key={msg._id}>
                                <strong>{msg.sender.firstName} {msg.sender.lastName}:</strong> {msg.message}
                            </li>
                        ))}
                    </ul>
                    <input type="text" placeholder="Type a message..." onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            handleSendMessage(chat._id, e.target.value);
                            e.target.value = '';
                        }
                    }} />
                </div>
            ))}
        </div>
    );
};

export default ChatPage;
*/