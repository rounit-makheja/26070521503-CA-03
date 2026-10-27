const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Helper to generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

// @desc    Register a new student
// @route   POST /api/auth/signup
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, college, degree, semester, email, password } = req.body;

    // Validate required fields
    if (!name || !college || !degree || !semester || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, college, degree, semester, email, password'
      });
    }

    // Password length validation
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    // Check if student email is already registered
    const userExists = await User.findOne({ email: email.toLowerCase().trim() });
    if (userExists) {
      return res.status(409).json({
        success: false,
        message: 'A student account with this email already exists'
      });
    }

    // Hash the password with bcryptjs
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user in MongoDB
    const user = await User.create({
      name: name.trim(),
      college: college.trim(),
      degree: degree.trim(),
      semester: semester.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword
    });

    const token = generateToken(user._id);

    return res.status(201).json({
      success: true,
      message: 'Student registered successfully',
      data: {
        user: {
          _id: user._id,
          name: user.name,
          college: user.college,
          degree: user.degree,
          semester: user.semester,
          email: user.email,
          createdAt: user.createdAt
        },
        token
      }
    });
  } catch (error) {
    console.error('[Register Error]:', error.message);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error occurred during student registration'
    });
  }
};

// @desc    Authenticate student & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate inputs
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password'
      });
    }

    // Find student by email
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check password match
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const token = generateToken(user._id);

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          _id: user._id,
          name: user.name,
          college: user.college,
          degree: user.degree,
          semester: user.semester,
          email: user.email,
          createdAt: user.createdAt
        },
        token
      }
    });
  } catch (error) {
    console.error('[Login Error]:', error.message);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error occurred during login'
    });
  }
};

// @desc    Get currently logged-in student profile
// @route   GET /api/auth/me
// @access  Private (Protected by JWT)
const getMe = async (req, res) => {
  try {
    // req.user is set by authMiddleware
    return res.status(200).json({
      success: true,
      message: 'Student profile retrieved successfully',
      data: {
        user: req.user
      }
    });
  } catch (error) {
    console.error('[GetMe Error]:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving student profile'
    });
  }
};

// @desc    Update student profile details
// @route   PUT /api/auth/profile
// @access  Private (Protected by JWT)
const updateProfile = async (req, res) => {
  try {
    const { name, college, degree, semester } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Student account not found'
      });
    }

    if (name && name.trim()) user.name = name.trim();
    if (college && college.trim()) user.college = college.trim();
    if (degree && degree.trim()) user.degree = degree.trim();
    if (semester && semester.trim()) user.semester = semester.trim();

    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user
      }
    });
  } catch (error) {
    console.error('[UpdateProfile Error]:', error.message);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to update student profile'
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  updateProfile
};
