import { useState, useRef, useEffect } from 'react';
import { askGroqConversation, type ChatMessage } from '../../services/groqService';
import './ChatGPTApp.css';

interface ChatSession {
  id: string;
  title: string;
  createdAt: number;
  messages: ChatMessage[];
}

const STORAGE_KEY = 'navneet_chatgpt_sessions_v1';

const SUGGESTED_PROMPTS = [
  {
    title: 'Skills & Tech Stack',
    desc: "What are Navneet's strongest skills and frontend frameworks?",
    prompt: "What are Navneet's core technical skills, frontend frameworks, and backend technologies?",
    icon: '⚡',
  },
  {
    title: 'Featured Projects',
    desc: 'Showcase production-grade full-stack web applications',
    prompt: 'Tell me about the top featured projects Navneet has built and the problems they solve.',
    icon: '🚀',
  },
  {
    title: 'Experience & Background',
    desc: 'Walk through work history, GDG community, and education',
    prompt: 'Summarize Navneet Sinha’s work experience, education at AKGEC, and community achievements.',
    icon: '💼',
  },
  {
    title: 'LeetCode & Problem Solving',
    desc: 'DSA problem count, rating, topics mastered & streak',
    prompt: 'What are Navneet’s LeetCode problem-solving stats and DSA topic proficiencies?',
    icon: '🧠',
  },
];

function generateId(): string {
  return 'chat_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
}

function loadSessions(): ChatSession[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // ignore
  }
  return [
    {
      id: generateId(),
      title: 'New Conversation',
      createdAt: Date.now(),
      messages: [],
    },
  ];
}

function saveSessions(sessions: ChatSession[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  } catch {
    // ignore
  }
}

export default function ChatGPTApp() {
  const [sessions, setSessions] = useState<ChatSession[]>(loadSessions);
  const [currentSessionId, setCurrentSessionId] = useState<string>(() => sessions[0]?.id || generateId());
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const activeSession = sessions.find((s) => s.id === currentSessionId) || sessions[0];
  const currentMessages = activeSession?.messages || [];

  // Scroll to bottom on message update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages, isLoading]);

  // Save sessions to localStorage
  useEffect(() => {
    saveSessions(sessions);
  }, [sessions]);

  // Adjust textarea height
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 140)}px`;
    }
  }, [input]);

  const handleNewChat = () => {
    const newSession: ChatSession = {
      id: generateId(),
      title: 'New Chat',
      createdAt: Date.now(),
      messages: [],
    };
    setSessions((prev) => [newSession, ...prev]);
    setCurrentSessionId(newSession.id);
    setInput('');
    setTimeout(() => textareaRef.current?.focus(), 50);
  };

  const handleDeleteSession = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setSessions((prev) => {
      const filtered = prev.filter((s) => s.id !== id);
      if (filtered.length === 0) {
        const fresh: ChatSession = {
          id: generateId(),
          title: 'New Chat',
          createdAt: Date.now(),
          messages: [],
        };
        setCurrentSessionId(fresh.id);
        return [fresh];
      }
      if (currentSessionId === id) {
        setCurrentSessionId(filtered[0].id);
      }
      return filtered;
    });
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || isLoading) return;

    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    const userMessage: ChatMessage = { role: 'user', content: text };
    const updatedMessages = [...currentMessages, userMessage];

    // Auto-generate title for first message
    const updatedTitle =
      currentMessages.length === 0
        ? text.slice(0, 32) + (text.length > 32 ? '...' : '')
        : activeSession.title;

    setSessions((prev) =>
      prev.map((s) =>
        s.id === currentSessionId
          ? { ...s, title: updatedTitle, messages: updatedMessages }
          : s
      )
    );

    setIsLoading(true);

    try {
      const reply = await askGroqConversation(updatedMessages);

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: reply,
      };

      setSessions((prev) =>
        prev.map((s) =>
          s.id === currentSessionId
            ? { ...s, messages: [...updatedMessages, assistantMessage] }
            : s
        )
      );
    } catch {
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: 'out of context Sorry',
      };
      setSessions((prev) =>
        prev.map((s) =>
          s.id === currentSessionId
            ? { ...s, messages: [...updatedMessages, errorMessage] }
            : s
        )
      );
    } finally {
      setIsLoading(false);
      setTimeout(() => textareaRef.current?.focus(), 50);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Helper to format assistant message content (bold, code blocks, lists)
  const renderFormattedContent = (content: string) => {
    // If output is out of context
    if (content === 'out of context Sorry') {
      return (
        <div className="chatgpt-context-alert">
          <span className="chatgpt-context-alert__icon">⚠️</span>
          <div>
            <strong>Out of Context Notice:</strong>
            <p>
              I am dedicated solely to answering questions about <strong>Navneet Sinha</strong> (his projects,
              experience, technical skills, resume, and accomplishments). Please ask questions related to his portfolio!
            </p>
          </div>
        </div>
      );
    }

    type ContentPart =
      | { type: 'text'; value: string }
      | { type: 'code'; lang: string; code: string };

    // Split on code blocks ```
    const codeBlockRegex = /```([a-zA-Z]*)\n([\s\S]*?)```/g;
    const parts: ContentPart[] = [];
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        parts.push({ type: 'text', value: content.substring(lastIndex, match.index) });
      }
      parts.push({ type: 'code', lang: match[1] || 'code', code: match[2].trim() });
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < content.length) {
      parts.push({ type: 'text', value: content.substring(lastIndex) });
    }

    return (
      <div className="chatgpt-formatted-text">
        {parts.map((p, idx) => {
          if (p.type === 'code') {
            return (
              <div key={idx} className="chatgpt-code-block">
                <div className="chatgpt-code-block__header">
                  <span className="chatgpt-code-block__lang">{p.lang}</span>
                  <button
                    type="button"
                    className="chatgpt-code-block__copy"
                    onClick={() => handleCopyText(p.code, `code_${idx}`)}
                  >
                    {copiedId === `code_${idx}` ? '✓ Copied!' : 'Copy code'}
                  </button>
                </div>
                <pre>
                  <code>{p.code}</code>
                </pre>
              </div>
            );
          }

          // Format paragraphs, bold markdown, and bullet points
          const paragraphs = p.value.split('\n\n');
          return (
            <div key={idx} className="chatgpt-text-chunk">
              {paragraphs.map((para, pIdx) => {
                const lines = para.split('\n');
                return (
                  <p key={pIdx}>
                    {lines.map((line, lIdx) => {
                      const trimmedLine = line.trim();
                      // Simple bold formatter **text**
                      const boldParts = trimmedLine.split(/(\*\*.*?\*\*)/g);

                      const formattedLine = boldParts.map((bp, bIdx) => {
                        if (bp.startsWith('**') && bp.endsWith('**')) {
                          return <strong key={bIdx}>{bp.slice(2, -2)}</strong>;
                        }
                        return bp;
                      });

                      const isBullet = trimmedLine.startsWith('•') || trimmedLine.startsWith('- ') || trimmedLine.startsWith('* ');

                      return (
                        <span key={lIdx} className={isBullet ? 'chatgpt-bullet-line' : 'chatgpt-regular-line'}>
                          {formattedLine}
                          {lIdx < lines.length - 1 && <br />}
                        </span>
                      );
                    })}
                  </p>
                );
              })}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="chatgpt-container">
      {/* ── Left Sidebar ───────────────────────────────────── */}
      <aside className={`chatgpt-sidebar ${isSidebarOpen ? 'chatgpt-sidebar--open' : 'chatgpt-sidebar--collapsed'}`}>
        <div className="chatgpt-sidebar__top">
          {/* Logo & New Chat */}
          <div className="chatgpt-sidebar__brand">
            <div className="chatgpt-logo-icon">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
                <rect width="24" height="24" rx="6" fill="#10a37f" />
                <path
                  d="M12 5.5a3.5 3.5 0 0 1 3.5 3.5v.7a3.5 3.5 0 0 1 3 5.2l-.5.9a3.5 3.5 0 0 1-3 5.2h-.5a3.5 3.5 0 0 1-3-1.7l-.5-1a3.5 3.5 0 0 1-4.2-4.2l.5-1a3.5 3.5 0 0 1 2.2-4.1V9a3.5 3.5 0 0 1 2.5-3.5z"
                  stroke="#fff"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="12" cy="12" r="2.2" fill="#fff" />
              </svg>
            </div>
            <span className="chatgpt-sidebar__title">ChatGPT</span>
            <button
              type="button"
              className="chatgpt-icon-btn chatgpt-sidebar__toggle"
              onClick={() => setIsSidebarOpen(false)}
              title="Close sidebar"
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z"/>
              </svg>
            </button>
          </div>

          <button
            type="button"
            className="chatgpt-new-chat-btn"
            onClick={handleNewChat}
          >
            <span className="chatgpt-new-chat-btn__plus">+</span>
            <span>New chat</span>
          </button>
        </div>

        {/* Sessions List */}
        <div className="chatgpt-sidebar__sessions">
          <div className="chatgpt-sidebar__heading">Recent Chats</div>
          <div className="chatgpt-sidebar__list">
            {sessions.map((session) => (
              <div
                key={session.id}
                className={`chatgpt-session-item ${session.id === currentSessionId ? 'chatgpt-session-item--active' : ''}`}
                onClick={() => setCurrentSessionId(session.id)}
              >
                <span className="chatgpt-session-item__icon">💬</span>
                <span className="chatgpt-session-item__title">{session.title}</span>
                <button
                  type="button"
                  className="chatgpt-session-item__delete"
                  onClick={(e) => handleDeleteSession(e, session.id)}
                  title="Delete chat"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="chatgpt-sidebar__footer">
          <div className="chatgpt-model-badge">
            <span className="chatgpt-model-badge__dot" />
            <span className="chatgpt-model-badge__text">Groq High-Speed LPU</span>
          </div>
          <div className="chatgpt-user-pill">
            <div className="chatgpt-user-avatar">👤</div>
            <div className="chatgpt-user-info">
              <span className="chatgpt-user-name">Guest Recruiter</span>
              <span className="chatgpt-user-role">Free Tier • Ultra Fast</span>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main Chat Canvas ────────────────────────────────── */}
      <main className="chatgpt-main">
        {/* Top Navbar */}
        <header className="chatgpt-header">
          {!isSidebarOpen && (
            <button
              type="button"
              className="chatgpt-icon-btn chatgpt-header__open-sidebar"
              onClick={() => setIsSidebarOpen(true)}
              title="Open sidebar"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
              </svg>
            </button>
          )}

          <div className="chatgpt-model-selector">
            <span className="chatgpt-model-selector__name">ChatGPT 4o</span>
            <span className="chatgpt-model-selector__provider">(Groq Cloud)</span>
            <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
              <path d="M7 10l5 5 5-5z"/>
            </svg>
          </div>

          <div className="chatgpt-header__actions">
            <button
              type="button"
              className="chatgpt-header__btn"
              onClick={handleNewChat}
              title="New Chat"
            >
              <span className="chatgpt-header__btn-icon">✏️</span>
              <span>New</span>
            </button>
          </div>
        </header>

        {/* Message Area */}
        <div className="chatgpt-messages-container">
          {currentMessages.length === 0 ? (
            /* Empty State */
            <div className="chatgpt-empty-state">
              <div className="chatgpt-empty-logo">
                <svg viewBox="0 0 48 48" width="48" height="48" fill="none">
                  <rect width="48" height="48" rx="12" fill="#10a37f" />
                  <g transform="translate(6, 6) scale(0.75)" stroke="#ffffff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" fill="none">
                    <path d="M24 11.5a6.5 6.5 0 0 1 6.5 6.5v1.2a6.5 6.5 0 0 1 5.6 9.7l-1 1.8a6.5 6.5 0 0 1-5.6 9.8H27a6.5 6.5 0 0 1-5.6-3.2l-1-1.8a6.5 6.5 0 0 1-7.9-7.9l1-1.8A6.5 6.5 0 0 1 19 16.2V15a6.5 6.5 0 0 1 5-3.5z" />
                    <path d="M19 24h10" />
                    <path d="M24 19v10" />
                    <circle cx="24" cy="24" r="5" fill="#ffffff" fillOpacity="0.2" />
                  </g>
                </svg>
              </div>

              <h2 className="chatgpt-empty-title">What can I help with today?</h2>
              <p className="chatgpt-empty-subtitle">
                Ask anything about Navneet Sinha's software engineering background, projects, LeetCode stats, or skills.
              </p>

              <div className="chatgpt-suggestions-grid">
                {SUGGESTED_PROMPTS.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className="chatgpt-suggestion-card"
                    onClick={() => handleSendMessage(item.prompt)}
                  >
                    <div className="chatgpt-suggestion-card__icon">{item.icon}</div>
                    <div className="chatgpt-suggestion-card__content">
                      <div className="chatgpt-suggestion-card__title">{item.title}</div>
                      <div className="chatgpt-suggestion-card__desc">{item.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Active Message Flow */
            <div className="chatgpt-messages-list">
              {currentMessages.map((msg, index) => {
                const isUser = msg.role === 'user';
                const msgId = `msg_${index}`;

                return (
                  <div
                    key={index}
                    className={`chatgpt-message-row ${isUser ? 'chatgpt-message-row--user' : 'chatgpt-message-row--assistant'}`}
                  >
                    <div className="chatgpt-message-avatar">
                      {isUser ? (
                        <div className="chatgpt-avatar chatgpt-avatar--user">👤</div>
                      ) : (
                        <div className="chatgpt-avatar chatgpt-avatar--assistant">
                          <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
                            <rect width="24" height="24" rx="6" fill="#10a37f" />
                            <circle cx="12" cy="12" r="3" fill="#ffffff" />
                            <path d="M12 4v4m0 8v4m-8-8h4m8 0h4" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
                          </svg>
                        </div>
                      )}
                    </div>

                    <div className="chatgpt-message-body">
                      <div className="chatgpt-message-author">
                        {isUser ? 'You' : 'ChatGPT (Navneet Portfolio AI)'}
                      </div>

                      <div className="chatgpt-message-content">
                        {isUser ? (
                          <div className="chatgpt-user-text">{msg.content}</div>
                        ) : (
                          renderFormattedContent(msg.content)
                        )}
                      </div>

                      {!isUser && (
                        <div className="chatgpt-message-actions">
                          <button
                            type="button"
                            className="chatgpt-action-btn"
                            onClick={() => handleCopyText(msg.content, msgId)}
                            title="Copy response"
                          >
                            {copiedId === msgId ? '✓ Copied' : '📋 Copy'}
                          </button>
                          <span className="chatgpt-inference-tag">⚡ Groq LPU</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Typing / Thinking Indicator */}
              {isLoading && (
                <div className="chatgpt-message-row chatgpt-message-row--assistant">
                  <div className="chatgpt-message-avatar">
                    <div className="chatgpt-avatar chatgpt-avatar--assistant">
                      <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
                        <rect width="24" height="24" rx="6" fill="#10a37f" />
                        <circle cx="12" cy="12" r="3" fill="#ffffff" />
                      </svg>
                    </div>
                  </div>
                  <div className="chatgpt-message-body">
                    <div className="chatgpt-message-author">ChatGPT</div>
                    <div className="chatgpt-thinking-dots">
                      <span /><span /><span />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Bottom Input Pill */}
        <div className="chatgpt-input-container">
          <div className="chatgpt-input-box">
            <button
              type="button"
              className="chatgpt-input-btn chatgpt-input-btn--plus"
              title="Attach context or code"
              onClick={() => handleSendMessage('Can you summarize Navneet Sinha in 3 key bullet points?')}
            >
              +
            </button>

            <textarea
              ref={textareaRef}
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything about Navneet's projects, experience, or skills..."
              className="chatgpt-textarea"
            />

            <button
              type="button"
              disabled={!input.trim() || isLoading}
              onClick={() => handleSendMessage()}
              className={`chatgpt-send-btn ${input.trim() && !isLoading ? 'chatgpt-send-btn--active' : ''}`}
              title="Send message"
            >
              {isLoading ? (
                <span className="chatgpt-send-spinner" />
              ) : (
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                </svg>
              )}
            </button>
          </div>

          <div className="chatgpt-disclaimer">
            ChatGPT can make mistakes. Navneet AI is powered by high-speed Groq LPU inference.
          </div>
        </div>
      </main>
    </div>
  );
}
