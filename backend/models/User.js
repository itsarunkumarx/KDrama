const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String },
  role: {
    type: String,
    enum: ['user'],
    default: 'user'
  },
  avatar: { type: String, default: '' },
  watchlist: [{ type: Number }],
  favorites: [{ type: Number }],
  isActive: { type: Boolean, default: true },
  lastLogin: { type: Date },
  // Trakt Integration
  traktUsername: { type: String, default: '' },
  traktAccessToken: { type: String, default: '' },
  traktRefreshToken: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
