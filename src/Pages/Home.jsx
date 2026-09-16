import "./Home.css";
import Navbar from "../Components/Navbar";

export default function Home({ user, onLogout }) {
  return (
    <div className="home-page">
      <Navbar />

      <section className="hero">
        <div className="hero-content">
          <p className="hero-eyebrow">South Africa's Premium Car Marketplace</p>
          <h1 className="hero-heading">
            Find your Next <span className="hero-accent">Perfect Drive</span>
          </h1>
          <p className="hero-subtext">
            Browse hundreds of verified listings from private sellers and
            dealers across the country. No middlemen, no hassle.
          </p>
        </div>

        <div className="hero-image" />
      </section>

      {user && (
        <div className="home-session-bar">
          Signed in as {user.name} · <button onClick={onLogout}>Log out</button>
        </div>
      )}
    </div>
  );
}