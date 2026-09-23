// Centralized asset configuration importing existing local assets
import bg1 from '../assets/background/1.jpg';
import bg2 from '../assets/background/2.jpg';
import bg3 from '../assets/background/3.jpg';
import audioTrack from '../assets/song/atlasaudio-soft-soft-music-576656.mp3';
import photoProf from '../assets/about/photos/prof.jpeg';
import photoSelf from '../assets/about/photos/self.png';
import photoSelfie from '../assets/about/photos/selfie.jpeg';

export interface WallpaperOption {
  id: string;
  name: string;
  url: string;
  description: string;
}

export const WALLPAPERS: WallpaperOption[] = [
  {
    id: 'wallpaper-3',
    name: 'Twilight Mountains',
    url: bg3,
    description: 'Starry twilight mountains wallpaper (Default Navneet OS)',
  },
  {
    id: 'wallpaper-1',
    name: 'Nebula Horizon',
    url: bg1,
    description: 'Deep celestial nebula with cosmic gradients',
  },
  {
    id: 'wallpaper-2',
    name: 'Cyberpunk Aurora',
    url: bg2,
    description: 'Vibrant twilight atmosphere with deep contrasts',
  },
];

export const DEFAULT_WALLPAPER = WALLPAPERS[0]; // wallpaper-3

export interface SongTrack {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number; // approximate seconds
  src: string;
}

export const PLAYLIST: SongTrack[] = [
  {
    id: 'track-1',
    title: 'Atlas Soft Ambience',
    artist: 'Atlas Audio',
    album: 'Developer Focus Sessions',
    duration: 172, // 2:52
    src: audioTrack,
  },
];

export interface PortfolioPhoto {
  id: string;
  name: string;
  src: string;
  size?: string;
}

export const PORTFOLIO_PHOTOS: PortfolioPhoto[] = [
  {
    id: 'photo-prof',
    name: 'prof.jpeg',
    src: photoProf,
    size: '120 KB',
  },
  {
    id: 'photo-self',
    name: 'self.png',
    src: photoSelf,
    size: '254 KB',
  },
  {
    id: 'photo-selfie',
    name: 'selfie.jpeg',
    src: photoSelfie,
    size: '206 KB',
  },
];

