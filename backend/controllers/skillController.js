// backend/controllers/skillController.js
const User = require('../models/user');
const Skill = require('../models/skill');
const Rating = require('../models/rating');

const getSkillSuggestions = async (req, res) => {
    const { query } = req.query; // Extract the query parameter from the request query string

    try {
        // Find the skills that match the query using a regular expression (case-insensitive)
        const skills = await Skill.find({ name: { $regex: query, $options: 'i' } });
        res.json(skills); 
    } catch (error) {
        console.error('Error fetching skill suggestions:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

/*
const searchUsersBySkill = async (req, res) => {
    try {
        const skillName = req.params.skillName; // Extract the skill name from the request parameters
        const currentUserId = req.user.id;      // Assuming req.user contains the authenticated user's information
        // Find skills that match the skill name using a regular expression (case-insensitive)
        const skills = await Skill.find({ name: { $regex: skillName, $options: 'i' } });

        if (skills.length === 0) {
            return res.status(404).json({ message: 'Skills not found' });
        }
        
        // Map the found skills to their IDs
        const skillIds = skills.map(skill => skill._id);
        // 1. Find users who have the matching skills in their skillsToTeach array
        // 2. Populate the skillsToTeach field with the actual skill documents
        // 3. Sort the users by their online status (isOnline)
        const users = await User.find({ 
            skillsToTeach: { $in: skillIds },
            _id: { $ne: currentUserId } // Exclude the current user
        })
        .populate('skillsToTeach')
        .sort({ isOnline: -1 });

        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
*/

// backend/controllers/skillController.js

const searchUsersBySkill = async (req, res) => {
    try {
        const skillName = req.params.skillName;
        const currentUserId = req.user.id;
        const { gender, ageOrder } = req.query;

        console.log("Query Parameters:", { gender, ageOrder });

        const currentUser = await User.findById(currentUserId);
        const blockedUsers = currentUser.blockedUsers;

        const skills = await Skill.find({ name: { $regex: skillName, $options: 'i' } });

        if (skills.length === 0) {
            return res.status(404).json({ message: 'Skills not found' });
        }

        const skillIds = skills.map(skill => skill._id);

        let filter = {
            skillsToTeach: { $in: skillIds },
            _id: { $ne: currentUserId, $nin: blockedUsers },
            blockedUsers: { $nin: [currentUserId] }
        };

        if (gender) {
            filter.gender = gender;
        }

        let sort = {};
        if (ageOrder === 'asc') {
            sort.dob = -1;
        } else if (ageOrder === 'desc') {
            sort.dob = 1;
        }

        sort.averageRating = -1;
        sort.isOnline = -1;

        console.log("Sorting Criteria:", sort);

        const users = await User.find(filter)
            .populate('skillsToTeach')
            .sort(sort);

        console.log("Sorted Users:", users);

        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};



const addSkill = async (req, res) => {
    try {
        const { name } = req.body; // Extract the skill name from the request body
 
        // Check if the skill already exists in the database
        let skill = await Skill.findOne({ name });
        if (skill) {
            return res.status(400).json({ message: 'Skill already exists' });
        }

        skill = new Skill({ name }); // Create a new skill document with the provided name
        await skill.save();          // Save the new skill document to the database

        res.status(201).json(skill);
    } catch (error) {
        console.error('Error adding skill:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    getSkillSuggestions,
    searchUsersBySkill,
    addSkill
};