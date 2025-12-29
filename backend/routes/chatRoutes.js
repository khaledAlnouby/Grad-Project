// backend/routes/chatRoutes.js
const express = require('express');
const { getChats, sendMessage, startChat, getChatById, closeChat, markMessagesAsSeen } = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/').get(protect, getChats);
router.route('/start').post(protect, startChat);
router.route('/send').post(protect, sendMessage);
router.route('/:id').get(protect, getChatById);
router.post('/close', protect, closeChat);
router.post('/mark-seen', protect, markMessagesAsSeen);

module.exports = router;


/*
// backend/routes/chatRoutes.js
const express = require('express');
const { getChats, sendMessage, startChat, getChatById } = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/').get(protect, getChats);
router.route('/start').post(protect, startChat);
router.route('/send').post(protect, sendMessage);
router.route('/:id').get(protect, getChatById);

module.exports = router;
*/

/*
// backend/routes/chatRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getChats, sendMessage, startChat } = require('../controllers/chatController');

router.route('/').get(protect, getChats);
router.route('/send').post(protect, sendMessage);
router.route('/start').post(protect, startChat);

module.exports = router;
*/