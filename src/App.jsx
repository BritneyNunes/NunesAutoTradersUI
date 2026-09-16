import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "../src/Pages/Login";
import Signup from "../src/Pages/SignUp";
import Home from "../src/Pages/Home";
import Dashboard from "../src/Pages/Dashboard";
import Profile from "../src/Pages/Profile";
import Inventory from "../src/Pages/Inventory";
import Contact from "../src/Pages/Contact";
import AboutUs from "../src/Pages/AboutUs";

function ProtectedRoute({ user, children }) {
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function App() {
  const [user, setUser] = useState(() => {
    const stored = sessionStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  function handleAuthenticated(loggedInUser) {
    setUser(loggedInUser);
  }

  function handleLogout() {
    sessionStorage.removeItem("authHeader");
    sessionStorage.removeItem("user");
    setUser(null);
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            user ? <Navigate to="/" replace /> : <Login onLogin={handleAuthenticated} />
          }
        />
        <Route
          path="/signup"
          element={
            user ? <Navigate to="/" replace /> : <Signup onSignup={handleAuthenticated} />
          }
        />

        <Route path="/" element={<Home user={user} onLogout={handleLogout} />} />
        <Route path="/inventory" element={<Inventory user={user} />} />
        <Route path="/about" element={<AboutUs user={user} />} />
        <Route path="/contact" element={<Contact user={user} />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute user={user}>
              <Dashboard user={user} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute user={user}>
              <Profile user={user} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;