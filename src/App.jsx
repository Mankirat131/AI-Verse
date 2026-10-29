import { useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import HomePage from "./components/home/HomePage.jsx";
import Categories from "./pages/Categories.jsx";
import Compare from "./pages/Compare.jsx";
import Recommendations from "./pages/Recommendations.jsx";
import Search from "./pages/Search.jsx";
import Login from "./pages/Login.jsx";
import { finishToolVisit } from "./components/util/activityTracker";

function App() {
  // When the user returns from a tool's tab, record how long they were away (on any page)
  useEffect(() => {
    const onReturn = () => {
      if (document.visibilityState === "visible") finishToolVisit();
    };
    document.addEventListener("visibilitychange", onReturn);
    window.addEventListener("focus", onReturn);
    return () => {
      document.removeEventListener("visibilitychange", onReturn);
      window.removeEventListener("focus", onReturn);
    };
  }, []);

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
      </Routes>
    </BrowserRouter>
  );
}

export default App;