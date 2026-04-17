import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user, logout } = useAuth();
  const roleColors = {
    admin: { bg: 'bg-yellow-600/20', text: 'text-yellow-400', label: '👑 Admin', icon: '⚡' },
    favorite: { bg: 'bg-purple-600/20', text: 'text-purple-400', label: '💎 Friend', icon: '✨' },
    user: { bg: 'bg-pink-600/20', text: 'text-pink-300', label: '👤 User', icon: '💕' },
  };
  const rc = roleColors[user?.role] || roleColors.user;

  return (
    <div className="pt-20 min-h-screen px-4 pb-20 bg-gradient-to-b from-slate-950 via-black to-slate-950">
      <div className="max-w-3xl mx-auto animate-fade-in space-y-8">
        
        {/* Profile Card - Main */}
        <div className="bg-gradient-to-br from-pink-600/20 to-red-600/20 backdrop-blur border-2 border-pink-500/40 rounded-4xl p-10 overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 via-red-600/10 to-amber-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          {/* Cute corner accents */}
          <div className="absolute -top-1 -right-1 w-24 h-24 border-t-4 border-r-4 border-pink-500/30 rounded-bl-4xl" />
          <div className="absolute -bottom-1 -left-1 w-20 h-20 border-b-4 border-l-4 border-amber-400/30 rounded-tr-4xl" />
          
          <div className="relative">
            {/* Avatar Section */}
            <div className="flex flex-col sm:flex-row items-center gap-8 mb-10">
              <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-pink-500 via-red-600 to-rose-700 flex items-center justify-center text-white text-5xl font-black shadow-2xl border-4 border-pink-400/50 flex-shrink-0 group-hover:scale-110 transition-transform">
                {user?.name?.split(' ').map(n=>n[0]).join('').toUpperCase().slice(0,2) || '👥'}
              </div>
              
              <div className="text-center sm:text-left">
                <h1 className="text-white text-4xl font-black mb-2 tracking-tight">{user?.name}</h1>
                <p className="text-gray-400 text-lg mb-4">{user?.email}</p>
                <div className={`inline-block px-6 py-2 rounded-full text-sm font-bold ${rc.bg} ${rc.text} border border-current/30`}>
                  <span className="mr-2">{rc.icon}</span>{rc.label}
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4 mb-10 pt-10 border-t border-white/10">
              <div className="text-center">
                <div className="text-3xl font-black text-pink-400 mb-1">🎬</div>
                <p className="text-gray-400 text-xs font-bold">DRAMAS WATCHED</p>
                <p className="text-white text-xl font-bold mt-1">12+</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-black text-red-400 mb-1">👥</div>
                <p className="text-gray-400 text-xs font-bold">WATCH PARTIES</p>
                <p className="text-white text-xl font-bold mt-1">5+</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-black text-amber-400 mb-1">⭐</div>
                <p className="text-gray-400 text-xs font-bold">FAVORITES</p>
                <p className="text-white text-xl font-bold mt-1">8+</p>
              </div>
            </div>
          </div>
        </div>

        {/* Account Details Card */}
        <div className="bg-white/5 backdrop-blur border border-white/10 rounded-3xl p-8">
          <h2 className="text-white text-2xl font-bold mb-6 flex items-center gap-3">
            <span className="text-2xl">📋</span> Account Details
          </h2>
          <div className="space-y-4">
            {[
              { label: 'Email Address', value: user?.email, icon: '✉️' },
              { label: 'Member Since', value: user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A', icon: '📅' },
              { label: 'Account Status', value: 'Active & Verified', icon: '✅' },
              { label: 'Account Type', value: user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1) || 'User', icon: rc.icon },
            ].map(({ label, value, icon }) => (
              <div key={label} className="flex items-center justify-between py-4 px-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all border border-white/10">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{icon}</span>
                  <span className="text-gray-300 font-semibold">{label}</span>
                </div>
                <span className="text-white font-bold">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Features Card */}
        <div className="bg-white/5 backdrop-blur border border-white/10 rounded-3xl p-8">
          <h2 className="text-white text-2xl font-bold mb-6 flex items-center gap-3">
            <span className="text-2xl">⚡</span> Your Features
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { emoji: '🎬', title: 'Watch K-Dramas', desc: 'Access to full drama library' },
              { emoji: '👥', title: 'Watch Parties', desc: 'Sync watch with friends' },
              { emoji: '💬', title: 'Live Chat', desc: 'Comment while watching' },
              { emoji: '🔍', title: 'Search & Filter', desc: 'Find your perfect drama' },
            ].map(({ emoji, title, desc }) => (
              <div key={title} className="p-4 bg-gradient-to-br from-pink-600/10 to-red-600/10 border border-pink-500/30 rounded-xl hover:border-pink-500/60 transition-all">
                <div className="text-2xl mb-2">{emoji}</div>
                <p className="text-white font-bold">{title}</p>
                <p className="text-gray-400 text-sm mt-1">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Sign Out Button */}
        <button 
          onClick={logout}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-pink-600 to-red-600 hover:from-pink-500 hover:to-red-500 text-white font-bold text-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-red-600/50 flex items-center justify-center gap-3"
        >
          <span className="text-2xl">🚪</span>
          <span>Sign Out From Your Account</span>
        </button>

        {/* Footer Info */}
        <div className="text-center text-gray-500 text-sm space-y-2">
          <p>💕 Thank you for being part of our K-drama community</p>
          <p className="text-xs">Last login: Just now</p>
        </div>
      </div>
    </div>
  );
}
