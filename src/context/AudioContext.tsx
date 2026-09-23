import { createContext, useContext, useState, useRef, useEffect, useCallback, type ReactNode } from 'react';
import { PLAYLIST, type SongTrack } from '../config/osAssets';
import { useNotification } from './NotificationContext';

interface AudioContextType {
  currentTrack: SongTrack;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  playlist: SongTrack[];
  togglePlay: () => void;
  play: () => void;
  pause: () => void;
  seek: (time: number) => void;
  setVolume: (vol: number) => void;
  toggleMute: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
}

const AudioContext = createContext<AudioContextType | null>(null);

export function AudioProvider({ children }: { children: ReactNode }) {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(PLAYLIST[0]?.duration || 180);
  const [volume, setVolumeState] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { notify } = useNotification();
  const currentTrack = PLAYLIST[currentTrackIndex] || PLAYLIST[0];

  // Initialize audio element (Strictly NO autoplay)
  useEffect(() => {
    const audio = new Audio(currentTrack.src);
    audio.preload = 'metadata';
    audio.volume = volume;

    const onLoadedMetadata = () => {
      if (audio.duration && !isNaN(audio.duration) && isFinite(audio.duration)) {
        setDuration(audio.duration);
      }
    };

    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const onEnded = () => {
      setIsPlaying(false);
    };

    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('ended', onEnded);

    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('ended', onEnded);
    };
  }, [currentTrack]);

  const play = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
        notify(
          'Now Playing',
          `${currentTrack.title} — ${currentTrack.artist}`,
          '🎵'
        );
      }).catch(() => {
        // User interaction required error handled gracefully
      });
    }
  }, [currentTrack, notify]);

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, []);

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, play, pause]);

  const seek = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  }, []);

  const setVolume = useCallback((vol: number) => {
    const clamped = Math.max(0, Math.min(1, vol));
    setVolumeState(clamped);
    if (audioRef.current) {
      audioRef.current.volume = clamped;
    }
    if (clamped === 0) setIsMuted(true);
    else setIsMuted(false);
  }, []);

  const toggleMute = useCallback(() => {
    if (isMuted) {
      if (audioRef.current) audioRef.current.volume = volume || 0.5;
      setIsMuted(false);
    } else {
      if (audioRef.current) audioRef.current.volume = 0;
      setIsMuted(true);
    }
  }, [isMuted, volume]);

  const nextTrack = useCallback(() => {
    setCurrentTrackIndex((prev) => (prev + 1) % PLAYLIST.length);
  }, []);

  const prevTrack = useCallback(() => {
    setCurrentTrackIndex((prev) => (prev - 1 + PLAYLIST.length) % PLAYLIST.length);
  }, []);

  return (
    <AudioContext.Provider
      value={{
        currentTrack,
        isPlaying,
        currentTime,
        duration,
        volume,
        isMuted,
        playlist: PLAYLIST,
        togglePlay,
        play,
        pause,
        seek,
        setVolume,
        toggleMute,
        nextTrack,
        prevTrack,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
}
