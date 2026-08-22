import './App.css';
import Navbar from './components/Navbar.jsx';
import HomePage from './components/home/HomePage.jsx';

/*
  App — the root component.

  The Navbar stays mounted above every page.
  HomePage holds all the homepage sections
  (hero, search, categories, trending tools).
*/

function App() {
  return (
    <div className="app">
      <Navbar />
      <HomePage />
    </div>
  );
}

export default App;
