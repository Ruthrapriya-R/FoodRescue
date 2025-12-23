const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// @route   POST /api/auth/register
// @desc    Register a new user (Student or Vendor)
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // 1. Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    // 2. Hash the password (Scramble it)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Create the user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: role || 'student' 
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully!" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   POST /api/auth/login
// @desc    Login and get a Token (Wristband)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find user by email
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // 2. Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // 3. Create the Token (The VIP Wristband)
    const token = jwt.sign(
      { id: user._id, role: user.role }, 
      "MY_SECRET_KEY", // In a real app, this goes in .env
      { expiresIn: "1d" }
    );

    res.status(200).json({ token, user: { _id: user._id, name: user.name, role: user.role } });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
