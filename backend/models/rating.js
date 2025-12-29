// backend/models/rating.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RatingSchema = new Schema({
    fromUser: { 
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    toUser: { 
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    score: { 
        type: Number, 
        required: true, 
        min: 1, 
        max: 5 
    },
    comment: { 
        type: String, 
        required: false 
    }
}, { timestamps: true });

module.exports = mongoose.model('Rating', RatingSchema);
/*
// backend/models/rating.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RatingSchema = new Schema({
    fromUser: { 
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    toUser: { 
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    skill: {
        type: Schema.Types.ObjectId,
        ref: 'Skill',
        required: true
    },
    score: { 
        type: Number, 
        required: true, 
        min: 1, 
        max: 5 
    },
    comment: { 
        type: String, 
        required: false 
    }
}, { timestamps: true });

module.exports = mongoose.model('Rating', RatingSchema);
*/