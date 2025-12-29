// backend/services/chatService.js
const Chat = require('../models/chat');
const User = require('../models/user');
const NotificationService = require('./notificationService');

const startChat = async (senderId, receiverId) => {
    let chat = await Chat.findOne({ participants: { $all: [senderId, receiverId] } });
    if (!chat) {
        chat = new Chat({
            participants: [senderId, receiverId],
            chatName: '',
            isGroupChat: false,
            isClosed: false,
            groupAdmin: receiverId
        });
        await chat.save();
    }
    return chat;
};

const sendMessage = async (chatId, userId, message, io) => {
    let chat = await Chat.findById(chatId);
    if (!chat) {
        throw new Error('Chat not found');
    }
    
    if (chat.isClosed) {
        throw new Error('Chat is closed');
    }

    const newMessage = {
        sender: userId,
        message,
        timestamp: new Date()
    };
    chat.messages.push(newMessage);
    await chat.save();

    const otherParticipant = chat.participants.find(participant => participant.toString() !== userId.toString());
    io.to(otherParticipant.toString()).emit('newMessage', { chatId, message: newMessage });

    const sender = await User.findById(userId);
    const notificationMessage = `You have a new message from###${sender.firstName}###${sender.lastName}.###${message.slice(0, 50)}...`;
    
    await NotificationService.createNotification(otherParticipant.toString(), userId, notificationMessage, io);
    
    return newMessage;
};

const getChats = async (userId) => {
    const chats = await Chat.find({ participants: userId })
        .populate('participants', 'firstName lastName username profilePhoto')
        .populate('messages.sender', 'firstName lastName username profilePhoto');
    return chats;
};

const getChatById = async (chatId) => {
    const chat = await Chat.findById(chatId)
        .populate('participants', 'firstName lastName username profilePhoto')
        .populate('messages.sender', 'firstName lastName username profilePhoto');
    if (!chat) {
        throw new Error('Chat not found');
    }
    return chat;
};

const closeChat = async (chatId, userId) => {
    let chat = await Chat.findById(chatId);
    if (!chat) {
        throw new Error('Chat not found');
    }
    
    if (chat.groupAdmin.toString() !== userId.toString()) {
        throw new Error('Only the group admin can close the chat');
    }

    chat.isClosed = true;
    await chat.save();
    
    return chat;
};

const markMessagesAsSeen = async (chatId, userId, io) => {
    let chat = await Chat.findById(chatId);
    if (!chat) {
        throw new Error('Chat not found');
    }

    chat.messages.forEach((message) => {
        if (message.sender.toString() !== userId.toString()) {
            message.seen = true;
        }
    });

    await chat.save();
    
    // Emit an event to notify the frontend
    chat.participants.forEach(participant => {
        if (participant.toString() !== userId.toString()) {
            io.to(participant.toString()).emit('messagesMarkedAsSeen', { chatId, userId });
        }
    });

    return chat;
};

const deleteChatBetweenUsers = async (userId, collaboratorId) => {
    await Chat.deleteMany({
        participants: { $all: [userId, collaboratorId] }
    });
};

module.exports = { startChat, sendMessage, getChats, getChatById, closeChat, deleteChatBetweenUsers, markMessagesAsSeen };
