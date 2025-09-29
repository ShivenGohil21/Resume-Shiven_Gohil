const express = require('express');
const cors = require('cors');
const config = require('./config/config');
const uploadRoutes = require('./routes/uploadRoutes');

const app = express();

// Middleware
app.use(cors(config.cors));
app.use(express.json());

// Routes
app.use('/', uploadRoutes);

// Global error handling middleware
app.use((error, req, res, next) => {
  console.error('Global error handler:', error);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`);
});

module.exports = app;
