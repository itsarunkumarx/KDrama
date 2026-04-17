import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setErr(''); setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/');
    } catch (e) {
      setErr(e.response?.data?.message || '❌ Login failed');
    } finally { setLoading(false); }
  };

  const handleTraktLogin = async () => {
    try {
      const res = await axios.get('/api/trakt/login');
      window.location.href = res.data.url;
    } catch (err) {
      setErr('Trakt login failed to initialize');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Premium Background - Pink/Red/Gold Theme */}
      <div className="absolute inset-0">
        {/* Gradient Base */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-950 via-kdark to-black" />
        
        {/* Romantic Light Beams - Pink/Red/Gold */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute -top-1/2 left-0 w-96 h-96 bg-red-600/25 rounded-full blur-3xl animate-float" />
          <div className="absolute -bottom-1/2 right-0 w-96 h-96 bg-pink-600/20 rounded-full blur-3xl animate-float" style={{animationDelay:'1.5s'}} />
          <div className="absolute top-1/3 -left-1/4 w-80 h-80 bg-yellow-500/15 rounded-full blur-3xl animate-float" style={{animationDelay:'3s'}} />
        </div>

        {/* Animated movie reel */}
        <div className="absolute top-10 right-10 w-20 h-20 rounded-full border-2 border-red-600/20 flex items-center justify-center text-4xl animate-spin opacity-20">
          🎬
        </div>

        {/* Film grain overlay */}
        <div className="absolute inset-0 opacity-20 mix-blend-multiply" style={{backgroundImage: 'url(data:image/svg+xml,%3Csvg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noise"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4"/%3E%3C/filter%3E%3Crect width="100%25" height="100%25" filter="url(%23noise)"/%3E%3C/svg%3E)'}} />
      </div>

      <div className="relative z-10 w-full max-w-md mx-4 animate-slide-up">
        {/* Logo Section - Cute Pink/Red/Gold */}
        <div className="text-center mb-12 animate-bounce-in">
          <div className="inline-flex items-center gap-3 mb-4 transform hover:scale-105 transition-transform">
            <div className="relative">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-rose-500 via-red-600 to-pink-600 flex items-center justify-center text-5xl shadow-2xl border-2 border-yellow-400/50">
                🎬
              </div>
              <div className="absolute inset-0 w-20 h-20 rounded-3xl bg-red-600/50 blur-2xl animate-pulse" />
              {/* Gold accents */}
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full blur-sm animate-pulse" />
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="bg-gradient-to-r from-rose-400 via-red-500 to-pink-600 bg-clip-text text-transparent font-display text-5xl tracking-widest font-black">KDRAMA</span>
                <span className="text-yellow-400 font-display text-5xl font-black">X</span>
              </div>
              <p className="text-red-300 text-xs font-bold tracking-widest mt-1">💖 PREMIUM EXPERIENCE</p>
            </div>
          </div>
          <p className="text-gray-300 text-sm tracking-wide font-medium">Sign In to Your Sweet World</p>
        </div>

        {/* Premium Glass Card - Pink/Red Theme */}
        <div className="glass rounded-4xl p-10 border-2 border-red-500/40 shadow-2xl backdrop-blur-xl relative overflow-hidden group">
          {/* Animated gradient border on hover */}
          <div className="absolute inset-0 rounded-4xl bg-gradient-to-r from-red-500/20 via-pink-600/20 to-yellow-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          {/* Cute corner accent */}
          <div className="absolute -top-1 -right-1 w-24 h-24 border-t-4 border-r-4 border-red-500/30 rounded-br-4xl" />
          <div className="absolute -bottom-1 -left-1 w-20 h-20 border-b-4 border-l-4 border-yellow-400/30 rounded-tr-4xl" />
          
          <div className="relative">
            <div className="mb-8">
              <h2 className="text-white text-4xl font-black mb-2 tracking-tight">Welcome Back! 💕</h2>
              <p className="text-pink-200 text-sm font-semibold">Your K-drama adventure awaits</p>
            </div>

            {/* Error Message - Premium Pink/Red Style */}
            {err && (
              <div className="mb-6 p-4 bg-gradient-to-r from-red-600/30 to-pink-600/30 border-l-4 border-red-500 rounded-xl text-red-100 text-sm animate-slide-up backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🚨</span>
                  <span className="font-bold">{err}</span>
                </div>
              </div>
            )}

            <form onSubmit={submit} className="space-y-6">
              {/* Email Field - Cute Pink/Red */}
              <div className="group/field">
                <label className="text-rose-200 text-xs font-bold mb-2.5 block uppercase tracking-widest">
                  Email Address
                </label>
                <div className={`relative transition-all duration-300 ${focusedField === 'email' ? 'scale-105' : ''}`}>
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-pink-500/10 group-focus-within/field:from-red-500/20 group-focus-within/field:to-pink-500/20 rounded-2xl transition-all" />
                  <input 
                    type="email" 
                    value={form.email} 
                    onChange={e => setForm({...form, email: e.target.value})}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="your@email.com" 
                    className="relative w-full py-4 px-14 text-base text-white placeholder-gray-400 bg-white/5 border-2 border-red-500/30 rounded-2xl focus:border-red-500 focus:outline-none transition-all duration-300 backdrop-blur-sm" 
                    required 
                  />
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-red-400 group-focus-within/field:text-red-300 transition-colors text-2xl">
                    ✉️
                  </span>
                </div>
              </div>

              {/* Password Field - Cute Pink/Red */}
              <div className="group/field">
                <label className="text-rose-200 text-xs font-bold mb-2.5 block uppercase tracking-widest">
                  Password
                </label>
                <div className={`relative transition-all duration-300 ${focusedField === 'password' ? 'scale-105' : ''}`}>
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-pink-500/10 group-focus-within/field:from-red-500/20 group-focus-within/field:to-pink-500/20 rounded-2xl transition-all" />
                  <input 
                    type={showPassword ? 'text' : 'password'}
                    value={form.password} 
                    onChange={e => setForm({...form, password: e.target.value})}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="••••••••" 
                    className="relative w-full py-4 px-14 text-base text-white placeholder-gray-400 bg-white/5 border-2 border-red-500/30 rounded-2xl focus:border-red-500 focus:outline-none transition-all duration-300 backdrop-blur-sm" 
                    required 
                  />
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-red-400 group-focus-within/field:text-red-300 transition-colors text-2xl">
                    🔒
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-300 transition-colors text-2xl"
                  >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
              </div>

              {/* Sign In Button - Pink/Red/Gold */}
              <button 
                type="submit" 
                disabled={loading} 
                className="w-full py-4 text-base font-bold mt-8 rounded-2xl transition-all duration-300 hover:scale-105 disabled:scale-100 disabled:opacity-70 bg-gradient-to-r from-red-600 via-rose-600 to-pink-600 text-white hover:from-red-500 hover:via-rose-500 hover:to-pink-500 hover:shadow-2xl hover:shadow-red-600/70 uppercase tracking-widest flex items-center justify-center gap-2 group relative overflow-hidden border-2 border-red-400/50"
              >
                <span className="relative z-10 font-black">{loading ? '⏳ Signing In...' : '🔥 Sign In Now'}</span>
                {!loading && <span className="relative z-10 group-hover:translate-x-1 transition-transform text-xl">→</span>}
              </button>
            </form>

            {/* Divider - Gold */}
            <div className="mt-8 flex items-center gap-4">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-yellow-600/30 to-transparent" />
              <span className="text-gray-400 text-xs font-bold">OR</span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-yellow-600/30 to-transparent" />
            </div>

            {/* Trakt Login Button */}
            <button 
              type="button"
              onClick={handleTraktLogin}
              className="mt-6 w-full py-4 text-sm font-bold rounded-2xl flex items-center justify-center gap-2 border-2 border-red-500/50 bg-red-500/10 text-white hover:bg-red-500/20 hover:border-red-500/80 transition-all duration-300 hover:scale-105 uppercase tracking-wide"
            >
              <span className="text-2xl animate-pulse">🎬</span>
              Login with Trakt
            </button>

            {/* Favorite Access Link */}
            <Link 
              to="/favorite-login"
              className="mt-6 w-full py-4 text-sm font-bold rounded-2xl flex items-center justify-center gap-2 border-2 border-yellow-500/50 bg-yellow-500/10 text-yellow-300 hover:bg-yellow-500/20 hover:border-yellow-500/80 transition-all duration-300 hover:scale-105 uppercase tracking-wide group/fav"
            >
              <span className="text-2xl group-hover/fav:animate-spin transition-transform">💎</span>
              Exclusive VIP Access
            </Link>

            {/* Register Link */}
            <p className="text-center text-gray-400 text-sm mt-8">
              New to KDramaX?{' '}
              <Link to="/register" className="text-red-400 hover:text-red-300 font-bold transition-colors hover:underline">
                Create Free Account
              </Link>
            </p>

            {/* Back to Entry */}
            <p className="text-center text-gray-500 text-xs mt-4">
              <Link to="/entry" className="hover:text-gray-300 transition-colors font-semibold">
                ← Back to Options
              </Link>
            </p>
          </div>
        </div>

        {/* Bottom Features - Pink/Red Theme */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center opacity-70">
          <div className="text-center">
            <div className="text-3xl mb-2">🎬</div>
            <p className="text-xs text-gray-300 font-semibold">500+ Dramas</p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-2">👫</div>
            <p className="text-xs text-gray-300 font-semibold">Watch Party</p>
          </div>
          <div className="text-center">
            <div className="text-xl mb-1">🔥</div>
            <p className="text-xs text-gray-400">Premium UI</p>
          </div>
        </div>
      </div>
    </div>
  );
}
