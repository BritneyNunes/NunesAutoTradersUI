import "./AboutUs.css";
import { Link } from "react-router-dom";
import Navbar from "../Components/Navbar";

const stats = [
  { value: "12+", label: "Years in business" },
  { value: "3,400+", label: "Cars sold" },
  { value: "98%", label: "Happy customers" },
  { value: "4", label: "Branches nationwide" },
];

const values = [
  {
    title: "Honest inspections",
    body: "Every vehicle on our floor is checked bumper to bumper before it's listed. No surprises, no shortcuts.",
  },
  {
    title: "Fair pricing",
    body: "We price against real market data, not guesswork, so you're never paying over the odds.",
  },
  {
    title: "People first",
    body: "Our team is judged on how well we look after customers, not just how fast we close a sale.",
  },
];

export default function AboutUs({ user }) {
  return (
    <div className="about-page">
      <Navbar user={user} />

      <section className="about-content">
        <div className="about-hero">
          <span className="hero-badge">Est. 2014</span>
          <h1 className="about-text">
            About <span className="brand-nunes">NunesAuto</span>{" "}
            <span className="brand-traders">Traders</span>
          </h1>
          <p>
            We've been helping South Africans buy and sell cars they can trust
            since 2014. What started as a single lot in Springfield has grown
            into a nationwide dealership network, but the way we treat
            customers hasn't changed.
          </p>
        </div>

        <div className="about-stats">
          {stats.map((stat) => (
            <div className="stat-card" key={stat.label}>
              <p className="stat-value">{stat.value}</p>
              <p className="stat-label">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="about-grid">
          <div className="about-panel">
            <h2>Our story</h2>
            <p>
              NunesAuto Traders was founded on a simple idea: buying a used
              car shouldn't feel like a gamble. We started with a handful of
              carefully inspected vehicles and a promise to never hide a
              vehicle's history from a buyer.
            </p>
            <p>
              Today we list hundreds of vehicles across our branches, but
              every single one still goes through the same inspection process
              our founder used on day one.
            </p>
          </div>

          <div className="about-panel">
            <h2>Our mission</h2>
            <p>
              To make finding a reliable car simple, transparent, and
              pressure-free — whether you're buying your first car or trading
              in your fifth.
            </p>
            <p>
              We back that up with clear vehicle histories, straightforward
              pricing, and a team that's happy to answer every question before
              you decide.
            </p>
          </div>
        </div>

        <div className="about-values">
          <h2>What we stand for</h2>
          <div className="values-grid">
            {values.map((value) => (
              <div className="value-card" key={value.title}>
                <h3>{value.title}</h3>
                <p>{value.body}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="about-cta">
          <div>
            <h2>Ready to find your next car?</h2>
            <p>Browse our current inventory or send us a message.</p>
          </div>
          <div className="about-cta-actions">
            <Link to="/inventory" className="cta-btn primary">
              View Inventory
            </Link>
            <Link to="/contact" className="cta-btn secondary">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}