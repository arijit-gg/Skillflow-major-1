const jwt = require('jsonwebtoken');
const User = require('../models/User');
const mongoose = require('mongoose');

const mockUser = {
  id: '66ba3a8e9f12345678901234',
  _id: '66ba3a8e9f12345678901234',
  name: 'Sarah Connor (Test Recruiter)',
  email: 'recruiter@smarthire.com',
  role: 'recruiter',
  companyName: 'SmartHire Global Inc.',
  avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
};

// Protect routes - require valid JWT token
exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route. Token missing.',
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'smarthire_super_secret_jwt_key_2026_recruitment'
    );

    // Fast-path for non-connected database (0ms delay)
    if (mongoose.connection.readyState !== 1) {
      req.user = {
        ...mockUser,
        id: decoded.id || mockUser.id,
        _id: decoded.id || mockUser.id,
        role: decoded.role || 'recruiter',
      };
      return next();
    }

    req.user = await User.findById(decoded.id);

    if (!req.user) {
      req.user = {
        ...mockUser,
        id: decoded.id || mockUser.id,
        _id: decoded.id || mockUser.id,
        role: decoded.role || 'recruiter',
      };
    }

    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route. Invalid or expired token.',
    });
  }
};

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    const userRole = req.user ? req.user.role : 'recruiter';
    if (!roles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: `User role '${userRole}' is not authorized to access this resource.`,
      });
    }
    next();
  };
};
