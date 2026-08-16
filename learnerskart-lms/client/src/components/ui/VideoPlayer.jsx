import React, { useRef, useState } from 'react';
import ReactPlayer from 'react-player';
import { Play, Pause, Volume2, VolumeX, Maximize2, Settings, ShieldCheck } from 'lucide-react';

export default function VideoPlayer({ url, savedPosition = 0, onTimeUpdate, onEnded }) {
  const playerRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const [played, setPlayed] = useState(0); // Progress percentage 0-1
  const [seeking, setSeeking] = useState(false);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [showSpeedControls, setShowSpeedControls] = useState(false);

  // Resume playback from last position once video loads
  const handleReady = () => {
    if (savedPosition > 0 && playerRef.current) {
      playerRef.current.seekTo(savedPosition, 'seconds');
    }
  };

  const handlePlayPause = () => {
    setPlaying(!playing);
  };

  const handleMute = () => {
    setMuted(!muted);
  };

  const handleVolumeChange = (e) => {
    setVolume(parseFloat(e.target.value));
    setMuted(false);
  };

  const handleSeekMouseDown = () => {
    setSeeking(true);
  };

  const handleSeekChange = (e) => {
    setPlayed(parseFloat(e.target.value));
  };

  const handleSeekMouseUp = (e) => {
    setSeeking(false);
    if (playerRef.current) {
      playerRef.current.seekTo(parseFloat(e.target.value));
    }
  };

  const handleProgress = (state) => {
    if (!seeking) {
      setPlayed(state.played);
      const currentSeconds = Math.round(state.playedSeconds);
      if (onTimeUpdate && currentSeconds % 10 === 0) {
        onTimeUpdate(currentSeconds);
      }
    }
  };

  const handleDuration = (dur) => {
    setDuration(dur);
  };

  const toggleFullscreen = () => {
    const playerEl = document.querySelector('.player-wrapper');
    if (playerEl) {
      if (!document.fullscreenElement) {
        playerEl.requestFullscreen().catch((err) => {
          console.error(err);
        });
      } else {
        document.exitFullscreen();
      }
    }
  };

  const formatTime = (seconds) => {
    const date = new Date(seconds * 1000);
    const hh = date.getUTCHours();
    const mm = date.getUTCMinutes();
    const ss = String(date.getUTCSeconds()).padStart(2, '0');
    if (hh) {
      return `${hh}:${String(mm).padStart(2, '0')}:${ss}`;
    }
    return `${mm}:${ss}`;
  };

  return (
    <div 
      onContextMenu={(e) => e.preventDefault()}
      className="player-wrapper relative bg-black aspect-video rounded-xl overflow-hidden shadow-lg group select-none"
    >
      <ReactPlayer
        ref={playerRef}
        url={url}
        width="100%"
        height="100%"
        playing={playing}
        volume={volume}
        muted={muted}
        playbackRate={playbackRate}
        onProgress={handleProgress}
        onDuration={handleDuration}
        onReady={handleReady}
        onEnded={onEnded}
        config={{
          file: {
            attributes: {
              controlsList: 'nodownload noremoteplayback',
              disablePictureInPicture: true,
              onContextMenu: (e) => e.preventDefault()
            }
          }
        }}
        progressInterval={1000}
      />

      {/* Security Watermark Badge */}
      <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg flex items-center gap-1.5 text-[9px] font-bold text-white/80 border border-white/10 opacity-70 pointer-events-none">
        <ShieldCheck size={12} className="text-emerald-400" />
        <span>Protected Stream (Download Disabled)</span>
      </div>

      {/* CUSTOM OVERLAY CONTROLS */}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 flex flex-col opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        
        {/* Seek Bar Slider */}
        <input
          type="range"
          min={0}
          max={0.999999}
          step="any"
          value={played}
          onMouseDown={handleSeekMouseDown}
          onChange={handleSeekChange}
          onMouseUp={handleSeekMouseUp}
          className="w-full h-1 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-accent mb-4"
        />

        {/* Dashboard buttons */}
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center gap-4">
            {/* Play/Pause */}
            <button onClick={handlePlayPause} className="hover:text-accent transition-colors">
              {playing ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
            </button>

            {/* Volume controls */}
            <div className="flex items-center gap-1.5">
              <button onClick={handleMute} className="hover:text-accent transition-colors">
                {muted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step="any"
                value={volume}
                onChange={handleVolumeChange}
                className="w-16 h-1 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-white"
              />
            </div>

            {/* Time counters */}
            <span className="text-xs font-semibold select-none">
              {formatTime(played * duration)} / {formatTime(duration)}
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Playback speed selector */}
            <div className="relative">
              <button 
                onClick={() => setShowSpeedControls(!showSpeedControls)}
                className="flex items-center gap-1 text-xs font-bold hover:text-accent transition-colors border border-white/20 px-2.5 py-1 rounded-lg"
              >
                <Settings size={14} />
                {playbackRate}x
              </button>
              {showSpeedControls && (
                <div className="absolute bottom-9 right-0 bg-slate-900 border border-slate-700 rounded-xl overflow-hidden shadow-lg py-1 w-24">
                  {[0.5, 0.75, 1.0, 1.25, 1.5, 2.0].map(rate => (
                    <button
                      key={rate}
                      onClick={() => {
                        setPlaybackRate(rate);
                        setShowSpeedControls(false);
                      }}
                      className={`block w-full text-left px-3 py-1.5 text-xs hover:bg-slate-800 ${
                        playbackRate === rate ? 'text-accent font-bold' : 'text-slate-300'
                      }`}
                    >
                      {rate}x
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Fullscreen */}
            <button onClick={toggleFullscreen} className="hover:text-accent transition-colors">
              <Maximize2 size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
