// backend/controllers/requestController.js
const Request = require('../models/request');
const User = require('../models/user');
const Skill = require('../models/skill');
const Chat = require('../models/chat');
const ChatService = require('../services/chatService');
const NotificationService = require('../services/notificationService');

const sendRequest = async (req, res) => {
    try {
        const { receiverId, skillId, message } = req.body;
        const senderId = req.user.id;

        if (!receiverId || !message) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const sender = await User.findById(senderId);
        const receiver = await User.findById(receiverId);

        if (!sender || !receiver) {
            return res.status(404).json({ message: 'Sender or receiver not found' });
        }

        // Check if they are already collaborators
        if (sender.collaborators.includes(receiverId) || receiver.collaborators.includes(senderId)) {
            return res.status(400).json({ message: 'You are already collaborators' });
        }
        
        // Check if there is already a pending request from sender to receiver
        const existingRequest = await Request.findOne({
            sender: senderId,
            receiver: receiverId,
            status: 'pending'
        });

        if (existingRequest) {
            return res.status(400).json({ message: 'You have already sent a request to this user' });
        }

        const request = new Request({
            sender: senderId,
            receiver: receiverId,
            message
        });

        await request.save();

        const io = req.app.get('io'); // Get the io instance
        
        // Enrich the notification message
        //const notificationMessage = `${sender.firstName}###${sender.lastName}###has requested to learn###${skill.name}.###${message.slice(0, 50)}...`;

        // Emit notification to the receiver using NotificationService
        //await NotificationService.createNotification(receiverId, senderId, notificationMessage, io);

        res.status(201).json({ message: 'Request sent successfully', request });
    } catch (error) {
        console.error('Error in sendRequest:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getRequests = async (req, res) => {
    try {
        const userId = req.user.id;
        const requests = await Request.find({ receiver: userId, status: 'pending' }).populate('sender', 'firstName lastName profilePhoto'); // Only fetch pending requests
        res.status(200).json({ requests });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

const updateRequestStatus = async (req, res) => {
    try {
        const { requestId, status } = req.body;
        const request = await Request.findById(requestId);

        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }

        if (request.status === 'confirmed' || request.status === 'deleted') {
            return res.status(400).json({ message: 'Request status cannot be updated more than once' });
        }

        request.status = status;
        await request.save();

        const io = req.app.get('io'); // Get the io instance
        
        const sender = await User.findById(request.sender);
        const receiver = await User.findById(request.receiver);

        if (!sender || !receiver) {
            return res.status(404).json({ message: 'Sender or receiver not found' });
        }

        // Enrich the notification message
        //const notificationMessage = `Your collaboration request to###${receiver.firstName}###${receiver.lastName}###has been###${status}`;
        
        // Emit notification to the sender using NotificationService
        //await NotificationService.createNotification(request.sender.toString(), req.user.id, notificationMessage, io);

        if (status === 'confirmed') {
            if (!sender.collaborators.includes(receiver._id)) {
                sender.collaborators.push(receiver._id);
                sender.totalCollaborators += 1;
            }
            if (!receiver.collaborators.includes(sender._id)) {
                receiver.collaborators.push(sender._id);
                receiver.totalCollaborators += 1;
            }
            await sender.save();
            await receiver.save();

            await ChatService.startChat(sender._id, receiver._id);
        }

        res.status(200).json({ message: 'Request status updated successfully', request });
    } catch (error) {
        console.error('Error in updateRequestStatus:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const endCollaboration = async (req, res) => {
    try {
        const { collaboratorId } = req.body;
        const userId = req.user.id;

        const user = await User.findById(userId);
        const collaborator = await User.findById(collaboratorId);

        if (!user || !collaborator) {
            return res.status(404).json({ message: 'User or collaborator not found' });
        }

        // Remove collaborator from user's collaborators list
        user.collaborators = user.collaborators.filter(id => id.toString() !== collaboratorId);
        user.totalCollaborators -= 1;
        await user.save();

        // Remove user from collaborator's collaborators list
        collaborator.collaborators = collaborator.collaborators.filter(id => id.toString() !== userId);
        collaborator.totalCollaborators -= 1;
        await collaborator.save();

        // Delete the chat(s) between the users
        await ChatService.deleteChatBetweenUsers(userId, collaboratorId);

        res.status(200).json({ message: 'Collaboration ended and chat deleted successfully' });
    } catch (error) {
        console.error('Error in endCollaboration:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const blockUser = async (req, res) => {
    try {
        const { userId } = req.body;
        const currentUserId = req.user.id;

        const user = await User.findById(currentUserId);
        const userToBlock = await User.findById(userId);

        if (!user || !userToBlock) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.blockedUsers.includes(userId)) {
            return res.status(400).json({ message: 'User already blocked' });
        }

        user.blockedUsers.push(userId);
        await user.save();

        // End collaboration if they are collaborators
        if (user.collaborators.includes(userId)) {
            user.collaborators = user.collaborators.filter(id => id.toString() !== userId);
            user.totalCollaborators -= 1;
            await user.save();

            userToBlock.collaborators = userToBlock.collaborators.filter(id => id.toString() !== currentUserId);
            userToBlock.totalCollaborators -= 1;
            await userToBlock.save();
        }

        // Delete the chat(s) between the users
        await ChatService.deleteChatBetweenUsers(currentUserId, userId);

        res.status(200).json({ message: 'User blocked and chat deleted successfully' });
    } catch (error) {
        console.error('Error in blockUser:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

/*
const endCollaboration = async (req, res) => {
    try {
        const { collaboratorId } = req.body;
        const userId = req.user.id;

        const user = await User.findById(userId);
        const collaborator = await User.findById(collaboratorId);

        if (!user || !collaborator) {
            return res.status(404).json({ message: 'User or collaborator not found' });
        }

        // Remove collaborator from user's collaborators list
        user.collaborators = user.collaborators.filter(id => id.toString() !== collaboratorId);
        user.totalCollaborators -= 1;
        await user.save();

        // Remove user from collaborator's collaborators list
        collaborator.collaborators = collaborator.collaborators.filter(id => id.toString() !== userId);
        collaborator.totalCollaborators -= 1;
        await collaborator.save();

        res.status(200).json({ message: 'Collaboration ended successfully' });
    } catch (error) {
        console.error('Error in endCollaboration:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
*/
/*
const blockUser = async (req, res) => {
    try {
        const { userId } = req.body;
        const currentUserId = req.user.id;

        const user = await User.findById(currentUserId);
        const userToBlock = await User.findById(userId);

        if (!user || !userToBlock) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.blockedUsers.includes(userId)) {
            return res.status(400).json({ message: 'User already blocked' });
        }

        user.blockedUsers.push(userId);
        await user.save();

        // End collaboration if they are collaborators
        if (user.collaborators.includes(userId)) {
            user.collaborators = user.collaborators.filter(id => id.toString() !== userId);
            user.totalCollaborators -= 1;
            await user.save();

            userToBlock.collaborators = userToBlock.collaborators.filter(id => id.toString() !== currentUserId);
            userToBlock.totalCollaborators -= 1;
            await userToBlock.save();
        }

        res.status(200).json({ message: 'User blocked successfully' });
    } catch (error) {
        console.error('Error in blockUser:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
*/
module.exports = { 
    sendRequest, 
    getRequests, 
    updateRequestStatus,
    endCollaboration,
    blockUser
};
