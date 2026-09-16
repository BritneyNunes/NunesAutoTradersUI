import { useState } from "react";
import "./Login.css";
import { Link } from "react-router-dom";
import { API_URL } from "../api/client";

export default function Login({ onLogin, onSwitchToSignup }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Enter your email and password to continue.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed. Check your details and try again.");
        setLoading(false);
        return;
      }

      // Basic Auth credential for protected routes, kept for this session only.
      const credential = btoa(`${email}:${password}`);
      sessionStorage.setItem("authHeader", `Basic ${credential}`);
      sessionStorage.setItem("user", JSON.stringify(data.user));

      setLoading(false);
      onLogin?.(data.user);
    } catch (err) {
      console.error("Login request failed:", err);
      setError("Can't reach the server. Is the API running?");
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-image" />

      <div className="login-panel">
        <div className="login-panel-inner">
          <h1 className="login-title">Login</h1>

          <form className="login-form" onSubmit={handleSubmit} noValidate>
            <label className="field">
              <span className="field-label">Email :</span>
              <input
                type="email"
                className="field-input"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </label>

            <label className="field">
              <span className="field-label">Password :</span>
              <input
                type="password"
                className="field-input"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </label>

            {error && (
              <p className="form-error" role="alert">
                {error}
              </p>
            )}

            <button type="submit" className="connect-btn" disabled={loading}>
              {loading ? "Connecting…" : "Connect"}
            </button>
          </form>

          <p className="login-footer">
            New here?{" "}
            <Link to="/signup">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}