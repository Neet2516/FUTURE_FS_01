import { useEffect, useRef } from 'react';
import { useTerminal } from '../../hooks/useTerminal';
import { useWindowManager, type AppId } from '../../context/WindowContext';
import { TERMINAL_COMMANDS } from '../../data/portfolio';
import NeofetchHero from '../terminal/NeofetchHero';
import './TerminalApp.css';

export default function TerminalApp() {
  const { openWindow } = useWindowManager();

  const {
    lines,
    input,
    setInput,
    handleKeyDown,
    endRef,
    submit,
    suggestions,
    activeSuggestionIndex,
    ghostSuffix,
    autocomplete,
  } = useTerminal({
    onLaunchGUI: () => openWindow('projects'),
    onOpenApp: (app) => openWindow(app as AppId),
  });

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleContainerClick = () => {
    inputRef.current?.focus();
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    const lower = trimmed.toLowerCase();

    // OS inter-app navigation commands
    if (lower === 'music' || lower === 'player') {
      openWindow('music');
      submit(input);
    } else if (lower === 'files' || lower === 'nautilus' || lower === 'explorer') {
      openWindow('files');
      submit(input);
    } else if (lower === 'browser' || lower === 'chrome' || lower === 'web') {
      openWindow('browser');
      submit(input);
    } else if (lower === 'projects' || lower === 'code') {
      openWindow('projects');
      submit(input);
    } else if (lower === 'settings') {
      openWindow('settings');
      submit(input);
    } else {
      submit(input);
    }
  };

  return (
    <div className="term-app" ref={containerRef} onClick={handleContainerClick}>
      {/* Terminal Output Area */}
      <div className="term-app__output">
        {/* Initial Neofetch Hero Showcase matching reference design */}
        <div className="term-app__hero-section">
          <div className="term-app__prompt-line term-app__prompt-line--initial">
            <span className="term-app__prompt-user">navneet@portfolio</span>
            <span className="term-app__prompt-colon">:</span>
            <span className="term-app__prompt-path">~</span>
            <span className="term-app__prompt-sym">$ </span>
            <span className="term-app__input-echo">neofetch</span>
          </div>

          <div className="term-app__neofetch-wrapper">
            <NeofetchHero onOpenApp={(app) => openWindow(app as AppId)} />
          </div>
        </div>

        {/* Dynamic Lines Stream */}
        <div className="term-app__lines">
          {lines.slice(14).map((line) => (
            <div key={line.id} className={`term-app__line term-app__line--${line.type}`}>
              {line.type === 'neofetch' ? (
                <div className="term-app__neofetch-wrapper">
                  <NeofetchHero onOpenApp={(app) => openWindow(app as AppId)} />
                </div>
              ) : line.type === 'input' ? (
                <div className="term-app__prompt-line">
                  <span className="term-app__prompt-user">navneet@portfolio</span>
                  <span className="term-app__prompt-colon">:</span>
                  <span className="term-app__prompt-path">~</span>
                  <span className="term-app__prompt-sym">$ </span>
                  <span className="term-app__input-echo">{Array.isArray(line.content) ? line.content[0] : line.content}</span>
                </div>
              ) : (
                <div className="term-app__content-rows">
                  {(Array.isArray(line.content) ? line.content : [line.content]).map((c, i) => (
                    <div key={i}>{c}</div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Active Command Prompt */}
        <form onSubmit={handleCustomSubmit} className="term-app__active-prompt">
          <span className="term-app__prompt-user">navneet@portfolio</span>
          <span className="term-app__prompt-colon">:</span>
          <span className="term-app__prompt-path">~</span>
          <span className="term-app__prompt-sym">$ </span>
          <div className="term-app__input-wrapper">
            {ghostSuffix && (
              <div className="term-app__ghost-layer" aria-hidden="true">
                <span className="term-app__ghost-invisible">{input}</span>
                <span className="term-app__ghost-suffix">{ghostSuffix}</span>
              </div>
            )}
            <input
              ref={inputRef}
              type="text"
              className="term-app__input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              spellCheck={false}
              autoCapitalize="off"
              autoComplete="off"
              autoFocus
            />
          </div>
        </form>

        {/* Dynamic Command Suggestions */}
        {suggestions.length > 0 && input.trim().length >= 1 && (
          <div className="term-app__suggestions-panel" role="listbox" aria-label="Command suggestions">
            <div className="term-app__suggestions-header">
              <span className="term-app__suggestions-hint">
                Suggestions (Press <kbd>Tab ⇥</kbd> to cycle & autocomplete):
              </span>
            </div>
            <div className="term-app__suggestions-list">
              {suggestions.map((cmd, idx) => {
                const isSelected = idx === activeSuggestionIndex;
                const queryLen = input.trim().length;
                const prefix = cmd.slice(0, queryLen);
                const remainder = cmd.slice(queryLen);
                const cmdMeta = TERMINAL_COMMANDS[cmd as keyof typeof TERMINAL_COMMANDS];

                return (
                  <button
                    key={cmd}
                    type="button"
                    className={`term-app__suggestion-item ${isSelected ? 'term-app__suggestion-item--active' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      autocomplete(cmd);
                      inputRef.current?.focus();
                    }}
                    title={`Click to autocomplete "${cmd}"`}
                    role="option"
                    aria-selected={isSelected}
                  >
                    <span className="term-app__sugg-cmd">
                      <span className="term-app__sugg-match">{prefix}</span>
                      <span className="term-app__sugg-rest">{remainder}</span>
                    </span>
                    {cmdMeta?.description && (
                      <span className="term-app__sugg-desc">{cmdMeta.description}</span>
                    )}
                    {isSelected && <kbd className="term-app__sugg-badge">Tab ⇥</kbd>}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div ref={endRef} />
      </div>
    </div>
  );
}
