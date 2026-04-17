import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { dramas, poster } from "../api/tmdb";
import SuperPlayer from "../components/SuperPlayer";
import DramaRow from "../components/DramaRow";
import api from "../api/backend";
import { motion, AnimatePresence } from "framer-motion";

export default function Watch() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [drama, setDrama] = useState(null);
  const [videos, setVideos] = useState([]);
  const [activeVideo, setActiveVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  // New States for Full Drama
  const [mode, setMode] = useState("trailer"); // 'trailer' or 'full'
  const [seasons, setSeasons] = useState([]);
  const [episodes, setEpisodes] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [selectedEpisode, setSelectedEpisode] = useState(1);
  const [loadingEpisodes, setLoadingEpisodes] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const [d, v] = await Promise.all([
          dramas.detail(id),
          dramas.videos(id),
        ]);
        const dramaData = d.data;
        setDrama(dramaData);

        const vids = [
          ...(v.data.results || []),
          ...(dramaData.videos?.results || []),
        ];
        setVideos(vids);

        const preferredVideo =
          vids.find((v) => v.type === "Trailer" && v.site === "YouTube") ||
          vids.find((v) => v.site === "YouTube") ||
          null;

        setActiveVideo(preferredVideo);
        if (!preferredVideo) setMode("full");

        // Fetch Seasons if it's a TV show
        if (dramaData.number_of_seasons > 0) {
          const sRes = await api.get(`/dramas/${id}/seasons`);
          setSeasons(sRes.data.seasons.filter((s) => s.season_number > 0)); // Skip specials usually
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetch();
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    if (mode === "full" && drama?.number_of_seasons > 0) {
      const fetchEpisodes = async () => {
        setLoadingEpisodes(true);
        try {
          const res = await api.get(`/dramas/${id}/season/${selectedSeason}`);
          setEpisodes(res.data.episodes);
        } catch (e) {
          console.error(e);
        } finally {
          setLoadingEpisodes(false);
        }
      };
      fetchEpisodes();
    }
  }, [selectedSeason, mode, id, drama]);

  useEffect(() => {
    if (mode === "full" && drama) {
      const history = JSON.parse(
        localStorage.getItem("kdrama_history") || "[]",
      );
      const item = {
        id,
        name: drama.name,
        poster_path: drama.poster_path,
        season: selectedSeason,
        episode: selectedEpisode,
        timestamp: Date.now(),
      };
      const newHistory = [item, ...history.filter((h) => h.id !== id)].slice(
        0,
        10,
      );
      localStorage.setItem("kdrama_history", JSON.stringify(newHistory));
    }
  }, [selectedSeason, selectedEpisode, mode, id, drama]);

  const createParty = async () => {
    setCreating(true);
    try {
      const r = await api.post("/rooms", {
        dramaId: drama.id,
        dramaTitle: drama.name,
        posterPath: drama.poster_path,
      });
      navigate("/party/" + r.data.roomId);
    } catch (e) {
      alert("Failed: " + (e.response?.data?.message || e.message));
    } finally {
      setCreating(false);
    }
  };

  if (loading)
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-kred border-t-transparent rounded-full animate-spin" />
      </div>
    );
  if (!drama)
    return (
      <div className="pt-16 text-center text-white py-20">Drama not found</div>
    );

  const rating = drama.vote_average?.toFixed(1);
  const year = drama.first_air_date?.substring(0, 4);

  // Video Source Logic
  let playerProps = {};
  if (mode === "trailer") {
    const trailerSrc = activeVideo
      ? `https://www.youtube-nocookie.com/embed/${activeVideo.key}?autoplay=1&modestbranding=1&rel=0`
      : null;

    playerProps = {
      type: "iframe",
      src: trailerSrc,
      title: `Trailer: ${drama.name}`,
      poster: poster(drama.backdrop_path, "original"),
    };
  } else {
    const isMovie = !drama.number_of_seasons || drama.number_of_seasons === 0;
    playerProps = {
      type: "iframe",
      src: isMovie
        ? `https://vidsrc.to/embed/movie/${id}`
        : `https://vidsrc.to/embed/tv/${id}/${selectedSeason}/${selectedEpisode}`,
      title: isMovie
        ? drama.name
        : `${drama.name} - S${selectedSeason} E${selectedEpisode}`,
    };
  }

  return (
    <div className="pt-16 min-h-screen animate-fade-in bg-[#0a0a0c]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 py-8">
        {/* Mode & Episode Toggle */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10 backdrop-blur-xl">
            <button
              onClick={() => setMode("trailer")}
              className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${mode === "trailer" ? "bg-kred text-white shadow-lg shadow-red-600/20" : "text-gray-400 hover:text-white"}`}
            >
              🎬 Trailer
            </button>
            <button
              onClick={() => setMode("full")}
              className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${mode === "full" ? "bg-pink-600 text-white shadow-lg shadow-pink-600/20" : "text-gray-400 hover:text-white"}`}
            >
              💎 Full Drama
            </button>
          </div>

          {mode === "full" && drama.number_of_seasons > 0 && (
            <div className="flex gap-3">
              <select
                value={selectedSeason}
                onChange={(e) => setSelectedSeason(e.target.value)}
                className="bg-white/5 border border-white/10 text-white px-4 py-2 rounded-xl text-sm font-bold focus:outline-none focus:border-pink-500 transition-colors"
              >
                {seasons.map((s) => (
                  <option
                    key={s.id}
                    value={s.season_number}
                    className="bg-neutral-900"
                  >
                    Season {s.season_number}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <SuperPlayer
          {...playerProps}
          poster={poster(drama.backdrop_path, "original")}
        />

        {/* Episode List */}
        <AnimatePresence>
          {mode === "full" && drama.number_of_seasons > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-8 overflow-hidden"
            >
              <h3 className="text-white font-bold text-xl mb-4 flex items-center gap-2">
                <span className="text-pink-500">📺</span> Episode List
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                {loadingEpisodes
                  ? Array(8)
                      .fill(0)
                      .map((_, i) => (
                        <div
                          key={i}
                          className="aspect-video bg-white/5 animate-pulse rounded-xl"
                        />
                      ))
                  : episodes.map((ep) => (
                      <button
                        key={ep.id}
                        onClick={() => setSelectedEpisode(ep.episode_number)}
                        className={`p-3 rounded-xl border transition-all text-center group ${selectedEpisode === ep.episode_number ? "bg-pink-600 border-pink-400 text-white shadow-lg shadow-pink-600/40" : "bg-white/5 border-white/10 text-gray-400 hover:border-white/30 hover:bg-white/10"}`}
                      >
                        <span className="block text-xs opacity-50 mb-1">
                          EP
                        </span>
                        <span className="text-lg font-black">
                          {ep.episode_number}
                        </span>
                      </button>
                    ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="flex items-start gap-6 mb-8">
              <img
                src={poster(drama.poster_path, "w342")}
                alt={drama.name}
                className="w-32 rounded-2xl shadow-2xl shrink-0 border-2 border-pink-500/30 object-cover aspect-[2/3]"
              />
              <div className="flex-1">
                <h1 className="text-white text-3xl sm:text-4xl font-bold tracking-tight">
                  {drama.name}
                </h1>
                {drama.original_name && drama.original_name !== drama.name && (
                  <p className="text-gray-400 text-sm mt-1 font-korean">
                    {drama.original_name}
                  </p>
                )}
                <div className="flex flex-wrap items-center gap-4 mt-4 text-sm">
                  {rating && (
                    <span className="text-yellow-400 font-bold bg-yellow-600/20 px-3 py-1 rounded-full">
                      ⭐ {rating}
                    </span>
                  )}
                  {year && <span className="text-gray-400">{year}</span>}
                  {drama.status && (
                    <span className="px-3 py-1 bg-red-600/20 rounded-full text-xs text-red-300 font-bold">
                      {drama.status}
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-2 mt-4">
                  {drama.genres?.map((g) => (
                    <span
                      key={g.id}
                      className="px-3 py-1 bg-pink-600/20 text-pink-300 rounded-full text-xs font-bold border border-pink-500/30"
                    >
                      {g.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <p className="text-gray-300 leading-relaxed mb-8 text-lg bg-white/5 p-6 rounded-3xl border border-white/10">
              {drama.overview}
            </p>

            {/* Watch Party CTA */}
            <div className="bg-gradient-to-r from-pink-600/20 to-red-600/20 backdrop-blur border-2 border-pink-500/40 rounded-3xl p-8 mb-8 hover:border-pink-500/60 transition-all group">
              <div className="flex items-center gap-4 mb-4">
                <div className="text-4xl group-hover:scale-110 transition-transform">
                  👥
                </div>
                <div>
                  <h3 className="text-white text-xl font-bold">
                    Watch Together!
                  </h3>
                  <p className="text-gray-300 text-sm">
                    Invite your friends and lovers to watch this drama in
                    real-time
                  </p>
                </div>
              </div>
              <button
                onClick={createParty}
                className="w-full bg-gradient-to-r from-pink-600 to-red-600 hover:from-pink-500 hover:to-red-500 text-white font-bold text-lg py-4 rounded-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-pink-600/50 flex items-center justify-center gap-3 disabled:opacity-50"
              >
                <span>{creating ? "⏳" : "🎬"}</span>
                <span>
                  {creating ? "Creating Party..." : "Start Watch Party"}
                </span>
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 h-fit">
              <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                <span className="text-pink-500">📺</span> Details
              </h3>
              <div className="space-y-3">
                {[
                  ["First Air Date", drama.first_air_date],
                  ["Episodes", drama.number_of_episodes],
                  ["Language", drama.original_language?.toUpperCase()],
                  ["Network", drama.networks?.[0]?.name],
                  ["Country", drama.origin_country?.join(", ")],
                ]
                  .filter(([, v]) => v)
                  .map(([k, v]) => (
                    <div
                      key={k}
                      className="flex justify-between py-2 border-b border-white/5"
                    >
                      <span className="text-gray-400 text-sm font-medium">
                        {k}
                      </span>
                      <span className="text-white text-sm font-bold">{v}</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
        {drama.similar?.results?.length > 0 && (
          <div className="mt-12">
            <DramaRow title="Similar Dramas" dramas={drama.similar.results} />
          </div>
        )}
      </div>
    </div>
  );
}
