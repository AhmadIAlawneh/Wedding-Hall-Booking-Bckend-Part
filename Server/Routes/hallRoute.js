const express = require('express');
const router = express.Router();
const Hall = require('../Schemas/Halls');

router.post('/hallAdd', async (req, res) => {
    try {
      // Create a new user object
      const {name,type,location,availableTimes,designs,booking}=req.body
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

      hall = new Hall({
        name,type,location,availableTimes,designs,booking,

      });
 
      // Save the user to the database
      await hall.save();
  
      // Return a success message
      res.status(201).send({ message: 'hall add successfully.' });
    } catch (error) {
      // Return an error message
      res.status(400).send({ error: error.message });
    }
  });

/*
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
   
  
      // Check if password is correct
 
  
     
*/
  // Export the router
  module.exports = router;