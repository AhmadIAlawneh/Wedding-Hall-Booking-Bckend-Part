const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../Schemas/User');
router.post('/signup', async (req, res) => {
    try {
      // Create a new user object
      const {idNumber,userName,role,email,name,phone,password,address}=req.body
     /* const user = new User({
        idNumber: req.body.idNumber,
        userName: req.body.userName,
        role: req.body.role,
        email: req.body.email,
        name: req.body.name,
        phone: req.body.phone,
        password: req.body.password,
        address:req.body.address
     

      });
     */
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ msg: 'User already exists' });
      }
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
      res.status(400).send({ error: error.message });
    }
  });


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
  
  // Export the router
  module.exports = router;