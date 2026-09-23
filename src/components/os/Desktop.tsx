import { useWindowManager } from '../../context/WindowContext';
import { useNotification } from '../../context/NotificationContext';
import { PERSONAL } from '../../data/portfolio';

// OS Shell Components
import TopBar from './TopBar';
import Dock from './Dock';
import DesktopIcon from './DesktopIcon';
import WindowFrame from './WindowFrame';
import MusicBar from './MusicBar';
import AppLauncher from './AppLauncher';
import NotificationCenter from './NotificationCenter';

// Apps
import TerminalApp from '../apps/TerminalApp';
import FileManagerApp from '../apps/FileManagerApp';
import BrowserApp from '../apps/BrowserApp';
import MusicPlayerApp from '../apps/MusicPlayerApp';
import ProjectsApp from '../apps/ProjectsApp';
import SettingsApp from '../apps/SettingsApp';
import ChatGPTApp from '../apps/ChatGPTApp';

import './Desktop.css';

export default function Desktop() {
  const {
    windows,
    activeWallpaper,
    openWindow,
    openFileInManager,
  } = useWindowManager();

  const { notify } = useNotification();

  const handleOpenResume = () => {
    window.open(PERSONAL.resume, '_blank', 'noopener,noreferrer');
    notify('Resume PDF Opened', 'Navneet Sinha Software Engineer resume opened in new tab', '📄');
  };

  const handleOpenTrash = () => {
    notify('Trash is Empty', 'No files in recycle bin. System is clean.', '🗑️');
  };

  return (
    <div
      className="os-desktop"
      style={{
        backgroundImage: `url(${activeWallpaper.url})`,
      }}
    >
      {/* Background Overlay / Vignette */}
      <div className="os-desktop__vignette" />

      {/* Top Bar */}
      <TopBar />

      {/* Main Workspace Area */}
      <div className="os-desktop__workspace">
        {/* Left-side Application Dock */}
        <Dock />

        {/* Desktop Icons — freely draggable canvas */}
        <div className="os-desktop__icons-canvas">
          {/* Column 1 */}
          <DesktopIcon id="icon-home"       label="Home"       iconType="folder" initialX={76}  initialY={16}  onOpen={() => openWindow('files')} />
          <DesktopIcon id="icon-about"      label="About Me"   iconType="folder" initialX={76}  initialY={106} onOpen={() => openFileInManager('About Me')} />
          <DesktopIcon id="icon-experience" label="Experience" iconType="folder" initialX={76}  initialY={196} onOpen={() => openFileInManager('Experience')} />
          <DesktopIcon id="icon-contact"    label="Contact"    iconType="folder" initialX={76}  initialY={286} onOpen={() => openFileInManager('Contact')} />
          <DesktopIcon id="icon-photos"     label="Photos"     iconType="folder" initialX={76}  initialY={376} onOpen={() => openFileInManager('photos')} />
          {/* Column 2 */}
          <DesktopIcon id="icon-projects"   label="Projects"   iconType="folder" initialX={168} initialY={16}  onOpen={() => openWindow('projects')} />
          <DesktopIcon id="icon-skills"     label="Skills"     iconType="folder" initialX={168} initialY={106} onOpen={() => openFileInManager('Skills')} />
          <DesktopIcon id="icon-resume"     label="Resume.pdf" iconType="pdf"    initialX={168} initialY={196} onOpen={handleOpenResume} />
          <DesktopIcon id="icon-trash"      label="Trash"      iconType="trash"  initialX={168} initialY={286} onOpen={handleOpenTrash} />
          <DesktopIcon id="icon-chatgpt"    label="ChatGPT"    iconType="chatgpt" initialX={168} initialY={376} onOpen={() => openWindow('chatgpt')} />
        </div>

        {/* Window Manager Canvas */}
        <div className="os-desktop__windows-layer">
          {/* Terminal Window */}
          {windows.terminal.isOpen && (
            <WindowFrame id="terminal" title={windows.terminal.title} iconGlyph="💻">
              <TerminalApp />
            </WindowFrame>
          )}

          {/* File Manager Window */}
          {windows.files.isOpen && (
            <WindowFrame id="files" title={windows.files.title} iconGlyph="📁">
              <FileManagerApp />
            </WindowFrame>
          )}

          {/* Browser Window */}
          {windows.browser.isOpen && (
            <WindowFrame id="browser" title={windows.browser.title} iconGlyph="🌐">
              <BrowserApp />
            </WindowFrame>
          )}

          {/* Music Player Window */}
          {windows.music.isOpen && (
            <WindowFrame id="music" title={windows.music.title} iconGlyph="🎵">
              <MusicPlayerApp />
            </WindowFrame>
          )}

          {/* Projects Showcase Window */}
          {windows.projects.isOpen && (
            <WindowFrame id="projects" title={windows.projects.title} iconGlyph="💻">
              <ProjectsApp />
            </WindowFrame>
          )}

          {/* Settings Window */}
          {windows.settings.isOpen && (
            <WindowFrame id="settings" title={windows.settings.title} iconGlyph="⚙️">
              <SettingsApp />
            </WindowFrame>
          )}

          {/* ChatGPT AI Window */}
          {windows.chatgpt.isOpen && (
            <WindowFrame id="chatgpt" title={windows.chatgpt.title} iconGlyph="🤖">
              <ChatGPTApp />
            </WindowFrame>
          )}
        </div>

        {/* Floating Persistent Music Bar (Matching Screenshot) */}
        <MusicBar />
      </div>

      {/* Activities / App Launcher Modal */}
      <AppLauncher />

      {/* Toast Notification Center */}
      <NotificationCenter />
    </div>
  );
}
