# Navneet Sinha — Developer Portfolio OS 🚀

An interactive, Ubuntu-inspired Developer Desktop Operating System built with React, TypeScript, and Vite. Designed to showcase full-stack projects, real-time architectures, technical skills, and achievements through an immersive desktop computing experience.

![Portfolio OS Preview](https://img.shields.io/badge/Status-Production_Ready-brightgreen)
![React](https://img.shields.io/badge/React-18-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Vite](https://img.shields.io/badge/Vite-6-purple)
![Groq](https://img.shields.io/badge/Groq_AI-LPU_Accelerated-orange)

---

## 🌟 Key Features

### 🖥️ Ubuntu-Inspired Desktop OS
- **Draggable & Maximizable Windows**: Full window management system supporting minimization, maximization, z-index elevation, and smooth drag mechanics.
- **Persistent Left Dock**: Ubuntu application dock with active indicators, tooltips, and application launcher.
- **Top System Bar**: Dynamic digital clock, sound/theme toggle, network and battery indicators.
- **Activities App Launcher**: 9-dot grid modal with instantaneous search across applications, files, and production projects.
- **Customizable Wallpapers & Themes**: Built-in settings app with 6 curated developer wallpapers and 10 VS Code-inspired color themes.

---

### 🤖 Standalone ChatGPT (Groq AI) App
- **High-Speed LPU Inference**: Powered by Groq Cloud (`qwen/qwen3.8-27b` / `openai/gpt-oss-120b`).
- **Authentic ChatGPT UI**:
  - Collapsible sidebar with "+ New chat", conversation history sessions, and delete controls.
  - Multi-turn conversational memory with context persistence in local storage.
  - Prompt suggestion cards on the welcome screen.
  - Code syntax blocks with one-click copy buttons and response feedback.
  - Strict resume/portfolio context guard preventing hallucinated trivia.

---

### 💻 Developer Terminal OS
- **Authentic Command Shell**: Interactive command prompt supporting bash-style navigation.
- **Commands Available**:
  - `whoami`, `about`, `projects`, `skills`, `experience`, `education`, `achievements`, `contact`, `resume`
  - `chatgpt` / `ai` (launches dedicated ChatGPT app window)
  - `files`, `browser`, `music`, `settings` (launches desktop apps)
  - `neofetch`, `theme list`, `theme set <name>`, `clear`

---

### 🌐 Navneet Mini-Browser
- **Multi-Tab Architecture**: Open, switch, and close tabs with independent history navigation.
- **Navigation Controls**: Back (`‹`), Forward (`›`), Reload (`↻`), and Home (`⌂`).
- **Smart Search vs URL Detection**:
  - Plain text queries automatically execute on Google.
  - Direct URLs format cleanly.
- **Frame Security Handling**: Sites enforcing `X-Frame-Options` or CSP (Google, YouTube, GitHub, LinkedIn, LeetCode, Gmail) open natively with an in-tab security fallback notice.
- **Live Iframe Embedding**: Embeddable websites (e.g., Wikipedia) render live within the browser window.
- **Quick-Access Cards**: Instant launcher cards for Google, YouTube, GitHub, LinkedIn, LeetCode, and Gmail.

---

### 📁 Nautilus File Manager & 🎵 Ambient Music Player
- **Nautilus File Manager**: Visual folder hierarchy exploring portfolio assets, profile portraits, project summaries, and resume documentation.
- **Music Player**: Ambient focus music with visualizer bar and persistent desktop controls.

---

## 🛠️ Tech Stack

- **Frontend Core**: React 18, TypeScript, Vite
- **Styling**: Tailored Modern CSS, Glassmorphism, CSS Custom Properties
- **AI Acceleration**: Groq Cloud SDK / REST API (LPU Inference Engine)
- **Icons & Graphics**: Pure SVG vector graphics and optimized assets

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/Neet2516/FUTURE_FS_01.git
cd FUTURE_FS_01
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Create a `.env` file in the root directory (refer to `.env.example`):
```env
VITE_GROQ_API_KEY=your_groq_api_key_here
```

### 4. Run the development server
```bash
npm run dev
```

### 5. Build for production
```bash
npm run build
```

---

## 👤 Author

**Navneet Sinha**
- **GitHub**: [@Neet2516](https://github.com/Neet2516)
- **LinkedIn**: [Navneet Sinha](https://www.linkedin.com/in/navneet-sinha-ba0853375)
- **Email**: getneet.25@gmail.com
