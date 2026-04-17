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

router.get("/trending", async (req, res) => {
  try {
    const { data } = await tmdb.get("/trending/tv/week", {
      params: { language: "en-US" },
    });
    return returnList(res, data);
  } catch (err) {
    return res.status(500).json({
      message: "Failed to fetch trending dramas",
      detail: err.response?.data || err.message,
    });
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
    return res.status(500).json({
      message: "Failed to fetch new releases",
      detail: err.response?.data || err.message,
    });
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
    return res.status(500).json({
      message: "Failed to fetch popular dramas",
      detail: err.response?.data || err.message,
    });
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
    return res.status(500).json({
      message: "Failed to fetch romance dramas",
      detail: err.response?.data || err.message,
    });
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
    return res.status(500).json({
      message: "Failed to fetch action dramas",
      detail: err.response?.data || err.message,
    });
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
    return res.status(500).json({
      message: "Failed to search dramas",
      detail: err.response?.data || err.message,
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { data } = await tmdb.get(`/tv/${req.params.id}`, {
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
    const status = err.response?.status || 500;
    return res.status(status).json({
      message: "Drama not found",
      detail: err.response?.data || err.message,
    });
  }
});

router.get("/:id/videos", async (req, res) => {
  try {
    const { data } = await tmdb.get(`/tv/${req.params.id}/videos`, {
      params: {
        language: "en-US",
        include_video_language: "en,null",
      },
    });
    return res.json({ results: data.results || [], source: "tmdb_live_api" });
  } catch (err) {
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
    return res.status(500).json({ message: "TMDB Error: " + err.message });
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
    return res.status(500).json({ message: "TMDB Error: " + err.message });
  }
});

module.exports = router;
