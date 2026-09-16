import "./Contact.css";
import { useState } from "react";
import Navbar from "../Components/Navbar";
import { apiFetch } from "../api/client";

export default function Contact({ user }) {
  const [form, setForm] = useState({
    name: "",
    surname: "",
    email: "",
    message: "",
  });

  const [status, setStatus] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const name = form.name.trim();
    const surname = form.surname.trim();
    const email = form.email.trim();
    const message = form.message.trim();

    if (!name || !surname || !email || !message) {
      setStatus({
        type: "error",
        message: "Please complete all fields before sending your message.",
      });
      return;
    }

    setLoading(true);
    setStatus({ type: "", message: "" });

    try {
      await apiFetch("/contact", {
        method: "POST",
        body: JSON.stringify({
          name: `${name} ${surname}`.trim(),
          email,
          message,
        }),
      });

      setStatus({
        type: "success",
        message: "Thanks! Your message has been sent successfully.",
      });
      setForm({ name: "", surname: "", email: "", message: "" });
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message || "Unable to send your message right now.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-page">
      <Navbar user={user} />

      <section className="contact-content">
        <div className="contact-card">
          <aside className="contact-info">
            <p className="info-copy">
              Have a question, a complaint, or just want to say hello? Our team is
              available Monday to Friday, 8am-5pm.
            </p>

            <div className="info-block">
              <span>Address :</span>
              <p>72 Marlborough Rd, Springfield</p>
            </div>

            <div className="info-block">
              <span>Phone :</span>
              <p>(+27) 12 345 6789</p>
            </div>

            <div className="info-block">
              <span>Email :</span>
              <p>britney@nunesauto.co.za</p>
            </div>
          </aside>

          <section className="contact-form-panel">
            <h2>Lets Connect</h2>

            <form className="contact-form" onSubmit={handleSubmit} noValidate>
              <label>
                <span>Name :</span>
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={form.name}
                  onChange={handleChange}
                />
              </label>

              <label>
                <span>Surname :</span>
                <input
                  type="text"
                  name="surname"
                  placeholder="Surname"
                  value={form.surname}
                  onChange={handleChange}
                />
              </label>

              <label>
                <span>Email :</span>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={handleChange}
                />
              </label>

              <label>
                <span>Message :</span>
                <textarea
                  name="message"
                  rows="5"
                  placeholder="Message"
                  value={form.message}
                  onChange={handleChange}
                />
              </label>

              {status.message && (
                <p className={`form-status ${status.type}`}>{status.message}</p>
              )}

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? "Sending..." : "Connect"}
              </button>
            </form>
          </section>
        </div>
      </section>
    </div>
  );
}