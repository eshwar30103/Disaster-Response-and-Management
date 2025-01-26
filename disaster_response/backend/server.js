// backend/server.js (updated)
require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const requestRoutes = require('./routes/requestRoutes');
const userRoutes = require('./routes/userRoutes'); // Import user routes
const organizationRoutes = require('./routes/organizationRoutes'); // Import organization routes
// backend/server.js (updated)
const errorHandler = require('./middleware/errorHandler');

// Use error handler
app.use(errorHandler);

const app = express();
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

// Use routes
app.use('/api', requestRoutes);
app.use('/api/users', userRoutes); // Link user routes
app.use('/api/organizations', organizationRoutes); // Link organization routes

// Start server
app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});