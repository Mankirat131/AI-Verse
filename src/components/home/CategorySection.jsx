import Reveal from './Reveal.jsx';
import './CategorySection.css';
import categories from '../../data/categories.js';


const icons = {
  coding: (
    <path d="M9 7l-5 5 5 5M15 7l5 5-5 5" />
  ),
  design: (
    <>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  writing: <path d="M4 6h16M4 12h11M4 18h7" />,
  research: (
    <>
      <circle cx="10.5" cy="10.5" r="6" />
      <path d="M20 20l-5-5" />
    </>
  ),
  video: (
    <>
      <rect x="3" y="6" width="13" height="12" rx="2" />
      <path d="M16 10.5l5-2.5v8l-5-2.5" />
    </>
  ),
  marketing: <path d="M4 11v2a1 1 0 001 1h2l8 5V5L7 10H5a1 1 0 00-1 1zM18 9a4 4 0 010 6" />,
  productivity: <path d="M13 3L5 14h6l-1 7 8-11h-6l1-7z" />,
};


function CategorySection() {
  return (
    <section className="categories-section">
      <div className="section-container">
        <Reveal>
          <div className="section-header">
            <span className="section-eyebrow">Browse by discipline</span>
            <h2 className="section-title">Explore the AI Universe</h2>
            <p className="section-subtitle">
              Seven curated constellations of tools — start with what you do.
            </p>
          </div>
        </Reveal>

        <div className="categories-grid">
          {categories.map((category, index) => (
            <Reveal key={category.id} delay={index * 60}>
              {/* Extra classes mark featured blocks / alternate icon styles */}
              <a
                href="#"
                className={[
                  'category-card',
                  category.featured ? 'category-card--featured' : '',
                  index % 2 === 1 ? 'category-card--alt' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                onClick={(event) => {
                  event.preventDefault(); 
                  console.log('Category clicked:', category.name);
                }}
              >
                <span className="category-icon">{icons[category.id]}</span>
                <span className="category-text">
                  <span className="category-name">
                    {category.name}
                    <svg
                      className="category-arrow"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      aria-hidden="true"
                    >
                      <path d="M7 17L17 7M9 7h8v8" />
                    </svg>
                  </span>
                  <span className="category-description">{category.description}</span>
                  <span className="category-count">{category.toolCount}</span>
                </span>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export default CategorySection;
