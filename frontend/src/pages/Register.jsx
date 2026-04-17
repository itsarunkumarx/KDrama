import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [step, setStep] = useState(1);

  const submit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) return setErr('❌ Passwords do not match');
    if (form.password.length < 6) return setErr('❌ Password must be at least 6 characters');
    setErr(''); setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      navigate('/');
    } catch (e) {
      setErr(e.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  const f = (field) => (e) => setForm({...form, [field]: e.target.value});

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Animated Background - Pink/Red/Gold Theme */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-950 via-kdark to-red-950" />
        
        {/* Animated orbs - Pink/Red/Gold theme */}
        <div className="absolute top-0 -left-40 w-96 h-96 bg-red-600/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-0 -right-40 w-80 h-80 bg-pink-600/20 rounded-full blur-3xl animate-float" style={{animationDelay:'2s'}} />
        <div className="absolute top-1/2 left-1/3 w-72 h-72 bg-yellow-600/15 rounded-full blur-3xl animate-float" style={{animationDelay:'4s'}} />
        
        {/* Animated particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div 
              key={i}
              className="absolute w-1 h-1 bg-red-400/30 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float 5s ease-in-out infinite`,
                animationDelay: `${i * 0.2}s`
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative z-10 w-full max-w-md mx-4">
        {/* Logo Section */}
        <div className="text-center mb-8 animate-bounce-in">
          <Link to="/entry" className="inline-flex items-center gap-3 mb-4 hover:opacity-80 transition-opacity">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-rose-500 via-red-600 to-pink-600 flex items-center justify-center text-4xl shadow-lg border-2 border-yellow-400/50">
              ✨
            </div>
            <div>
              <div className="flex items-baseline gap-1">
                <span className="bg-gradient-to-r from-rose-400 via-red-500 to-pink-600 bg-clip-text text-transparent font-display text-5xl tracking-widest font-black">KDRAMA</span>
                <span className="text-yellow-400 font-display text-5xl font-black">X</span>
              </div>
              <p className="text-pink-300 text-xs font-bold tracking-widest">Join the Community</p>
            </div>
          </Link>
        </div>

        {/* Glass Card - Pink/Red Theme */}
        <div className="glass rounded-4xl p-9 border-2 border-red-500/40 shadow-2xl backdrop-blur-xl relative overflow-hidden group">
          {/* Gradient border effect */}
          <div className="absolute inset-0 rounded-4xl bg-gradient-to-r from-red-500/10 via-pink-600/10 to-yellow-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Cute corner accents */}
          <div className="absolute -top-1 -right-1 w-24 h-24 border-t-4 border-r-4 border-red-500/30 rounded-br-4xl" />
          <div className="absolute -bottom-1 -left-1 w-20 h-20 border-b-4 border-l-4 border-yellow-400/30 rounded-tr-4xl" />
          
          <div className="relative">
            {/* Progress indicator - Pink/Red */}
            <div className="mb-6 flex gap-2">
              <div className={`h-2 flex-1 rounded-full transition-all ${step >= 1 ? 'bg-gradient-to-r from-red-500 to-pink-500' : 'bg-white/10'}`} />
              <div className={`h-2 flex-1 rounded-full transition-all ${step >= 2 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' : 'bg-white/10'}`} />
            </div>

            <div className="mb-8">
              {step === 1 ? (
                <>
                  <h2 className="text-white text-4xl font-black mb-2 tracking-tight">Welcome! 💕</h2>
                  <p className="text-pink-200 text-sm font-semibold">Let's start your K-drama journey</p>
                </>
              ) : (
                <>
                  <h2 className="text-white text-4xl font-black mb-2 tracking-tight">Secure Account 🔐</h2>
                  <p className="text-pink-200 text-sm font-semibold">Create a strong password</p>
                </>
              )}
            </div>

            {/* Error Message */}
            {err && (
              <div className="mb-6 p-4 bg-gradient-to-r from-red-600/30 to-pink-600/30 border border-red-500/50 rounded-2xl text-red-100 text-sm animate-slide-up">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">⚠️</span>
                  <span className="font-bold">{err}</span>
                </div>
              </div>
            )}

            <form onSubmit={submit} className="space-y-5">
              {/* Step 1: Name & Email */}
              {step === 1 && (
                <>
                  <div className="group">
                    <label className="text-rose-200 text-xs font-bold mb-2 block uppercase tracking-widest">
                      Full Name
                    </label>
                    <div className={`relative transition-all ${focusedField === 'name' ? 'scale-105' : ''}`}>
                      <input 
                        type="text"
                        value={form.name} 
                        onChange={f('name')}
                        onFocus={() => setFocusedField('name')}
                        onBlur={() => setFocusedField(null)}
                        placeholder="Your name" 
                        className="w-full py-4 px-14 text-white placeholder-gray-400 bg-white/5 border-2 border-red-500/30 rounded-2xl focus:border-red-500 focus:outline-none transition-all duration-300 backdrop-blur-sm" 
                        required 
                      />
                      <span className="absolute left-5 top-1/2 -translate-y-1/2 text-red-400 group-focus-within:text-red-300 transition-colors text-2xl">
                        👤
                      </span>
                    </div>
                  </div>

                  <div className="group">
                    <label className="text-rose-200 text-xs font-bold mb-2 block uppercase tracking-widest">
                      Email Address
                    </label>
                    <div className={`relative transition-all ${focusedField === 'email' ? 'scale-105' : ''}`}>
                      <input 
                        type="email"
                        value={form.email} 
                        onChange={f('email')}
                        onFocus={() => setFocusedField('email')}
                        onBlur={() => setFocusedField(null)}
                        placeholder="you@example.com" 
                        className="w-full py-4 px-14 text-white placeholder-gray-400 bg-white/5 border-2 border-red-500/30 rounded-2xl focus:border-red-500 focus:outline-none transition-all duration-300 backdrop-blur-sm" 
                        required 
                      />
                      <span className="absolute left-5 top-1/2 -translate-y-1/2 text-red-400 group-focus-within:text-red-300 transition-colors text-2xl">
                        ✉️
                      </span>
                    </div>
                  </div>

                  <button 
                    type="button"
                    onClick={() => {
                      if (form.name && form.email) setStep(2);
                    }}
                    disabled={!form.name || !form.email}
                    className="w-full py-4 text-base mt-6 font-black tracking-widest rounded-2xl transition-all duration-300 hover:scale-105 disabled:scale-100 disabled:opacity-50 bg-gradient-to-r from-red-600 via-rose-600 to-pink-600 text-white hover:from-red-500 hover:via-rose-500 hover:to-pink-500 flex items-center justify-center gap-2 border-2 border-red-400/50"
                  >
                    Continue 🎬 → 
                  </button>
                </>
              )}

              {/* Step 2: Password - Gold Accent */}
              {step === 2 && (
                <>
                  <div className="group">
                    <label className="text-yellow-200 text-xs font-bold mb-2 block uppercase tracking-widest">
                      Password
                    </label>
                    <div className={`relative transition-all ${focusedField === 'password' ? 'scale-105' : ''}`}>
                      <input 
                        type="password"
                        value={form.password} 
                        onChange={f('password')}
                        onFocus={() => setFocusedField('password')}
                        onBlur={() => setFocusedField(null)}
                        placeholder="••••••••" 
                        className="w-full py-4 px-14 text-white placeholder-gray-400 bg-white/5 border-2 border-yellow-500/30 rounded-2xl focus:border-yellow-500 focus:outline-none transition-all duration-300 backdrop-blur-sm" 
                        required 
                      />
                      <span className="absolute left-5 top-1/2 -translate-y-1/2 text-yellow-400 group-focus-within:text-yellow-300 transition-colors text-2xl">
                        🔒
                      </span>
                    </div>
                  </div>

                  <div className="group">
                    <label className="text-yellow-200 text-xs font-bold mb-2 block uppercase tracking-widest">
                      Confirm Password
                    </label>
                    <div className={`relative transition-all ${focusedField === 'confirm' ? 'scale-105' : ''}`}>
                      <input 
                        type="password"
                        value={form.confirm} 
                        onChange={f('confirm')}
                        onFocus={() => setFocusedField('confirm')}
                        onBlur={() => setFocusedField(null)}
                        placeholder="••••••••" 
                        className="w-full py-4 px-14 text-white placeholder-gray-400 bg-white/5 border-2 border-yellow-500/30 rounded-2xl focus:border-yellow-500 focus:outline-none transition-all duration-300 backdrop-blur-sm" 
                        required 
                      />
                      <span className="absolute left-5 top-1/2 -translate-y-1/2 text-yellow-400 group-focus-within:text-yellow-300 transition-colors text-2xl">
                        🔐
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-6">
                    <button 
                      type="button"
                      onClick={() => setStep(1)}
                      className="flex-1 py-4 text-base font-bold rounded-2xl bg-white/10 text-white hover:bg-white/20 transition-all border-2 border-white/20"
                    >
                      ← Back
                    </button>
                    <button 
                      type="submit"
                      disabled={loading} 
                      className="flex-1 py-4 text-base font-black rounded-2xl bg-gradient-to-r from-yellow-600 via-orange-600 to-yellow-600 text-white hover:from-yellow-500 hover:via-orange-500 hover:to-yellow-500 transition-all disabled:opacity-70 flex items-center justify-center gap-2 border-2 border-yellow-400/50"
                    >
                      <span>{loading ? '⏳ Creating...' : '🎉 Create Account'}</span>
                    </button>
                  </div>
                </>
              )}
            </form>

            {/* Sign In Link */}
            <p className="text-center text-gray-400 text-sm mt-8">
              Already have an account?{' '}
              <Link to="/login" className="text-red-400 hover:text-red-300 font-bold transition-colors hover:underline">
                Sign in here
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

        {/* Footer Text */}
        <p className="text-center text-gray-400 text-xs mt-6 font-semibold">
          Secure, fast, and beautiful! Join us now 💖
        </p>
      </div>
    </div>
  );
}
