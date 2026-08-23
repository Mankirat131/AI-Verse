import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import HomePage from "./components/home/HomePage.jsx";
import Categories from "./pages/Categories.jsx";
import Compare from "./pages/Compare.jsx";
import Recommendations from "./pages/Recommendations.jsx";
import Search from "./pages/Search.jsx";
import Login from "./pages/Login.jsx";
import About from "./pages/About.jsx";

/*
  App — the root component.

  The Navbar stays mounted above every page.
  HomePage holds all the homepage sections
  (hero, search, categories, trending tools).
*/

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<Search />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/compare" element={<Compare />} />
        <Route path="/recommendations" element={<Recommendations />} />
        <Route path="/login" element={<Login />} />
         <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
