const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../Schemas/User');
const Role = require('../Schemas/Roles');

router.get('/api/autofill', async (req, res) => {
    res.send("Welcome !")
    // await Role.create({
    //     roleName: "owner"
    // });
    // await Role.create({
    //     roleName: "admin"
    // });
    // await Role.create({
    //     roleName: "user"
    // });
//     const ownerRole = await Role.findOne({roleName: "owner"}).exec();
//     const salt = await bcrypt.genSalt(10);
//     const password = await bcrypt.hash("1234", salt);
//     res.status(200).send(JSON.stringify(ownerRole))
//    if(!ownerRole) {
//     res.status(200).send("Something went Wrong")
//     return;
//    }
//     await User.create({
//         idNumber: "111",userName: "admin",role: ownerRole._id,email: "owner@hallapp.com",name: "Owner",phone: "111",password,address: "Space"

//       });    
//       res.status(200).send("Success use owner@hallapp.com as user name and 1234 as password")

    //   owner@hallapp.com
  });


  // Export the router
  module.exports = router;