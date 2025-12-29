// backend/routes/jitsiRoutes.js
const express = require('express');
const generateJitsiJWT = require('../utils/generateJitsi-JWT');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/token', (req, res) => {
  const { user, room } = req.query;
  if (!user || !room) {
    return res.status(400).json({ message: 'User and room are required' });
  }

  const token = generateJitsiJWT(user, room);
  res.json({ token });
});

module.exports = router;
