import "./Profile.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";
import { API_URL } from "../api/client";

export default function Profile({ user, onLogout }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("personal");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState(user?.email || "");
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || "");
  const [whatsapp, setWhatsapp] = useState(""); // TODO: no backend field yet
  const [city, setCity] = useState(""); // TODO: backend only has one `location` string
  const [province, setProvince] = useState("Gauteng"); // TODO: same as above

  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState(null);

  useEffect(() => {
    if (user?.name) {
      const parts = user.name.split(" ");
      setFirstName(parts[0] || "");
      setLastName(parts.slice(1).join(" ") || "");
    }
  }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveMessage(null);

    try {
      const authHeader = sessionStorage.getItem("authHeader");

      const res = await fetch(`${API_URL}/users/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader,
        },
        body: JSON.stringify({
          name: `${firstName} ${lastName}`.trim(),
          phoneNumber,
          location: city, // TODO: backend only takes one combined location string for now
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to update profile");
      }

      setSaveMessage({ type: "success", text: "Profile updated successfully." });
    } catch (err) {
      setSaveMessage({ type: "error", text: err.message });
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    onLogout();
    navigate("/login");
  };

  return (
    <div className="profile-page">
      <Navbar user={user} />

      <section className="profile-shell">
        <aside className="profile-sidebar">
          <div className="profile-avatar-block">
            <div className="profile-avatar-large">
              {firstName?.charAt(0).toUpperCase() || "?"}
            </div>
            <p className="profile-sidebar-name">
              {firstName} {lastName}
            </p>
            <p className="profile-sidebar-email">{email}</p>
            {/* TODO: verified seller status not tracked in backend yet */}
          </div>

          <div className="profile-stats">
            <div className="profile-stat">
              <span className="stat-value">—</span>
              <span className="stat-label">Listings</span>
            </div>
            <div className="profile-stat">
              <span className="stat-value">—</span>
              <span className="stat-label">Chats</span>
            </div>
            <div className="profile-stat">
              <span className="stat-value">—</span>
              <span className="stat-label">Member</span>
            </div>
          </div>

          <nav className="profile-nav">
            <p className="profile-nav-heading">Account</p>
            <button
              className={activeTab === "personal" ? "active" : ""}
              onClick={() => setActiveTab("personal")}
            >
              Personal Info
            </button>
            <button
              className={activeTab === "security" ? "active" : ""}
              onClick={() => setActiveTab("security")}
            >
              Security &amp; Password
            </button>
            <button
              className={activeTab === "notifications" ? "active" : ""}
              onClick={() => setActiveTab("notifications")}
            >
              Notification
            </button>

            <p className="profile-nav-heading">Seller</p>
            <button onClick={() => navigate("/dashboard")}>My Listing</button>
          </nav>

          <button className="profile-logout" onClick={handleLogout}>
            Log Out
          </button>
        </aside>

        <main className="profile-main">
          {activeTab === "personal" && (
            <>
              <h1>Personal Information</h1>
              <p className="profile-subtext">
                Update your name, contact detail, and location.
              </p>

              <form className="profile-form" onSubmit={handleSave}>
                <div className="form-row">
                  <div className="form-field">
                    <label>First Name</label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </div>
                  <div className="form-field">
                    <label>Last Name</label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-field">
                  <label>Email</label>
                  <input type="email" value={email} disabled />
                  <p className="field-hint">
                    Your email is used for login and notifications.
                  </p>
                </div>

                <div className="form-row">
                  <div className="form-field">
                    <label>Phone Number</label>
                    <input
                      type="tel"
                      placeholder="(+27) 12 345 6789"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                  </div>
                  <div className="form-field">
                    <label>WhatsApp Number</label>
                    <input
                      type="tel"
                      placeholder="(+27) 12 345 6789"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      disabled
                      title="Not supported by backend yet"
                    />
                  </div>
                </div>

                <div className="form-field">
                  <label>Location</label>
                  <p className="field-hint">
                    Helps buyers know where you and your vehicles are based.
                  </p>
                </div>

                <div className="form-row">
                  <div className="form-field">
                    <label>City</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    />
                  </div>
                  <div className="form-field">
                    <label>Province</label>
                    <select
                      value={province}
                      onChange={(e) => setProvince(e.target.value)}
                      disabled
                      title="Not supported by backend yet"
                    >
                      <option>Gauteng</option>
                      <option>Western Cape</option>
                      <option>KwaZulu-Natal</option>
                      <option>Eastern Cape</option>
                    </select>
                  </div>
                </div>

                {saveMessage && (
                  <p className={`save-message ${saveMessage.type}`}>
                    {saveMessage.text}
                  </p>
                )}

                <button type="submit" className="save-btn" disabled={saving}>
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </form>
            </>
          )}

          {activeTab === "security" && (
            <p className="profile-placeholder">
              Security &amp; password settings coming soon.
            </p>
          )}

          {activeTab === "notifications" && (
            <p className="profile-placeholder">
              Notification preferences coming soon.
            </p>
          )}
        </main>
      </section>
    </div>
  );
}