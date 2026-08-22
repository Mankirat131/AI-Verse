import Hero from './Hero.jsx';
import CategorySection from './CategorySection.jsx';
import TrendingTools from './TrendingTools.jsx';
import './HomePage.css';

/*
  HomePage — assembles all homepage sections in order.

  This component contains no logic of its own; it only composes
  the smaller section components, like a table of contents.
*/

function HomePage() {
  return (
    <main>
      {/* Decorative violet light behind the lower page (aria-hidden = ignored by screen readers) */}
      <div className="page-ambient" aria-hidden="true" />

      {/* Full-screen intro with search */}
      <Hero />

      {/* Category blocks */}
      <div id="categories">
        <CategorySection />
      </div>

      {/* Trending tools preview */}
      <TrendingTools />
    </main>
  );
}

export default HomePage;
