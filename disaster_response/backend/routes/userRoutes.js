const express = require('express');
const User = require('../models/user');
const { validateUserRegistration, handleValidationErrors } = require('../middleware/validateInput');
const authMiddleware = require('../middleware/authMiddleware'); // Import authMiddleware

const router = express.Router();
// Register a new user (no authentication required)
router.post('/register', validateUserRegistration, handleValidationErrors, async (req, res) => {
  const { name, email, phone, location, password } = req.body;

  try {
    const user = new User({ name, email, phone, location, password });
    await user.save();
    res.status(201).json({ message: 'User registered successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
});

// Login a user (no authentication required)
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = user.generateToken();
    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
});

// Protected route: Get user profile (authentication required)
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password'); // Exclude password
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user profile', error: error.message });
  }
});

module.exports = router;