// backend/middleware/validateInput.js
const { body, validationResult } = require('express-validator');

// Validate user registration input
const validateUserRegistration = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Invalid email address'),
  body('phone').isMobilePhone().withMessage('Invalid phone number'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
];

// Validate organization registration input
const validateOrganizationRegistration = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Invalid email address'),
  body('phone').isMobilePhone().withMessage('Invalid phone number'),
  body('services').isArray().withMessage('Services must be an array'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
];

// Validate request submission input
const validateRequestSubmission = [
  body('calamity').notEmpty().withMessage('Calamity type is required'),
  body('location').notEmpty().withMessage('Location is required'),
];

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = {
  validateUserRegistration,
  validateOrganizationRegistration,
  validateRequestSubmission,
  handleValidationErrors,
};