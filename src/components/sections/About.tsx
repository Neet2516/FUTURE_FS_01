import { useState } from 'react';
import { EXPERIENCES } from '../../data/portfolio';
import { PORTFOLIO_PHOTOS, type PortfolioPhoto } from '../../config/osAssets';
import './About.css';

const STATS = [
  { value: '3+', label: 'Projects Deployed' },
  { value: '10k+', label: 'Competition Teams Beaten' },
  { value: '150+', label: 'LeetCode Problems' },
  { value: '130+', label: 'Students Served' },
];

export default function About() {
  const [selectedPhoto, setSelectedPhoto] = useState<PortfolioPhoto>(PORTFOLIO_PHOTOS[0]);

  return (
    <section id="about" className="about section" aria-label="About section">
      <div className="container">
        {/* Header */}
        <div className="section-header reveal">
          <p className="section-number">02 — ABOUT</p>
          <h2 className="about__heading">
            Engineering with{' '}
            <span className="gradient-text">purpose.</span>
          </h2>
        </div>

        {/* Main content */}
        <div className="about__grid">
          {/* Left: Bio */}
          <div className="about__bio reveal-left">
            <p className="about__bio-text">
              I'm a full-stack developer passionate about building scalable web applications,
              real-time collaborative systems, and AI-powered platforms. I thrive at the
              intersection of thoughtful engineering and beautiful user interfaces — where
              architecture meets aesthetics.
            </p>
            <p className="about__bio-text">
              My focus areas include frontend architecture with React/Next.js, backend systems
              with Node.js, real-time communication via WebSockets, and deployment on cloud
              platforms. I care deeply about performance, accessibility, and developer experience.
            </p>

            {/* Education & Community highlight */}
            <div className="about__highlights stagger">
              {EXPERIENCES.map((exp) => (
                <div key={exp.id} className="about__highlight-card glass">
                  <div className="about__highlight-icon">
                    {exp.type === 'education' ? '🎓' : '👥'}
                  </div>
                  <div>
                    <p className="about__highlight-role">{exp.role}</p>
                    <p className="about__highlight-org">{exp.institution}</p>
                    <p className="about__highlight-period">{exp.period}</p>
                  </div>
                  {exp.current && (
                    <span className="about__highlight-badge">Current</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right: Stats + visual + Photos */}
          <div className="about__right reveal-right">
            {/* Stats grid */}
            <div className="about__stats">
              {STATS.map((stat) => (
                <div key={stat.label} className="about__stat glass">
                  <span className="about__stat-value">{stat.value}</span>
                  <span className="about__stat-label">{stat.label}</span>
                </div>
              ))}
            </div>

            {/* Photos Gallery */}
            <div className="about__photos-card glass">
              <div className="about__photos-header">
                <span className="about__photos-title">Photos</span>
                <span className="about__photos-count">{PORTFOLIO_PHOTOS.length}</span>
              </div>

              <div className="about__photos-showcase">
                <div className="about__photos-main-box">
                  <img
                    src={selectedPhoto.src}
                    alt={selectedPhoto.name}
                    className="about__photos-main-img"
                  />
                </div>

                <div className="about__photos-thumbs-row">
                  {PORTFOLIO_PHOTOS.map((photo) => (
                    <button
                      key={photo.id}
                      type="button"
                      className={`about__photos-thumb-btn ${photo.id === selectedPhoto.id ? 'about__photos-thumb-btn--active' : ''}`}
                      onClick={() => setSelectedPhoto(photo)}
                      title={photo.name}
                      aria-label={photo.name}
                    >
                      <img src={photo.src} alt={photo.name} className="about__photos-thumb-img" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Code snippet visual */}
            <div className="about__code-card glass">
              <div className="about__code-bar">
                <span className="about__code-dot" style={{ background: '#ff5f57' }} />
                <span className="about__code-dot" style={{ background: '#ffbd2e' }} />
                <span className="about__code-dot" style={{ background: '#28ca41' }} />
                <span className="about__code-filename">navneet.ts</span>
              </div>
              <pre className="about__code"><code>
                <span className="code-kw">const</span> <span className="code-var">navneet</span> <span className="code-punct">=</span> <span className="code-punct">{'{'}</span>{'\n'}
                {'  '}<span className="code-prop">name</span><span className="code-punct">:</span> <span className="code-str">"Navneet Sinha"</span><span className="code-punct">,</span>{'\n'}
                {'  '}<span className="code-prop">role</span><span className="code-punct">:</span> <span className="code-str">"Full Stack Developer"</span><span className="code-punct">,</span>{'\n'}
                {'  '}<span className="code-prop">location</span><span className="code-punct">:</span> <span className="code-str">"New Delhi, India"</span><span className="code-punct">,</span>{'\n'}
                {'  '}<span className="code-prop">focus</span><span className="code-punct">:</span> <span className="code-punct">[</span>{'\n'}
                {'    '}<span className="code-str">"Real-time systems"</span><span className="code-punct">,</span>{'\n'}
                {'    '}<span className="code-str">"Scalable architecture"</span><span className="code-punct">,</span>{'\n'}
                {'    '}<span className="code-str">"Beautiful UIs"</span><span className="code-punct">,</span>{'\n'}
                {'  '}<span className="code-punct">],</span>{'\n'}
                {'  '}<span className="code-prop">stack</span><span className="code-punct">:</span> <span className="code-punct">{'{'}</span>{'\n'}
                {'    '}<span className="code-prop">frontend</span><span className="code-punct">:</span> <span className="code-punct">[</span><span className="code-str">"React"</span><span className="code-punct">,</span> <span className="code-str">"Next.js"</span><span className="code-punct">,</span> <span className="code-str">"TypeScript"</span><span className="code-punct">],</span>{'\n'}
                {'    '}<span className="code-prop">backend</span><span className="code-punct">:</span> <span className="code-punct">[</span><span className="code-str">"Node.js"</span><span className="code-punct">,</span> <span className="code-str">"Express"</span><span className="code-punct">,</span> <span className="code-str">"WebSockets"</span><span className="code-punct">],</span>{'\n'}
                {'    '}<span className="code-prop">db</span><span className="code-punct">:</span> <span className="code-punct">[</span><span className="code-str">"MongoDB"</span><span className="code-punct">,</span> <span className="code-str">"PostgreSQL"</span><span className="code-punct">,</span> <span className="code-str">"Redis"</span><span className="code-punct">],</span>{'\n'}
                {'  '}<span className="code-punct">{'}'}</span><span className="code-punct">,</span>{'\n'}
                {'  '}<span className="code-prop">status</span><span className="code-punct">:</span> <span className="code-str">"Open to Work 🚀"</span><span className="code-punct">,</span>{'\n'}
                <span className="code-punct">{'};'}</span>
              </code></pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

