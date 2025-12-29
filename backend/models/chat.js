// backend/models/chat.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const chatSchema = new mongoose.Schema({
    participants: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    chatName: {
        type: String,
        default: ''
    },
    isGroupChat: {
        type: Boolean,
        default: false
    },
    isClosed: { 
        type: Boolean, 
        default: false 
    },
    groupAdmin: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    messages: [
        {
            sender: {
                type: Schema.Types.ObjectId,
                ref: 'User'
            },
            message: {
                type: String,
                required: true
            },
            timestamp: {
                type: Date,
                default: Date.now
            },
            seen: {
                type: Boolean,
                default: false
            }
        }
    ]
}, { timestamps: true });

const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;


/*
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const chatSchema = new mongoose.Schema({
    participants: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    messages: [
        {
            sender: {
                type: Schema.Types.ObjectId,
                ref: 'User'
            },
            message: {
                type: String,
                required: true
            },
            timestamp: {
                type: Date,
                default: Date.now
            }
        }
    ]
}, { timestamps: true });

const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;
*/