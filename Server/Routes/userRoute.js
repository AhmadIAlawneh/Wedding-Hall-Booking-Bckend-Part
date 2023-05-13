const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../Schemas/User");
const Role = require("../Schemas/Roles");
const authMiddleware = require("../authMiddleware");
router.post("/signup", async (req, res) => {
  try {
    // Create a new user object
    const { idNumber, userName, role, email, name, phone, password, address } =
      req.body;
    const userRole = await Role.findOne({ roleName: "user" }).exec();

    user = new User({
      idNumber,
      userName,
      role: userRole._id,
      email,
      name,
      phone,
      password,
      address,
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    // Save the user to the database
    await user.save();

    // Return a success message
    res.status(201).send({ message: "User created successfully." });
  } catch (error) {
    // Return an error message
    res.status(400).send({ error: error, message: error.message });
  }
});

//get all user

router.get("/signup", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email }).populate("role").exec();
    if (!user) {
      return res.status(400).json({ msg: "Invalid email" });
    }

    // Check if password is correct
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid password" });
    }

    // Generate JWT token
    const payload = {
      user: {
        id: user.id,
        roles: user.roles,
      },
    };
    const token = jwt.sign(payload, "secret", { expiresIn: "1h" });
    res.status(200).json({ token, user });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//get specific user

router.get("/users/:id", async (req, res) => {
  try {
    const userId = req.params.id;

    // Find the user by ID in the database
    const user = await User.findById(userId);

    if (!user) {
      // If user is not found, return an error message
      return res.status(404).send({ error: "User not found." });
    }

    // Return the user object
    res.send(user);
  } catch (error) {
    // Return an error message
    res.status(500).send({ error: error.message });
  }
});

//modify user profile
router.put("/users/:userId", async (req, res) => {
  const userId = req.params.userId;

  try {
    // Find the user by ID
    const user = await User.findOne({ _id: userId });

    if (!user) {
      // Handle case when user is not found
      return res.status(404).send("User not found");
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
    return res.status(200).json({
      message: "User profile modified successfully",
      user,
    });
  } catch (err) {
    // Handle error
    if (err.code === 11000) {
      // Duplicate key error
      return res.status(400).send("Duplicate username, email, or phone");
    }
    console.error(err);
    return res.status(500).send("Internal Server Error");
  }
});

//get user who logged in

router.get("/user", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id; // Assuming the user ID is available in the request object after authentication

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Return the user information
    res.status(200).json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// update user logged in
router.put("/user", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, email, phone, address, userName } = req.body;

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update the user information
    user.userName = userName;
    user.name = name;
    user.email = email;
    user.phone = phone;
    user.address = address;

    // Save the updated user
    await user.save();

    res.status(200).json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

//make role User

router.get("/api/updateusers", async (req, res) => {
  const users = await User.find({ userName: { $nin: ["admin"] } });
  const userRole = await Role.findOne({ roleName: "user" }).exec();

  const promises = users.map((user) => {
    user.role = userRole._id;
    return user.save();
  });
  await Promise.all(promises);
  res.send("success");
});

// Export the router
module.exports = router;
