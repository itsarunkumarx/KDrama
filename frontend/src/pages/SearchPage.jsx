import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { dramas } from '../api/tmdb';
import DramaCard from '../components/DramaCard';

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get('q') || '';
  const category = searchParams.get('category') || '';
  const page = parseInt(searchParams.get('page') || '1');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState(q);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        let r;
        if (q) r = await dramas.search(q, page);
        else if (category === 'romance') r = await dramas.romance();
        else if (category === 'action') r = await dramas.action();
        else if (category === 'new') r = await dramas.newReleases(page);
        else r = await dramas.popular(page);
        setResults(r.data.results || []);
        setTotalPages(r.data.total_pages || 1);
      } catch(e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetch();
    window.scrollTo(0, 0);
  }, [q, category, page]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (input.trim()) {
      setSearchParams({ q: input.trim(), page: '1' });
    }
  };

  const goToPage = (newPage) => {
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (category) params.set('category', category);
    params.set('page', newPage.toString());
    setSearchParams(params);
  };

  const title = q ? `Search Results for "${q}"` : 
    category === 'romance' ? '💕 Romance K-Dramas' : 
    category === 'action' ? '⚡ Action & Thriller K-Dramas' : 
    category === 'new' ? '🆕 New Korean Dramas' : 
    '🎬 All K-Dramas';

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-black to-slate-950 pt-20 pb-20">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 animate-fade-in space-y-12">
        
        {/* Search Bar - Beautiful */}
        <form onSubmit={handleSearch} className="flex gap-3 max-w-3xl mx-auto">
          <div className="flex-1 relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-red-600 rounded-2xl blur-lg opacity-50 group-focus-within:opacity-100 transition-all" />
            <input 
              value={input} 
              onChange={e => setInput(e.target.value)} 
              placeholder="Search for K-dramas... (ex: Squid Game, Goblin, Boys Over Flowers)" 
              className="relative w-full bg-black border-2 border-pink-500/40 text-white placeholder-gray-400 text-lg py-4 px-6 rounded-2xl focus:outline-none focus:border-pink-500 transition-all backdrop-blur" 
            />
            <span className="absolute right-5 top-1/2 -translate-y-1/2 text-2xl">🔍</span>
          </div>
          <button 
            type="submit" 
            className="bg-gradient-to-r from-pink-600 to-red-600 hover:from-pink-500 hover:to-red-500 text-white font-bold text-lg px-8 py-4 rounded-2xl transition-all hover:scale-105 hover:shadow-lg hover:shadow-red-600/50"
          >
            Search
          </button>
        </form>

        {/* Title & Filters Section */}
        <div className="space-y-6">
          <div>
            <h1 className="text-white text-4xl font-black tracking-tight mb-2">{title}</h1>
            <p className="text-gray-400 text-lg">
              {results.length > 0 ? (
                <>Found <span className="text-pink-400 font-bold">{results.length}</span> amazing K-dramas {category ? `in "${category}"` : ''}</>
              ) : (
                <>No results found</>
              )}
            </p>
          </div>
          
          {/* Filter Buttons - Beautiful */}
          <div className="flex gap-3 flex-wrap">
            {[
              { label: '🆕 New', cat: 'new' },
              { label: '💕 Romance', cat: 'romance' },
              { label: '⚡ Action', cat: 'action' },
              { label: '🎬 All', cat: null },
            ].map(({ label, cat }) => (
              <button 
                key={label}
                onClick={() => setSearchParams(cat ? { category: cat, page: '1' } : { page: '1' })}
                className={`px-6 py-3 rounded-xl font-bold text-sm transition-all transform hover:scale-105 ${
                  (cat === null && !category && !q) || category === cat
                    ? 'bg-gradient-to-r from-pink-600 to-red-600 text-white shadow-lg shadow-red-600/50'
                    : 'bg-white/10 text-gray-200 hover:bg-white/20 border border-white/20'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Results Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {[...Array(12)].map((_,i) => (
              <div key={i} className="aspect-[2/3] bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : results.length === 0 ? (
          <div className="text-center py-32 space-y-6">
            <div className="text-8xl">🔍</div>
            <p className="text-white text-3xl font-black">No K-dramas found</p>
            <p className="text-gray-400 text-lg max-w-md mx-auto">Try searching with different keywords or browse our categories</p>
            <button 
              onClick={() => setSearchParams({ page: '1' })}
              className="inline-block bg-gradient-to-r from-pink-600 to-red-600 hover:from-pink-500 hover:to-red-500 text-white font-bold px-8 py-4 rounded-2xl transition-all hover:scale-105 hover:shadow-lg"
            >
              🎬 Browse All K-Dramas
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {results.map(d => <DramaCard key={d.id} drama={d} size="md" />)}
            </div>

            {/* Pagination Controls - Beautiful */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 flex-wrap py-12 border-t border-white/10">
                <button
                  onClick={() => goToPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-pink-600/20 to-red-600/20 text-white font-bold border border-pink-500/40 hover:border-pink-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  ← Previous
                </button>

                <div className="flex items-center gap-2">
                  {[...Array(Math.min(5, totalPages))].map((_, i) => {
                    let pageNum;
                    if (totalPages <= 5) pageNum = i + 1;
                    else if (page <= 3) pageNum = i + 1;
                    else if (page >= totalPages - 2) pageNum = totalPages - 4 + i;
                    else pageNum = page - 2 + i;

                    return (
                      <button
                        key={i}
                        onClick={() => goToPage(pageNum)}
                        className={`w-11 h-11 rounded-lg font-bold transition-all transform hover:scale-110 ${
                          pageNum === page 
                            ? 'bg-gradient-to-r from-pink-600 to-red-600 text-white shadow-lg' 
                            : 'bg-white/10 text-gray-200 hover:bg-white/20'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => goToPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-pink-600/20 to-red-600/20 text-white font-bold border border-pink-500/40 hover:border-pink-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  Next →
                </button>

                <span className="text-gray-400 text-sm font-bold ml-4 px-4 py-3 bg-white/5 rounded-lg border border-white/10">
                  Page <span className="text-pink-400">{page}</span> of <span className="text-pink-400">{totalPages}</span>
                </span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
