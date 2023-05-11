const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../Schemas/User');
router.post('/signup', async (req, res) => {
    try {
      // Create a new user object
      const {idNumber,userName,role,email,name,phone,password,address}=req.body
 
   
      user = new User({
        idNumber,userName,role,email,name,phone,password,address

      });
      
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      // Save the user to the database
      await user.save();
  
      // Return a success message
      res.status(201).send({ message: 'User created successfully.' });
    } catch (error) {
      // Return an error message
      res.status(400).send({ error: error.message+error });
    }
  });

//get all user 

  router.get('/signup', async (req, res) => {
    try {
      const users = await User.find();
      res.json(users);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  })

  router.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Check if user exists
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ msg: 'Invalid email' });
      }
  
      // Check if password is correct
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ msg: 'Invalid password' });
      }
  
      // Generate JWT token
      const payload = {
        user: {
          id: user.id,
          roles: user.roles
        }
      };
      const token = jwt.sign(payload, 'secret', { expiresIn: '1h' });
  
      res.json({ token });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });


  //get specific user

  router.get('/users/:id', async (req, res) => {
    try {
      const userId = req.params.id;
      
      // Find the user by ID in the database
      const user = await User.findById(userId);
      
      if (!user) {
        // If user is not found, return an error message
        return res.status(404).send({ error: 'User not found.' });
      }
      
      // Return the user object
      res.send(user);
    } catch (error) {
      // Return an error message
      res.status(500).send({ error: error.message });
    }
  });
  
  //modify user profile 
  router.put('/users/:userId', async (req, res) => {
    const userId = req.params.userId;
  
    try {
      // Find the user by ID
      const user = await User.findById(userId);
  
      if (!user) {
        // Handle case when user is not found
        return res.status(404).send('User not found');
      }
  
      // Modify the user
      user.userName = req.body.userName || user.userName;
      user.email = req.body.email || user.email;
      user.name = req.body.name || user.name;
      user.phone = req.body.phone || user.phone;
      user.address = req.body.address || user.address;
  
      // Save the updated user document
      await user.save();
  
      // Send response to client
      return res.send('User profile modified successfully');
    } catch (err) {
      // Handle error
      if (err.code === 11000) {
        // Duplicate key error
        return res.status(400).send('Duplicate username, email, or phone');
      }
      console.error(err);
      return res.status(500).send('Internal Server Error');
    }
  });
  
  // Export the router
  module.exports = router;