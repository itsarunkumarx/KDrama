import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';

export default function ChatBox({ socket, roomId }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [users, setUsers] = useState([]);
  const [tab, setTab] = useState('chat');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const endRef = useRef(null);

  const emojis = ['😂', '😍', '😢', '🔥', '😡', '🤩', '💔', '✨', '👏', '🎉'];

  useEffect(() => {
    if (!socket) return;
    socket.on('new-message', (msg) => {
      setMessages(prev => [...prev, msg]);
    });
    socket.on('room-update', (room) => {
      setUsers(room.users || []);
      setMessages(room.messages || []);
    });
    return () => {
      socket.off('new-message');
      socket.off('room-update');
    };
  }, [socket]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = (e) => {
    e.preventDefault();
    if (!input.trim() || !socket) return;
    socket.emit('chat-message', {
      roomId,
      message: input.trim(),
      user: { name: user.name, role: user.role, userId: user._id }
    });
    setInput('');
  };

  const addEmoji = (emoji) => {
    setInput(input + emoji);
    setShowEmojiPicker(false);
  };

  const formatTime = (iso) => {
    const d = new Date(iso);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const roleColor = (role) =>
    'text-pink-300';

  const roleBg = (role) =>
    'bg-red-600/20';

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-slate-900/80 to-black/80 backdrop-blur-2xl rounded-2xl overflow-hidden border border-pink-500/20">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-pink-500/20 shrink-0 bg-gradient-to-r from-red-950/40 to-pink-950/40">
        <div>
          <h3 className="text-white font-bold text-sm tracking-wide">💬 Live Chat</h3>
          <p className="text-gray-400 text-xs mt-1">Watch party discussion</p>
        </div>
        <div className="flex items-center gap-2 bg-green-600/20 px-3 py-1.5 rounded-full border border-green-500/30">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-green-300 text-xs font-bold">{users.length} watching</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-pink-500/20 shrink-0 bg-black/40">
        {['chat', 'viewers'].map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-all duration-300 relative ${
              tab === t 
                ? 'text-white' 
                : 'text-gray-400 hover:text-gray-300'
            }`}>
            {tab === t && <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-500 to-red-500"></div>}
            {t === 'chat' ? `💬 Chat (${messages.length})` : `👥 Viewers (${users.length})`}
          </button>
        ))}
      </div>

      {/* Chat Messages */}
      {tab === 'chat' && (
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 min-h-0 scrollbar-thin scrollbar-thumb-red-600/40 scrollbar-track-transparent">
          {messages.length === 0 && (
            <div className="text-center text-gray-400 py-12">
              <div className="text-5xl mb-3">💭</div>
              <p className="font-semibold">Be the first to chat!</p>
              <p className="text-xs mt-1">Share your thoughts about this drama</p>
            </div>
          )}
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex gap-3 animate-slide-up ${msg.user?.userId === user._id ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center text-xs font-bold text-white ${roleBg(msg.user?.role)} border border-white/20`}>
                {msg.user?.name?.[0]?.toUpperCase()}
              </div>
              <div className={`max-w-xs ${msg.user?.userId === user._id ? 'items-end' : 'items-start'} flex flex-col`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs font-bold ${roleColor(msg.user?.role)}`}>{msg.user?.name}</span>
                  <span className="text-gray-500 text-xs">{formatTime(msg.time)}</span>
                </div>
                <div className={`text-sm px-4 py-2.5 rounded-2xl leading-relaxed font-medium backdrop-blur transition-all hover:shadow-lg ${
                  msg.user?.userId === user._id
                    ? 'bg-gradient-to-r from-pink-600/80 to-red-600/80 text-white rounded-tr-none border border-pink-400/30'
                    : 'bg-white/10 text-gray-100 rounded-tl-none border border-white/20 hover:bg-white/15'
                }`}>
                  {msg.message}
                </div>
              </div>
            </div>
          ))}
          <div ref={endRef} />
        </div>
      )}

      {/* Viewers List */}
      {tab === 'viewers' && (
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2 min-h-0">
          {users.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              <p className="text-sm">No viewers yet</p>
            </div>
          ) : (
            users.map((u, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all border border-white/10">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white ${roleBg(u.role)} border border-white/20`}>
                  {u.name?.[0]?.toUpperCase()}
                </div>
                <div className="flex-1">
                  <p className="text-white text-sm font-semibold">{u.name}</p>
                  <p className={`text-xs font-bold ${roleColor(u.role)}`}>👤 Viewer</p>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-xs text-green-400 font-bold">Online</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Input */}
      <form onSubmit={send} className="p-4 border-t border-pink-500/20 shrink-0 bg-black/40 space-y-3">
        {/* Emoji Picker */}
        {showEmojiPicker && (
          <div className="flex gap-1.5 p-2 rounded-xl bg-white/5 border border-white/20 animate-slide-up">
            {emojis.map(emoji => (
              <button
                key={emoji}
                type="button"
                onClick={() => addEmoji(emoji)}
                className="text-lg hover:scale-125 transition-transform duration-200 hover:bg-white/10 p-1.5 rounded-lg"
              >
                {emoji}
              </button>
            ))}
          </div>
        )}

        <div className="flex gap-2 items-center">
          <button
            type="button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="text-xl hover:scale-110 transition-transform hover:bg-white/10 p-2 rounded-lg"
          >
            😊
          </button>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Share your thoughts..."
            className="flex-1 bg-white/10 border border-white/20 text-white placeholder-gray-400 text-sm px-4 py-2.5 rounded-xl focus:outline-none focus:border-pink-500/50 focus:bg-white/15 transition-all"
            maxLength={300}
          />
          <button 
            type="submit" 
            disabled={!input.trim()}
            className="px-4 py-2.5 bg-gradient-to-r from-pink-600 to-red-600 text-white font-bold rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-red-600/50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <span>💫 Send</span>
          </button>
        </div>
      </form>
    </div>
  );
}
