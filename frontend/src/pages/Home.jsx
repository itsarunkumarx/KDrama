import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dramas, poster } from '../api/tmdb';
import HeroSection from '../components/HeroSection';
import DramaRow from '../components/DramaRow';

export default function Home() {
  const [trending, setTrending] = useState([]);
  const [newReleases, setNewReleases] = useState([]);
  const [popular, setPopular] = useState([]);
  const [romance, setRomance] = useState([]);
  const [action, setAction] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [heroIndex, setHeroIndex] = useState(0);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [t, n, p, r, a] = await Promise.all([
          dramas.trending(), dramas.newReleases(), dramas.popular(), dramas.romance(), dramas.action()
        ]);
        setTrending(t.data.results || []);
        setNewReleases(n.data.results || []);
        setPopular(p.data.results || []);
        setRomance(r.data.results || []);
        setAction(a.data.results || []);
        
        // Load history from localStorage
        const savedHistory = JSON.parse(localStorage.getItem('kdrama_history') || '[]');
        setHistory(savedHistory);
      } catch(e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetchAll();
  }, []);

  useEffect(() => {
    if (!trending.length) return;
    const t = setInterval(() => setHeroIndex(i => (i+1) % Math.min(5, trending.length)), 8000);
    return () => clearInterval(t);
  }, [trending]);

  if (loading) return (
    <div className="pt-16 min-h-screen bg-gradient-to-b from-slate-950 to-black">
      <div className="max-w-[1400px] mx-auto">
        <div className="h-[85vh] bg-gradient-to-r from-slate-800 to-slate-900 rounded-3xl animate-pulse" />
        <div className="mt-12 space-y-12 px-4 sm:px-8">
          {[1,2,3].map(i => (
            <div key={i}>
              <div className="h-8 w-48 bg-slate-800 rounded-lg animate-pulse mb-6" />
              <div className="flex gap-4">{[1,2,3,4,5].map(j => <div key={j} className="w-48 aspect-[2/3] bg-slate-800 rounded-2xl animate-pulse shrink-0" />)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="animate-fade-in min-h-screen bg-gradient-to-b from-slate-950 via-black to-slate-950">
      <HeroSection drama={trending[heroIndex]} />
      
      {/* Beautiful Slider Indicators */}
      {trending.length > 1 && (
        <div className="flex justify-center gap-3 -mt-8 relative z-10 mb-12">
          {trending.slice(0,5).map((_,i) => (
            <button 
              key={i} 
              onClick={() => setHeroIndex(i)}
              className={`transition-all duration-300 rounded-full transform hover:scale-125 ${i===heroIndex ? 'w-8 h-3 bg-gradient-to-r from-pink-500 to-red-500 shadow-lg shadow-red-600/50' : 'w-3 h-3 bg-white/30 hover:bg-white/60'}`} 
            />
          ))}
        </div>
      )}

      <div className="pb-20 max-w-[1400px] mx-auto px-4 sm:px-8 space-y-16">
        
        {/* CONTINUE WATCHING Section */}
        {history.length > 0 && (
          <div className="animate-slide-up-fade">
            <div className="flex items-center gap-3 mb-8">
              <div className="text-4xl animate-pulse">🍿</div>
              <div>
                <h2 className="text-white text-3xl font-black tracking-tight">Continue Watching</h2>
                <p className="text-gray-400 text-sm mt-1">Pick up where you left off</p>
              </div>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
              {history.map(item => (
                <Link key={item.id} to={`/watch/${item.id}`} className="shrink-0 w-64 group relative block">
                  <div className="relative aspect-video rounded-2xl overflow-hidden border-2 border-white/5 group-hover:border-pink-500/50 transition-all shadow-xl">
                    <img src={poster(item.poster_path, 'w780')} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <p className="text-white font-bold truncate text-sm">{item.name}</p>
                      <p className="text-pink-400 text-xs font-black tracking-widest mt-1">
                        S{item.season} : E{item.episode}
                      </p>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                      <div className="w-12 h-12 bg-pink-600 rounded-full flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                        <span className="text-white text-2xl">▶</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* TRENDING Section */}
        <div>
          <div className="flex items-center gap-3 mb-8">
            <div className="text-4xl">🔥</div>
            <div>
              <h2 className="text-white text-3xl font-black tracking-tight">Trending This Week</h2>
              <p className="text-gray-400 text-sm mt-1">Most watched K-dramas right now</p>
            </div>
          </div>
          <DramaRow dramas={trending} badge="FIRE" />
        </div>

        {/* NEW RELEASES Section */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="text-4xl">✨</div>
              <div>
                <h2 className="text-white text-3xl font-black tracking-tight">New Releases</h2>
                <p className="text-gray-400 text-sm mt-1">Fresh K-dramas just added</p>
              </div>
            </div>
            <Link to="/search?category=new" className="group flex items-center gap-2 bg-gradient-to-r from-pink-600 to-red-600 hover:from-pink-500 hover:to-red-500 text-white px-6 py-2 rounded-full font-bold transition-all hover:scale-105 hover:shadow-lg">
              View All <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>
          <DramaRow dramas={newReleases} size="lg" />
        </div>

        {/* ROMANCE Section */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="text-4xl">💕</div>
              <div>
                <h2 className="text-white text-3xl font-black tracking-tight">Romance K-Dramas</h2>
                <p className="text-gray-400 text-sm mt-1">Heartwarming love stories</p>
              </div>
            </div>
            <Link to="/search?category=romance" className="group flex items-center gap-2 bg-gradient-to-r from-pink-600 to-red-600 hover:from-pink-500 hover:to-red-500 text-white px-6 py-2 rounded-full font-bold transition-all hover:scale-105 hover:shadow-lg">
              Explore <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>
          <DramaRow dramas={romance} />
        </div>

        {/* ACTION Section */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="text-4xl">⚡</div>
              <div>
                <h2 className="text-white text-3xl font-black tracking-tight">Action & Thriller</h2>
                <p className="text-gray-400 text-sm mt-1">Intense and gripping dramas</p>
              </div>
            </div>
            <Link to="/search?category=action" className="group flex items-center gap-2 bg-gradient-to-r from-pink-600 to-red-600 hover:from-pink-500 hover:to-red-500 text-white px-6 py-2 rounded-full font-bold transition-all hover:scale-105 hover:shadow-lg">
              More <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>
          <DramaRow dramas={action} />
        </div>

        {/* POPULAR Section */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="text-4xl">⭐</div>
              <div>
                <h2 className="text-white text-3xl font-black tracking-tight">Most Popular</h2>
                <p className="text-gray-400 text-sm mt-1">All-time fan favorites</p>
              </div>
            </div>
            <Link to="/search" className="group flex items-center gap-2 bg-gradient-to-r from-pink-600 to-red-600 hover:from-pink-500 hover:to-red-500 text-white px-6 py-2 rounded-full font-bold transition-all hover:scale-105 hover:shadow-lg">
              Browse <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>
          <DramaRow dramas={popular} size="sm" />
        </div>

        {/* CTA Section - Beautiful Browse All */}
        <Link to="/search" className="group block">
          <div className="bg-gradient-to-r from-pink-600/20 to-red-600/20 backdrop-blur border-2 border-pink-500/40 hover:border-pink-500/60 rounded-4xl p-12 text-center transition-all hover:shadow-2xl hover:shadow-pink-600/30">
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="text-5xl animate-bounce">🎬</span>
            </div>
            <h3 className="text-white text-4xl font-black mb-3 tracking-tight">Explore Complete Collection</h3>
            <p className="text-gray-300 text-lg mb-6 max-w-2xl mx-auto">Discover 500+ beautiful K-dramas with advanced search, filters, and watch parties</p>
            <div className="inline-block bg-gradient-to-r from-pink-600 to-red-600 hover:from-pink-500 hover:to-red-500 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all group-hover:scale-105 group-hover:shadow-lg">
              Browse All Dramas →
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
