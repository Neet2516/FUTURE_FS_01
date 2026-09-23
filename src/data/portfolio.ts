// ============================================================
//  NAVNEET SINHA — Portfolio Data
//  Source of truth for all portfolio content
// ============================================================

export const PERSONAL = {
  name: "Navneet Sinha",
  alias: "Neet",
  roles: ["Full Stack Developer", "Frontend Engineer", "React Specialist", "WebSockets Enthusiast"],
  tagline: "Building scalable, interactive web experiences.",
  bio: `I'm a full-stack developer passionate about building scalable web applications, 
real-time collaborative systems, and AI-powered platforms. I thrive at the intersection 
of thoughtful engineering and beautiful user interfaces — where architecture meets aesthetics.

Currently pursuing B.Tech in Computer Science at Ajay Kumar Garg Engineering College (AKGEC), 
and actively contributing to the Google Developer Groups (GDG) AKGEC community.`,
  bioShort: "Full-stack developer who builds real-time systems, collaborative tools, and AI-powered platforms with the MERN stack.",
  location: "New Delhi, India",
  status: "Open to Work",
  email: "getneet.25@gmail.com",
  phone: "+91-8882159469",
  github: "https://github.com/Neet2516",
  githubUsername: "Neet2516",
  linkedin: "https://www.linkedin.com/in/navneet-sinha-ba0853375",
  instagram: "https://www.instagram.com/its.navneet.25",
  resume: "https://drive.google.com/file/d/11rNMxFmuomneQBFE9lU8RadqYNb3ZSqe/view?usp=sharing",
} as const;

export const SKILLS = {
  languages: {
    label: "Languages",
    items: ["JavaScript", "TypeScript", "C++", "HTML5", "CSS3"],
  },
  frontend: {
    label: "Frontend",
    items: [
      "React.js",
      "Next.js",
      "Tailwind CSS",
      "Redux",
      "Framer Motion",
      "GSAP",
      "Three.js",
      "React Flow",
      "Shadcn UI",
    ],
  },
  backend: {
    label: "Backend",
    items: ["Node.js", "Express.js", "REST APIs", "WebSockets", "WebRTC", "JWT", "OAuth"],
  },
  databases: {
    label: "Databases",
    items: ["MongoDB", "PostgreSQL", "MySQL", "Redis", "LevelDB"],
  },
  devops: {
    label: "DevOps & Tools",
    items: ["Git", "GitHub", "Docker", "Vercel", "Netlify", "Render", "AWS", "CI/CD", "Postman", "Prisma", "Vite"],
  },
} as const;

// Tech icon map (using simple emoji/text for now, can be replaced with SVG icons)
export const TECH_COLORS: Record<string, string> = {
  "React.js": "#61DAFB",
  "Next.js": "#ffffff",
  "TypeScript": "#3178C6",
  "JavaScript": "#F7DF1E",
  "Node.js": "#339933",
  "Express.js": "#ffffff",
  "MongoDB": "#47A248",
  "PostgreSQL": "#4169E1",
  "Redis": "#DC382D",
  "Tailwind CSS": "#06B6D4",
  "WebSockets": "#00d4ff",
  "Yjs": "#7c3aed",
  "React Flow": "#ff0072",
  "Shadcn UI": "#ffffff",
  "Recharts": "#8B5CF6",
  "React Leaflet": "#199900",
  "Docker": "#2496ED",
  "Vercel": "#ffffff",
  "Three.js": "#ffffff",
  "GSAP": "#88CE02",
};

export interface Project {
  id: string;
  index: string;
  name: string;
  tagline: string;
  description: string;
  problem: string;
  tech: string[];
  github: string;
  live: string;
  status: "deployed" | "in-progress" | "archived";
  featured: boolean;
  highlights: string[];
}

export const PROJECTS: Project[] = [
  {
    id: "syncboard",
    index: "01",
    name: "SyncBoard",
    tagline: "Real-time collaborative workspace",
    description:
      "A real-time collaborative workspace where multiple users can draw, write, and build together simultaneously. Built with conflict-free replicated data types (CRDTs) to ensure eventual consistency across all connected clients.",
    problem:
      "Solving concurrent multi-user synchronization with zero data conflicts using Yjs CRDTs and Redis pub/sub.",
    tech: ["React.js", "TypeScript", "Node.js", "WebSockets", "Yjs", "Redis", "React Flow"],
    github: "https://github.com/Neet2516/SyncBoard",
    live: "https://sync-board-client-lake.vercel.app/",
    status: "deployed",
    featured: true,
    highlights: [
      "CRDTs (Yjs) for conflict-free real-time sync",
      "Redis pub/sub for horizontal scaling",
      "React Flow for node-based canvas",
      "WebSocket room management",
    ],
  },
  {
    id: "code-theft-auto",
    index: "02",
    name: "Code Theft Auto",
    tagline: "Real-time coding competition platform",
    description:
      "A real-time coding competition platform with synchronized contest progression, live leaderboards, and competitive coding mechanics. Deployed for 130+ students.",
    problem:
      "Building a fair, real-time competitive coding environment with synchronized state across all participants.",
    tech: ["Next.js", "TypeScript", "Node.js", "MongoDB", "WebSockets"],
    github: "https://github.com/Neet2516/Code_Theft_Auto",
    live: "https://code-theft-auto.vercel.app/",
    status: "deployed",
    featured: true,
    highlights: [
      "Real-time leaderboard with WebSocket updates",
      "Deployed for 130+ concurrent students",
      "Synchronized contest progression",
      "Dynamic problem set management",
    ],
  },
  {
    id: "city-waste-command",
    index: "03",
    name: "City Waste Command",
    tagline: "AI-driven circular waste intelligence system",
    description:
      "An AI-powered smart waste management platform with real-time dashboards, geospatial bin tracking across the city, ML-based waste classification, and circular economy analytics.",
    problem:
      "Modernizing urban waste management with AI classification, geospatial bin tracking, and data-driven insights.",
    tech: ["TypeScript", "React.js", "Node.js", "Express.js", "Tailwind CSS", "Shadcn UI", "Recharts", "React Leaflet"],
    github: "https://github.com/Neet2516/city-waste-command",
    live: "https://wastemanagementmc.netlify.app/",
    status: "deployed",
    featured: true,
    highlights: [
      "ML-based waste classification system",
      "Real-time geospatial bin tracking (React Leaflet)",
      "Circular economy analytics dashboard",
      "India Innovates Hackathon: Top 1,000 of 10,000+",
    ],
  },
];

export interface Experience {
  id: string;
  type: "education" | "work" | "community";
  institution: string;
  role: string;
  period: string;
  location: string;
  description: string;
  highlights?: string[];
  current: boolean;
}

export const EXPERIENCES: Experience[] = [
  {
    id: "akgec",
    type: "education",
    institution: "Ajay Kumar Garg Engineering College",
    role: "B.Tech — Computer Science & Engineering",
    period: "2024 – Present",
    location: "Ghaziabad, Uttar Pradesh",
    description:
      "Pursuing Bachelor of Technology in Computer Science and Engineering. Active member of the technical community.",
    highlights: [
      "Core CS fundamentals: DSA, OS, DBMS, CN",
      "Building full-stack projects alongside coursework",
      "Active in college hackathons and competitions",
    ],
    current: true,
  },
  {
    id: "gdg-akgec",
    type: "community",
    institution: "Google Developer Groups (GDG) — AKGEC",
    role: "Active Contributor",
    period: "2024 – Present",
    location: "AKGEC, Ghaziabad",
    description:
      "Contributing to the GDG AKGEC chapter — participating in developer sessions, workshops, and community events.",
    highlights: [
      "Developer workshops and Google tech events",
      "Collaborative open-source contributions",
      "Community knowledge sharing",
    ],
    current: true,
  },
];

export interface Achievement {
  id: string;
  title: string;
  organization: string;
  year: string;
  description: string;
  badge?: string;
  type: "hackathon" | "competition" | "certification" | "dsa";
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "india-innovates",
    title: "India Innovates Hackathon 2026",
    organization: "National Level Hackathon",
    year: "2026",
    description:
      "Selected in Top 1,000 teams out of 10,000+ participants nationwide for City Waste Command project.",
    badge: "🏆",
    type: "hackathon",
  },
  {
    id: "sih",
    title: "Smart India Hackathon (SIH)",
    organization: "Government of India",
    year: "2024",
    description: "Participated in India's largest hackathon organized by the Ministry of Education.",
    badge: "🚀",
    type: "hackathon",
  },
  {
    id: "anveshna",
    title: "Anveshna '26",
    organization: "AKGEC Technical Competition",
    year: "2026",
    description: "Participated in project-based technical competition at AKGEC.",
    badge: "⚡",
    type: "competition",
  },
  {
    id: "leetcode",
    title: "150+ LeetCode Problems",
    organization: "LeetCode",
    year: "2024–2025",
    description:
      "Solved 150+ algorithmic problems across arrays, trees, graphs, dynamic programming, and system design.",
    badge: "💻",
    type: "dsa",
  },
];

export const DSA_STATS = {
  leetcode: {
    solved: "150+",
    profile: "https://leetcode.com/u/navneet-sinha",
    streak: "Active",
  },
  topics: ["Arrays & Strings", "Trees & Graphs", "Dynamic Programming", "Sliding Window", "Two Pointers", "Binary Search", "Stack & Queue", "Recursion"],
};

// Terminal command definitions
export const TERMINAL_COMMANDS = {
  chatgpt: {
    description: "Launch the dedicated ChatGPT (Groq AI) app",
    usage: "chatgpt",
  },
  ai: {
    description: "Open the ChatGPT (Groq AI) app",
    usage: "ai",
  },
  ask: {
    description: "Open the ChatGPT (Groq AI) app",
    usage: "ask",
  },
  help: {
    description: "List all available commands",
    usage: "help",
  },
  whoami: {
    description: "Display current user & role",
    usage: "whoami",
  },
  about: {
    description: "Learn about Navneet",
    usage: "about",
  },
  skills: {
    description: "View technical skills",
    usage: "skills",
  },
  projects: {
    description: "View all projects",
    usage: "projects",
  },
  experience: {
    description: "Experience & work history",
    usage: "experience",
  },
  education: {
    description: "Academic education & degrees",
    usage: "education",
  },
  achievements: {
    description: "Hackathons & achievements",
    usage: "achievements",
  },
  contact: {
    description: "Get in touch",
    usage: "contact",
  },
  resume: {
    description: "View and open resume",
    usage: "resume",
  },
  github: {
    description: "Open GitHub profile",
    usage: "github",
  },
  neofetch: {
    description: "Display system & developer specs",
    usage: "neofetch",
  },
  theme: {
    description: "Change theme or open theme picker (e.g. theme monokai)",
    usage: "theme [theme-name|list]",
  },
  gui: {
    description: "Launch visual portfolio GUI desktop",
    usage: "gui",
  },
  portfolio: {
    description: "Alias for gui",
    usage: "portfolio",
  },
  files: {
    description: "Launch Nautilus File Manager",
    usage: "files",
  },
  music: {
    description: "Launch Ambient Music Player",
    usage: "music",
  },
  browser: {
    description: "Launch Navneet Web Browser",
    usage: "browser",
  },
  settings: {
    description: "Open System & Theme Settings",
    usage: "settings",
  },
  clear: {
    description: "Clear the terminal (Ctrl+L)",
    usage: "clear",
  },
  reboot: {
    description: "Reboot OS sequence",
    usage: "reboot",
  },
} as const;
