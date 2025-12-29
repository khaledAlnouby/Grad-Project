// backend/controllers/chatController.js
const ChatService = require('../services/chatService');

const startChat = async (req, res) => {
    try {
        const { receiverId } = req.body;
        const senderId = req.user.id;
        const chat = await ChatService.startChat(senderId, receiverId);
        res.status(200).json(chat);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const sendMessage = async (req, res) => {
    try {
        const { chatId, message } = req.body;
        const userId = req.user.id;
        const io = req.app.get('io');
        const newMessage = await ChatService.sendMessage(chatId, userId, message, io);
        res.status(200).json({ message: newMessage });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getChats = async (req, res) => {
    try {
        const userId = req.user.id;
        const chats = await ChatService.getChats(userId);
        res.status(200).json(chats);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getChatById = async (req, res) => {
    try {
        const chat = await ChatService.getChatById(req.params.id);
        res.status(200).json(chat);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const closeChat = async (req, res) => {
    try {
        const { chatId } = req.body;
        const userId = req.user.id;
        const chat = await ChatService.closeChat(chatId, userId);
        res.status(200).json(chat);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const markMessagesAsSeen = async (req, res) => {
    try {
        const { chatId } = req.body;
        const userId = req.user.id;
        const io = req.app.get('io');
        const updatedChat = await ChatService.markMessagesAsSeen(chatId, userId, io);
        res.status(200).json(updatedChat);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { getChats, sendMessage, startChat, getChatById, closeChat, markMessagesAsSeen };