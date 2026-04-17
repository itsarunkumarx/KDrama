import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SuperPlayer({ type, src, title, poster }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [brightness, setBrightness] = useState(100);
  const [gestureType, setGestureType] = useState(null); // 'volume', 'brightness', 'seek'
  const [gestureValue, setGestureValue] = useState(0);

  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const controlsTimeout = useRef(null);

  useEffect(() => {
    const handleMouseActivity = () => {
      setShowControls(true);
      clearTimeout(controlsTimeout.current);
      controlsTimeout.current = setTimeout(() => {
        if (isPlaying) setShowControls(false);
      }, 3000);
    };

    window.addEventListener('mousemove', handleMouseActivity);
    return () => window.removeEventListener('mousemove', handleMouseActivity);
  }, [isPlaying]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) videoRef.current.pause();
      else videoRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (e) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen();
      setIsFullScreen(true);
    } else {
      document.exitFullscreen();
      setIsFullScreen(false);
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Gesture Handling (Volume/Brightness)
  const handleDrag = (e, info) => {
    const { x, y } = info.offset;
    const { width, height } = containerRef.current.getBoundingClientRect();
    const isLeft = info.point.x < width / 2;

    if (Math.abs(y) > Math.abs(x)) {
      if (isLeft) {
        // Brightness
        const newBrightness = Math.max(0, Math.min(200, brightness - y / 2));
        setBrightness(newBrightness);
        setGestureType('brightness');
        setGestureValue(Math.round((newBrightness / 200) * 100));
      } else {
        // Volume
        const newVolume = Math.max(0, Math.min(1, volume - y / 400));
        setVolume(newVolume);
        if (videoRef.current) videoRef.current.volume = newVolume;
        setGestureType('volume');
        setGestureValue(Math.round(newVolume * 100));
      }
    }
  };

  const handleDragEnd = () => {
    setTimeout(() => setGestureType(null), 1000);
  };

  if (type === 'iframe') {
    return (
      <div className="w-full aspect-video rounded-3xl overflow-hidden bg-black relative shadow-2xl group border-4 border-white/5">
        <iframe
          src={src}
          className="w-full h-full"
          allowFullScreen
          allow="autoplay; encrypted-media; picture-in-picture"
          title={title}
        />
        <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
          <p className="text-white text-xs font-bold tracking-widest uppercase">{title}</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="w-full aspect-video rounded-3xl overflow-hidden bg-black relative shadow-2xl group border-4 border-white/5"
      style={{ filter: `brightness(${brightness}%)` }}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className="w-full h-full cursor-pointer"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onClick={togglePlay}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      {/* Overlay Gesture Feedback */}
      <AnimatePresence>
        {gestureType && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/60 backdrop-blur-xl rounded-2xl p-6 flex flex-col items-center gap-2 pointer-events-none z-50 border border-white/20"
          >
            <div className="text-4xl">
              {gestureType === 'brightness' ? '☀️' : '🔊'}
            </div>
            <div className="w-32 h-1 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-pink-500" style={{ width: `${gestureValue}%` }} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Drag Area for gestures */}
      <motion.div 
        drag
        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
        dragElastic={0}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        className="absolute inset-0 z-10"
      />

      {/* Custom Controls */}
      <AnimatePresence>
        {showControls && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute inset-0 z-20 flex flex-col justify-end bg-gradient-to-t from-black/90 via-transparent to-transparent p-6 pointer-events-none"
          >
            {/* Top Bar */}
            <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center pointer-events-auto">
              <h3 className="text-white font-bold tracking-tight text-lg drop-shadow-lg">{title}</h3>
              <div className="flex gap-4">
                <select 
                  className="bg-white/10 backdrop-blur-md text-white text-xs px-2 py-1 rounded-lg border border-white/20 focus:outline-none"
                  value={playbackRate}
                  onChange={(e) => {
                    const rate = parseFloat(e.target.value);
                    setPlaybackRate(rate);
                    videoRef.current.playbackRate = rate;
                  }}
                >
                  {[0.5, 0.75, 1, 1.25, 1.5, 2].map(r => <option key={r} value={r}>{r}x</option>)}
                </select>
              </div>
            </div>

            {/* Bottom Controls */}
            <div className="space-y-4 pointer-events-auto">
              {/* Seekbar */}
              <div className="group/seek relative">
                <input
                  type="range"
                  min={0}
                  max={duration}
                  value={currentTime}
                  onChange={handleSeek}
                  className="w-full h-1.5 bg-white/20 rounded-full appearance-none cursor-pointer accent-pink-500 hover:h-2 transition-all"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <button onClick={togglePlay} className="text-white text-2xl hover:scale-110 transition-transform">
                    {isPlaying ? '⏸️' : '▶️'}
                  </button>
                  <div className="text-white/80 text-sm font-mono tracking-tighter">
                    {formatTime(currentTime)} <span className="text-white/30 mx-1">/</span> {formatTime(duration)}
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2 group/vol">
                    <span className="text-white/60 text-lg">🔊</span>
                    <input 
                      type="range" 
                      min={0} max={1} step={0.1} 
                      value={volume}
                      onChange={(e) => {
                        const v = parseFloat(e.target.value);
                        setVolume(v);
                        videoRef.current.volume = v;
                      }}
                      className="w-0 group-hover/vol:w-20 transition-all duration-300 appearance-none bg-white/20 h-1 rounded-full accent-white"
                    />
                  </div>
                  <button onClick={toggleFullScreen} className="text-white hover:scale-110 transition-transform text-xl">
                    {isFullScreen ? '↙️' : '↗️'}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!isPlaying && !showControls && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none">
          <motion.div 
            animate={{ scale: [1, 1.1, 1] }} 
            transition={{ repeat: Infinity, duration: 2 }}
            className="text-white/20 text-9xl"
          >
            ▶️
          </motion.div>
        </div>
      )}
    </div>
  );
}
