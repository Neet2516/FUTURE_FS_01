import { useState, useEffect } from 'react';
import { PROJECTS, SKILLS, PERSONAL, EXPERIENCES, ACHIEVEMENTS } from '../../data/portfolio';
import { PORTFOLIO_PHOTOS, type PortfolioPhoto } from '../../config/osAssets';
import { useWindowManager } from '../../context/WindowContext';
import './FileManagerApp.css';

type FileItemType = 'folder' | 'pdf' | 'txt' | 'project' | 'image';

interface FileItem {
  id: string;
  name: string;
  type: FileItemType;
  meta: string;
  data?: any;
}

const ROOT_ITEMS: FileItem[] = [
  { id: 'projects', name: 'Projects', type: 'folder', meta: '3 items' },
  { id: 'skills', name: 'Skills', type: 'folder', meta: '4 categories' },
  { id: 'experience', name: 'Experience', type: 'folder', meta: '2 items' },
  { id: 'about', name: 'About Me', type: 'folder', meta: 'photos + 3 files' },
  { id: 'resume', name: 'Resume.pdf', type: 'pdf', meta: '180 KB' },
  { id: 'achievements', name: 'Achievements', type: 'folder', meta: '4 items' },
  { id: 'notes', name: 'Notes.txt', type: 'txt', meta: '1.2 KB' },
  { id: 'contact', name: 'Contact.vcf', type: 'txt', meta: '480 B' },
];

export default function FileManagerApp() {
  const [currentFolder, setCurrentFolder] = useState<string>('Home');
  const [folderHistory, setFolderHistory] = useState<string[]>(['Home']);
  const [historyIndex, setHistoryIndex] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [activeProjectDetail, setActiveProjectDetail] = useState<any | null>(null);
  const [activePhotoDetail, setActivePhotoDetail] = useState<PortfolioPhoto | null>(null);
  const [activeTextDetail, setActiveTextDetail] = useState<{ title: string; content: string } | null>(null);
  const { openWindow, selectedFilePath } = useWindowManager();

  const navigateTo = (folder: string) => {
    if (folder === currentFolder) return;
    const newHistory = folderHistory.slice(0, historyIndex + 1);
    newHistory.push(folder);
    setFolderHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setCurrentFolder(folder);
    setSelectedItemId(null);
    setSearchQuery('');
  };

  const handleGoBack = () => {
    if (historyIndex > 0) {
      const prevFolder = folderHistory[historyIndex - 1];
      setHistoryIndex(historyIndex - 1);
      setCurrentFolder(prevFolder);
      setSelectedItemId(null);
      setSearchQuery('');
    }
  };

  const handleGoForward = () => {
    if (historyIndex < folderHistory.length - 1) {
      const nextFolder = folderHistory[historyIndex + 1];
      setHistoryIndex(historyIndex + 1);
      setCurrentFolder(nextFolder);
      setSelectedItemId(null);
      setSearchQuery('');
    }
  };

  // Sync with selectedFilePath from desktop icon clicks
  useEffect(() => {
    if (selectedFilePath) {
      if (selectedFilePath === 'About' || selectedFilePath === 'About Me') {
        navigateTo('About Me');
      } else if (selectedFilePath === 'photos' || selectedFilePath === 'Photos') {
        navigateTo('photos');
      } else if (selectedFilePath === 'Projects') {
        navigateTo('Projects');
      } else if (selectedFilePath === 'Skills') {
        navigateTo('Skills');
      } else if (selectedFilePath === 'Experience') {
        navigateTo('Experience');
      }
    }
  }, [selectedFilePath]);

  const handlePhotoNext = () => {
    if (!activePhotoDetail) return;
    const idx = PORTFOLIO_PHOTOS.findIndex((p) => p.id === activePhotoDetail.id);
    const nextIdx = (idx + 1) % PORTFOLIO_PHOTOS.length;
    setActivePhotoDetail(PORTFOLIO_PHOTOS[nextIdx]);
  };

  const handlePhotoPrev = () => {
    if (!activePhotoDetail) return;
    const idx = PORTFOLIO_PHOTOS.findIndex((p) => p.id === activePhotoDetail.id);
    const prevIdx = (idx - 1 + PORTFOLIO_PHOTOS.length) % PORTFOLIO_PHOTOS.length;
    setActivePhotoDetail(PORTFOLIO_PHOTOS[prevIdx]);
  };

  const getItemsForCurrentFolder = (): FileItem[] => {
    if (currentFolder === 'Home' || currentFolder === 'Desktop' || currentFolder === 'Documents') {
      return ROOT_ITEMS;
    }

    if (currentFolder === 'About Me' || currentFolder === 'About') {
      return [
        {
          id: 'folder-photos',
          name: 'photos',
          type: 'folder',
          meta: '3 photos',
        },
        {
          id: 'file-bio',
          name: 'Bio.txt',
          type: 'txt',
          meta: '1.4 KB',
          data: {
            title: 'Bio.txt',
            content: `${PERSONAL.name} (${PERSONAL.alias})\n${PERSONAL.roles.join(' • ')}\n\n${PERSONAL.bio}\n\nLocation: ${PERSONAL.location}\nStatus: ${PERSONAL.status}\nEmail: ${PERSONAL.email}\nGitHub: ${PERSONAL.github}`,
          },
        },
        {
          id: 'file-edu',
          name: 'Education.txt',
          type: 'txt',
          meta: '680 B',
          data: {
            title: 'Education.txt',
            content: `Ajay Kumar Garg Engineering College (AKGEC)\nB.Tech in Computer Science and Engineering (2022 - 2026)\n\nExtracurriculars & Clubs:\n• Google Developer Groups (GDG) AKGEC — Core Member & Contributor\n• Solved 150+ DSA problems on LeetCode & competitive platforms\n• Hackathons & Team Competitions Winner`,
          },
        },
        {
          id: 'file-profile',
          name: 'navneet.ts',
          type: 'txt',
          meta: '1.1 KB',
          data: {
            title: 'navneet.ts',
            content: `export const developer = {\n  name: "${PERSONAL.name}",\n  alias: "${PERSONAL.alias}",\n  roles: [\n${PERSONAL.roles.map((r) => `    "${r}"`).join(',\n')}\n  ],\n  location: "${PERSONAL.location}",\n  status: "${PERSONAL.status}",\n  tech: ["React", "Next.js", "TypeScript", "Node.js", "WebSockets", "MongoDB"],\n  links: {\n    github: "${PERSONAL.github}",\n    linkedin: "${PERSONAL.linkedin}",\n    instagram: "${PERSONAL.instagram}"\n  }\n};`,
          },
        },
      ];
    }

    if (currentFolder === 'photos' || currentFolder === 'Photos') {
      return PORTFOLIO_PHOTOS.map((p) => ({
        id: p.id,
        name: p.name,
        type: 'image',
        meta: p.size || 'Image',
        data: p,
      }));
    }

    if (currentFolder === 'Projects') {
      return PROJECTS.map((p) => ({
        id: p.id,
        name: p.name,
        type: 'project',
        meta: p.tech.slice(0, 2).join(', '),
        data: p,
      }));
    }

    if (currentFolder === 'Skills') {
      return Object.entries(SKILLS).map(([key, cat]) => ({
        id: key,
        name: cat.label,
        type: 'folder',
        meta: `${cat.items.length} skills`,
        data: cat,
      }));
    }

    if (currentFolder === 'Experience') {
      return EXPERIENCES.map((exp, idx) => ({
        id: `exp-${idx}`,
        name: exp.institution,
        type: 'txt',
        meta: exp.period,
        data: {
          title: `${exp.institution}.txt`,
          content: `Role: ${exp.role}\nInstitution: ${exp.institution}\nPeriod: ${exp.period}\nStatus: ${exp.current ? 'Current' : 'Completed'}\nType: ${exp.type}\n\nDescription: ${exp.description || 'Full stack engineering and learning curriculum.'}`,
        },
      }));
    }

    if (currentFolder === 'Achievements') {
      return ACHIEVEMENTS.map((ach, idx) => ({
        id: `ach-${idx}`,
        name: ach.title,
        type: 'txt',
        meta: ach.year,
        data: {
          title: `${ach.title}.txt`,
          content: `Title: ${ach.title}\nYear: ${ach.year}\nDescription: ${ach.description}`,
        },
      }));
    }

    return ROOT_ITEMS;
  };

  const items = getItemsForCurrentFolder().filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleItemDoubleClick = (item: FileItem) => {
    if (item.type === 'folder') {
      if (item.id === 'about' || item.name === 'About Me' || item.name === 'About') {
        navigateTo('About Me');
      } else if (item.id === 'folder-photos' || item.name === 'photos' || item.name === 'Photos') {
        navigateTo('photos');
      } else {
        navigateTo(item.name);
      }
    } else if (item.type === 'image') {
      setActivePhotoDetail(item.data);
    } else if (item.type === 'txt') {
      if (item.id === 'notes') {
        setActiveTextDetail({
          title: 'Notes.txt',
          content: `Dev Notes & Reminders:\n• Optimize WebSocket reconnect logic in SyncBoard\n• Deploy update to portfolio terminal\n• Practice tree & graph problems on LeetCode\n• Maintain clean commits on GitHub (@Neet2516)`,
        });
      } else if (item.id === 'contact') {
        openWindow('contact');
      } else if (item.data?.content) {
        setActiveTextDetail(item.data);
      }
    } else if (item.type === 'pdf' || item.id === 'resume') {
      window.open(PERSONAL.resume, '_blank', 'noopener,noreferrer');
    } else if (item.type === 'project') {
      setActiveProjectDetail(item.data);
    }
  };

  return (
    <div className="nautilus-app">
      {/* Navigation Header Toolbar */}
      <div className="nautilus-app__toolbar">
        <div className="nautilus-app__nav-btns">
          <button
            type="button"
            className="nautilus-app__icon-btn"
            onClick={handleGoBack}
            title="Go Back"
            disabled={historyIndex === 0}
          >
            &lt;
          </button>
          <button
            type="button"
            className="nautilus-app__icon-btn"
            onClick={handleGoForward}
            title="Go Forward"
            disabled={historyIndex >= folderHistory.length - 1}
          >
            &gt;
          </button>
        </div>

        {/* Path Breadcrumbs */}
        <div className="nautilus-app__breadcrumbs">
          <button
            type="button"
            className="nautilus-app__crumb-btn"
            onClick={() => navigateTo('Home')}
          >
            🏠 Home
          </button>
          {currentFolder === 'photos' && (
            <>
              <span className="nautilus-app__crumb-sep">/</span>
              <button
                type="button"
                className="nautilus-app__crumb-btn"
                onClick={() => navigateTo('About Me')}
              >
                About Me
              </button>
              <span className="nautilus-app__crumb-sep">/</span>
              <span className="nautilus-app__crumb-current">photos</span>
            </>
          )}
          {currentFolder !== 'Home' && currentFolder !== 'photos' && (
            <>
              <span className="nautilus-app__crumb-sep">/</span>
              <span className="nautilus-app__crumb-current">{currentFolder}</span>
            </>
          )}
        </div>

        {/* Search input */}
        <div className="nautilus-app__search">
          <span className="nautilus-app__search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="nautilus-app__search-input"
          />
        </div>
      </div>

      {/* Main Split Body */}
      <div className="nautilus-app__body">
        {/* Left Sidebar Tree */}
        <aside className="nautilus-app__sidebar">
          <div className="nautilus-app__sidebar-section">
            <button
              type="button"
              className={`nautilus-app__sidebar-item ${currentFolder === 'Home' ? 'nautilus-app__sidebar-item--active' : ''}`}
              onClick={() => navigateTo('Home')}
            >
              <span>🏠</span> Home
            </button>
            <button
              type="button"
              className={`nautilus-app__sidebar-item ${currentFolder === 'Desktop' ? 'nautilus-app__sidebar-item--active' : ''}`}
              onClick={() => navigateTo('Desktop')}
            >
              <span>🖥️</span> Desktop
            </button>
            <button
              type="button"
              className={`nautilus-app__sidebar-item ${currentFolder === 'About Me' ? 'nautilus-app__sidebar-item--active' : ''}`}
              onClick={() => navigateTo('About Me')}
            >
              <span>👤</span> About Me
            </button>
            <button
              type="button"
              className={`nautilus-app__sidebar-item ${currentFolder === 'photos' ? 'nautilus-app__sidebar-item--active' : ''}`}
              onClick={() => navigateTo('photos')}
            >
              <span>🖼️</span> Photos
            </button>
            <button
              type="button"
              className={`nautilus-app__sidebar-item ${currentFolder === 'Projects' ? 'nautilus-app__sidebar-item--active' : ''}`}
              onClick={() => navigateTo('Projects')}
            >
              <span>📁</span> Projects
            </button>
            <button
              type="button"
              className={`nautilus-app__sidebar-item ${currentFolder === 'Skills' ? 'nautilus-app__sidebar-item--active' : ''}`}
              onClick={() => navigateTo('Skills')}
            >
              <span>⚡</span> Skills
            </button>
            <button
              type="button"
              className={`nautilus-app__sidebar-item ${currentFolder === 'Experience' ? 'nautilus-app__sidebar-item--active' : ''}`}
              onClick={() => navigateTo('Experience')}
            >
              <span>💼</span> Experience
            </button>
            <button
              type="button"
              className="nautilus-app__sidebar-item"
              onClick={() => openWindow('music')}
            >
              <span>🎵</span> Music
            </button>
            <button
              type="button"
              className="nautilus-app__sidebar-item"
              onClick={() => window.open(PERSONAL.resume, '_blank', 'noopener,noreferrer')}
            >
              <span>📄</span> Resume.pdf
            </button>
          </div>
        </aside>

        {/* Right Files Grid */}
        <div className="nautilus-app__content">
          {items.length === 0 ? (
            <div className="nautilus-app__empty">
              <span>🔍</span>
              <p>No files matching "{searchQuery}"</p>
            </div>
          ) : (
            <div className="nautilus-app__grid">
              {items.map((item) => {
                const isSelected = selectedItemId === item.id;

                return (
                  <div
                    key={item.id}
                    className={`nautilus-file ${isSelected ? 'nautilus-file--selected' : ''}`}
                    onClick={() => setSelectedItemId(item.id)}
                    onDoubleClick={() => handleItemDoubleClick(item)}
                    tabIndex={0}
                  >
                    <div className="nautilus-file__icon">
                      {item.type === 'folder' && <span className="nautilus-file__folder-glyph">📁</span>}
                      {item.type === 'pdf' && <span className="nautilus-file__pdf-glyph">📄</span>}
                      {item.type === 'txt' && <span className="nautilus-file__txt-glyph">📝</span>}
                      {item.type === 'project' && <span className="nautilus-file__project-glyph">💻</span>}
                      {item.type === 'image' && (
                        <div className="nautilus-file__thumb-box">
                          <img
                            src={item.data.src}
                            alt={item.name}
                            className="nautilus-file__thumb-img"
                            loading="lazy"
                          />
                        </div>
                      )}
                    </div>
                    <div className="nautilus-file__name" title={item.name}>{item.name}</div>
                    <div className="nautilus-file__meta">{item.meta}</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Photo Gallery Lightbox */}
      {activePhotoDetail && (
        <div className="nautilus-detail-overlay" onClick={() => setActivePhotoDetail(null)}>
          <div className="nautilus-photo-modal" onClick={(e) => e.stopPropagation()}>
            <div className="nautilus-photo-header">
              <span className="nautilus-photo-filename">{activePhotoDetail.name}</span>
              <button
                type="button"
                onClick={() => setActivePhotoDetail(null)}
                className="nautilus-detail-close"
                aria-label="Close"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className="nautilus-photo-preview-wrap">
              <button
                type="button"
                className="nautilus-photo-nav-btn nautilus-photo-nav-btn--prev"
                onClick={handlePhotoPrev}
                title="Previous photo"
                aria-label="Previous photo"
              >
                &lsaquo;
              </button>
              <img
                src={activePhotoDetail.src}
                alt={activePhotoDetail.name}
                className="nautilus-photo-preview-img"
              />
              <button
                type="button"
                className="nautilus-photo-nav-btn nautilus-photo-nav-btn--next"
                onClick={handlePhotoNext}
                title="Next photo"
                aria-label="Next photo"
              >
                &rsaquo;
              </button>
            </div>
          </div>
        </div>
      )}


      {/* Text File Detail Modal */}
      {activeTextDetail && (
        <div className="nautilus-detail-overlay" onClick={() => setActiveTextDetail(null)}>
          <div className="nautilus-text-modal" onClick={(e) => e.stopPropagation()}>
            <div className="nautilus-detail-header">
              <div className="nautilus-detail-header-left">
                <span className="nautilus-detail-badge">
                  <span className="nautilus-detail-dot" aria-hidden="true" />
                  Text Document
                </span>
                <h3 className="nautilus-detail-title">{activeTextDetail.title}</h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveTextDetail(null)}
                className="nautilus-detail-close"
                aria-label="Close document"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <pre className="nautilus-text-content">
              <code>{activeTextDetail.content}</code>
            </pre>
            <div className="nautilus-detail-actions">
              <button
                type="button"
                onClick={() => setActiveTextDetail(null)}
                className="nautilus-btn nautilus-btn--secondary"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Project Detail Modal if active */}
      {activeProjectDetail && (
        <div className="nautilus-detail-overlay" onClick={() => setActiveProjectDetail(null)}>
          <div className="nautilus-detail-card" onClick={(e) => e.stopPropagation()}>
            <div className="nautilus-detail-header">
              <div className="nautilus-detail-header-left">
                <span className="nautilus-detail-badge">
                  <span className="nautilus-detail-dot" aria-hidden="true" />
                  {activeProjectDetail.status === 'deployed' ? 'Production Live' : 'Active Project'}
                </span>
                <h3 className="nautilus-detail-title">{activeProjectDetail.name}</h3>
                {activeProjectDetail.tagline && (
                  <p className="nautilus-detail-tagline">{activeProjectDetail.tagline}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => setActiveProjectDetail(null)}
                className="nautilus-detail-close"
                aria-label="Close details"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <p className="nautilus-detail-desc">{activeProjectDetail.description}</p>

            {activeProjectDetail.problem && (
              <div className="nautilus-detail-problem">
                <span className="nautilus-detail-problem-label">Key Challenge Solved</span>
                <p className="nautilus-detail-problem-text">{activeProjectDetail.problem}</p>
              </div>
            )}

            <div className="nautilus-detail-tech">
              {activeProjectDetail.tech?.map((t: string) => (
                <span key={t} className="nautilus-tech-pill">{t}</span>
              ))}
            </div>

            <div className="nautilus-detail-actions">
              {activeProjectDetail.live && (
                <a
                  href={activeProjectDetail.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="nautilus-btn nautilus-btn--primary"
                  aria-label={`View live demo of ${activeProjectDetail.name}`}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                  <span>Live Demo</span>
                </a>
              )}
              {activeProjectDetail.github && (
                <a
                  href={activeProjectDetail.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="nautilus-btn nautilus-btn--secondary"
                  aria-label={`View source code of ${activeProjectDetail.name} on GitHub`}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                  </svg>
                  <span>Source Code</span>
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
