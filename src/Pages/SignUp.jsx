import { useState } from "react";
import "./SignUp.css";
import { Link } from "react-router-dom";
import { API_URL } from "../api/client";

function EyeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-7 0-11-7-11-7a18.5 18.5 0 0 1 5.06-5.94M9.9 4.24A10.94 10.94 0 0 1 12 4c7 0 11 7 11 7a18.5 18.5 0 0 1-2.16 3.19M14.12 14.12a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

export default function Signup({ onSignup, onSwitchToLogin }) {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!name || !surname || !email || !password || !phoneNumber) {
      setError("Fill in every field to create your account.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${name} ${surname}`.trim(),
          email,
          password,
          phoneNumber,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Couldn't create your account. Try again.");
        setLoading(false);
        return;
      }

      // Sign the new user straight in — Basic Auth credential for protected routes.
      const credential = btoa(`${email}:${password}`);
      sessionStorage.setItem("authHeader", `Basic ${credential}`);
      sessionStorage.setItem("user", JSON.stringify(data.user));

      setLoading(false);
      onSignup?.(data.user);
    } catch (err) {
      console.error("Signup request failed:", err);
      setError("Can't reach the server. Is the API running?");
      setLoading(false);
    }
  }

  return (
    <div className="signup-page">
      <div className="signup-image" />

      <div className="signup-panel">
        <div className="signup-panel-inner">
          <h1 className="signup-title">Sign Up</h1>

          <form className="signup-form" onSubmit={handleSubmit} noValidate>
            <label className="field">
              <span className="field-label">Name :</span>
              <input
                type="text"
                className="field-input"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="given-name"
              />
            </label>

            <label className="field">
              <span className="field-label">Surname :</span>
              <input
                type="text"
                className="field-input"
                placeholder="Surname"
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
                autoComplete="family-name"
              />
            </label>

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
              <span className="field-label">Phone Number :</span>
              <input
                className="field-input"
                placeholder="Phone Number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                autoComplete="phone-number"
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
                autoComplete="new-password"
              />
            </label>


            {error && (
              <p className="form-error" role="alert">
                {error}
              </p>
            )}

            <button type="submit" className="connect-btn" disabled={loading}>
              {loading ? "Creating account…" : "Connect"}
            </button>
          </form>

          <p className="signup-footer">
            Already have an account?{" "}
            <Link to="/login">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}