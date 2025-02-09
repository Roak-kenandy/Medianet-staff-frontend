const express = require('express');
const router = express.Router();
const sequelize = require('../config/db'); // Ensure this points to your DB connection
const { Sequelize } = require('sequelize');
const fs = require('fs');

const multer = require('multer');
const path = require('path');

// Set up storage configuration for uploaded images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Save files in the 'uploads' directory
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

// Multer middleware for handling image uploads
const upload = multer({ storage });

const uploadDir = path.join(__dirname, 'uploads');



router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
    }

    try {
        const [staffMember] = await sequelize.query(
            'SELECT * FROM LoginPerson WHERE LOWER(email) = LOWER(:email)', 
            {
                replacements: { email },
                type: Sequelize.QueryTypes.SELECT,
            }
        );

        if (!staffMember) {
            return res.status(404).json({ error: 'Email not found. Please register or check your credentials.' });
        }

        // Note: Password validation would happen here if storing hashed passwords
        if (staffMember.password !== password) {
            return res.status(401).json({ error: 'Invalid password.' });
        }

        return res.json({ message: 'Login successful', user: staffMember });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'An error occurred during login.' });
    }
});

// GET all staff
router.get('/staff', async (req, res) => {
  try {
    const staffDetails = await sequelize.query('SELECT * FROM StaffDetails', {
      type: Sequelize.QueryTypes.SELECT,
    });
    res.json(staffDetails);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving staff details' });
  }
});

// POST a new staff record
router.post('/staff',upload.single('staffImage'), async (req, res) => {
  const {
    firstname, lastname, employeeid, nationality,
    contactnumber1, countrycode1, contactnumber2,
    countrycode2, designation, superior, department,
  } = req.body;

  const staffImage = req.file ? fs.readFileSync(path.join(__dirname, '..', 'uploads', req.file.filename)) : null;


  try {
    await sequelize.query(
      `INSERT INTO StaffDetails (firstname, lastname, employeeid, nationality, 
        contactnumber1, countrycode1, contactnumber2, countrycode2, 
        designation, superior, department, staffImage) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      {
        replacements: [
            firstname, lastname, employeeid, nationality,
            contactnumber1, countrycode1, contactnumber2,
            countrycode2, designation, superior, department,staffImage
        ],
      }
    );
    res.status(201).json({ message: 'Staff created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating staff' });
  }
});

// Update staff details including image
router.put('/staff/:staffId', upload.single('staffImage'), async (req, res) => {
  const staffId = req.params.staffId;
  const {
    firstname, lastname, employeeid, nationality,
    contactnumber1, countrycode1, contactnumber2,
    countrycode2, designation, superior, department,
  } = req.body;

  const staffImage = req.file ? fs.readFileSync(path.join(__dirname, '..', 'uploads', req.file.filename)) : null;

  try {
    const updateFields = [
      firstname, lastname, employeeid, nationality,
      contactnumber1, countrycode1, contactnumber2,
      countrycode2, designation, superior, department,
      staffImage, staffId,
    ];

    await sequelize.query(
      `UPDATE StaffDetails 
      SET firstname = ?, lastname = ?, employeeid = ?, nationality = ?, 
          contactnumber1 = ?, countrycode1 = ?, contactnumber2 = ?, 
          countrycode2 = ?, designation = ?, superior = ?, department = ?, 
          staffImage = ? 
      WHERE staffId = ?`,
      { replacements: updateFields }
    );

    res.json({ message: 'Staff updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating staff' });
  }
});

// DELETE staff record
router.delete('/staff/:staffId', async (req, res) => {
  const staffId = req.params.staffId;
  try {
    await sequelize.query('DELETE FROM StaffDetails WHERE staffId = ?', {
      replacements: [staffId],
    });
    res.json({ message: 'Staff deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting staff' });
  }
});

// GET staff details by staffId
router.get('/staff/:staffId', async (req, res) => {
    const staffId = req.params.staffId;
  
    try {
      const staffDetails = await sequelize.query(
        'SELECT * FROM StaffDetails WHERE staffId = :staffId',
        {
          replacements: { staffId },
          type: Sequelize.QueryTypes.SELECT,
        }
      );
  
      if (staffDetails.length === 0) {
        return res.status(404).json({ message: 'Staff not found' });
      }
  
      res.json(staffDetails[0]); // Assuming staffDetails is an array, and we return the first item
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error retrieving staff details' });
    }
  });
  

module.exports = router;
