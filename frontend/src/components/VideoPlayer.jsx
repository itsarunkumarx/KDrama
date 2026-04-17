import { useState, useEffect, useRef } from 'react';
import YouTube from 'react-youtube';

export default function VideoPlayer({ videoId, onStateChange, syncState, isHost, dramaTitle }) {
  const playerRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [playerState, setPlayerState] = useState(-1);
  const syncingRef = useRef(false);

  useEffect(() => {
    if (!syncState || !ready || !playerRef.current || isHost) return;
    const player = playerRef.current;
    syncingRef.current = true;
    if (syncState.playing) {
      player.seekTo(syncState.currentTime + 0.5, true);
      player.playVideo();
    } else {
      player.pauseVideo();
      player.seekTo(syncState.currentTime, true);
    }
    setTimeout(() => { syncingRef.current = false; }, 1000);
  }, [syncState]);

  const opts = {
    width: '100%',
    height: '100%',
    playerVars: {
      autoplay: 1,
      controls: 1,
      modestbranding: 1,
      rel: 0,
      origin: window.location.origin,
      enablejsapi: 1,
    }
  };

  const onReady = (e) => {
    playerRef.current = e.target;
    setReady(true);
  };

  const onPlayerStateChange = (e) => {
    if (syncingRef.current || !isHost) return;
    const state = {
      playing: e.data === 1,
      currentTime: e.target.getCurrentTime?.() || 0,
    };
    setPlayerState(e.data);
    onStateChange?.(state);
  };

  if (!videoId) {
    return (
      <div className="w-full aspect-video bg-kcard rounded-xl flex flex-col items-center justify-center gap-4">
        <div className="text-6xl">🎬</div>
        <p className="text-white text-xl font-display tracking-wider">{dramaTitle || 'No Video Available'}</p>
        <p className="text-kgray text-sm">No trailer found for this drama</p>
      </div>
    );
  }

  return (
    <div className="w-full aspect-video rounded-xl overflow-hidden bg-black relative shadow-2xl">
      <YouTube
        videoId={videoId}
        opts={opts}
        onReady={onReady}
        onStateChange={onPlayerStateChange}
        className="w-full h-full"
        iframeClassName="w-full h-full"
      />
      {!ready && (
        <div className="absolute inset-0 bg-kcard flex items-center justify-center">
          <div className="w-12 h-12 border-2 border-kred border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}
