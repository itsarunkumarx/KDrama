const express = require('express');
const router = express.Router();
const axios = require('axios');
const Drama = require('../models/Drama');

// Setup Trakt API instance
const trakt = axios.create({
  baseURL: 'https://api.trakt.tv',
  headers: {
    'Content-Type': 'application/json',
    'trakt-api-version': '2',
    'trakt-api-key': process.env.TRAKT_CLIENT_ID
  },
  timeout: 10000 // 10s timeout for Trakt calls
});

// Setup TMDB API instance
const tmdb = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  params: {
    api_key: process.env.TMDB_API_KEY
  },
  headers: {
    Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
    'Content-Type': 'application/json;charset=utf-8'
  }
});

console.log('📡 Trakt API Key loaded:', process.env.TRAKT_CLIENT_ID ? '✅' : '❌');
console.log('📡 TMDB API Key loaded:', process.env.TMDB_API_KEY ? '✅' : '❌');

/**
 * Helper to map Trakt response to our frontend's expected format.
 * Includes a warning note: Trakt does not provide image URLs natively.
 * We cross-reference the local DB to restore the posters!
 */
const mapTraktShowAsync = async (item) => {
  const show = item.show || item;
  const tmdbId = show.ids?.tmdb || show.ids?.trakt;
  
  let poster_path = null;
  let backdrop_path = null;
  
  // Pluck the beautiful images from our local database to fix Trakt's text-only limitation!
  if (tmdbId) {
    const local = await Drama.findOne({ id: tmdbId });
    if (local) {
      poster_path = local.poster_path;
      backdrop_path = local.backdrop_path;
    }
  }

  return {
    id: tmdbId,
    name: show.title,
    original_name: show.title,
    overview: show.overview,
    first_air_date: show.first_aired,
    popularity: item.watchers || show.rating || 0,
    poster_path,   
    backdrop_path, 
    source: 'trakt_merged'
  };
};

// Check if Trakt keys exist
const hasTraktAuth = () => process.env.TRAKT_CLIENT_ID && process.env.TRAKT_CLIENT_ID !== 'your_client_id_here';

// ── Get trending from Trakt (Real-Time) - Fallback to Local ────────
router.get('/trending', async (req, res) => {
  try {
    console.log('🎬 /trending endpoint called');
    
    // Try Trakt API first
    if (hasTraktAuth()) {
      try {
        console.log('📡 Attempting Trakt API...');
        // Filter by Korean language
        const { data } = await trakt.get('/shows/trending?extended=full&languages=ko');
        if (data && data.length > 0) {
          console.log('✅ Trakt Success: ' + data.length + ' dramas');
          const mapped = await Promise.all(data.map(mapTraktShowAsync));
          return res.json({ results: mapped, total_results: mapped.length, source: 'trakt_live_api' });
        }
      } catch (err) {
        console.log('⚠️ Trakt error, falling back to local cache');
      }
    }
    
    // Fallback to local database cache
    console.log('📚 Checking local database...');
    const localDramas = await Drama.find().sort({ popularity: -1 }).limit(20);
    if (localDramas.length > 0) {
      console.log('✅ Found local dramas: ' + localDramas.length);
      return res.json({ results: localDramas, total_results: localDramas.length, source: 'local_cache' });
    }
    
    res.json({ results: [], source: 'none' });
  } catch (err) {
    res.status(500).json({ message: 'Error: ' + err.message });
  }
});

// ── New Releases - Trakt First with Local Fallback ──────────────────
router.get('/new-releases', async (req, res) => {
  try {
    console.log('📅 /new-releases endpoint called');
    
    if (hasTraktAuth()) {
      try {
        const { data } = await trakt.get('/shows/anticipated?extended=full');
        // Trakt's languages filter might not work on anticipated, but let's filter after fetch if needed.
        const koreanShows = data.filter(item => item.show.language === 'ko' || item.show.country === 'kr');
        if (koreanShows.length > 0) {
          console.log('✅ Trakt Success: ' + koreanShows.length + ' new releases');
          const mapped = await Promise.all(koreanShows.map(mapTraktShowAsync));
          return res.json({ results: mapped, total_results: mapped.length, source: 'trakt_live_api' });
        }
      } catch (err) {
        console.log('⚠️ Trakt error, falling back to local');
      }
    }
    
    const localDramas = await Drama.find().sort({ first_air_date: -1 }).limit(20);
    if (localDramas.length > 0) {
      return res.json({ results: localDramas, total_results: localDramas.length, source: 'local_cache' });
    }
    
    res.json({ results: [], source: 'none' });
  } catch (err) {
    res.status(500).json({ message: 'Error: ' + err.message });
  }
});

// ── Popular K-Dramas - Trakt First with Local Fallback ───────────────
router.get('/popular', async (req, res) => {
  try {
    console.log('⭐ /popular endpoint called');
    
    if (hasTraktAuth()) {
      try {
        const { data } = await trakt.get('/shows/popular?extended=full&languages=ko');
        if (data && data.length > 0) {
          const mapped = await Promise.all(data.map(mapTraktShowAsync));
          return res.json({ results: mapped, total_results: mapped.length, source: 'trakt_live_api' });
        }
      } catch (err) {
        console.log('⚠️ Trakt error, falling back to local');
      }
    }
    
    const dramas = await Drama.find().sort({ popularity: -1 }).limit(20);
    if (dramas.length > 0) {
      return res.json({ results: dramas, total_results: dramas.length, source: 'local_cache' });
    }
    
    res.json({ results: [], source: 'none' });
  } catch (err) {
    res.status(500).json({ message: 'Error: ' + err.message });
  }
});

// ── Romance K-Dramas ───────────────────────────────────────────────
router.get('/romance', async (req, res) => {
  try {
    if (hasTraktAuth()) {
      try {
        const { data } = await trakt.get('/shows/popular?extended=full&languages=ko&genres=romance');
        if (data && data.length > 0) {
          const mapped = await Promise.all(data.map(mapTraktShowAsync));
          return res.json({ results: mapped, total_results: mapped.length, source: 'trakt_live_api' });
        }
      } catch (err) { }
    }
    
    const dramas = await Drama.find().sort({ popularity: -1 }).limit(20);
    res.json({ results: dramas, total_results: dramas.length, source: 'local_cache' });
  } catch (err) {
    res.status(500).json({ message: 'Error: ' + err.message });
  }
});

// ── Action K-Dramas ────────────────────────────────────────────────
router.get('/action', async (req, res) => {
  try {
    if (hasTraktAuth()) {
      try {
        const { data } = await trakt.get('/shows/popular?extended=full&languages=ko&genres=action');
        if (data && data.length > 0) {
          const mapped = await Promise.all(data.map(mapTraktShowAsync));
          return res.json({ results: mapped, total_results: mapped.length, source: 'trakt_live_api' });
        }
      } catch (err) { }
    }
    
    const dramas = await Drama.find().sort({ popularity: -1 }).limit(20);
    res.json({ results: dramas, total_results: dramas.length, source: 'local_cache' });
  } catch (err) {
    res.status(500).json({ message: 'Error: ' + err.message });
  }
});

// ── Search ─────────────────────────────────────────────────────────
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.json({ results: [] });
    
    // Fallback to Trakt (Search Trakt returns { type: 'show', show: {...} })
    if (hasTraktAuth()) {
      try {
        const { data } = await trakt.get(`/search/show?query=${q}&extended=full`);
        if (data && data.length > 0) {
          const mapped = await Promise.all(data.map(item => mapTraktShowAsync(item.show)));
          return res.json({ results: mapped, total_results: mapped.length, source: 'trakt_live_api' });
        }
      } catch (err) {}
    }

    // Search local database
    const localResults = await Drama.find({
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { original_name: { $regex: q, $options: 'i' } },
        { overview: { $regex: q, $options: 'i' } }
      ]
    }).limit(20);
    
    if (localResults.length > 0) {
      return res.json({ results: localResults, total_results: localResults.length, source: 'local' });
    }
    
    res.json({ results: [], source: 'none' });
  } catch (err) {
    res.status(500).json({ message: 'Error: ' + err.message });
  }
});

// ── Drama Detail ───────────────────────────────────────────────────
router.get('/:id', async (req, res) => {
  try {
    const dramaId = req.params.id; // Could be TMDB or Trakt ID now
    
    // Try Trakt as fallback (with timeout)
    if (hasTraktAuth()) {
      try {
        const { data } = await trakt.get(`/shows/${dramaId}?extended=full`);
        const mapped = await mapTraktShowAsync(data);
        return res.json({ ...mapped, source: 'trakt' });
      } catch (err) { }
    }

    // Try local DB (Assume ID matches local DB which has TMDB IDs normally)
    let drama = await Drama.findOne({ id: parseInt(dramaId) });
    if (drama) {
      return res.json({ 
        ...drama.toObject(), 
        source: 'local',
        id: drama.id,
        name: drama.name || drama.title,
        title: drama.title || drama.name
      });
    }
    
    res.status(404).json({ message: 'Drama not found', id: dramaId });
  } catch (err) {
    res.status(500).json({ message: `Error: ${err.message}` });
  }
});

// ── Videos (Real Trailer Support) ──────────────────────────────────
router.get('/:id/videos', async (req, res) => {
  const dramaId = req.params.id;
  const results = [];

  try {
    // 1. Try fetching trailer from Trakt
    if (hasTraktAuth()) {
      try {
        const { data } = await trakt.get(`/shows/${dramaId}?extended=full`);
        if (data.trailer && data.trailer.includes('youtube.com/watch?v=')) {
          const key = data.trailer.split('v=')[1];
          results.push({ id: `trakt_${dramaId}`, key, site: 'YouTube', type: 'Trailer', name: 'Official Trailer' });
          return res.json({ results });
        }
      } catch (e) { }
    }

    // 2. Fallback to Local Database
    let drama = await Drama.findOne({ id: parseInt(dramaId) });
    if (drama && drama.videos && drama.videos.length > 0) {
      return res.json({ results: drama.videos });
    }
  } catch (err) { }
  
  res.json({ results });
});

// ── Seasons (All Seasons Metadata) ───────────────────────────────
router.get('/:id/seasons', async (req, res) => {
  try {
    const { data } = await tmdb.get(`/tv/${req.params.id}?append_to_response=images`);
    res.json({ seasons: data.seasons || [] });
  } catch (err) {
    res.status(500).json({ message: 'TMDB Error: ' + err.message });
  }
});

// ── Season Detail (Episode List) ──────────────────────────────────
router.get('/:id/season/:s', async (req, res) => {
  try {
    const { id, s } = req.params;
    const { data } = await tmdb.get(`/tv/${id}/season/${s}`);
    res.json({ episodes: data.episodes || [] });
  } catch (err) {
    res.status(500).json({ message: 'TMDB Error: ' + err.message });
  }
});

module.exports = router;
