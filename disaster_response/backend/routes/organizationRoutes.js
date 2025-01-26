const express = require('express');
const Organization = require('../models/organization');
const { validateOrganizationRegistration, handleValidationErrors } = require('../middleware/validateInput');
const authMiddleware = require('../middleware/authMiddleware'); // Import authMiddleware

const router = express.Router();

// Register a new organization (no authentication required)
router.post('/register', validateOrganizationRegistration, handleValidationErrors, async (req, res) => {
  const { name, email, phone, location, services, password } = req.body;

  try {
    const organization = new Organization({ name, email, phone, location, services, password });
    await organization.save();
    res.status(201).json({ message: 'Organization registered successfully', organization });
  } catch (error) {
    res.status(500).json({ message: 'Error registering organization', error: error.message });
  }
});

// Login an organization (no authentication required)
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const organization = await Organization.findOne({ email });
    if (!organization || !(await organization.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = organization.generateToken();
    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
});

// Protected route: Get organization profile (authentication required)
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const organization = await Organization.findById(req.userId).select('-password'); // Exclude password
    if (!organization) {
      return res.status(404).json({ message: 'Organization not found' });
    }
    res.status(200).json(organization);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching organization profile', error: error.message });
  }
});

module.exports = router;