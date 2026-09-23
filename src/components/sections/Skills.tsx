import { useState } from 'react';
import { SKILLS, TECH_COLORS } from '../../data/portfolio';
import './Skills.css';

type Category = keyof typeof SKILLS;

const CATEGORY_ICONS: Record<string, string> = {
  languages: '{ }',
  frontend: '🎨',
  backend: '⚙️',
  databases: '🗄️',
  devops: '🚀',
};

export default function Skills() {
  const [active, setActive] = useState<Category>('frontend');
  const categories = Object.keys(SKILLS) as Category[];

  return (
    <section id="skills" className="skills section" aria-label="Skills section">
      {/* Subtle bg accent */}
      <div className="skills__bg-accent" aria-hidden="true" />

      <div className="container">
        {/* Header */}
        <div className="section-header reveal">
          <p className="section-number">04 — SKILLS</p>
          <h2 className="skills__heading">
            The technologies I{' '}
            <span className="gradient-text">wield.</span>
          </h2>
        </div>

        {/* Category tabs */}
        <div className="skills__tabs reveal" role="tablist" aria-label="Skill categories">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`skills__tab ${active === cat ? 'skills__tab--active' : ''}`}
              onClick={() => setActive(cat)}
              role="tab"
              aria-selected={active === cat}
              aria-controls={`skills-panel-${cat}`}
              id={`skills-tab-${cat}`}
            >
              <span className="skills__tab-icon" aria-hidden="true">
                {CATEGORY_ICONS[cat]}
              </span>
              {SKILLS[cat].label}
            </button>
          ))}
        </div>

        {/* Skills grid */}
        <div
          className="skills__grid stagger"
          id={`skills-panel-${active}`}
          role="tabpanel"
          aria-labelledby={`skills-tab-${active}`}
        >
          {SKILLS[active].items.map((skill) => (
            <SkillCard key={skill} name={skill} />
          ))}
        </div>

        {/* All skills marquee */}
        <div className="skills__marquee reveal" aria-hidden="true">
          <div className="skills__marquee-track">
            {[...Object.values(SKILLS).flatMap((s) => s.items), ...Object.values(SKILLS).flatMap((s) => s.items)].map(
              (skill, i) => (
                <span key={i} className="skills__marquee-item">
                  {skill}
                </span>
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function SkillCard({ name }: { name: string }) {
  const color = TECH_COLORS[name];

  return (
    <div
      className="skill-card glass"
      style={{ '--skill-color': color || 'var(--cyan)' } as React.CSSProperties}
      role="listitem"
    >
      <div className="skill-card__dot" aria-hidden="true" />
      <span className="skill-card__name">{name}</span>
    </div>
  );
}
