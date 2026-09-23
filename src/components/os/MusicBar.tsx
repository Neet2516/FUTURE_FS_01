import { useAudio } from '../../context/AudioContext';
import { useWindowManager } from '../../context/WindowContext';
import './MusicBar.css';

function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

export default function MusicBar() {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    togglePlay,
    seek,
    volume,
    setVolume,
    toggleMute,
    isMuted,
    nextTrack,
    prevTrack,
  } = useAudio();
  const { openWindow } = useWindowManager();

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    seek(parseFloat(e.target.value));
  };

  return (
    <div className="os-musicbar" role="region" aria-label="Music Player Bar">
      {/* Track info & thumbnail on left */}
      <div
        className="os-musicbar__track"
        onClick={() => openWindow('music')}
        title="Open Full Music Player"
      >
        <div className={`os-musicbar__thumb ${isPlaying ? 'os-musicbar__thumb--playing' : ''}`}>
          <span>🎵</span>
        </div>
        <div className="os-musicbar__meta">
          <span className="os-musicbar__title">{currentTrack.title}</span>
          <span className="os-musicbar__artist">{currentTrack.artist}</span>
        </div>
      </div>

      {/* Center Controls & Scrubber */}
      <div className="os-musicbar__controls-center">
        <div className="os-musicbar__buttons">
          <button type="button" className="os-musicbar__btn" title="Shuffle">🔀</button>
          <button type="button" className="os-musicbar__btn" onClick={prevTrack} title="Previous">⏮</button>
          <button
            type="button"
            className="os-musicbar__btn os-musicbar__play-btn"
            onClick={togglePlay}
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? '⏸' : '▶'}
          </button>
          <button type="button" className="os-musicbar__btn" onClick={nextTrack} title="Next">⏭</button>
          <button type="button" className="os-musicbar__btn" title="Repeat">🔁</button>
        </div>

        {/* Scrubber timeline */}
        <div className="os-musicbar__timeline">
          <span className="os-musicbar__time">{formatTime(currentTime)}</span>
          <input
            type="range"
            min="0"
            max={duration || 100}
            step="0.5"
            value={currentTime}
            onChange={handleSeekChange}
            className="os-musicbar__scrubber"
            aria-label="Seek track position"
          />
          <span className="os-musicbar__time">{formatTime(duration)}</span>
        </div>
      </div>

      {/* Right side: Volume & App launcher */}
      <div className="os-musicbar__right">
        <button
          type="button"
          className="os-musicbar__btn"
          onClick={toggleMute}
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted || volume === 0 ? '🔇' : '🔊'}
        </button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.02"
          value={isMuted ? 0 : volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="os-musicbar__vol-slider"
          aria-label="Volume"
        />
        <button
          type="button"
          className="os-musicbar__btn"
          onClick={() => openWindow('music')}
          title="Open Music Player Window"
        >
          📑
        </button>
      </div>
    </div>
  );
}
