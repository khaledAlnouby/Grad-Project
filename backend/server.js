// backend/server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db'); // Database connection module
const authRoutes = require('./routes/authRoutes'); // Authentication routes
const userInfoRoutes = require('./routes/userInfoRoutes'); // User information routes
const protectRoutes = require('./routes/protectRoutes'); // Protected routes
const sendEmail = require('./utils/sendEmail'); // Email sending utility
const skillRoutes = require('./routes/skillRoutes'); // Skill-related routes
const requestRoutes = require('./routes/requestRoutes'); // Request-related routes
const chatRoutes = require('./routes/chatRoutes');
const jitsiRoutes = require('./routes/jitsiRoutes');
const ratingRoutes = require('./routes/ratingRoutes');
const notificationRoutes = require('./routes/notificationRoutes'); // Notification-related routes
const path = require('path');
const http = require('http');
const { Server } = require('socket.io'); // Socket.IO for real-time communication
const { verifyToken } = require('./middleware/authMiddleware'); // Token verification middleware
const User = require('./models/user'); // User model

dotenv.config(); // Load environment variables from .env file
connectDB(); // Connect to the database

const app = express();
const server = http.createServer(app); // Create an HTTP server
const io = new Server(server, {
    cors: {
        origin: "*", // Allow all origins for CORS (Cross-Origin Resource Sharing)
    }
});

const PORT = process.env.PORT || 5000; // Define the port to run the server

// Middleware setup
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON bodies

// Define routes for various API endpoints
app.use('/api/auth', authRoutes); // Authentication routes
app.use('/api/user', userInfoRoutes); // User information routes
app.use('/api/protectRoute', protectRoutes); // Protected routes
app.use('/api/skills', skillRoutes); // Skill-related routes
app.use('/api/requests', requestRoutes); // Request-related routes
app.use('/api/chat', chatRoutes);
app.use('/api/jitsi', jitsiRoutes);
app.use('/api/ratings', ratingRoutes);
app.use('/api/notifications', notificationRoutes); // Notification-related routes
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve static files

// Middleware to authenticate and authorize WebSocket connections
io.use((socket, next) => {
    if (socket.handshake.query && socket.handshake.query.token) { // Check for token in query
        try {
            const decoded = verifyToken(socket.handshake.query.token); // Verify token
            socket.userId = decoded.userId; // Attach user ID to socket
            next(); // Proceed to the next middleware
        } catch (err) {
            return next(new Error('Authentication error')); // Handle authentication error
        }
    } else {
        next(new Error('Authentication error')); // Handle missing token error
    }
}).on('connection', (socket) => { // Handle a new connection
    console.log('A user connected: ', socket.userId);

    // Join a room specific to the user ID
    socket.join(socket.userId);

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('User disconnected: ', socket.userId);
    });
});

// Make the io instance accessible to routes for emitting events
app.set('io', io);

// Start the server and listen on the specified port
server.listen(PORT, () => {
    console.log(`Server Running on Port: ${PORT}`);
});
