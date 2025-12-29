// backend/models/user.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    dob: {
        type: Date,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    phoneNumber: {
        type: String
    },
    age: {
        type: Number
    },
    country: {
        type: String
    },
    state: {
        type: String
    },
    city: {
        type: String
    },
    gender: {
        type: String
    },
    universityName: {
        type: String
    },
    facultyName: {
        type: String
    },
    departmentName: {
        type: String
    },
    academicLevel: {
        type: String,
        enum: ['academicLevel', 'firstLevel', 'secondLevel', 'thirdLevel', 'fourthLevel', 'fifthLevel', 'sixthLevel', 'seventhLevel', 'graduate']
    },
    graduatedYear: {
        type: String,
        required: function() {
            return this.academicLevel === 'graduate';  // Require graduatedYear only if academicLevel is 'graduate'
        }
    },
    skillsToLearn: [{
        type: Schema.Types.ObjectId,
        ref: 'Skill'
    }],
    skillsToTeach: [{
        type: Schema.Types.ObjectId,
        ref: 'Skill'
    }],
    profilePhoto: {
        type: String
    },
    coverPhoto: {
        type: String
    },
    isOnline: {
        type: Boolean,
        default: false
    },
    collaborators: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    blockedUsers: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    totalCollaborators: {
        type: Number,
        default: 0
    },
    averageRating: { 
        type: Number, 
        default: 0 
    }
}, { timestamps: true });

userSchema.pre('save', function(next) {
    if (this.dob) {
        const ageDifMs = Date.now() - this.dob.getTime();
        const ageDate = new Date(ageDifMs); // miliseconds from epoch
        this.age = Math.abs(ageDate.getUTCFullYear() - 1970);
    }
    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
