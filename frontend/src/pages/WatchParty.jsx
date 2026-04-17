import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';
import VideoPlayer from '../components/VideoPlayer';
import ChatBox from '../components/ChatBox';
import api from '../api/backend';
import { dramas } from '../api/tmdb';

export default function WatchParty() {
  const { roomId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [socket, setSocket] = useState(null);
  const [room, setRoom] = useState(null);
  const [drama, setDrama] = useState(null);
  const [videos, setVideos] = useState([]);
  const [activeVideo, setActiveVideo] = useState(null);
  const [syncState, setSyncState] = useState(null);
  const [connected, setConnected] = useState(false);
  const [copied, setCopied] = useState(false);
  const isHost = room?.host?.userId?.toString() === user?._id?.toString();

  useEffect(() => {
    const sock = io(window.location.origin);
    setSocket(sock);

    sock.on('connect', () => {
      setConnected(true);
      sock.emit('join-room', {
        roomId,
        user: { userId: user._id, name: user.name, role: user.role }
      });
    });

    sock.on('video-state', (state) => {
      setSyncState(state);
    });

    sock.on('disconnect', () => setConnected(false));

    return () => sock.disconnect();
  }, [roomId]);

  useEffect(() => {
    api.get(`/rooms/${roomId}`)
      .then(r => {
        setRoom(r.data.room);
        return dramas.detail(r.data.room.dramaId);
      })
      .then(d => {
        setDrama(d.data);
        return dramas.videos(d.data.id);
      })
      .then(v => {
        const vids = v.data.results || [];
        setVideos(vids);
        const main = vids.find(x => x.type === 'Trailer' && x.site === 'YouTube') || vids.find(x => x.site === 'YouTube');
        setActiveVideo(main);
      })
      .catch(e => {
        console.error(e);
        alert('Room not found!');
        navigate('/');
      });
  }, [roomId]);

  const handleVideoSync = (state) => {
    if (!socket || !isHost) return;
    socket.emit('video-sync', { roomId, state, user: { name: user.name } });
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!room) return (
    <div className="min-h-screen pt-16 flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-2 border-kred border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-kgray">Joining watch party...</p>
      </div>
    </div>
  );

  return (
    <div className="pt-16 min-h-screen animate-fade-in">
      {/* Room Header */}
      <div className="bg-gradient-to-r from-red-950/40 via-pink-950/40 to-red-950/40 backdrop-blur-xl border-b border-pink-500/20 px-4 sm:px-8 py-4">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <div className={`w-3 h-3 rounded-full ${connected ? 'bg-green-400 animate-pulse' : 'bg-red-500'}`} />
            <div className="flex items-center gap-2">
              <span className="text-white font-bold text-lg">{drama?.name || 'Watch Party'}</span>
              {isHost && <span className="bg-gradient-to-r from-pink-600 to-red-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">👑 HOST</span>}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={copyLink} 
              className="group relative bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-gray-900 font-bold text-sm px-4 py-2 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center gap-2"
            >
              {copied ? '✅ Copied!' : '🔗 Invite Friends'}
            </button>
            <button 
              onClick={() => navigate('/')} 
              className="text-gray-300 hover:text-white text-sm font-bold transition-colors px-3 py-2 rounded-lg hover:bg-white/10"
            >
              ✕ Exit
            </button>
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 py-6">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6" style={{height: 'calc(100vh - 200px)'}}>
          {/* Video Side */}
          <div className="xl:col-span-3 flex flex-col gap-4 min-h-0">
            <VideoPlayer
              videoId={activeVideo?.key}
              dramaTitle={drama?.name}
              onStateChange={handleVideoSync}
              syncState={syncState}
              isHost={isHost}
            />

            {/* Video selector */}
            {videos.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {videos.filter(v => v.site === 'YouTube').map(v => (
                  <button key={v.id} onClick={() => setActiveVideo(v)}
                    className={`shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all transform hover:scale-105 ${
                      activeVideo?.id === v.id 
                        ? 'bg-gradient-to-r from-pink-600 to-red-600 text-white shadow-lg' 
                        : 'bg-white/10 text-gray-200 hover:bg-white/20'
                    }`}
                  >
                    {v.type === 'Trailer' ? '🎬' : '▶️'} {v.name?.substring(0, 25)}
                  </button>
                ))}
              </div>
            )}

            {/* Status Messages */}
            {!isHost && (
              <div className="p-4 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border border-blue-500/30 rounded-xl text-blue-200 text-sm font-semibold text-center">
                <div className="flex items-center justify-center gap-2">
                  <span className="animate-pulse">🎬</span>
                  <span>Video is synced! Enjoy watching together! 💕</span>
                </div>
              </div>
            )}
            {isHost && (
              <div className="p-4 bg-gradient-to-r from-pink-600/20 to-red-600/20 border border-pink-500/30 rounded-xl text-pink-200 text-sm font-semibold text-center">
                <div className="flex items-center justify-center gap-2">
                  <span>👑</span>
                  <span>You control the sync! Play/Pause controls all viewers.</span>
                </div>
              </div>
            )}
          </div>

          {/* Chat Side */}
          <div className="xl:col-span-1 min-h-[500px] xl:min-h-0">
            <ChatBox socket={socket} roomId={roomId} />
          </div>
        </div>
      </div>
    </div>
  );
}
