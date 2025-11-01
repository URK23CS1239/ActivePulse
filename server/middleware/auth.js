const jwt = require('jsonwebtoken');
const User = require('../models/User');
const logger = require('../utils/logger');

const auth = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if user still exists
    const user = await User.findById(decoded.userId);
    if (!user) {
      throw new Error();
    }

    // Add user to request
    req.user = decoded;
    next();
  } catch (error) {
    logger.error('Auth Middleware Error:', error);
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

// Middleware for checking admin role
const isAdmin = (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Access denied. Admin privileges required.' });
    }
    next();
  } catch (error) {
    logger.error('Admin Auth Middleware Error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Middleware for checking trainer role
const isTrainer = (req, res, next) => {
  try {
    if (req.user.role !== 'trainer' && req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Access denied. Trainer privileges required.' });
    }
    next();
  } catch (error) {
    logger.error('Trainer Auth Middleware Error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};

module.exports = {
  auth,
  isAdmin,
  isTrainer
};