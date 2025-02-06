// app.js

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const staffDetailsRoutes = require('../server/routes/staffDetailsROutes');
const sequelize = require('./config/db');
const path = require('path');

const app = express();

// Enable CORS for all routes
//added policy
app.use(cors());

// Middleware to parse JSON body
app.use(express.json());

// app.use(express.static("client/build"));

if(process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/build')));
}

console.log(__dirname)
console.log(path.join(__dirname, 'client/build'));


// Middleware for logging requests
app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

// Routes
app.use('/api/staffRoutes', staffDetailsRoutes);

// Sync the database and listen for requests
sequelize.sync().then(() => {
  app.listen(process.env.PORT, () => {
    console.log('Listening on port', process.env.PORT);
  });
});
