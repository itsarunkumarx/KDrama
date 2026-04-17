const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const User = require('../models/User');
const FavoriteAccess = require('../models/FavoriteAccess');
const { auth, adminOnly } = require('../middleware/auth');

// All admin routes require auth + admin role
router.use(auth, adminOnly);

// ── Dashboard Stats ────────────────────────────────────────────────────────
router.get('/stats', async (req, res) => {
  try {
    const [totalUsers, favoriteUsers, totalCodes, usedCodes] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      User.countDocuments({ role: 'favorite' }),
      FavoriteAccess.countDocuments(),
      FavoriteAccess.countDocuments({ used: true })
    ]);
    res.json({ totalUsers, favoriteUsers, totalCodes, usedCodes });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── Get All Favorite Users ─────────────────────────────────────────────────
router.get('/favorite-users', async (req, res) => {
  try {
    const users = await User.find({ role: 'favorite' })
      .select('name email lastLogin createdAt')
      .sort({ createdAt: -1 });
    const accesses = await FavoriteAccess.find().sort({ createdAt: -1 });
    res.json({ users, accesses });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── Get All Normal Users ───────────────────────────────────────────────────
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({ role: { $in: ['user', 'favorite'] } })
      .select('name email role lastLogin createdAt isActive')
      .sort({ createdAt: -1 });
    res.json({ users });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── Generate Favorite Access Code ─────────────────────────────────────────
router.post('/generate-code', async (req, res) => {
  try {
    const { email, name, notes, expiresInDays } = req.body;
    if (!email || !name)
      return res.status(400).json({ message: 'Email and name are required' });

    const code = uuidv4().replace(/-/g, '').substring(0, 8).toUpperCase();
    const expiresAt = expiresInDays
      ? new Date(Date.now() + expiresInDays * 86400000)
      : null;

    const access = await FavoriteAccess.create({
      email: email.toLowerCase(),
      name,
      code,
      notes,
      expiresAt,
      createdBy: req.user._id
    });

    res.status(201).json({ access, message: `Code generated: ${code}` });
  } catch (err) {
    if (err.code === 11000)
      return res.status(400).json({ message: 'Code collision, try again' });
    res.status(500).json({ message: err.message });
  }
});

// ── Get All Codes ──────────────────────────────────────────────────────────
router.get('/codes', async (req, res) => {
  try {
    const codes = await FavoriteAccess.find()
      .sort({ createdAt: -1 })
      .populate('createdBy', 'name email');
    res.json({ codes });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── Delete Code ────────────────────────────────────────────────────────────
router.delete('/code/:id', async (req, res) => {
  try {
    await FavoriteAccess.findByIdAndDelete(req.params.id);
    res.json({ message: 'Code deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── Toggle User Status ─────────────────────────────────────────────────────
router.patch('/user/:id/toggle', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.role === 'admin')
      return res.status(400).json({ message: 'Cannot modify admin' });
    user.isActive = !user.isActive;
    await user.save();
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
