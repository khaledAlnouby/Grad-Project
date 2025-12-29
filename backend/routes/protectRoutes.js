// backend/routes/protectRoutes.js
const express = require('express');
const { verifyToken } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/verifyToken', (req, res) => {
  const token = req.headers.authorization && req.headers.authorization.startsWith('Bearer') ?
    req.headers.authorization.split(' ')[1] : null;

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    const decoded = verifyToken(token);
    res.status(200).json({ message: 'Token is valid' });
  } catch (error) {
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
});

module.exports = router;
