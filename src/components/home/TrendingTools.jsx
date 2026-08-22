import Reveal from './Reveal.jsx';
import './TrendingTools.css';
import tools from '../../data/tools.js';

/*
  TrendingTools — a preview grid of popular AI tools.

  The data is a static import from src/data/tools.js.
  Each card shows: a monogram tile (placeholder icon),
  the tool name, a short description and its category tag.

  Cards are purely presentational for now — clicking one
  just logs to the console.
*/

function TrendingTools() {
  return (
    <section className="trending-section">
      <div className="section-container">
        <Reveal>
          <div className="trending-header">
            <div className="section-header">
              <span className="section-eyebrow">Most explored this week</span>
              <h2 className="section-title">Trending AI Tools</h2>
              <p className="section-subtitle">
                A hand-picked shortlist of what the community is exploring right now.
              </p>
            </div>

            <a href="#" className="trending-view-all">
              View all tools
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                <path d="M7 17L17 7M9 7h8v8" />
              </svg>
            </a>
          </div>
        </Reveal>

        <div className="tools-grid">
          {tools.map((tool, index) => (
            // Stagger the reveal so cards appear one after another
            <Reveal key={tool.id} delay={index * 70}>
              <a
                href="#"
                className="tool-card"
                onClick={(event) => {
                  event.preventDefault();
                  console.log('Tool clicked:', tool.name);
                }}
              >
                {/* Placeholder icon tile — will be replaced by real logos later */}
                <span className={`tool-monogram ${index % 2 === 1 ? 'tool-monogram--violet' : ''}`}>
                  {tool.monogram}
                </span>

                <div className="tool-info">
                  <span className="tool-name">{tool.name}</span>
                  <p className="tool-description">{tool.description}</p>
                </div>

                <div className="tool-meta">
                  <span className="tool-tag">{tool.category}</span>
                  <span className="tool-rating">★ {tool.rating}</span>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TrendingTools;
