const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../Schemas/User');
const Role = require('../Schemas/Roles');


router.get('/api/autofill', async (req, res) => {
  try {
    await Role.create({ roleName: "owner" });
    await Role.create({ roleName: "admin" });
    await Role.create({ roleName: "user" });

    const ownerRole = await Role.findOne({ roleName: "owner" }).exec();
    if (!ownerRole) {
      res.status(500).send("Something went wrong");
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash("1234", salt);

    await User.create({
      idNumber: "111",
      userName: "admin",
      role: ownerRole._id,
      email: "owner@hallapp.com",
      name: "Owner",
      phone: "111",
      password,
      address: "Space"
    });

    res.status(200).send("Success! Use owner@hallapp.com as the username and 1234 as the password.");
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
  }
});

// Export the router
module.exports = router;

  // Export the router
  module.exports = router;