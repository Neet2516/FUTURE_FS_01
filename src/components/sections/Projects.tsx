import { PROJECTS } from '../../data/portfolio';
import './Projects.css';

export default function Projects() {
  return (
    <section id="projects" className="projects section" aria-label="Projects section">
      <div className="container">
        {/* Header */}
        <div className="section-header reveal">
          <p className="section-number">05 — PROJECTS</p>
          <h2 className="projects__heading">
            Things I've{' '}
            <span className="gradient-text">built.</span>
          </h2>
          <p className="projects__subtext">
            Real-world applications, production deployments, and engineering challenges solved.
          </p>
        </div>

        {/* Project cards */}
        <div className="projects__list">
          {PROJECTS.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ project, index }: { project: typeof PROJECTS[0]; index: number }) {
  const isEven = index % 2 === 0;

  return (
    <article
      className={`project-card reveal`}
      style={{ '--delay': `${index * 100}ms` } as React.CSSProperties}
      aria-label={`Project: ${project.name}`}
    >
      {/* Index number */}
      <div className="project-card__index" aria-hidden="true">
        {project.index}
      </div>

      <div className={`project-card__inner ${isEven ? '' : 'project-card__inner--reverse'}`}>
        {/* Content */}
        <div className="project-card__content">
          <div className="project-card__header">
            <span className={`project-card__status project-card__status--${project.status}`}>
              <span className="project-card__status-dot" aria-hidden="true" />
              {project.status === 'deployed' ? 'Live' : project.status}
            </span>
            <h3 className="project-card__name">{project.name}</h3>
            <p className="project-card__tagline">{project.tagline}</p>
          </div>

          <p className="project-card__description">{project.description}</p>

          {/* Problem statement */}
          <div className="project-card__problem">
            <span className="project-card__problem-label">Problem solved:</span>
            <span className="project-card__problem-text">{project.problem}</span>
          </div>

          {/* Highlights */}
          <ul className="project-card__highlights" aria-label="Key features">
            {project.highlights.map((h) => (
              <li key={h} className="project-card__highlight">
                <span className="project-card__highlight-bullet" aria-hidden="true">▹</span>
                {h}
              </li>
            ))}
          </ul>

          {/* Tech stack */}
          <div className="project-card__tech" role="list" aria-label="Technologies used">
            {project.tech.map((t) => (
              <span key={t} className="tech-badge" role="listitem">{t}</span>
            ))}
          </div>

          {/* Links */}
          <div className="project-card__links">
            <a
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
              aria-label={`View live demo of ${project.name}`}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
              Live Demo
            </a>
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary"
              aria-label={`View source code of ${project.name} on GitHub`}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
              </svg>
              Source
            </a>
          </div>
        </div>

        {/* Visual panel */}
        <div className="project-card__visual">
          <div className="project-card__visual-inner">
            <div className="project-card__visual-bg">
              <div className="project-card__visual-glow" />
              <div className="project-card__visual-content">
                <span className="project-card__visual-name">{project.name}</span>
                <div className="project-card__visual-dots">
                  {project.tech.slice(0, 3).map((t) => (
                    <span key={t} className="project-card__visual-tech">{t}</span>
                  ))}
                </div>
                {/* Browser mockup */}
                <div className="project-card__browser">
                  <div className="project-card__browser-bar">
                    <span className="project-card__browser-dot" style={{ background: '#ff5f57' }} />
                    <span className="project-card__browser-dot" style={{ background: '#ffbd2e' }} />
                    <span className="project-card__browser-dot" style={{ background: '#28ca41' }} />
                    <span className="project-card__browser-url">{project.live.replace('https://', '')}</span>
                  </div>
                  <div className="project-card__browser-body">
                    <div className="project-card__browser-lines">
                      <div className="pbrl pbrl--long" />
                      <div className="pbrl pbrl--medium" />
                      <div className="pbrl pbrl--short" />
                      <div className="pbrl pbrl--long" />
                      <div className="pbrl pbrl--medium" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
