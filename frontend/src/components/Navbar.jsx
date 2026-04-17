import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setQuery(''); setSearchOpen(false);
    }
  };

  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'glass shadow-2xl border-b border-red-500/20' : 'bg-gradient-to-b from-black/80 to-transparent'}`}>
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 h-16 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 shrink-0 hover:scale-105 transition-transform">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-rose-500 via-red-600 to-pink-600 flex items-center justify-center text-lg font-black">🎬</div>
          <div>
            <span className="bg-gradient-to-r from-red-400 via-red-500 to-pink-600 bg-clip-text text-transparent font-display text-3xl tracking-widest font-black">KDRAMA</span>
            <span className="text-yellow-400 font-display text-3xl ml-1 font-black">X</span>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-6 text-sm font-bold text-gray-300">
          <Link to="/" className="hover:text-red-400 transition-colors hover:underline">Home</Link>
          <Link to="/search" className="hover:text-red-400 transition-colors hover:underline flex items-center gap-1.5">
            🎬 All K-Dramas
          </Link>
          <Link to="/search?category=new" className="hover:text-red-400 transition-colors hover:underline flex items-center gap-1.5">
            🆕 New <span className="badge-new">HOT</span>
          </Link>
          <Link to="/search?category=romance" className="hover:pink-400 transition-colors hover:underline">💕 Romance</Link>
          <Link to="/search?category=action" className="hover:text-red-400 transition-colors hover:underline">⚡ Action</Link>

        </div>

        <div className="flex items-center gap-3">
          {searchOpen ? (
            <form onSubmit={handleSearch} className="flex items-center gap-2 animate-slide-in-right">
              <input autoFocus value={query} onChange={e => setQuery(e.target.value)}
                placeholder="Search K-dramas..." className="bg-white/10 border-2 border-red-500/50 rounded-lg text-sm py-2 px-3 w-48 sm:w-64 text-white placeholder-gray-400 focus:border-red-500 focus:outline-none transition-all backdrop-blur-sm" />
              <button type="button" onClick={() => setSearchOpen(false)} className="text-gray-300 hover:text-red-400 transition-colors p-2 text-lg">✕</button>
            </form>
          ) : (
            <button onClick={() => setSearchOpen(true)} className="text-gray-300 hover:text-red-400 transition-colors p-2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </button>
          )}

          <div className="relative">
            <button onClick={() => setMenuOpen(!menuOpen)}
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 via-rose-500 to-pink-600 flex items-center justify-center text-white text-sm font-black hover:scale-110 transition-transform shadow-lg border-2 border-yellow-400/50">
              {initials}
            </button>
            {menuOpen && (
              <div className="absolute right-0 top-12 w-64 glass rounded-2xl shadow-2xl overflow-hidden animate-slide-up border-2 border-red-500/30">
                {/* User Info */}
                <div className="px-5 py-4 border-b-2 border-red-500/20 bg-gradient-to-r from-red-950/30 to-pink-950/30">
                  <p className="text-sm font-black text-white truncate">{user?.name}</p>
                  <p className="text-xs text-gray-300 truncate">{user?.email}</p>
                  <span className="text-xs px-3 py-1 rounded-full mt-2 inline-block font-black tracking-wider bg-red-500/30 text-red-300">
                    👤 {user?.role?.toUpperCase()}
                  </span>
                </div>
                {/* Links */}
                <Link to="/profile" className="flex items-center gap-3 px-5 py-3 hover:bg-red-500/10 text-sm text-gray-300 hover:text-red-300 transition-all font-semibold">👤 My Profile</Link>
                <Link to="/search" className="flex items-center gap-3 px-5 py-3 hover:bg-red-500/10 text-sm text-gray-300 hover:text-red-300 transition-all font-semibold">🔍 Search Dramas</Link>

                {/* Logout */}
                <button onClick={logout} className="w-full flex items-center gap-3 px-5 py-3 hover:bg-red-600/20 text-sm text-red-300 hover:text-red-200 text-left transition-all font-bold">
                  🚪 Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
