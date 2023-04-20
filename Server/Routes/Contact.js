const express = require('express');
const router = express.Router();
const Contact = require('../Schemas/Contact');

router.post('/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Validate input data
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: 'Please fill in all fields' });
    }

    // Create a new contact
    const contact = new Contact({
      name,
      email,
      subject,
      message
    });

    // Save the contact to the database
    await contact.save();

    res.json({ message: 'Thank you for contacting us. We will get back to you shortly.' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;