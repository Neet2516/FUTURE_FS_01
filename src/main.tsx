import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from './context/ThemeContext';
import { NotificationProvider } from './context/NotificationContext';
import { AudioProvider } from './context/AudioContext';
import { WindowProvider } from './context/WindowContext';
import './index.css';
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <NotificationProvider>
        <AudioProvider>
          <WindowProvider>
            <App />
          </WindowProvider>
        </AudioProvider>
      </NotificationProvider>
    </ThemeProvider>
  </StrictMode>,
);
