import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { poster } from '../api/tmdb';

export default function DramaCard({ drama, size = 'md' }) {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);
  const [imgError, setImgError] = useState(false);

  const sizeClasses = {
    sm: 'w-32 sm:w-36',
    md: 'w-40 sm:w-44',
    lg: 'w-48 sm:w-56',
  };

  const rating = drama.vote_average ? drama.vote_average.toFixed(1) : 'N/A';
  const year = drama.first_air_date?.substring(0, 4) || '';
  const isNew = drama.first_air_date && new Date(drama.first_air_date) > new Date(Date.now() - 30 * 86400000);

  return (
    <div
      className={`${sizeClasses[size]} shrink-0 drama-card relative`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Poster */}
      <div className="relative overflow-hidden rounded-2xl aspect-[2/3] bg-kcard shadow-lg hover:shadow-xl transition-shadow">
        <img
          src={imgError ? '/no-poster.png' : poster(drama.poster_path)}
          alt={drama.name}
          className="w-full h-full object-cover transition-transform duration-500 cursor-pointer"
          style={{ transform: hovered ? 'scale(1.08)' : 'scale(1)' }}
          onError={() => setImgError(true)}
          onClick={() => navigate(`/watch/${drama.id}`)}
          loading="lazy"
        />

        {/* Badges */}
        {isNew && (
          <div className="absolute top-3 left-3 bg-gradient-to-r from-pink-500 to-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-pulse">
            🆕 NEW
          </div>
        )}

        {/* Rating */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-black/80 backdrop-blur rounded-full px-2.5 py-1 text-xs border border-yellow-500/40">
          <span className="text-yellow-400 text-sm">★</span>
          <span className="text-white font-bold">{rating}</span>
        </div>

        {/* Hover overlay */}
        <div className={`absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent transition-all duration-300 ${hovered ? 'opacity-100' : 'opacity-0'} flex flex-col justify-end`}>
          <div className="p-4 space-y-2">
            {/* Watch Now Button */}
            <button 
              onClick={() => navigate(`/watch/${drama.id}`)}
              className="w-full group relative bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white font-bold text-sm py-2.5 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-red-600/50 flex items-center justify-center gap-2 transform"
            >
              <span className="text-lg">▶️</span>
              <span>Watch Now</span>
            </button>

            {/* Watch Together Button */}
            <button
              onClick={(e) => { 
                e.stopPropagation(); 
                navigate(`/watch/${drama.id}?party=true`); 
              }}
              className="w-full group relative bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-gray-900 font-bold text-sm py-2 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-amber-600/50 flex items-center justify-center gap-2 transform"
            >
              <span className="text-lg animate-bounce">👥</span>
              <span>Watch Together</span>
            </button>
          </div>
        </div>
      </div>

      {/* Info below card */}
      <div className="mt-3 px-1">
        <p className="text-white text-sm font-bold truncate leading-tight hover:text-pink-400 transition-colors cursor-pointer" onClick={() => navigate(`/watch/${drama.id}`)}>
          {drama.name}
        </p>
        <div className="flex items-center justify-between mt-1">
          <p className="text-gray-400 text-xs">{year}</p>
          {drama.genres && <p className="text-gray-500 text-xs">{drama.genres.slice(0, 1).join(', ')}</p>}
        </div>
      </div>
    </div>
  );
}
