import { useState } from 'react';
import { PROJECTS } from '../../data/portfolio';
import './ProjectsApp.css';

export default function ProjectsApp() {
  const [selectedTech, setSelectedTech] = useState<string>('all');

  // Extract all unique tech tags
  const allTechs = Array.from(new Set(PROJECTS.flatMap((p) => p.tech)));

  const filteredProjects = selectedTech === 'all'
    ? PROJECTS
    : PROJECTS.filter((p) => p.tech.includes(selectedTech));

  return (
    <div className="projects-app">
      {/* App Header & Filter Bar */}
      <div className="projects-app__header">
        <div>
          <h2 className="projects-app__title">Projects Showcase</h2>
          <p className="projects-app__subtitle">
            Production web applications, full stack architectures, and engineering projects.
          </p>
        </div>

        {/* Filter Badges */}
        <div className="projects-app__filters">
          <button
            type="button"
            className={`projects-app__filter-btn ${selectedTech === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedTech('all')}
          >
            All ({PROJECTS.length})
          </button>
          {allTechs.slice(0, 6).map((tech) => (
            <button
              key={tech}
              type="button"
              className={`projects-app__filter-btn ${selectedTech === tech ? 'active' : ''}`}
              onClick={() => setSelectedTech(tech)}
            >
              {tech}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="projects-app__grid">
        {filteredProjects.map((project) => (
          <article key={project.id} className="projects-app__card">
            <div className="projects-app__card-header">
              <span className={`projects-app__badge projects-app__badge--${project.status}`}>
                ● {project.status === 'deployed' ? 'Production Live' : project.status}
              </span>
              <span className="projects-app__index">{project.index}</span>
            </div>

            <h3 className="projects-app__name">{project.name}</h3>
            <p className="projects-app__tagline">{project.tagline}</p>
            <p className="projects-app__desc">{project.description}</p>

            <div className="projects-app__problem-box">
              <span className="projects-app__problem-label">Problem Solved:</span>
              <span className="projects-app__problem-text">{project.problem}</span>
            </div>

            <div className="projects-app__highlights">
              {project.highlights.map((h, i) => (
                <div key={i} className="projects-app__highlight-item">
                  <span className="projects-app__bullet">▹</span>
                  <span>{h}</span>
                </div>
              ))}
            </div>

            <div className="projects-app__tech-list">
              {project.tech.map((t) => (
                <span key={t} className="projects-app__tech-pill">{t}</span>
              ))}
            </div>

            <div className="projects-app__actions">
              {project.live && (
                <a
                  href={project.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="projects-app__btn projects-app__btn--primary"
                >
                  Live Demo ↗
                </a>
              )}
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="projects-app__btn projects-app__btn--secondary"
                >
                  GitHub Code ↗
                </a>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
