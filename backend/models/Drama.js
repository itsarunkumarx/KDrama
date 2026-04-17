const mongoose = require('mongoose');

const dramaSchema = new mongoose.Schema({
  id: { type: Number, unique: true, required: true },
  name: String,
  title: String,
  original_name: String,
  poster_path: String,
  backdrop_path: String,
  overview: String,
  vote_average: Number,
  vote_count: Number,
  popularity: Number,
  first_air_date: String,
  original_language: String,
  genre_ids: [Number],
  genres: [String],
  status: String,
  episode_run_time: [Number],
  networks: [String],
  production_companies: [String],
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Drama', dramaSchema);
