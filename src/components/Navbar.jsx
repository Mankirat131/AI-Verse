function Navbar() {
  return<>
    <nav className="navbar">
      <div className="navbar-inner">

        <a href="/" className="logo">
          <span>◇</span> AI-VERSE
        </a>

        <div className="nav-links">
          <a href="#">Discover</a>
          <a href="#Search Tool">🔍 Search </a>
          <a href="#">Categories</a>
          <a href="#">Compare</a>
          <a href="#">Recommendations</a>
        </div>

        <div className="nav-actions">
          <button className="search">⌕</button>
          <a href="#" className="login">Log in</a>
          <a href="#" className="cta">Explore AI</a>
        </div>

      </div>
    </nav>
  </>
}

export default Navbar;