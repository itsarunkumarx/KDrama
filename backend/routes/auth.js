const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const generateToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });

// ── Register (Normal User) ──────────────────────────────────────────────────
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: 'All fields required' });
    if (password.length < 6)
      return res.status(400).json({ message: 'Password must be at least 6 characters' });

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing)
      return res.status(400).json({ message: 'Email already registered' });

    const user = await User.create({ name, email, password, role: 'user' });
    const token = generateToken(user._id);

    res.status(201).json({ token, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── Login ──────────────────────────────────────────────────────────────────
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: 'Email and password required' });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ message: 'Invalid credentials' });

    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user._id);
    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── Get Me ─────────────────────────────────────────────────────────────────
router.get('/me', auth, (req, res) => {
  res.json({ user: req.user });
});

// ── Update Watchlist ───────────────────────────────────────────────────────
router.post('/watchlist/:dramaId', auth, async (req, res) => {
  try {
    const id = parseInt(req.params.dramaId);
    const user = req.user;
    if (user.watchlist.includes(id)) {
      user.watchlist = user.watchlist.filter(x => x !== id);
    } else {
      user.watchlist.push(id);
    }
    await user.save();
    res.json({ watchlist: user.watchlist });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
