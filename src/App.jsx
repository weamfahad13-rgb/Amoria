import "./App.css";
import { Routes, Route, useNavigate } from "react-router-dom";

import CakePage from "./CakePage";

import wallpaper from "./assets/wallpaper.svg";
import logo from "./assets/logo.svg";
import button from "./assets/button.svg";

function HomePage() {
  const navigate = useNavigate();

  return (
    <main className="home">
      <img className="wallpaper" src={wallpaper} alt="background" />

      <div className="hero-content">
        <img className="logo" src={logo} alt="Amoria" />

        <button className="main-button" onClick={() => navigate("/cakes")}>
          <img src={button} alt="Tell Us" />
        </button>
      </div>
    </main>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/cakes" element={<CakePage />} />
    </Routes>
  );
}

export default App;