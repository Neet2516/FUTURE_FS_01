import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { PERSONAL, PROJECTS, SKILLS, EXPERIENCES, ACHIEVEMENTS, DSA_STATS, TERMINAL_COMMANDS } from '../data/portfolio';
import { THEMES } from '../data/themes';
import { useTheme } from '../context/ThemeContext';

export const AVAILABLE_COMMANDS = [
  'help',
  'chatgpt',
  'ai',
  'ask',
  'chat',
  'whoami',
  'about',
  'projects',
  'skills',
  'experience',
  'education',
  'achievements',
  'contact',
  'resume',
  'github',
  'neofetch',
  'theme',
  'gui',
  'desktop',
  'clear',
  'cls',
  'reboot',
  'files',
  'music',
  'browser',
  'settings',
];

export type TerminalLine = {
  id: string;
  type: 'input' | 'output' | 'error' | 'success' | 'info' | 'system' | 'neofetch';
  content: string | string[];
};

const INITIAL_WELCOME_LINES: TerminalLine[] = [
  {
    id: 'welcome-0',
    type: 'system',
    content: '┌─────────────────────────────────────────────────────────────┐',
  },
  {
    id: 'welcome-1',
    type: 'system',
    content: '│  navneet@portfolio:~                                        │',
  },
  {
    id: 'welcome-2',
    type: 'system',
    content: '├─────────────────────────────────────────────────────────────┤',
  },
  {
    id: 'welcome-3',
    type: 'input',
    content: 'whoami',
  },
  {
    id: 'welcome-4',
    type: 'success',
    content: 'Navneet Sinha — Full Stack Developer & Frontend Engineer',
  },
  {
    id: 'welcome-5',
    type: 'info',
    content: 'Location: New Delhi, India  •  Status: Open to Work',
  },
  {
    id: 'welcome-6',
    type: 'output',
    content: '',
  },
  {
    id: 'welcome-7',
    type: 'input',
    content: 'help',
  },
  {
    id: 'welcome-8',
    type: 'info',
    content: 'Available commands:',
  },
  {
    id: 'welcome-9',
    type: 'output',
    content: '  about        skills       projects     experience',
  },
  {
    id: 'welcome-10',
    type: 'output',
    content: '  education    achievements contact      resume',
  },
  {
    id: 'welcome-11',
    type: 'output',
    content: '  neofetch     theme        gui          clear',
  },
  {
    id: 'welcome-12',
    type: 'system',
    content: '└─────────────────────────────────────────────────────────────┘',
  },
  {
    id: 'welcome-13',
    type: 'success',
    content: 'Tip: Type "gui" to open visual desktop • Type "help" to explore',
  },
];

function generateId() {
  return Math.random().toString(36).slice(2);
}

interface UseTerminalOptions {
  onLaunchGUI?: () => void;
  onReboot?: () => void;
  onOpenApp?: (app: string) => void;
}

export function useTerminal(options?: UseTerminalOptions) {
  const [lines, setLines] = useState<TerminalLine[]>(INITIAL_WELCOME_LINES);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const endRef = useRef<HTMLDivElement>(null);
  const { setTheme, openThemeSelector, currentTheme } = useTheme();

  const scrollToBottom = useCallback(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [lines, scrollToBottom]);

  const processCommand = useCallback(
    (cmd: string): TerminalLine[] => {
      const trimmed = cmd.trim();
      const lower = trimmed.toLowerCase();

      if (lower.startsWith('theme ')) {
        const query = lower.slice(6).trim();
        const found = THEMES.find(
          (t) => t.id.toLowerCase() === query || t.name.toLowerCase().includes(query)
        );
        if (found) {
          setTheme(found.id);
          return [
            { id: generateId(), type: 'success', content: `✓ Theme changed to "${found.name}"` },
          ];
        }
        return [
          {
            id: generateId(),
            type: 'error',
            content: `Theme "${query}" not found. Available themes: ${THEMES.map((t) => t.id).join(', ')}`,
          },
        ];
      }

      switch (lower) {
        case 'help':
          return [
            { id: generateId(), type: 'success', content: 'Available OS commands:' },
            ...Object.entries(TERMINAL_COMMANDS).map(([name, meta]) => ({
              id: generateId(),
              type: 'output' as const,
              content: `  ${name.padEnd(14)} — ${meta.description}`,
            })),
          ];

        case 'whoami':
          return [
            { id: generateId(), type: 'success', content: `▸ ${PERSONAL.name} — ${PERSONAL.roles[0]}` },
            { id: generateId(), type: 'info', content: `  Specializing in scalable web apps, real-time collaboration, and modern frontend architecture.` },
            { id: generateId(), type: 'output', content: `  Location: ${PERSONAL.location}  |  Status: ${PERSONAL.status}` },
            { id: generateId(), type: 'output', content: `  Email:    ${PERSONAL.email}  |  Phone: ${PERSONAL.phone}` },
          ];

        case 'about':
          return [
            { id: generateId(), type: 'success', content: `▸ About ${PERSONAL.name}` },
            { id: generateId(), type: 'info', content: `  Role:     ${PERSONAL.roles.join(' & ')}` },
            { id: generateId(), type: 'info', content: `  Location: ${PERSONAL.location}` },
            { id: generateId(), type: 'output', content: '' },
            { id: generateId(), type: 'output', content: PERSONAL.bioShort },
            { id: generateId(), type: 'output', content: '' },
            { id: generateId(), type: 'output', content: 'Education: B.Tech in CSE at Ajay Kumar Garg Engineering College (AKGEC)' },
            { id: generateId(), type: 'output', content: 'Community: Google Developer Groups (GDG) AKGEC' },
            { id: generateId(), type: 'output', content: 'Photos:    3 portfolio photos in about/photos (prof.jpeg, self.png, selfie.jpeg)' },
            { id: generateId(), type: 'info', content: 'Tip: Type "photos" or "files" to view photos' },
          ];

        case 'projects':
          return [
            { id: generateId(), type: 'success', content: 'Featured Production Projects:' },
            ...PROJECTS.flatMap((p) => [
              { id: generateId(), type: 'info' as const, content: `` },
              { id: generateId(), type: 'success' as const, content: `  [${p.index}] ${p.name} — ${p.tagline}` },
              { id: generateId(), type: 'output' as const, content: `      ${p.description}` },
              { id: generateId(), type: 'output' as const, content: `      Stack: ${p.tech.join(', ')}` },
              { id: generateId(), type: 'output' as const, content: `      Live:  ${p.live}` },
              { id: generateId(), type: 'output' as const, content: `      Repo:  ${p.github}` },
            ]),
          ];

        case 'skills':
          return [
            { id: generateId(), type: 'success', content: 'Technical Skills & Arsenal:' },
            ...Object.values(SKILLS).flatMap((cat) => [
              { id: generateId(), type: 'info' as const, content: `` },
              { id: generateId(), type: 'info' as const, content: `  [${cat.label}]` },
              { id: generateId(), type: 'output' as const, content: `  ${cat.items.join('  •  ')}` },
            ]),
          ];

        case 'experience':
          return [
            { id: generateId(), type: 'success', content: 'Experience & Education:' },
            ...EXPERIENCES.flatMap((e) => [
              { id: generateId(), type: 'info' as const, content: `` },
              { id: generateId(), type: 'success' as const, content: `  ${e.institution}` },
              { id: generateId(), type: 'output' as const, content: `  ${e.role} (${e.period} · ${e.location})` },
              { id: generateId(), type: 'output' as const, content: `  ${e.description}` },
            ]),
          ];

        case 'education':
          return [
            { id: generateId(), type: 'success', content: 'Academic Education:' },
            { id: generateId(), type: 'info', content: '  Degree:      Bachelor of Technology (B.Tech) in Computer Science & Engineering' },
            { id: generateId(), type: 'output', content: '  College:     Ajay Kumar Garg Engineering College (AKGEC), Ghaziabad' },
            { id: generateId(), type: 'output', content: '  Affiliation: Dr. A.P.J. Abdul Kalam Technical University (AKTU)' },
            { id: generateId(), type: 'output', content: '  Timeline:    2024 – Present (Undergraduate)' },
            { id: generateId(), type: 'output', content: '  Community:   Active Core Member at Google Developer Groups (GDG) AKGEC' },
          ];

        case 'achievements':
          return [
            { id: generateId(), type: 'success', content: 'Achievements & Competitive Programming:' },
            ...ACHIEVEMENTS.map((a) => ({
              id: generateId(),
              type: 'output' as const,
              content: `  ${a.badge}  ${a.title} (${a.year}) — ${a.description}`,
            })),
            { id: generateId(), type: 'info', content: `` },
            { id: generateId(), type: 'output', content: `  LeetCode: ${DSA_STATS.leetcode.solved} problems solved | ${DSA_STATS.leetcode.streak}` },
          ];

        case 'contact':
          return [
            { id: generateId(), type: 'success', content: "Contact Coordinates:" },
            { id: generateId(), type: 'output', content: `  Email:     ${PERSONAL.email}` },
            { id: generateId(), type: 'output', content: `  Phone:     ${PERSONAL.phone}` },
            { id: generateId(), type: 'output', content: `  GitHub:    ${PERSONAL.github}` },
            { id: generateId(), type: 'output', content: `  LinkedIn:  ${PERSONAL.linkedin}` },
            { id: generateId(), type: 'output', content: `  Resume:    ${PERSONAL.resume}` },
          ];

        case 'resume':
          if (typeof window !== 'undefined') {
            window.open(PERSONAL.resume, '_blank', 'noopener,noreferrer');
          }
          return [
            { id: generateId(), type: 'success', content: 'Opening curriculum vitae in a new browser tab...' },
            { id: generateId(), type: 'output', content: `  URL: ${PERSONAL.resume}` },
          ];

        case 'github':
          if (typeof window !== 'undefined') {
            window.open(PERSONAL.github, '_blank', 'noopener,noreferrer');
          }
          return [
            { id: generateId(), type: 'success', content: 'Opening GitHub profile in a new browser tab...' },
            { id: generateId(), type: 'output', content: `  URL: ${PERSONAL.github}` },
          ];

        case 'neofetch':
          return [
            {
              id: generateId(),
              type: 'neofetch',
              content: '',
            },
          ];

        case 'gui':
        case 'portfolio':
        case 'startx':
        case 'desktop':
          if (options?.onLaunchGUI) {
            setTimeout(() => options.onLaunchGUI!(), 200);
          }
          return [
            { id: generateId(), type: 'success', content: '✓ Focusing Desktop Workstation...' },
          ];

        case 'music':
        case 'player':
          if (options?.onOpenApp) {
            options.onOpenApp('music');
          }
          return [
            { id: generateId(), type: 'success', content: '✓ Launching Music Player...' },
          ];

        case 'photos':
        case 'gallery':
        case 'images':
          if (options?.onOpenApp) {
            options.onOpenApp('files');
          }
          return [
            { id: generateId(), type: 'success', content: '✓ Found 3 photos in about/photos:' },
            { id: generateId(), type: 'output', content: '  • prof.jpeg   (120 KB) - Professional Profile Portrait' },
            { id: generateId(), type: 'output', content: '  • self.png    (254 KB) - Interactive Studio Portrait' },
            { id: generateId(), type: 'output', content: '  • selfie.jpeg (206 KB) - Campus & Lifestyle Selfie' },
            { id: generateId(), type: 'info', content: 'Opening folder in Nautilus File Manager...' },
          ];

        case 'files':
        case 'nautilus':
        case 'filemanager':
          if (options?.onOpenApp) {
            options.onOpenApp('files');
          }
          return [
            { id: generateId(), type: 'success', content: '✓ Opening Nautilus File Manager...' },
          ];

        case 'browser':
        case 'web':
        case 'chrome':
          if (options?.onOpenApp) {
            options.onOpenApp('browser');
          }
          return [
            { id: generateId(), type: 'success', content: '✓ Launching Navneet Browser...' },
          ];

        case 'settings':
          if (options?.onOpenApp) {
            options.onOpenApp('settings');
          }
          return [
            { id: generateId(), type: 'success', content: '✓ Opening Settings...' },
          ];

        case 'chatgpt':
        case 'ai':
        case 'ask':
        case 'chat':
        case 'groq':
          if (options?.onOpenApp) {
            options.onOpenApp('chatgpt');
          }
          return [
            { id: generateId(), type: 'success', content: '✓ Launching ChatGPT (Groq AI) App...' },
          ];

        case 'theme':
          openThemeSelector();
          return [
            { id: generateId(), type: 'info', content: 'Opening VS Code Theme Selector...' },
          ];

        case 'reboot':
          if (options?.onReboot) {
            setTimeout(() => options.onReboot!(), 200);
          }
          return [
            { id: generateId(), type: 'system', content: 'Broadcast message from root@portfolio:' },
            { id: generateId(), type: 'system', content: 'The system is rebooting NOW!' },
          ];

        case 'clear':
        case 'cls':
          return [];

        case '':
          return [];

        default:
          return [
            {
              id: generateId(),
              type: 'error',
              content: `Command not found: "${trimmed}". Type "help" to see available commands or "chatgpt" to launch the AI Assistant.`,
            },
          ];
      }
    },
    [currentTheme, options]
  );

  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(0);
  const tabCycleRef = useRef<{ prefix: string; index: number }>({ prefix: '', index: -1 });

  // Compute matching command suggestions
  const trimmed = input.trimStart().toLowerCase();
  const suggestions = useMemo(() => {
    if (!trimmed) return [];
    return AVAILABLE_COMMANDS.filter((cmd) => cmd.startsWith(trimmed));
  }, [trimmed]);

  // Compute ghost text suffix for inline autocomplete hint
  const ghostSuffix = useMemo(() => {
    if (!trimmed || suggestions.length === 0) return '';
    const match = suggestions[activeSuggestionIndex] || suggestions[0];
    if (match.startsWith(trimmed) && match !== trimmed) {
      return match.slice(trimmed.length);
    }
    return '';
  }, [trimmed, suggestions, activeSuggestionIndex]);

  const autocomplete = useCallback(
    (cmd?: string) => {
      if (cmd) {
        setInput(cmd);
      } else if (suggestions.length > 0) {
        const match = suggestions[activeSuggestionIndex] || suggestions[0];
        setInput(match);
      }
      tabCycleRef.current = { prefix: '', index: -1 };
      setActiveSuggestionIndex(0);
    },
    [suggestions, activeSuggestionIndex]
  );

  const submit = useCallback(
    (cmd: string) => {
      tabCycleRef.current = { prefix: '', index: -1 };
      setActiveSuggestionIndex(0);

      const inputLine: TerminalLine = {
        id: generateId(),
        type: 'input',
        content: cmd,
      };

      const trimmedCmd = cmd.trim();
      const lower = trimmedCmd.toLowerCase();

      // Special handling for theme command
      if (lower === 'theme' || lower === 'themes') {
        openThemeSelector();
        const themeResult: TerminalLine[] = [
          { id: generateId(), type: 'info', content: `Current theme: "${currentTheme.name}" (${currentTheme.category})` },
          { id: generateId(), type: 'success', content: '✓ Opened VS Code Theme QuickPick menu.' },
          { id: generateId(), type: 'output', content: '  Use ↑/↓ keys to preview, Enter to select, Esc to cancel.' },
        ];
        setLines((prev) => [...prev, inputLine, ...themeResult]);
      } else if (lower === 'theme list' || lower === 'themes list') {
        const themeResult: TerminalLine[] = [
          { id: generateId(), type: 'success', content: 'Available VS Code Color Themes (10):' },
          ...THEMES.map((t) => ({
            id: generateId(),
            type: 'output' as const,
            content: `  ${t.id === currentTheme.id ? '●' : '○'} ${t.name.padEnd(36)} [${t.category}]`,
          })),
          { id: generateId(), type: 'info', content: '  Usage: "theme <name>" (e.g. "theme monokai") or "theme" for UI' },
        ];
        setLines((prev) => [...prev, inputLine, ...themeResult]);
      } else if (lower.startsWith('theme ')) {
        const targetQuery = lower.slice(6).trim();
        const match = THEMES.find(
          (t) =>
            t.id.toLowerCase() === targetQuery ||
            t.name.toLowerCase().includes(targetQuery) ||
            targetQuery.split(/[\s-_]+/).every((part) => t.name.toLowerCase().includes(part))
        );

        if (match) {
          setTheme(match.id);
          const themeResult: TerminalLine[] = [
            { id: generateId(), type: 'success', content: `✓ Switched to "${match.name}" (${match.category})` },
            { id: generateId(), type: 'output', content: `  Palette: ${match.description}` },
          ];
          setLines((prev) => [...prev, inputLine, ...themeResult]);
        } else {
          const themeResult: TerminalLine[] = [
            { id: generateId(), type: 'error', content: `Theme "${targetQuery}" not found.` },
            { id: generateId(), type: 'output', content: `Type "theme list" to see all 10 available themes.` },
          ];
          setLines((prev) => [...prev, inputLine, ...themeResult]);
        }
      } else if (lower === 'clear' || lower === 'cls') {
        setLines([]);
      } else if (lower.startsWith('ask ') || lower.startsWith('ai ') || lower.startsWith('chat ') || lower.startsWith('chatgpt')) {
        if (options?.onOpenApp) {
          options.onOpenApp('chatgpt');
        }
        setLines((prev) => [
          ...prev,
          inputLine,
          {
            id: generateId(),
            type: 'success',
            content: '✓ Groq AI Chat is available as a dedicated application. Launching ChatGPT...',
          },
        ]);
      } else {
        const result = processCommand(cmd);
        setLines((prev) => [...prev, inputLine, ...result]);
      }

      if (trimmedCmd) {
        setHistory((prev) => [cmd, ...prev.slice(0, 49)]);
      }
      setHistoryIndex(-1);
      setInput('');
    },
    [openThemeSelector, setTheme, currentTheme, processCommand]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      // Ctrl+L -> clear terminal
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'l') {
        e.preventDefault();
        setLines([]);
        return;
      }

      if (e.key === 'Tab') {
        e.preventDefault();
        const currentTrimmed = input.trimStart().toLowerCase();
        if (!currentTrimmed && !tabCycleRef.current.prefix) return;

        const basePrefix = tabCycleRef.current.prefix || currentTrimmed;
        const matches = AVAILABLE_COMMANDS.filter((c) => c.startsWith(basePrefix));

        if (matches.length > 0) {
          tabCycleRef.current.prefix = basePrefix;
          const nextIdx = (tabCycleRef.current.index + 1) % matches.length;
          tabCycleRef.current.index = nextIdx;
          setActiveSuggestionIndex(nextIdx);
          setInput(matches[nextIdx]);
        }
        return;
      }

      if (e.key === 'ArrowRight') {
        if (ghostSuffix && e.currentTarget.selectionStart === input.length) {
          e.preventDefault();
          setInput(input + ghostSuffix);
          tabCycleRef.current = { prefix: '', index: -1 };
          setActiveSuggestionIndex(0);
          return;
        }
      }

      // Any other normal key resets tab cycling unless it's a modifier key
      if (!['Shift', 'Control', 'Alt', 'Meta'].includes(e.key)) {
        tabCycleRef.current = { prefix: '', index: -1 };
        setActiveSuggestionIndex(0);
      }

      if (e.key === 'Enter') {
        submit(input);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const next = historyIndex + 1;
        if (next < history.length) {
          setHistoryIndex(next);
          setInput(history[next]);
        }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        const next = historyIndex - 1;
        if (next >= 0) {
          setHistoryIndex(next);
          setInput(history[next]);
        } else {
          setHistoryIndex(-1);
          setInput('');
        }
      }
    },
    [input, history, historyIndex, submit, ghostSuffix]
  );

  return {
    lines,
    input,
    setInput,
    handleKeyDown,
    endRef,
    submit,
    clearLines: () => setLines([]),
    suggestions,
    activeSuggestionIndex,
    ghostSuffix,
    autocomplete,
  };
}
