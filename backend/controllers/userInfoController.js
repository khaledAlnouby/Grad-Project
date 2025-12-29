// backend/controllers/userInfoController.js
const User = require('../models/user');
const Skill = require('../models/skill');

const getUserProfile = async (req, res) => {
    const userId = req.user._id;

    try {
        const user = await User.findById(userId)
            .populate('skillsToLearn', 'name') // Populate skillsToLearn field
            .populate('skillsToTeach', 'name'); // Populate skillsToTeach field

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getUserProfileById = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findById(id)
            .populate('skillsToLearn', 'name')
            .populate('skillsToTeach', 'name');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getCollaborators = async (req, res) => {
    const userId = req.user._id;

    try {
        const user = await User.findById(userId)
            .populate({
                path: 'collaborators',
                select: 'firstName lastName profilePhoto skillsToTeach',
                populate: {
                    path: 'skillsToTeach',
                    select: 'name' 
                }
            });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user.collaborators);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const updateBasicInfo = async (req, res) => {
    const userId = req.user._id;
    const { email } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.email = email;
        await user.save();

        res.status(200).json({ message: 'Basic information updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const updateProfilePhoto = async (req, res) => {
    const userId = req.user._id;
    const profilePhoto = req.file ? req.file.path : null;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (profilePhoto) user.profilePhoto = profilePhoto;
        await user.save();

        res.status(200).json({ message: 'Profile photo updated successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const updateCoverPhoto = async (req, res) => {
    const userId = req.user._id;
    const coverPhoto = req.file ? req.file.path : null;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (coverPhoto) user.coverPhoto = coverPhoto;
        await user.save();

        res.status(200).json({ message: 'Cover photo updated successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const updatePersonalInfo = async (req, res) => {
    const userId = req.user._id;
    const { firstName, lastName, phoneNumber, age, country, state, city, gender, dob } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.firstName = firstName || user.firstName;
        user.lastName = lastName || user.lastName;
        user.phoneNumber = phoneNumber;
        user.age = age;
        user.country = country;
        user.state = state;
        user.city = city;
        user.gender = gender;
        user.dob = dob || user.dob;

        await user.save();

        res.status(200).json({ message: 'Personal information updated successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const updateEducationalInfo = async (req, res) => {
    const userId = req.user._id;
    const { universityName, facultyName, departmentName, academicLevel, graduatedYear, skillsToLearn, skillsToTeach } = req.body;

    try {
        console.log('Updating educational info for user:', userId);
        const user = await User.findById(userId);
        if (!user) {
            console.error('User not found');
            return res.status(404).json({ message: 'User not found' });
        }

        user.universityName = universityName;
        user.facultyName = facultyName;
        user.departmentName = departmentName;
        user.academicLevel = academicLevel || 'academicLevel';

        if (academicLevel === 'graduate') {
            if (!graduatedYear) {
                console.error('Graduated year is required for graduates');
                return res.status(400).json({ message: 'Graduated year is required for graduates' });
            }
            user.graduatedYear = graduatedYear;
        } else {
            user.graduatedYear = undefined;
        }

        const handleSkills = async (skills) => {
            const skillIds = [];
            for (let skill of skills) {
                if (!skill.name) {
                    console.error('Skill name is required');
                    return res.status(400).json({ message: 'Skill name is required' });
                }
                let skillObj = await Skill.findOne({ name: skill.name });
                if (!skillObj) {
                    skillObj = new Skill({ name: skill.name });
                    await skillObj.save();
                }
                skillIds.push(skillObj._id);
            }
            return skillIds;
        }

        user.skillsToLearn = await handleSkills(skillsToLearn || []);
        user.skillsToTeach = await handleSkills(skillsToTeach || []);

        await user.save();

        res.status(200).json({ message: 'Educational information updated successfully' });
    } catch (error) {
        console.error('Error updating educational info:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    getUserProfile,
    getUserProfileById,
    getCollaborators,
    updateBasicInfo,
    updateProfilePhoto,
    updateCoverPhoto,
    updatePersonalInfo,
    updateEducationalInfo
};
