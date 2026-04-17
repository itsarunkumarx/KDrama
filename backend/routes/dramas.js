const express = require("express");
const router = express.Router();
const axios = require("axios");

const tmdb = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  params: {
    api_key: process.env.TMDB_API_KEY,
  },
  headers: {
    Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
    "Content-Type": "application/json;charset=utf-8",
  },
  timeout: 15000,
});

const normalizeShow = (show) => ({
  id: show.id,
  name: show.name || show.title,
  title: show.name || show.title,
  original_name: show.original_name || show.original_title,
  overview: show.overview,
  first_air_date: show.first_air_date || show.release_date,
  popularity: show.popularity,
  poster_path: show.poster_path,
  backdrop_path: show.backdrop_path,
  vote_average: show.vote_average,
  vote_count: show.vote_count,
  genre_ids: show.genre_ids,
  original_language: show.original_language,
  source: "tmdb_live_api",
});

const returnList = (res, data, page) => {
  const results = (data.results || []).map(normalizeShow);
  return res.json({
    results,
    page: data.page || page || 1,
    total_results: data.total_results || results.length,
    source: "tmdb_live_api",
  });
};

const parsePage = (value) => {
  const page = parseInt(value || "1", 10);
  return Number.isNaN(page) || page < 1 ? 1 : page;
};

const returnListFallback = (res, message, err, page = 1) => {
  console.error(`❌ ${message}:`, err.response?.data || err.message);
  return res.json({
    results: [],
    page,
    total_results: 0,
    source: "tmdb_error_fallback",
    message,
  });
};

router.get("/trending", async (req, res) => {
  try {
    const { data } = await tmdb.get("/trending/tv/week", {
      params: { language: "en-US" },
    });
    return returnList(res, data);
  } catch (err) {
    return returnListFallback(res, "Failed to fetch trending dramas", err);
  }
});

router.get("/new-releases", async (req, res) => {
  const page = parsePage(req.query.page);
  try {
    const { data } = await tmdb.get("/discover/tv", {
      params: {
        language: "en-US",
        page,
        sort_by: "first_air_date.desc",
        with_original_language: "ko",
        "first_air_date.lte": new Date().toISOString().slice(0, 10),
        include_null_first_air_dates: false,
      },
    });
    return returnList(res, data, page);
  } catch (err) {
    return returnListFallback(res, "Failed to fetch new releases", err, page);
  }
});

router.get("/popular", async (req, res) => {
  const page = parsePage(req.query.page);
  try {
    const { data } = await tmdb.get("/tv/popular", {
      params: { language: "en-US", page },
    });
    return returnList(res, data, page);
  } catch (err) {
    return returnListFallback(res, "Failed to fetch popular dramas", err, page);
  }
});

router.get("/romance", async (req, res) => {
  try {
    const { data } = await tmdb.get("/discover/tv", {
      params: {
        language: "en-US",
        sort_by: "popularity.desc",
        with_original_language: "ko",
        with_genres: "10749",
      },
    });
    return returnList(res, data);
  } catch (err) {
    return returnListFallback(res, "Failed to fetch romance dramas", err);
  }
});

router.get("/action", async (req, res) => {
  try {
    const { data } = await tmdb.get("/discover/tv", {
      params: {
        language: "en-US",
        sort_by: "popularity.desc",
        with_original_language: "ko",
        with_genres: "10759",
      },
    });
    return returnList(res, data);
  } catch (err) {
    return returnListFallback(res, "Failed to fetch action dramas", err);
  }
});

router.get("/search", async (req, res) => {
  const q = (req.query.q || "").trim();
  const page = parsePage(req.query.page);
  if (!q) {
    return res.json({ results: [], page, total_results: 0, source: "none" });
  }

  try {
    const { data } = await tmdb.get("/search/tv", {
      params: { query: q, page, language: "en-US" },
    });
    return returnList(res, data, page);
  } catch (err) {
    return returnListFallback(res, "Failed to search dramas", err, page);
  }
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const { data } = await tmdb.get(`/tv/${id}`, {
      params: {
        language: "en-US",
        append_to_response: "similar,videos",
      },
    });
    return res.json({
      ...data,
      name: data.name || data.title,
      title: data.name || data.title,
      source: "tmdb_live_api",
    });
  } catch (err) {
    if (err.response?.status === 404) {
      try {
        const { data } = await tmdb.get(`/movie/${id}`, {
          params: {
            language: "en-US",
            append_to_response: "similar,videos",
          },
        });
        return res.json({
          ...data,
          name: data.title || data.name,
          title: data.title || data.name,
          first_air_date: data.release_date,
          number_of_seasons: 0,
          number_of_episodes: 0,
          source: "tmdb_movie_fallback",
        });
      } catch (movieErr) {
        return res.status(404).json({
          message: "Drama not found",
          detail: movieErr.response?.data || movieErr.message,
        });
      }
    }
    return res.status(500).json({
      message: "Failed to fetch drama details",
      detail: err.response?.data || err.message,
    });
  }
});

router.get("/:id/videos", async (req, res) => {
  const id = req.params.id;
  try {
    const { data } = await tmdb.get(`/tv/${id}/videos`, {
      params: {
        language: "en-US",
        include_video_language: "en,null",
      },
    });
    return res.json({ results: data.results || [], source: "tmdb_live_api" });
  } catch (err) {
    if (err.response?.status === 404) {
      try {
        const { data } = await tmdb.get(`/movie/${id}/videos`, {
          params: {
            language: "en-US",
            include_video_language: "en,null",
          },
        });
        return res.json({
          results: data.results || [],
          source: "tmdb_movie_fallback",
        });
      } catch (movieErr) {
        return res.json({ results: [], source: "tmdb_error_fallback" });
      }
    }
    return res.json({ results: [], source: "tmdb_error_fallback" });
  }
});

router.get("/:id/seasons", async (req, res) => {
  try {
    const { data } = await tmdb.get(`/tv/${req.params.id}`, {
      params: { language: "en-US" },
    });
    return res.json({ seasons: data.seasons || [] });
  } catch (err) {
    return res.json({ seasons: [] });
  }
});

router.get("/:id/season/:s", async (req, res) => {
  try {
    const { id, s } = req.params;
    const { data } = await tmdb.get(`/tv/${id}/season/${s}`, {
      params: { language: "en-US" },
    });
    return res.json({ episodes: data.episodes || [] });
  } catch (err) {
    return res.json({ episodes: [] });
  }
});

module.exports = router;
