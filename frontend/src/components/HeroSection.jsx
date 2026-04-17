import { useNavigate } from 'react-router-dom';
import { backdrop } from '../api/tmdb';

export default function HeroSection({ drama }) {
  const navigate = useNavigate();
  if (!drama) return <div className="h-[85vh] bg-kcard animate-pulse" />;

  const bg = backdrop(drama.backdrop_path);
  const rating = drama.vote_average?.toFixed(1);
  const year = drama.first_air_date?.substring(0, 4);
  const genres = drama.genre_ids?.slice(0, 3).join(' • ') || '';
  const overview = drama.overview?.length > 200 ? drama.overview.substring(0, 200) + '...' : drama.overview;

  return (
    <div className="relative h-[85vh] min-h-[500px] overflow-hidden">
      {/* Background Image */}
      {bg && (
        <img src={bg} alt={drama.name} className="absolute inset-0 w-full h-full object-cover object-top scale-105" />
      )}

      {/* Gradient Overlay */}
      <div className="absolute inset-0 hero-gradient" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-kdark" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 px-4 sm:px-8 md:px-16 pb-16 max-w-3xl animate-slide-up">
        {/* Featured Tag */}
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1.5 h-8 bg-gradient-to-b from-pink-500 to-red-600 rounded-full" />
          <span className="text-pink-400 font-black text-sm tracking-widest uppercase">✨ FEATURED TODAY</span>
        </div>

        {/* Title */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-white tracking-tight leading-none mb-4">
          {drama.name}
        </h1>

        {/* Meta */}
        <div className="flex items-center gap-4 mb-6 text-base flex-wrap">
          {rating && (
            <span className="flex items-center gap-1.5 text-yellow-400 font-bold bg-yellow-600/20 px-3 py-1 rounded-full border border-yellow-500/30">
              <span className="text-lg">★</span> {rating}
            </span>
          )}
          {year && <span className="text-gray-400 font-bold">{year}</span>}
          {drama.number_of_seasons && <span className="text-gray-400 font-bold">📺 {drama.number_of_seasons} Season{drama.number_of_seasons > 1 ? 's' : ''}</span>}
        </div>

        {/* Overview */}
        <p className="text-gray-300 text-lg leading-relaxed mb-8 max-w-2xl">{overview}</p>

        {/* Buttons - Beautiful */}
        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => navigate(`/watch/${drama.id}`)}
            className="group relative bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white font-bold text-lg px-10 py-4 rounded-2xl transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:shadow-red-600/50 flex items-center gap-3 transform"
          >
            <span className="text-2xl">▶️</span>
            <span>Watch Now</span>
          </button>
          <button
            onClick={() => navigate(`/watch/${drama.id}?party=true`)}
            className="group relative bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-gray-900 font-bold text-lg px-10 py-4 rounded-2xl transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:shadow-amber-600/50 flex items-center gap-3 transform"
          >
            <span className="text-2xl animate-bounce">👥</span>
            <span>Watch Together</span>
          </button>
          <button
            onClick={() => navigate(`/watch/${drama.id}`)}
            className="group relative border-2 border-white/30 hover:border-pink-500 text-white font-bold text-lg px-8 py-4 rounded-2xl transition-all duration-300 hover:scale-105 hover:bg-white/10 flex items-center gap-2"
          >
            <span className="text-xl">ℹ️</span>
            <span>More Info</span>
          </button>
        </div>
      </div>
    </div>
  );
}
