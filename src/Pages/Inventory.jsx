import "./Inventory.css";
import { useEffect, useState } from "react";
import Navbar from "../Components/Navbar";
import { apiFetch } from "../api/client";

export default function Inventory({ user }) {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCar, setSelectedCar] = useState(null);

  const [makeFilter, setMakeFilter] = useState("All Makes");
  const [priceFilter, setPriceFilter] = useState("Any Price");
  const [yearFilter, setYearFilter] = useState("Any Year");

  const [originStyle, setOriginStyle] = useState({});
  const [authNotice, setAuthNotice] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    async function loadCars() {
      try {
        const data = await apiFetch("/cars");
        setCars(data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadCars();
  }, []);

  const makes = ["All Makes", ...new Set(cars.map((car) => car.brand))];
  const years = ["Any Year", ...new Set(cars.map((car) => car.year))].sort();

  const priceRanges = {
    "Any Price": () => true,
    "Under R200,000": (price) => price < 200000,
    "R200,000 - R500,000": (price) => price >= 200000 && price <= 500000,
    "Over R500,000": (price) => price > 500000,
  };

  const filteredCars = cars.filter((car) => {
    const matchesMake = makeFilter === "All Makes" || car.brand === makeFilter;
    const matchesYear = yearFilter === "Any Year" || car.year === Number(yearFilter);
    const matchesPrice = priceRanges[priceFilter](car.price);
    return matchesMake && matchesYear && matchesPrice;
  });

  const openDetails = async (carId, e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const originX = rect.left + rect.width / 2;
    const originY = rect.top + rect.height / 2;

    setOriginStyle({
      "--origin-x": `${originX}px`,
      "--origin-y": `${originY}px`,
    });

    try {
      const car = await apiFetch(`/cars/${carId}`);
      setSelectedCar(car);
      setCurrentImageIndex(0);
    } catch (err) {
      console.error("Failed to load car details:", err);
    }
  };

  const closeDetails = () => {
    setSelectedCar(null);
    setAuthNotice("");
    setCurrentImageIndex(0);
  };

  const handleContactSeller = async () => {
    if (!user) {
      setAuthNotice("Please log in to contact the seller.");
      return;
    }

    if (!selectedCar) {
      return;
    }

    const message = window.prompt(
      `Send a message to the seller about ${selectedCar.brand} ${selectedCar.model}:`,
      "Hi, I'm interested in this vehicle and would like more information."
    );

    if (!message || !message.trim()) {
      setAuthNotice("Message was not sent. Please enter a message to continue.");
      return;
    }

    try {
      setAuthNotice("Sending your message...");
      await apiFetch(`/cars/${selectedCar._id}/contact`, {
        method: "POST",
        body: JSON.stringify({ message: message.trim() }),
      });

      setAuthNotice("Your message has been sent to the seller.");
    } catch (err) {
      setAuthNotice(err.message || "Could not send your message right now.");
    }
  };

  const handleNextImage = () => {
    if (selectedCar?.images && selectedCar.images.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % selectedCar.images.length);
    }
  };

  const handlePrevImage = () => {
    if (selectedCar?.images && selectedCar.images.length > 1) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? selectedCar.images.length - 1 : prev - 1
      );
    }
  };

  return (
    <div className="inventory-page">
      <Navbar user={user} />

      <section className="inventory-content">
        <div className="inventory-header">
          <h1 className="inventory-title">Inventory</h1>

          <div className="inventory-filters">
            <select
              value={makeFilter}
              onChange={(e) => setMakeFilter(e.target.value)}
            >
              {makes.map((make) => (
                <option key={make} value={make}>
                  {make}
                </option>
              ))}
            </select>

            <select
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value)}
            >
              {Object.keys(priceRanges).map((range) => (
                <option key={range} value={range}>
                  {range}
                </option>
              ))}
            </select>

            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading && <p className="inventory-status">Loading inventory...</p>}
        {error && <p className="inventory-status error">{error}</p>}
        {!loading && !error && filteredCars.length === 0 && (
          <p className="inventory-status">No cars match these filters.</p>
        )}

        <div className="inventory-grid">
          {filteredCars.map((car) => (
            <div
              className="car-card"
              key={car._id}
              onClick={(event) => openDetails(car._id, event)}
            >
              <div className="car-card-image">
                {car.images?.[0] ? (
                  <img src={car.images[0]} alt={`${car.brand} ${car.model}`} />
                ) : (
                  <div className="car-card-image-placeholder" />
                )}
              </div>

              <div className="car-card-body">
                <p className="car-card-make">{car.brand}</p>
                <p className="car-card-title">{car.model}</p>
                <p className="car-card-year">{car.year}</p>
                <p className="car-card-price">
                  R{Number(car.price).toLocaleString()}
                </p>

                <div className="car-card-tags">
                  {car.mileage != null && (
                    <span className="car-tag">
                      {Number(car.mileage).toLocaleString()} km
                    </span>
                  )}
                  {car.transmission && (
                    <span className="car-tag">{car.transmission}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {selectedCar && (
        <div className="car-modal-overlay" onClick={closeDetails}>
          <div
            className="car-modal"
            style={originStyle}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="car-modal-image">
              {selectedCar.images?.[currentImageIndex] ? (
                <img
                  src={selectedCar.images[currentImageIndex]}
                  alt={`${selectedCar.brand} ${selectedCar.model}`}
                />
              ) : (
                <div className="car-modal-image-placeholder" />
              )}
              
              {selectedCar.images && selectedCar.images.length > 1 && (
                <div className="image-carousel-controls">
                  <button
                    className="carousel-btn carousel-btn-prev"
                    onClick={handlePrevImage}
                    aria-label="Previous image"
                  >
                    ‹
                  </button>
                  <span className="image-counter">
                    {currentImageIndex + 1} / {selectedCar.images.length}
                  </span>
                  <button
                    className="carousel-btn carousel-btn-next"
                    onClick={handleNextImage}
                    aria-label="Next image"
                  >
                    ›
                  </button>
                </div>
              )}
            </div>

            <div className="car-modal-body">
              <p className="car-modal-make">{selectedCar.brand}</p>
              <h2 className="car-modal-title">{selectedCar.model}</h2>
              <p className="car-modal-price">
                R{Number(selectedCar.price).toLocaleString()}
              </p>

              {selectedCar.description && (
                <p className="car-modal-description">{selectedCar.description}</p>
              )}

              <div className="car-modal-specs">
                <div>
                  <span className="spec-label">Year</span>
                  <span className="spec-value">{selectedCar.year}</span>
                </div>
                <div>
                  <span className="spec-label">Mileage</span>
                  <span className="spec-value">
                    {selectedCar.mileage != null
                      ? `${Number(selectedCar.mileage).toLocaleString()} km`
                      : "—"}
                  </span>
                </div>
                <div>
                  <span className="spec-label">Fuel Type</span>
                  <span className="spec-value">{selectedCar.fuelType || "—"}</span>
                </div>
                <div>
                  <span className="spec-label">Transmission</span>
                  <span className="spec-value">
                    {selectedCar.transmission || "—"}
                  </span>
                </div>
                <div>
                  <span className="spec-label">Color</span>
                  <span className="spec-value">{selectedCar.color || "—"}</span>
                </div>
                <div>
                  <span className="spec-label">Location</span>
                  <span className="spec-value">{selectedCar.location || "—"}</span>
                </div>
              </div>

              {authNotice && <p className="inventory-auth-notice">{authNotice}</p>}

              <div className="car-modal-actions">
                <button className="modal-close-btn" onClick={closeDetails}>
                  Close
                </button>
                <button className="modal-contact-btn" onClick={handleContactSeller}>
                  {user ? "Contact Seller" : "Login to contact"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
