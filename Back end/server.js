const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check endpoint (always accessible)
app.get('/api/health', (req, res) => {
  const isDbConnected = mongoose.connection.readyState === 1;
  res.status(isDbConnected ? 200 : 503).json({
    success: true,
    server: 'running',
    database: isDbConnected ? 'connected' : 'disconnected',
    message: isDbConnected
      ? 'Food Waste Management System API is healthy'
      : 'API is running but MongoDB is not connected. Please start MongoDB.',
    timestamp: new Date().toISOString(),
  });
});

// Middleware to check database connectivity for all other API routes
app.use('/api', (req, res, next) => {
  if (req.path === '/health') return next();
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      success: false,
      message: 'MongoDB is not connected. Please start MongoDB (e.g., brew services start mongodb-community) and try again.',
    });
  }
  next();
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/food', require('./routes/foodRoutes'));
app.use('/api/donations', require('./routes/donationRoutes'));
app.use('/api/requests', require('./routes/requestRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/collections', require('./routes/collectionRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Global error handler (must be last)
app.use(require('./middleware/errorHandler'));

// Start Express server immediately so port 5000 is always alive
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  connectWithRetry();
});

// Connect to MongoDB with automatic retry
function connectWithRetry() {
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/food_waste_management';
  console.log(`⏳ Connecting to MongoDB at ${mongoUri}...`);

  mongoose
    .connect(mongoUri)
    .then(() => {
      console.log('✅ MongoDB Connected Successfully');
    })
    .catch((err) => {
      console.error(`⚠️ MongoDB connection error: ${err.message}`);
      console.log('🔄 Will retry MongoDB connection in 5 seconds. (Ensure MongoDB is running: brew services start mongodb-community)');
      setTimeout(connectWithRetry, 5000);
    });
}

module.exports = app;
