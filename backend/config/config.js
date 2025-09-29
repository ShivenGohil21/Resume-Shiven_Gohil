require('dotenv').config();

const config = {
  port: process.env.PORT || 5000,
  cors: {
    origin: process.env.CORS_ORIGIN || ['http://localhost:3000'],
    credentials: true,
    optionsSuccessStatus: 200, // For legacy browser support
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
  }
};

module.exports = config;

