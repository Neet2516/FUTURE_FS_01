import { useEffect, useRef } from 'react';
import { useTerminal } from '../../hooks/useTerminal';
import type { TerminalLine } from '../../hooks/useTerminal';
import { PERSONAL } from '../../data/portfolio';
import './Terminal.css';

interface TerminalProps {
  isOpen: boolean;
  onClose: () => void;
}

const COMMAND_SUGGESTIONS = [
  'help', 'about', 'projects', 'skills', 'experience', 'dsa', 'achievements', 'contact', 'clear'
];

function LineOutput({ line }: { line: TerminalLine }) {
  const content = Array.isArray(line.content) ? line.content : [line.content];

  if (line.type === 'input') {
    return (
      <div className="term-line term-line--input">
        <span className="term-prompt">
          <span className="term-prompt-user">navneet</span>
          <span className="term-prompt-at">@</span>
          <span className="term-prompt-host">portfolio</span>
          <span className="term-prompt-sym"> $ </span>
        </span>
        <span className="term-input-text">{content[0]}</span>
      </div>
    );
  }

  return (
    <>
      {content.map((c, i) => (
        <div key={i} className={`term-line term-line--${line.type}`}>
          {c}
        </div>
      ))}
    </>
  );
}

export default function Terminal({ isOpen, onClose }: TerminalProps) {
  const {
    lines,
    input,
    setInput,
    handleKeyDown,
    endRef,
    submit,
    suggestions,
    activeSuggestionIndex,
    autocomplete,
  } = useTerminal();
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Auto-focus input when terminal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // ESC to close
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  // Trap body scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="term-backdrop" onClick={onClose} aria-hidden="true" />

      {/* Terminal Panel */}
      <div
        className="term-panel"
        role="dialog"
        aria-label="Interactive terminal"
        aria-modal="true"
        ref={panelRef}
      >
        {/* Title Bar */}
        <div className="term-titlebar">
          <div className="term-titlebar-dots">
            <button
              className="term-dot term-dot--red"
              onClick={onClose}
              aria-label="Close terminal"
              title="Close"
            />
            <span className="term-dot term-dot--yellow" aria-hidden="true" />
            <span className="term-dot term-dot--green" aria-hidden="true" />
          </div>
          <div className="term-titlebar-title">
            <span>navneet</span>
            <span style={{ color: 'var(--text-muted)' }}>@</span>
            <span style={{ color: 'var(--cyan)' }}>portfolio</span>
            <span style={{ color: 'var(--text-muted)' }}> — zsh</span>
          </div>
          <div className="term-titlebar-actions">
            {/* Quick command buttons */}
            <div className="term-quick-cmds">
              {COMMAND_SUGGESTIONS.slice(0, 5).map((cmd) => (
                <button
                  key={cmd}
                  className="term-quick-btn"
                  onClick={() => submit(cmd)}
                  aria-label={`Run command: ${cmd}`}
                >
                  {cmd}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Output Area */}
        <div
          className="term-output"
          onClick={() => inputRef.current?.focus()}
          aria-label="Terminal output"
          aria-live="polite"
          aria-atomic="false"
        >
          {lines.map((line) => (
            <LineOutput key={line.id} line={line} />
          ))}
          <div ref={endRef} />
        </div>

        {/* Input Area */}
        <div className="term-input-area">
          <div className="term-input-line">
            <span className="term-prompt-full">
              <span className="term-p-bracket">┌─(</span>
              <span className="term-p-user">navneet</span>
              <span className="term-p-at">@</span>
              <span className="term-p-host">portfolio</span>
              <span className="term-p-bracket">)-[~]</span>
            </span>
          </div>
          <div className="term-input-row">
            <span className="term-p-arrow">└─</span>
            <span className="term-p-dollar">$</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="term-input-field"
              placeholder="type 'help' for commands..."
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              aria-label="Terminal input"
            />
          </div>

          {/* Tab completion hints */}
          {suggestions.length > 0 && input.trim().length >= 1 && (
            <div className="term-suggestions" role="listbox" aria-label="Command suggestions">
              {suggestions.slice(0, 6).map((cmd, idx) => {
                const isSelected = idx === activeSuggestionIndex;
                const queryLen = input.trim().length;
                return (
                  <button
                    key={cmd}
                    className={`term-suggestion ${isSelected ? 'term-suggestion--active' : ''}`}
                    onClick={() => { autocomplete(cmd); inputRef.current?.focus(); }}
                    role="option"
                    aria-selected={isSelected}
                  >
                    <span style={{ color: 'var(--cyan)', textDecoration: 'underline' }}>{cmd.slice(0, queryLen)}</span>
                    <span>{cmd.slice(queryLen)}</span>
                    {isSelected && <kbd style={{ marginLeft: 6, fontSize: 9, opacity: 0.8 }}>Tab ⇥</kbd>}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Help hint */}
        <div className="term-footer">
          <span>Tab: autocomplete</span>
          <span>↑↓: history</span>
          <span>ESC: close</span>
          <span>Email: {PERSONAL.email}</span>
        </div>
      </div>
    </>
  );
}
