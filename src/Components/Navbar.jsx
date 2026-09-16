import "./Navbar.css";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Navbar({ overlay = false, user }) {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "light"
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <header className={`navbar ${overlay ? "navbar--overlay" : ""}`}>
      <div className="navbar-left">
        <div className="navbar-logo">
          <Link to="/">
            <span className="logo-nunesauto">NunesAuto</span>{" "}
            <span className="logo-traders">Traders</span>
          </Link>
        </div>
      </div>
      <nav className="navbar-links">
        <Link to="/inventory">Inventory</Link>
        <Link to="/about">About Us</Link>
        <Link to="/contact">Contact us</Link>
        <Link to="/dashboard">Dashboard</Link>

        <Link to="/profile" className="navbar-profile" aria-label="Profile">
          {user?.name?.charAt(0).toUpperCase() || "?"}
        </Link>

        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label="Toggle dark mode"
        >
          {theme === "light" ? "🌙" : "☀️"}
        </button>
      </nav>
    </header>
  );
}