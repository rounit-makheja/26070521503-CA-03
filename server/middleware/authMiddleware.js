const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Student account not found or token has expired'
        });
      }

      req.user = user;
      next();
    } catch (error) {
      console.error('[AuthMiddleware] Error:', error.message);
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token, authorization denied'
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'No authorization token provided, access denied'
    });
  }
};

module.exports = { protect };
