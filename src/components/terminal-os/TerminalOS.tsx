import { useEffect, useRef } from 'react';
import { useTerminal, type TerminalLine } from '../../hooks/useTerminal';
import { useTheme } from '../../context/ThemeContext';
import { TERMINAL_COMMANDS } from '../../data/portfolio';
import NeofetchHero from '../terminal/NeofetchHero';
import './TerminalOS.css';

interface TerminalOSProps {
  onLaunchGUI: () => void;
  onReboot?: () => void;
}

const QUICK_COMMANDS = ['whoami', 'help', 'about', 'skills', 'projects', 'neofetch', 'theme', 'gui'];

function TerminalOSLine({ line }: { line: TerminalLine }) {
  const content = Array.isArray(line.content) ? line.content : [line.content];

  if (line.type === 'neofetch') {
    return (
      <div className="os-term__line os-term__line--neofetch">
        <NeofetchHero />
      </div>
    );
  }

  if (line.type === 'input') {
    return (
      <div className="os-term__line os-term__line--input">
        <span className="os-term__prompt">
          <span className="os-term__prompt-user">navneet</span>
          <span className="os-term__prompt-at">@</span>
          <span className="os-term__prompt-host">portfolio</span>
          <span className="os-term__prompt-path">:~</span>
          <span className="os-term__prompt-sym">$ </span>
        </span>
        <span className="os-term__input-echo">{content[0]}</span>
      </div>
    );
  }

  if (line.type === 'system') {
    return (
      <div className="os-term__line os-term__line--system">
        {content.map((c, i) => (
          <div key={i}>{c}</div>
        ))}
      </div>
    );
  }

  return (
    <div className={`os-term__line os-term__line--${line.type}`}>
      {content.map((c, i) => (
        <div key={i} className="os-term__line-row">
          {c}
        </div>
      ))}
    </div>
  );
}

export default function TerminalOS({ onLaunchGUI, onReboot }: TerminalOSProps) {
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
    onLaunchGUI,
    onReboot,
  });
  const { currentTheme, openThemeSelector } = useTheme();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto focus terminal input on mount & on any click in terminal area
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleContainerClick = () => {
    inputRef.current?.focus();
  };

  return (
    <div className="os-shell-container" onClick={handleContainerClick}>
      {/* Background scanline & ambient glow */}
      <div className="os-shell-ambient" aria-hidden="true" />

      {/* Main Terminal Window */}
      <main className="os-term-window" ref={containerRef}>
        {/* Title Bar */}
        <header className="os-term__titlebar">
          <div className="os-term__traffic-lights">
            <button
              type="button"
              className="os-term__dot os-term__dot--red"
              title="Launch GUI Desktop"
              aria-label="Launch GUI Desktop"
              onClick={(e) => {
                e.stopPropagation();
                onLaunchGUI();
              }}
            />
            <button
              type="button"
              className="os-term__dot os-term__dot--yellow"
              title="Change Theme"
              aria-label="Change Theme"
              onClick={(e) => {
                e.stopPropagation();
                openThemeSelector();
              }}
            />
            <button
              type="button"
              className="os-term__dot os-term__dot--green"
              title="Maximize / Launch GUI"
              aria-label="Maximize / Launch GUI"
              onClick={(e) => {
                e.stopPropagation();
                onLaunchGUI();
              }}
            />
          </div>

          <div className="os-term__title">
            <span className="os-term__title-icon">&gt;_</span>
            <span className="os-term__title-user">navneet@portfolio: ~</span>
            <span className="os-term__title-shell">(bash 5.2)</span>
          </div>

          <div className="os-term__title-actions">
            <button
              type="button"
              className="os-term__theme-pill"
              onClick={(e) => {
                e.stopPropagation();
                openThemeSelector();
              }}
              title="Color Theme (Ctrl+K Ctrl+T)"
            >
              <span className="os-term__theme-icon">🎨</span>
              <span className="os-term__theme-name">{currentTheme.name}</span>
            </button>
            <button
              type="button"
              className="os-term__gui-switch-btn"
              onClick={(e) => {
                e.stopPropagation();
                onLaunchGUI();
              }}
              title="Switch to GUI visual portfolio"
            >
              <span>Launch GUI</span>
              <kbd>gui</kbd>
            </button>
          </div>
        </header>

        {/* Quick Command Chips */}
        <div className="os-term__chips-bar" role="toolbar" aria-label="Quick terminal commands">
          <span className="os-term__chips-label">Quick run:</span>
          {QUICK_COMMANDS.map((cmd) => (
            <button
              key={cmd}
              type="button"
              className={`os-term__chip ${cmd === 'gui' ? 'os-term__chip--accent' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                if (cmd === 'gui') {
                  onLaunchGUI();
                } else {
                  submit(cmd);
                }
              }}
            >
              {cmd}
            </button>
          ))}
        </div>

        {/* Terminal Scrollable Stream Area */}
        <div className="os-term__body" role="region" aria-label="Terminal Shell Output">
          <div className="os-term__lines">
            {lines.map((line) => (
              <TerminalOSLine key={line.id} line={line} />
            ))}
          </div>

          {/* Active Command Input Line */}
          <div className="os-term__input-line">
            <label htmlFor="os-terminal-input" className="os-term__prompt">
              <span className="os-term__prompt-user">navneet</span>
              <span className="os-term__prompt-at">@</span>
              <span className="os-term__prompt-host">portfolio</span>
              <span className="os-term__prompt-path">:~</span>
              <span className="os-term__prompt-sym">$ </span>
            </label>

            <div className="os-term__input-wrapper">
              {ghostSuffix && (
                <div className="os-term__ghost-layer" aria-hidden="true">
                  <span className="os-term__ghost-invisible">{input}</span>
                  <span className="os-term__ghost-suffix">{ghostSuffix}</span>
                </div>
              )}
              <input
                id="os-terminal-input"
                ref={inputRef}
                type="text"
                className="os-term__real-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                autoFocus
                spellCheck={false}
                autoCapitalize="off"
                autoComplete="off"
                aria-label="Terminal command prompt"
              />
              <span className="os-term__custom-caret" aria-hidden="true" />
            </div>
          </div>

          {/* Command Suggestions Popup Panel */}
          {suggestions.length > 0 && input.trim().length >= 1 && (
            <div className="os-term__suggestions-panel" role="listbox" aria-label="Command suggestions">
              <div className="os-term__suggestions-header">
                <span className="os-term__suggestions-hint">
                  Suggestions (Press <kbd>Tab ⇥</kbd> to cycle & autocomplete):
                </span>
              </div>
              <div className="os-term__suggestions-list">
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
                      className={`os-term__suggestion-item ${isSelected ? 'os-term__suggestion-item--active' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        autocomplete(cmd);
                        inputRef.current?.focus();
                      }}
                      onDoubleClick={(e) => {
                        e.stopPropagation();
                        submit(cmd);
                      }}
                      title={`Click to complete "${cmd}" • Double click to execute`}
                      role="option"
                      aria-selected={isSelected}
                    >
                      <span className="os-term__sugg-cmd">
                        <span className="os-term__sugg-match">{prefix}</span>
                        <span className="os-term__sugg-rest">{remainder}</span>
                      </span>
                      {cmdMeta?.description && (
                        <span className="os-term__sugg-desc">{cmdMeta.description}</span>
                      )}
                      {isSelected && <kbd className="os-term__sugg-badge">Tab ⇥</kbd>}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Auto-scroll anchor */}
          <div ref={endRef} />
        </div>

        {/* Status Bar / Bottom Help Hint */}
        <footer className="os-term__statusbar">
          <div className="os-term__status-left">
            <span className="os-term__status-dot" aria-hidden="true" />
            <span className="os-term__status-hint">
              Type <kbd>help</kbd> to explore • Type <kbd>gui</kbd> to open portfolio
            </span>
          </div>

          <div className="os-term__status-right">
            <span className="os-term__status-key">
              <kbd>Tab</kbd> autocomplete
            </span>
            <span className="os-term__status-key">
              <kbd>Ctrl+L</kbd> clear
            </span>
            <button
              type="button"
              className="os-term__status-gui-btn"
              onClick={(e) => {
                e.stopPropagation();
                onLaunchGUI();
              }}
            >
              Open GUI Portfolio &rarr;
            </button>
          </div>
        </footer>
      </main>
    </div>
  );
}
