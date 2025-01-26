const express = require('express');
const Request = require('../models/request');
const User = require('../models/user');
const Organization = require('../models/organization');
const { validateRequestSubmission, handleValidationErrors } = require('../middleware/validateInput');
const authMiddleware = require('../middleware/authMiddleware'); // Import authMiddleware
const { sendEmail } = require('../utils/notify');
const { predict_disaster_category } = require('../utils/ml_utils'); // Import ML utility

const router = express.Router();

// Protected route: Submit a new request (authentication required)
router.post('/submit-request', authMiddleware, validateRequestSubmission, handleValidationErrors, async (req, res) => {
  const { message, location } = req.body; // Changed from 'calamity' to 'message'
  const userId = req.userId; // Get user ID from the token

  try {
    // Predict the disaster category using the ML model
    const [category, confidence] = predict_disaster_category(message);
    if (!category) {
      return res.status(400).json({ message: 'Failed to predict disaster category.' });
    }

    // Fetch the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Save the request to the database
    const newRequest = new Request({
      userId,
      message,
      category, // Predicted category from ML model
      confidence, // Confidence level from ML model
      location,
    });
    await newRequest.save();

    // Notify the nearest organization
    const organization = await Organization.findOne({ services: category }); // Use predicted category
    if (organization) {
      const subject = `New ${category} Request`;
      const text = `A new ${category} request has been submitted by ${user.name}.\n\nLocation: ${location}\n\nPlease take necessary action.`;
      sendEmail(organization.email, subject, text);
    }

    res.status(201).json({ message: 'Request submitted successfully', request: newRequest });
  } catch (error) {
    res.status(500).json({ message: 'Error submitting request', error: error.message });
  }
});

// Protected route: Fetch all requests (authentication required)
router.get('/requests', authMiddleware, async (req, res) => {
  try {
    const requests = await Request.find().populate('userId', 'name email phone');
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching requests', error: error.message });
  }
});

// Protected route: Update request status (authentication required)
router.put('/requests/:id', authMiddleware, async (req, res) => {
  const { status } = req.body;

  try {
    const request = await Request.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.status(200).json(request);
  } catch (error) {
    res.status(500).json({ message: 'Error updating request', error: error.message });
  }
});

module.exports = router;