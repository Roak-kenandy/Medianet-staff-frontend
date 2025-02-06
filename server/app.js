require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const staffDetailsRoutes = require('../server/routes/staffDetailsROutes');
const sequelize = require('./config/db');
const path = require('path');

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000', // Allow only your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));

// Middleware to parse JSON body
app.use(express.json());

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/build')));

  // Serve index.html for any unknown routes
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

// Logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, req.body || req.query);
  next();
});

// Routes
app.use('/api/staffRoutes', staffDetailsRoutes);

// Error-handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Sync the database and listen for requests
if (process.env.NODE_ENV !== 'production') {
  sequelize.sync().then(() => {
    console.log('Database synced');
  });
}

app.listen(process.env.PORT, () => {
  console.log('Listening on port', process.env.PORT);
});