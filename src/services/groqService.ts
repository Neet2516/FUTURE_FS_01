import { PERSONAL, SKILLS, PROJECTS, EXPERIENCES, ACHIEVEMENTS, DSA_STATS } from '../data/portfolio';

const GROQ_API_ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions';
const OUT_OF_CONTEXT_REPLY = 'out of context Sorry';

// Build structured resume context from source of truth
function buildResumeContext(): string {
  const skillsSummary = Object.values(SKILLS)
    .map((data) => `${data.label}: ${data.items.join(', ')}`)
    .join('\n');

  const projectsSummary = PROJECTS.map(
    (p, i) =>
      `${i + 1}. ${p.name} - "${p.tagline}"
   Description: ${p.description}
   Problem Solved: ${p.problem}
   Tech Stack: ${p.tech.join(', ')}
   Key Highlights: ${p.highlights?.join('; ') || 'N/A'}
   GitHub: ${p.github || 'N/A'}, Demo: ${p.live || 'N/A'}`
  ).join('\n\n');

  const experiencesSummary = EXPERIENCES.map(
    (e) =>
      `${e.role} at ${e.institution} (${e.period}, ${e.type}) - ${e.location}
   Details: ${e.description}${e.highlights ? ` (Highlights: ${e.highlights.join('; ')})` : ''}`
  ).join('\n\n');

  const achievementsSummary = ACHIEVEMENTS.map(
    (a) => `• ${a.title} (${a.year}, ${a.organization}): ${a.description}`
  ).join('\n');

  return `
CANDIDATE INFORMATION:
Name: ${PERSONAL.name} (Alias: ${PERSONAL.alias})
Primary Roles: ${PERSONAL.roles.join(', ')}
Tagline: ${PERSONAL.tagline}
Location: ${PERSONAL.location}
Status: ${PERSONAL.status}
Bio: ${PERSONAL.bio}
Email: ${PERSONAL.email}
Phone: ${PERSONAL.phone}
GitHub: ${PERSONAL.github} (Username: ${PERSONAL.githubUsername})
LinkedIn: ${PERSONAL.linkedin}
Education & Background: B.Tech in Computer Science at Ajay Kumar Garg Engineering College (AKGEC). Active contributor at Google Developer Groups (GDG) AKGEC community.
DSA Problem Solving: ${DSA_STATS.leetcode.solved} problems solved on LeetCode. Streak: ${DSA_STATS.leetcode.streak}. Profile: ${DSA_STATS.leetcode.profile}. Topics mastered: ${DSA_STATS.topics.join(', ')}.

TECHNICAL SKILLS:
${skillsSummary}

FEATURED PROJECTS:
${projectsSummary}

EXPERIENCE & WORK HISTORY:
${experiencesSummary}

ACHIEVEMENTS & CERTIFICATIONS:
${achievementsSummary}
`.trim();
}

const RESUME_CONTEXT = buildResumeContext();

const SYSTEM_PROMPT = `You are the official Portfolio AI Assistant for Navneet Sinha.
Your job is to answer questions from recruiters, engineers, and visitors strictly and factually based on Navneet Sinha's portfolio and resume information provided below:

${RESUME_CONTEXT}

STRICT CONSTRAINTS & RULES:
1. ONLY answer questions regarding Navneet Sinha's background, resume, skills, tech stack, projects, experience, achievements, education, DSA stats, or contact coordinates.
2. If the user asks ANY question that is outside the scope of Navneet Sinha's portfolio/resume (e.g. general trivia, politics, recipes, weather, unrelated coding problems, personal advice, random chit-chat, or general knowledge), you MUST reply with EXACTLY and ONLY:
out of context Sorry
3. Do NOT provide explanations, do NOT apologize with extra words, do NOT add punctuation or preambles when out of context. The exact string must be:
out of context Sorry
4. When answering valid questions about Navneet, be polite, professional, concise, and helpful.`;

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export async function askGroqConversation(history: ChatMessage[]): Promise<string> {
  // Get API key from Vite environment
  const apiKey = (
    import.meta.env.VITE_GROQ_API_KEY ||
    import.meta.env.API ||
    import.meta.env.GROQ_API_KEY ||
    ''
  ).replace(/['"]/g, '').trim();

  if (!apiKey) {
    console.warn('Groq API Key not detected in environment variables.');
    return OUT_OF_CONTEXT_REPLY;
  }

  // qwen3.8-27b provides ultra-fast direct completions without consuming token budgets on reasoning
  const candidateModels = ['qwen/qwen3.8-27b', 'openai/gpt-oss-120b', 'openai/gpt-oss-20b'];

  const messagesPayload = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...history.slice(-8), // Send up to last 8 turns of context
  ];

  for (const model of candidateModels) {
    try {
      const response = await fetch(GROQ_API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: messagesPayload,
          temperature: 0.2,
          max_tokens: 800,
        }),
      });

      if (response.status === 429 || response.status === 401 || response.status === 403) {
        continue;
      }

      if (!response.ok) {
        continue;
      }

      const data = await response.json();
      const answer = data.choices?.[0]?.message?.content?.trim();

      if (!answer) {
        continue;
      }

      if (answer.toLowerCase().includes('out of context')) {
        return OUT_OF_CONTEXT_REPLY;
      }

      return answer;
    } catch {
      continue;
    }
  }

  return OUT_OF_CONTEXT_REPLY;
}

export async function askGroqAI(question: string): Promise<string> {
  const trimmed = question.trim();
  if (!trimmed) {
    return OUT_OF_CONTEXT_REPLY;
  }
  return askGroqConversation([{ role: 'user', content: trimmed }]);
}

