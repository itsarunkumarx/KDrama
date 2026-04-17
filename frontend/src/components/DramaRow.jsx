import { useState, useRef } from 'react';
import DramaCard from './DramaCard';

export default function DramaRow({ title, dramas, badge, size = 'md' }) {
  const rowRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const scroll = (dir) => {
    const el = rowRef.current;
    const amount = el.offsetWidth * 0.8;
    el.scrollBy({ left: dir === 'right' ? amount : -amount, behavior: 'smooth' });
  };

  const onScroll = () => {
    const el = rowRef.current;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  if (!dramas?.length) return null;

  return (
    <div className="mb-10 group/row">
      {/* Row Title */}
      <div className="flex items-center gap-3 mb-4 px-4 sm:px-8">
        <h2 className="text-white text-xl sm:text-2xl font-bold font-display tracking-wide">{title}</h2>
        {badge && <span className="badge-new">{badge}</span>}
      </div>

      {/* Scrollable Row */}
      <div className="relative">
        {/* Left Arrow */}
        {canScrollLeft && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-0 bottom-8 w-12 z-10 flex items-center justify-center
              bg-gradient-to-r from-kdark to-transparent opacity-0 group-hover/row:opacity-100 transition-opacity"
          >
            <span className="text-white text-2xl glass rounded-full w-9 h-9 flex items-center justify-center hover:bg-kred/30 transition-colors">‹</span>
          </button>
        )}

        {/* Cards */}
        <div
          ref={rowRef}
          onScroll={onScroll}
          className="row-scroll flex gap-3 px-4 sm:px-8 pb-2"
        >
          {dramas.map(drama => (
            <DramaCard key={drama.id} drama={drama} size={size} />
          ))}
        </div>

        {/* Right Arrow */}
        {canScrollRight && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-0 bottom-8 w-12 z-10 flex items-center justify-center
              bg-gradient-to-l from-kdark to-transparent opacity-0 group-hover/row:opacity-100 transition-opacity"
          >
            <span className="text-white text-2xl glass rounded-full w-9 h-9 flex items-center justify-center hover:bg-kred/30 transition-colors">›</span>
          </button>
        )}
      </div>
    </div>
  );
}
