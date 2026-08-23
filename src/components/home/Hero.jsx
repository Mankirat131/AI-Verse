import HeroBackground from './HeroBackground.jsx';
import SearchBar from './SearchBar.jsx';
import Reveal from './Reveal.jsx';
import './Hero.css';

/*
  Hero — the first full-viewport screen.

  Structure:
  - <HeroBackground /> draws the atmosphere BEHIND everything
  - the content column holds: eyebrow, headline, paragraph,
    search bar and the two CTA buttons
  - <Reveal> gives the content a gentle entrance animation
*/

function Hero() {
  return (
    <section className="hero">
      {/* Decorative layers — no text, no interaction */}
      <HeroBackground />

      <div className="hero-content">
        <Reveal>
          <p className="hero-eyebrow">
            <span className="eyebrow-star" aria-hidden="true">✦</span>
            Find the right AI tool for every task
          </p>
        </Reveal>

        <Reveal delay={100}>
          <h1 className="hero-title">
            Discover
            <br />
            the <span className="hero-title-accent">AI Universe</span>
          </h1>
        </Reveal>

        <Reveal delay={200}>
          <p className="hero-description">
            Explore, compare and discover the right AI tool for whatever
            you're trying to accomplish.
          </p>
        </Reveal>

        {/* The main hero interaction */}
        <Reveal delay={300}>
          <SearchBar />
        </Reveal>

        <Reveal delay={400}>
          <div className="hero-actions">
            <a href="#categories" className="btn-primary">
              Explore AI Tools
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </a>

            <a href="#categories" className="btn-secondary">
              Explore Categories
            </a>
          </div>
        </Reveal>
      </div>

      {/* Subtle scroll hint at the bottom of the screen */}
      <div className="hero-scroll-hint" aria-hidden="true">
        <span />
      </div>
    </section>
  );
}

export default Hero;
