import './App.css';
import Navbar from './components/Navbar.jsx';

function App() {
  return (
    <div className="app">
      <div className="app-ambient" aria-hidden="true" />
      <Navbar />
    </div>
  );
}

export default App;