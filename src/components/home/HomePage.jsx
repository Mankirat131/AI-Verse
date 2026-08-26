import Hero from './Hero.jsx';
import CategorySection from './CategorySection.jsx';
import TrendingTools from './TrendingTools.jsx';
import './HomePage.css';

function HomePage() {
  return (
    <main>
      <div className="page-ambient" aria-hidden="true" />

      <Hero />

      <div id="categories">
        <CategorySection />
      </div>

      <TrendingTools />
    </main>
  );
}

export default HomePage;
