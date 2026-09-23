import { ACHIEVEMENTS, DSA_STATS } from '../../data/portfolio';
import './Achievements.css';

export default function Achievements() {
  return (
    <section id="achievements" className="achievements section" aria-label="Achievements and DSA section">
      <div className="container">
        {/* Header */}
        <div className="section-header reveal">
          <p className="section-number">07 — ACHIEVEMENTS & DSA</p>
          <h2 className="achievements__heading">
            Challenges{' '}
            <span className="gradient-text">conquered.</span>
          </h2>
        </div>

        <div className="achievements__grid">
          {/* Left: Achievements */}
          <div className="achievements__left">
            <h3 className="achievements__sub reveal">Hackathons & Competitions</h3>
            <div className="achievements__cards stagger">
              {ACHIEVEMENTS.filter((a) => a.type !== 'dsa').map((a) => (
                <div key={a.id} className="achievement-card glass">
                  <div className="achievement-card__badge">{a.badge}</div>
                  <div className="achievement-card__content">
                    <div className="achievement-card__header">
                      <h4 className="achievement-card__title">{a.title}</h4>
                      <span className="achievement-card__year">{a.year}</span>
                    </div>
                    <p className="achievement-card__org">{a.organization}</p>
                    <p className="achievement-card__desc">{a.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: DSA */}
          <div className="achievements__right reveal-right">
            <h3 className="achievements__sub">Data Structures & Algorithms</h3>

            <div className="dsa__card glass">
              <div className="dsa__header">
                <div className="dsa__platform">
                  <span className="dsa__platform-icon">💻</span>
                  <span className="dsa__platform-name">LeetCode</span>
                </div>
                <a
                  href={DSA_STATS.leetcode.profile}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-ghost btn-sm"
                  aria-label="View LeetCode profile"
                >
                  Profile →
                </a>
              </div>

              <div className="dsa__stats-row">
                <div className="dsa__stat">
                  <span className="dsa__stat-value">{DSA_STATS.leetcode.solved}</span>
                  <span className="dsa__stat-label">Problems Solved</span>
                </div>
                <div className="dsa__stat">
                  <span className="dsa__stat-value" style={{ color: 'var(--green)' }}>
                    {DSA_STATS.leetcode.streak}
                  </span>
                  <span className="dsa__stat-label">Status</span>
                </div>
              </div>

              <div className="dsa__topics">
                <p className="dsa__topics-label">Topics covered:</p>
                <div className="dsa__topics-grid">
                  {DSA_STATS.topics.map((topic) => (
                    <span key={topic} className="dsa__topic-badge">{topic}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Competitive programming platforms */}
            <div className="dsa__platforms">
              <p className="dsa__platforms-label">Active on:</p>
              <div className="dsa__platforms-list">
                {['LeetCode', 'Codeforces', 'CodeChef'].map((p) => (
                  <span key={p} className="dsa__platform-badge">{p}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
