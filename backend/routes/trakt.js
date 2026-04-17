const express = require('express');
const router = express.Router();
const axios = require('axios');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const TRAKT_BASE = 'https://api.trakt.tv';
const generateToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });

// ── Step 1: Redirect user to Trakt OAuth page ─────────────────────────────
router.get('/login', (req, res) => {
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: process.env.TRAKT_CLIENT_ID,
    redirect_uri: process.env.TRAKT_REDIRECT_URI,
  });
  const traktAuthUrl = `https://trakt.tv/oauth/authorize?${params.toString()}`;
  console.log('🔗 Redirecting to Trakt OAuth:', traktAuthUrl);
  res.json({ url: traktAuthUrl });
});

// ── Step 2: Handle Trakt callback (exchange code for token) ───────────────
router.post('/callback', async (req, res) => {
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ message: 'Authorization code is required' });
  }

  try {
    console.log('🔄 Exchanging Trakt code for token...');

    // Exchange authorization code for access token
    const tokenRes = await axios.post('https://api.trakt.tv/oauth/token', {
      code,
      client_id: process.env.TRAKT_CLIENT_ID,
      client_secret: process.env.TRAKT_CLIENT_SECRET,
      redirect_uri: process.env.TRAKT_REDIRECT_URI,
      grant_type: 'authorization_code',
    }, {
      headers: { 'Content-Type': 'application/json' }
    });

    const { access_token, refresh_token } = tokenRes.data;
    console.log('✅ Trakt token received');

    // Get user profile from Trakt
    const profileRes = await axios.get(`${TRAKT_BASE}/users/me`, {
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'trakt-api-version': '2',
        'trakt-api-key': process.env.TRAKT_CLIENT_ID,
      }
    });

    const traktUser = profileRes.data;
    console.log('👤 Trakt user:', traktUser.username);

    // Find or create user in our database
    let user = await User.findOne({ email: `${traktUser.username}@trakt.tv` });

    if (!user) {
      // Create new user from Trakt profile
      user = await User.create({
        name: traktUser.name || traktUser.username,
        email: `${traktUser.username}@trakt.tv`,
        password: `trakt_${traktUser.username}_${Date.now()}`, // auto-generated
        role: 'user',
        traktUsername: traktUser.username,
        traktAccessToken: access_token,
        traktRefreshToken: refresh_token,
      });
      console.log('🆕 New user created from Trakt:', user.name);
    } else {
      // Update tokens for existing user
      user.traktAccessToken = access_token;
      user.traktRefreshToken = refresh_token;
      user.traktUsername = traktUser.username;
      user.lastLogin = new Date();
      await user.save();
      console.log('🔁 Existing user updated:', user.name);
    }

    const token = generateToken(user._id);
    res.json({ token, user });

  } catch (err) {
    console.error('❌ Trakt OAuth error:', err.response?.data || err.message);
    res.status(500).json({
      message: 'Trakt login failed',
      detail: err.response?.data || err.message
    });
  }
});

// ── Get Trakt watchlist ────────────────────────────────────────────────────
router.get('/watchlist', async (req, res) => {
  const { trakt_token, username } = req.query;
  if (!trakt_token || !username) {
    return res.status(400).json({ message: 'Token and username required' });
  }

  try {
    const { data } = await axios.get(`${TRAKT_BASE}/users/${username}/watchlist/shows`, {
      headers: {
        'Authorization': `Bearer ${trakt_token}`,
        'trakt-api-version': '2',
        'trakt-api-key': process.env.TRAKT_CLIENT_ID,
      }
    });
    res.json({ watchlist: data });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch Trakt watchlist' });
  }
});

module.exports = router;
