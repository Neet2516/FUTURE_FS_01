import { useAudio } from '../../context/AudioContext';
import './MusicPlayerApp.css';

function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

export default function MusicPlayerApp() {
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
    playlist,
  } = useAudio();

  return (
    <div className="music-app">
      {/* Vinyl Showcase */}
      <div className="music-app__showcase">
        <div className={`music-app__vinyl ${isPlaying ? 'music-app__vinyl--spinning' : ''}`}>
          <div className="music-app__vinyl-grooves">
            <div className="music-app__vinyl-center">
              <span>🎵</span>
            </div>
          </div>
        </div>

        <div className="music-app__info">
          <h2 className="music-app__title">{currentTrack.title}</h2>
          <p className="music-app__artist">{currentTrack.artist}</p>
          <span className="music-app__album">{currentTrack.album}</span>
        </div>
      </div>

      {/* Progress Timeline */}
      <div className="music-app__timeline">
        <span className="music-app__time">{formatTime(currentTime)}</span>
        <input
          type="range"
          min="0"
          max={duration || 100}
          step="0.5"
          value={currentTime}
          onChange={(e) => seek(parseFloat(e.target.value))}
          className="music-app__scrubber"
        />
        <span className="music-app__time">{formatTime(duration)}</span>
      </div>

      {/* Controls */}
      <div className="music-app__controls">
        <button type="button" className="music-app__ctrl-btn" title="Previous">⏮</button>
        <button
          type="button"
          className="music-app__ctrl-btn music-app__ctrl-play"
          onClick={togglePlay}
          title={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? '⏸' : '▶'}
        </button>
        <button type="button" className="music-app__ctrl-btn" title="Next">⏭</button>
      </div>

      {/* Volume Bar */}
      <div className="music-app__volume-row">
        <button type="button" onClick={toggleMute} className="music-app__vol-btn">
          {isMuted || volume === 0 ? '🔇' : '🔊'}
        </button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={isMuted ? 0 : volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="music-app__vol-slider"
        />
        <span className="music-app__vol-val">{Math.round(volume * 100)}%</span>
      </div>

      {/* Playlist Queue */}
      <div className="music-app__queue">
        <h4 className="music-app__queue-title">Playlist Queue</h4>
        {playlist.map((track, i) => (
          <div key={track.id} className="music-app__queue-item music-app__queue-item--active">
            <span className="music-app__queue-index">{i + 1}</span>
            <div className="music-app__queue-meta">
              <span className="music-app__queue-name">{track.title}</span>
              <span className="music-app__queue-sub">{track.artist}</span>
            </div>
            <span className="music-app__queue-dur">{formatTime(track.duration)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
