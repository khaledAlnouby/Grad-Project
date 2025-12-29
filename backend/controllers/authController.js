// backend/controllers/authController.js
const User = require('../models/user');
const sendEmail = require('../utils/sendEmail');
const { hashPassword, comparePassword, generateToken, verifyToken } = require('../middleware/authMiddleware');

const register = async (req, res) => {
    const { email, dob, username, password, firstName, lastName } = req.body;

    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const usernameExists = await User.findOne({ username });
        if (usernameExists) {
            return res.status(400).json({ message: 'Username already taken' });
        }

        const hashedPassword = await hashPassword(password);

        const user = await User.create({
            email,
            dob,
            username,
            password: hashedPassword,
            firstName,
            lastName,
            isVerified: false
        });

        const token = generateToken({ userId: user._id });
        const verificationLink = `http://localhost:3000/verify/${token}`;

        await sendEmail(email, 'Verify Your Email', `Please verify your email by clicking the following link: ${verificationLink}`);

        res.status(201).json({ message: 'User registered, please check your email for verification link' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const verifyEmail = async (req, res) => {
    const { token } = req.params;

    try {
        const decoded = verifyToken(token);
        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(400).json({ message: 'Invalid token' });
        }

        user.isVerified = true;
        await user.save();

        res.status(200).json({ message: 'Email verified successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        if (!user.isVerified) {
            return res.status(400).json({ message: 'Please verify your email before logging in' });
        }

        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Update isOnline to true
        user.isOnline = true;
        await user.save(); // Save the updated user document

        const token = generateToken({ userId: user._id, isOnline: true });

        res.status(200).json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const logout = async (req, res) => {
    try {
        let token;
        if (req.headers.authorization) {
            token = req.headers.authorization.split(' ')[1];
        } else if (req.body.token) {
            token = req.body.token;
        } else {
            console.log('Token not provided');
            return res.status(400).json({ message: 'Token not provided' });
        }

        console.log(`Logout request received with token: ${token}`);
        const decoded = verifyToken(token);
        const user = await User.findById(decoded.userId);

        if (!user) {
            console.log('User not found');
            return res.status(400).json({ message: 'User not found' });
        }

        // Update isOnline to false
        user.isOnline = false;
        await user.save(); // Save the updated user document

        console.log('User logged out successfully');
        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        console.error('Error during logout:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    register,
    verifyEmail,
    login,
    logout
};
