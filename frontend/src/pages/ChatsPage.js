// frontend/src/pages/ChatsPage.js
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ChatsList from '../components/ChatsList';
import ChatRoom from '../components/ChatRoom';
import '../assets/styles/ChatsPage.css';

const ChatsPage = () => {
    const [selectedChatId, setSelectedChatId] = useState(null);
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const chatId = params.get('chatId');
        if (chatId) {
            setSelectedChatId(chatId);
        }
    }, [location]);

    const handleSelectChat = (chatId) => {
        setSelectedChatId(chatId);
    };

    return (
        <div className="messages-container">
            <div className="conversations-list">
                <ChatsList onSelectChat={handleSelectChat} />
            </div>
            <div className="conversation">
                {selectedChatId ? (
                    <ChatRoom chatId={selectedChatId} />
                ) : (
                    <div className="no-conversation">Select a chat to start messaging</div>
                )}
            </div>
        </div>
    );
};

export default ChatsPage;
