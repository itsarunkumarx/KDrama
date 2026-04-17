import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Entry() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  if (user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-red-950 to-slate-950 relative overflow-hidden flex flex-col items-center justify-center">
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-pink-500/20 blur-3xl rounded-full animate-float"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-red-500/20 blur-3xl rounded-full animate-float" style={{ animationDelay: '-2s' }}></div>
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-amber-500/10 blur-3xl rounded-full animate-float" style={{ animationDelay: '-4s' }}></div>
      </div>

      {/* Content */}
      <div className={`relative z-10 text-center px-6 max-w-3xl transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        
        {/* Logo/Title */}
        <div className="mb-8 inline-block">
          <h1 className="text-5xl sm:text-7xl font-bold bg-gradient-to-r from-pink-400 via-red-400 to-yellow-400 bg-clip-text text-transparent animate-pulse">
            🎬 K-DRAMA <span className="text-amber-300">HUB</span>
          </h1>
        </div>

        {/* Subtitle */}
        <p className="text-lg sm:text-2xl text-pink-200 mb-4 font-light tracking-wide">
          Watch Together. Chat Forever.
        </p>
        <p className="text-sm sm:text-base text-gray-300 mb-12 max-w-xl mx-auto leading-relaxed">
          💕 Join lovers and friends watching the same K-dramas in real-time. Chat, sync, and experience stories together on every device.
        </p>

        {/* Main CTA Card */}
        <div className="bg-gradient-to-br from-pink-500/10 via-red-500/10 to-amber-500/10 backdrop-blur-2xl border-2 border-pink-400/40 rounded-4xl p-12 shadow-2xl hover:shadow-pink-600/50 transition-all duration-500 group mb-8">
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-white mb-3">Ready to Connect?</h2>
              <p className="text-gray-200 text-lg">Choose an option to get started</p>
            </div>

            {/* Two Button Layout */}
            <div className="grid sm:grid-cols-2 gap-4">
              {/* Login Button */}
              <Link
                to="/login"
                className="group/btn relative px-8 py-5 rounded-2xl bg-gradient-to-r from-red-600 to-pink-600 text-white font-bold text-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-red-600/50"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-red-600 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                <span className="relative flex items-center justify-center gap-3">
                  🎭 Login
                </span>
              </Link>

              {/* Create Account Button */}
              <Link
                to="/register"
                className="group/btn relative px-8 py-5 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-bold text-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-amber-600/50"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-600 to-amber-600 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                <span className="relative flex items-center justify-center gap-3">
                  ✨ Join Now
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-3 gap-4 mt-12">
          <div className="bg-red-600/20 backdrop-blur border border-red-500/30 rounded-2xl p-6 hover:bg-red-600/30 transition-all">
            <div className="text-4xl mb-3">👥</div>
            <h3 className="text-white font-bold mb-2">Watch Together</h3>
            <p className="text-gray-300 text-sm">Sync with friends & lovers</p>
          </div>

          <div className="bg-pink-600/20 backdrop-blur border border-pink-500/30 rounded-2xl p-6 hover:bg-pink-600/30 transition-all">
            <div className="text-4xl mb-3">💬</div>
            <h3 className="text-white font-bold mb-2">Live Chat</h3>
            <p className="text-gray-300 text-sm">Share reactions in real-time</p>
          </div>

          <div className="bg-amber-600/20 backdrop-blur border border-amber-500/30 rounded-2xl p-6 hover:bg-amber-600/30 transition-all">
            <div className="text-4xl mb-3">📱</div>
            <h3 className="text-white font-bold mb-2">Any Device</h3>
            <p className="text-gray-300 text-sm">Watch on phone, tablet, or TV</p>
          </div>
        </div>

        {/* Why Join Section */}
        <div className="mt-16 space-y-4 text-left max-w-2xl mx-auto">
          <h3 className="text-2xl font-bold text-white text-center mb-6">Why Join K-Drama Hub?</h3>
          
          <div className="flex items-start gap-4">
            <div className="text-2xl mt-1">💖</div>
            <div>
              <h4 className="font-bold text-white">Connect with Your Favorites</h4>
              <p className="text-gray-300 text-sm">Create private watch parties with the people you love</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="text-2xl mt-1">🎭</div>
            <div>
              <h4 className="font-bold text-white">Massive Library</h4>
              <p className="text-gray-300 text-sm">Access hundreds of K-dramas from trending hits to hidden gems</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="text-2xl mt-1">⚡</div>
            <div>
              <h4 className="font-bold text-white">Perfectly Synced</h4>
              <p className="text-gray-300 text-sm">Everyone watches at the same time with automatic playback sync</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="text-2xl mt-1">🌍</div>
            <div>
              <h4 className="font-bold text-white">Global Community</h4>
              <p className="text-gray-300 text-sm">Join millions of K-drama fans around the world</p>
            </div>
          </div>
        </div>

        {/* Footer Quote */}
        <div className="mt-16 italic text-gray-300 text-lg">
          "Every drama is better when watched with the ones you love" 💕
        </div>
      </div>
    </div>
  );
}
