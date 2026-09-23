import { EXPERIENCES } from '../../data/portfolio';
import './Experience.css';

export default function Experience() {
  return (
    <section id="experience" className="experience section" aria-label="Experience section">
      <div className="container">
        <div className="section-header reveal">
          <p className="section-number">06 — EXPERIENCE & EDUCATION</p>
          <h2 className="experience__heading">
            Where I've{' '}
            <span className="gradient-text">grown.</span>
          </h2>
        </div>

        <div className="experience__timeline">
          {EXPERIENCES.map((exp, i) => (
            <TimelineEntry key={exp.id} exp={exp} index={i} isLast={i === EXPERIENCES.length - 1} />
          ))}
        </div>
      </div>
    </section>
  );
}

function TimelineEntry({
  exp,
  index,
  isLast,
}: {
  exp: typeof EXPERIENCES[0];
  index: number;
  isLast: boolean;
}) {
  return (
    <div className={`timeline-entry reveal`} style={{ '--delay': `${index * 120}ms` } as React.CSSProperties}>
      {/* Timeline connector */}
      <div className="timeline-entry__connector">
        <div className={`timeline-entry__dot ${exp.current ? 'timeline-entry__dot--active' : ''}`}>
          <span aria-hidden="true">{exp.type === 'education' ? '🎓' : '👥'}</span>
        </div>
        {!isLast && <div className="timeline-entry__line" aria-hidden="true" />}
      </div>

      {/* Content */}
      <div className="timeline-entry__content glass">
        <div className="timeline-entry__header">
          <div>
            <div className="timeline-entry__meta">
              <span className="timeline-entry__period">{exp.period}</span>
              <span className="timeline-entry__separator" aria-hidden="true">·</span>
              <span className="timeline-entry__location">{exp.location}</span>
              {exp.current && (
                <span className="timeline-entry__current-badge" aria-label="Currently here">Current</span>
              )}
            </div>
            <h3 className="timeline-entry__role">{exp.role}</h3>
            <p className="timeline-entry__institution">{exp.institution}</p>
          </div>
        </div>

        <p className="timeline-entry__desc">{exp.description}</p>

        {exp.highlights && (
          <ul className="timeline-entry__highlights" aria-label="Highlights">
            {exp.highlights.map((h) => (
              <li key={h} className="timeline-entry__highlight">
                <span aria-hidden="true" className="timeline-entry__highlight-icon">▹</span>
                {h}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
