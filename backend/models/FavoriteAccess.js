const mongoose = require('mongoose');

const favoriteAccessSchema = new mongoose.Schema({
  email: { type: String, required: true, lowercase: true, trim: true },
  name: { type: String, required: true, trim: true },
  code: { type: String, required: true, unique: true },
  used: { type: Boolean, default: false },
  usedAt: { type: Date },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  expiresAt: { type: Date },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('FavoriteAccess', favoriteAccessSchema);
