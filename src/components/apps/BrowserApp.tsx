import { useState, useEffect, useRef, useCallback } from 'react';
import { PERSONAL } from '../../data/portfolio';
import { useWindowManager } from '../../context/WindowContext';
import { askGroqAI } from '../../services/groqService';
import './BrowserApp.css';

export interface BrowserTab {
  id: string;
  title: string;
  icon: string;
  url: string;
  history: string[];
  historyIndex: number;
  isLoading: boolean;
  mode: 'home' | 'embedded' | 'external_blocked';
  loadKey: number;
  searchQuery?: string;
}

interface QuickAccessItem {
  id: string;
  title: string;
  url: string;
  icon: string;
  description: string;
  color: string;
  isExternal: boolean;
  category: 'search' | 'social' | 'dev' | 'media';
}

const BLOCKED_DOMAINS = [
  'google.com',
  'google.co.',
  'youtube.com',
  'youtu.be',
  'github.com',
  'linkedin.com',
  'leetcode.com',
  'gmail.com',
  'mail.google.com',
  'twitter.com',
  'x.com',
  'facebook.com',
  'instagram.com',
  'reddit.com',
  'notion.so',
  'medium.com',
  'chatgpt.com',
  'openai.com',
  'stackoverflow.com',
];

function isIframeBlocked(url: string): boolean {
  try {
    if (url.startsWith('mailto:')) return true;
    const hostname = new URL(url).hostname.toLowerCase();
    return BLOCKED_DOMAINS.some((d) => hostname.includes(d));
  } catch {
    return false;
  }
}

function isUrlPattern(input: string): boolean {
  const trimmed = input.trim();
  if (/^https?:\/\//i.test(trimmed)) return true;
  if (/^mailto:/i.test(trimmed)) return true;
  if (/^localhost(:\d+)?(\/.*)?$/i.test(trimmed)) return true;
  if (/^([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(:\d+)?(\/.*)?$/i.test(trimmed)) return true;
  return false;
}

function formatUrl(input: string): string {
  const trimmed = input.trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (/^mailto:/i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

function extractDomain(url: string): string {
  try {
    if (url.startsWith('mailto:')) {
      return url.replace(/^mailto:/, '');
    }
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

function generateTabId(): string {
  return 'tab_' + Math.random().toString(36).substring(2, 9);
}

const INITIAL_URL = 'https://navneet.os/newtab';

function createNewTab(initialUrl = INITIAL_URL): BrowserTab {
  const isHome = initialUrl === INITIAL_URL;
  return {
    id: generateTabId(),
    title: isHome ? 'New Tab' : extractDomain(initialUrl),
    icon: isHome ? '🌐' : '📄',
    url: initialUrl,
    history: [initialUrl],
    historyIndex: 0,
    isLoading: false,
    mode: isHome ? 'home' : (isIframeBlocked(initialUrl) ? 'external_blocked' : 'embedded'),
    loadKey: Date.now(),
  };
}

export default function BrowserApp() {
  const [tabs, setTabs] = useState<BrowserTab[]>([createNewTab()]);
  const [activeTabId, setActiveTabId] = useState<string>(() => tabs[0].id);
  const [addressInput, setAddressInput] = useState(INITIAL_URL);
  const [homeSearchInput, setHomeSearchInput] = useState('');
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const addressInputRef = useRef<HTMLInputElement>(null);
  const { openWindow } = useWindowManager();

  const activeTab = tabs.find((t) => t.id === activeTabId) || tabs[0];

  // Sync address input when active tab changes
  useEffect(() => {
    if (activeTab) {
      setAddressInput(activeTab.url);
    }
  }, [activeTabId, activeTab?.url]);

  // Quick Access items including explicitly requested cards
  const QUICK_ACCESS: QuickAccessItem[] = [
    {
      id: 'google',
      title: 'Google',
      url: 'https://www.google.com',
      icon: '🔍',
      description: 'Search the web & information',
      color: '#4285F4',
      isExternal: true,
      category: 'search',
    },
    {
      id: 'youtube',
      title: 'YouTube',
      url: 'https://www.youtube.com',
      icon: '▶️',
      description: 'Videos, tutorials & music',
      color: '#FF0000',
      isExternal: true,
      category: 'media',
    },
    {
      id: 'github',
      title: 'GitHub',
      url: PERSONAL.github,
      icon: '🐙',
      description: `Navneet's repositories (@${PERSONAL.githubUsername})`,
      color: '#9333EA',
      isExternal: true,
      category: 'dev',
    },
    {
      id: 'linkedin',
      title: 'LinkedIn',
      url: PERSONAL.linkedin,
      icon: '💼',
      description: 'Professional career network & experience',
      color: '#0A66C2',
      isExternal: true,
      category: 'social',
    },
    {
      id: 'leetcode',
      title: 'LeetCode',
      url: 'https://leetcode.com',
      icon: '⚡',
      description: 'DSA & algorithmic problem solving',
      color: '#FFA116',
      isExternal: true,
      category: 'dev',
    },
    {
      id: 'gmail',
      title: 'Gmail',
      url: `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(PERSONAL.email)}`,
      icon: '✉️',
      description: `Compose email to ${PERSONAL.email}`,
      color: '#EA4335',
      isExternal: true,
      category: 'social',
    },
    {
      id: 'wikipedia',
      title: 'Wikipedia (Embed Demo)',
      url: 'https://en.wikipedia.org/wiki/Main_Page',
      icon: '📖',
      description: 'Free encyclopedia (embeddable in iframe)',
      color: '#10B981',
      isExternal: false,
      category: 'search',
    },
    {
      id: 'projects',
      title: 'Projects Showcase',
      url: 'https://navneet.os/projects',
      icon: '💻',
      description: 'Interactive portfolio applications gallery',
      color: '#00F5FF',
      isExternal: false,
      category: 'dev',
    },
  ];

  // Navigate the active tab to a specific destination
  const navigateTab = useCallback(
    (target: string, isFromHistory = false) => {
      const trimmed = target.trim();
      if (!trimmed) return;

      let finalUrl: string;
      let tabTitle: string;
      let tabIcon: string;
      let tabMode: 'home' | 'embedded' | 'external_blocked';
      let searchQuery: string | undefined = undefined;

      if (trimmed === INITIAL_URL || trimmed === 'about:blank' || trimmed.toLowerCase() === 'home') {
        finalUrl = INITIAL_URL;
        tabTitle = 'New Tab';
        tabIcon = '🌐';
        tabMode = 'home';
      } else if (trimmed === 'https://navneet.os/projects') {
        openWindow('projects');
        return;
      } else if (trimmed === 'https://navneet.os/chatgpt') {
        openWindow('chatgpt');
        return;
      } else if (trimmed.toLowerCase().startsWith('mailto:')) {
        const email = trimmed.replace(/^mailto:/i, '').trim();
        finalUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}`;
        tabTitle = `Gmail: ${email}`;
        tabIcon = '✉️';
        tabMode = 'external_blocked';
        window.open(finalUrl, '_blank', 'noopener,noreferrer');
      } else if (isUrlPattern(trimmed)) {
        finalUrl = formatUrl(trimmed);
        const domain = extractDomain(finalUrl);
        tabTitle = domain;
        tabIcon = '🌐';

        if (isIframeBlocked(finalUrl)) {
          tabMode = 'external_blocked';
          // Open in real native browser tab as required
          window.open(finalUrl, '_blank', 'noopener,noreferrer');
        } else {
          tabMode = 'embedded';
        }
      } else {
        // Normal text entered -> Google search
        searchQuery = trimmed;
        finalUrl = `https://www.google.com/search?q=${encodeURIComponent(trimmed)}`;
        tabTitle = `Google: ${trimmed}`;
        tabIcon = '🔍';
        tabMode = 'external_blocked';

        // Automatically open real Google search in new browser tab
        window.open(finalUrl, '_blank', 'noopener,noreferrer');
      }

      setTabs((prev) =>
        prev.map((tab) => {
          if (tab.id !== activeTabId) return tab;

          let newHistory = tab.history;
          let newHistoryIndex = tab.historyIndex;

          if (!isFromHistory) {
            newHistory = [...tab.history.slice(0, tab.historyIndex + 1), finalUrl];
            newHistoryIndex = newHistory.length - 1;
          }

          return {
            ...tab,
            url: finalUrl,
            title: tabTitle,
            icon: tabIcon,
            mode: tabMode,
            searchQuery,
            history: newHistory,
            historyIndex: newHistoryIndex,
            isLoading: tabMode === 'embedded',
            loadKey: Date.now(),
          };
        })
      );

      setAddressInput(finalUrl);
    },
    [activeTabId, openWindow]
  );

  // Address Bar Submit
  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigateTab(addressInput);
  };

  // Home Page Search Submit
  const handleHomeSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (homeSearchInput.trim()) {
      navigateTab(homeSearchInput.trim());
      setHomeSearchInput('');
    }
  };

  // Back Button
  const handleGoBack = () => {
    if (activeTab.historyIndex > 0) {
      const prevIndex = activeTab.historyIndex - 1;
      const prevUrl = activeTab.history[prevIndex];

      setTabs((prev) =>
        prev.map((tab) => {
          if (tab.id !== activeTabId) return tab;
          const isHome = prevUrl === INITIAL_URL;
          const blocked = isIframeBlocked(prevUrl);

          return {
            ...tab,
            url: prevUrl,
            historyIndex: prevIndex,
            title: isHome ? 'New Tab' : extractDomain(prevUrl),
            icon: isHome ? '🌐' : '📄',
            mode: isHome ? 'home' : (blocked ? 'external_blocked' : 'embedded'),
            isLoading: !isHome && !blocked,
            loadKey: Date.now(),
          };
        })
      );
      setAddressInput(prevUrl);
    }
  };

  // Forward Button
  const handleGoForward = () => {
    if (activeTab.historyIndex < activeTab.history.length - 1) {
      const nextIndex = activeTab.historyIndex + 1;
      const nextUrl = activeTab.history[nextIndex];

      setTabs((prev) =>
        prev.map((tab) => {
          if (tab.id !== activeTabId) return tab;
          const isHome = nextUrl === INITIAL_URL;
          const blocked = isIframeBlocked(nextUrl);

          return {
            ...tab,
            url: nextUrl,
            historyIndex: nextIndex,
            title: isHome ? 'New Tab' : extractDomain(nextUrl),
            icon: isHome ? '🌐' : '📄',
            mode: isHome ? 'home' : (blocked ? 'external_blocked' : 'embedded'),
            isLoading: !isHome && !blocked,
            loadKey: Date.now(),
          };
        })
      );
      setAddressInput(nextUrl);
    }
  };

  // Refresh Button
  const handleRefresh = () => {
    setTabs((prev) =>
      prev.map((tab) => {
        if (tab.id !== activeTabId) return tab;
        return {
          ...tab,
          isLoading: tab.mode === 'embedded',
          loadKey: Date.now(),
        };
      })
    );

    // If iframe, stop loading on timer fallback
    setTimeout(() => {
      setTabs((prev) =>
        prev.map((tab) => (tab.id === activeTabId ? { ...tab, isLoading: false } : tab))
      );
    }, 1200);
  };

  // Home Button
  const handleGoHome = () => {
    navigateTab(INITIAL_URL);
  };

  // New Tab Button
  const handleAddTab = () => {
    const freshTab = createNewTab();
    setTabs((prev) => [...prev, freshTab]);
    setActiveTabId(freshTab.id);
    setAddressInput(INITIAL_URL);
    setTimeout(() => addressInputRef.current?.focus(), 50);
  };

  // Close Tab Button
  const handleCloseTab = (tabId: string, e: React.MouseEvent) => {
    e.stopPropagation();

    setTabs((prev) => {
      const filtered = prev.filter((t) => t.id !== tabId);

      // If user closed the only tab, spawn a fresh new tab immediately
      if (filtered.length === 0) {
        const fallback = createNewTab();
        setActiveTabId(fallback.id);
        setAddressInput(INITIAL_URL);
        return [fallback];
      }

      // If active tab was closed, switch to adjacent tab
      if (activeTabId === tabId) {
        const closedIdx = prev.findIndex((t) => t.id === tabId);
        const nextActive = filtered[Math.max(0, closedIdx - 1)] || filtered[0];
        setActiveTabId(nextActive.id);
        setAddressInput(nextActive.url);
      }

      return filtered;
    });
  };

  // Quick Card Click
  const handleQuickAccessClick = (item: QuickAccessItem) => {
    if (item.id === 'projects') {
      openWindow('projects');
      return;
    }
    navigateTab(item.url);
  };

  // Copy URL
  const handleCopyCurrentUrl = () => {
    navigator.clipboard.writeText(activeTab.url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Open active URL in native browser window
  const handleOpenExternal = () => {
    if (activeTab.url && activeTab.url !== INITIAL_URL) {
      window.open(activeTab.url, '_blank', 'noopener,noreferrer');
    }
  };

  // Built-in AI Search assistant on home tab
  const handleAskAI = async (query: string) => {
    if (!query.trim()) return;
    setIsAiLoading(true);
    setAiAnswer(null);
    try {
      const answer = await askGroqAI(query);
      setAiAnswer(answer);
    } catch {
      setAiAnswer('out of context Sorry');
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="browser-app">
      {/* ── 1. Chrome-Style Tab Strip ─────────────────────── */}
      <div className="browser-app__tab-strip">
        <div className="browser-app__tabs-list">
          {tabs.map((tab) => {
            const isActive = tab.id === activeTabId;
            return (
              <div
                key={tab.id}
                className={`browser-tab ${isActive ? 'browser-tab--active' : ''}`}
                onClick={() => {
                  setActiveTabId(tab.id);
                  setAddressInput(tab.url);
                }}
                title={tab.title}
              >
                <span className="browser-tab__icon">{tab.icon}</span>
                <span className="browser-tab__title">{tab.title}</span>
                <button
                  type="button"
                  className="browser-tab__close"
                  onClick={(e) => handleCloseTab(tab.id, e)}
                  title="Close tab (Ctrl+W)"
                >
                  ✕
                </button>
              </div>
            );
          })}
        </div>

        {/* New Tab Button */}
        <button
          type="button"
          className="browser-tab__add-btn"
          onClick={handleAddTab}
          title="New Tab (Ctrl+T)"
        >
          +
        </button>
      </div>

      {/* ── 2. Navigation & Address Toolbar ───────────────── */}
      <div className="browser-app__toolbar">
        {/* Navigation Buttons */}
        <div className="browser-app__nav-controls">
          <button
            type="button"
            className="browser-nav-btn"
            disabled={activeTab.historyIndex <= 0}
            onClick={handleGoBack}
            title="Click to go back"
          >
            ‹
          </button>
          <button
            type="button"
            className="browser-nav-btn"
            disabled={activeTab.historyIndex >= activeTab.history.length - 1}
            onClick={handleGoForward}
            title="Click to go forward"
          >
            ›
          </button>
          <button
            type="button"
            className={`browser-nav-btn ${activeTab.isLoading ? 'browser-nav-btn--loading' : ''}`}
            onClick={handleRefresh}
            title="Reload this page"
          >
            ↻
          </button>
          <button
            type="button"
            className="browser-nav-btn"
            onClick={handleGoHome}
            title="Open Homepage"
          >
            ⌂
          </button>
        </div>

        {/* Address & Search Input Form */}
        <form onSubmit={handleAddressSubmit} className="browser-app__address-form">
          <span className="browser-app__security-badge" title="Secure Connection">
            {activeTab.mode === 'home' ? '🌐' : '🔒'}
          </span>

          <input
            ref={addressInputRef}
            type="text"
            className="browser-app__address-input"
            value={addressInput}
            onChange={(e) => setAddressInput(e.target.value)}
            placeholder="Search Google or enter a website URL..."
            onFocus={(e) => e.target.select()}
          />

          {addressInput && addressInput !== INITIAL_URL && (
            <button
              type="button"
              className="browser-app__clear-btn"
              onClick={() => setAddressInput('')}
              title="Clear address bar"
            >
              ✕
            </button>
          )}

          <button type="submit" className="browser-app__go-btn" title="Go / Search">
            Go
          </button>
        </form>

        {/* Window External Actions */}
        <div className="browser-app__toolbar-actions">
          <button
            type="button"
            className="browser-tool-btn"
            onClick={handleOpenExternal}
            title="Open current page in native browser tab"
          >
            ↗
          </button>
          <div className="browser-app__user-badge">NS</div>
        </div>
      </div>

      {/* ── 3. Animated Loading Progress Bar ─────────────── */}
      <div className={`browser-app__progress-bar ${activeTab.isLoading ? 'browser-app__progress-bar--active' : ''}`} />

      {/* ── 4. Bookmarks Bar ──────────────────────────────── */}
      <div className="browser-app__bookmarks-bar">
        <span className="browser-bookmarks-label">★ Quick:</span>
        <div className="browser-bookmarks-scroll">
          {QUICK_ACCESS.map((item) => (
            <button
              key={item.id}
              type="button"
              className="browser-bookmark-chip"
              onClick={() => handleQuickAccessClick(item)}
            >
              <span className="browser-bookmark-chip__icon">{item.icon}</span>
              <span className="browser-bookmark-chip__title">{item.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── 5. Main Browser Canvas Viewport ───────────────── */}
      <div className="browser-app__viewport">
        {/* Case A: Home / New Tab View */}
        {activeTab.mode === 'home' && (
          <div className="browser-home">
            {/* Ambient Logo & Header */}
            <div className="browser-home__branding">
              <div className="browser-home__globe-icon">🌐</div>
              <h1 className="browser-home__title">Navneet Browser</h1>
              <p className="browser-home__subtitle">
                High-speed developer browser with Google search, direct URL navigation, and seamless external fallbacks.
              </p>
            </div>

            {/* Omnibox / Google Search Bar */}
            <form onSubmit={handleHomeSearchSubmit} className="browser-home__search-box">
              <span className="browser-home__search-prefix">🔍</span>
              <input
                type="text"
                className="browser-home__search-input"
                placeholder="Search with Google or type a website URL..."
                value={homeSearchInput}
                onChange={(e) => setHomeSearchInput(e.target.value)}
              />
              <button
                type="submit"
                className="browser-home__search-submit"
                disabled={!homeSearchInput.trim()}
              >
                Search Google
              </button>
            </form>

            {/* AI Assistant Question Box */}
            <div className="browser-home__ai-section">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (homeSearchInput.trim()) {
                    handleAskAI(homeSearchInput.trim());
                  }
                }}
                className="browser-home__ai-subform"
              >
                <span className="browser-home__ai-tag">🤖 Groq AI Assistant:</span>
                <button
                  type="button"
                  className="browser-home__ai-btn"
                  onClick={() => handleAskAI('What are Navneet Sinha’s featured full-stack projects?')}
                >
                  ⚡ Ask AI about Navneet
                </button>
              </form>

              {isAiLoading && (
                <div className="browser-home__ai-loading">
                  <span className="browser-spinner" /> Querying high-speed Groq AI...
                </div>
              )}

              {aiAnswer && (
                <div className="browser-home__ai-card">
                  <div className="browser-home__ai-card-header">
                    <span>🤖 Navneet Portfolio AI</span>
                    <button
                      type="button"
                      className="browser-home__ai-card-close"
                      onClick={() => setAiAnswer(null)}
                    >
                      ✕
                    </button>
                  </div>
                  <div className="browser-home__ai-card-body">{aiAnswer}</div>
                </div>
              )}
            </div>

            {/* Quick Access Cards Grid (Google, YouTube, GitHub, LinkedIn, LeetCode, Gmail) */}
            <div className="browser-home__cards-header">
              <h3 className="browser-home__cards-title">Frequently Visited & Quick Shortcuts</h3>
              <span className="browser-home__cards-sub">One-click instant launch</span>
            </div>

            <div className="browser-home__grid">
              {QUICK_ACCESS.map((card) => (
                <div
                  key={card.id}
                  className="browser-shortcut-card"
                  style={{ '--card-accent': card.color } as React.CSSProperties}
                  onClick={() => handleQuickAccessClick(card)}
                >
                  <div className="browser-shortcut-card__top">
                    <span className="browser-shortcut-card__icon">{card.icon}</span>
                    <span className="browser-shortcut-card__badge">
                      {card.isExternal ? 'Opens External ↗' : 'In-OS'}
                    </span>
                  </div>

                  <div className="browser-shortcut-card__info">
                    <h4 className="browser-shortcut-card__title">{card.title}</h4>
                    <p className="browser-shortcut-card__desc">{card.description}</p>
                  </div>

                  <div className="browser-shortcut-card__footer">
                    <span className="browser-shortcut-card__action">Launch ➔</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Case B: Iframe Blocked (Google, YouTube, GitHub, etc.) */}
        {activeTab.mode === 'external_blocked' && (
          <div className="browser-external-fallback">
            <div className="browser-external-card">
              <div className="browser-external-card__icon-wrap">
                <span className="browser-external-card__icon">🔒</span>
              </div>

              <span className="browser-external-card__badge">EXTERNAL LAUNCH NOTICE</span>
              <h2 className="browser-external-card__title">
                {activeTab.searchQuery
                  ? `Google Search: "${activeTab.searchQuery}"`
                  : `Opened ${extractDomain(activeTab.url)} in New Tab`}
              </h2>

              <p className="browser-external-card__desc">
                Websites such as <strong>{extractDomain(activeTab.url)}</strong> restrict iframe embedding via{' '}
                <code>X-Frame-Options: SAMEORIGIN / DENY</code> and Content-Security-Policy (CSP) headers.
                <br />
                To provide an optimal experience without broken frames, this destination was launched directly in your native browser tab!
              </p>

              <div className="browser-external-card__url-box">
                <span className="browser-external-card__url-glyph">🔗</span>
                <span className="browser-external-card__url-text">{activeTab.url}</span>
              </div>

              <div className="browser-external-card__actions">
                <button
                  type="button"
                  className="browser-btn browser-btn--primary"
                  onClick={() => window.open(activeTab.url, '_blank', 'noopener,noreferrer')}
                >
                  <span>Open Again in New Tab</span>
                  <span>↗</span>
                </button>

                <button
                  type="button"
                  className="browser-btn browser-btn--secondary"
                  onClick={handleCopyCurrentUrl}
                >
                  {copiedLink ? '✓ Link Copied!' : 'Copy Link 📋'}
                </button>

                <button
                  type="button"
                  className="browser-btn browser-btn--outline"
                  onClick={handleGoHome}
                >
                  Back to Homepage ⌂
                </button>
              </div>

              <div className="browser-external-card__tips">
                <span>💡 Tip:</span> You can open multiple tabs simultaneously using the <code>+</code> button above or test embeddable websites like Wikipedia!
              </div>
            </div>
          </div>
        )}

        {/* Case C: Embedded Iframe View (Wikipedia, docs, allowed sites) */}
        {activeTab.mode === 'embedded' && (
          <div className="browser-embedded-container">
            <iframe
              key={activeTab.loadKey}
              src={activeTab.url}
              className="browser-app__iframe"
              title={activeTab.title}
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
              onLoad={() => {
                setTabs((prev) =>
                  prev.map((t) => (t.id === activeTabId ? { ...t, isLoading: false } : t))
                );
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
