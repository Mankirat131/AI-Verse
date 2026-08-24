
import { Link } from 'react-router-dom';
function Navbar() {
  return<>
    <nav className="navbar">
      <div className="navbar-inner">

        <a href="/" className="logo">
          <span>◇</span> AI-VERSE
        </a>

        <div className="nav-links">
          <Link to="/">Discover</Link>
          <Link to="/search">🔍 Search </Link>
          <Link to="/categories">Categories</Link>
          <Link to="/compare">Compare</Link>
          <Link to="/recommendations">Recommendations</Link>

        </div>

        <div className="nav-actions">
          <button className="search">⌕</button>
          <Link to="/login" className="login">Log in</Link>
          <Link to="/search" className="cta">Explore AI</Link>
        </div>

      </div>
    </nav>
  </>
}

export default Navbar;