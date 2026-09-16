import { useState } from "react";

const initialForm = {
  brand: "",
  model: "",
  year: "",
  price: "",
  mileage: "",
  location: "",
  description: "",
  imageUrl: "",
  color: "",
  transmission: "",
  fuelType: "",
};

export default function AddNewListing({ onClose, onSubmit }) {
  const [formData, setFormData] = useState(initialForm);
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!formData.brand || !formData.model || !formData.year || !formData.price) {
      setFormError("Brand, model, year, and price are required.");
      return;
    }

    setSubmitting(true);

    try {
      await onSubmit({
        brand: formData.brand,
        model: formData.model,
        year: Number(formData.year),
        price: Number(formData.price),
        mileage: formData.mileage ? Number(formData.mileage) : null,
        location: formData.location || null,
        description: formData.description || null,
        images: formData.imageUrl ? [formData.imageUrl] : [],
        color: formData.color || null,
        transmission: formData.transmission || null,
        fuelType: formData.fuelType || null,
      });
      // Dashboard closes the modal on success; nothing else to do here
    } catch (err) {
      setFormError(err.message || "Failed to add listing.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="add-listing-overlay" onClick={onClose}>
      <div className="add-listing-modal" onClick={(e) => e.stopPropagation()}>
        <h2 className="add-listing-heading">Add New Listing</h2>

        <form className="add-listing-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-field">
              <label>Brand *</label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleFormChange}
                placeholder="BMW"
              />
            </div>
            <div className="form-field">
              <label>Model *</label>
              <input
                type="text"
                name="model"
                value={formData.model}
                onChange={handleFormChange}
                placeholder="M4 Competition"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-field">
              <label>Year *</label>
              <input
                type="number"
                name="year"
                value={formData.year}
                onChange={handleFormChange}
                placeholder="2023"
              />
            </div>
            <div className="form-field">
              <label>Price (R) *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleFormChange}
                placeholder="850000"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-field">
              <label>Mileage (km)</label>
              <input
                type="number"
                name="mileage"
                value={formData.mileage}
                onChange={handleFormChange}
                placeholder="15000"
              />
            </div>
            <div className="form-field">
              <label>Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleFormChange}
                placeholder="Johannesburg"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-field">
              <label>Color</label>
              <input
                type="text"
                name="color"
                value={formData.color}
                onChange={handleFormChange}
                placeholder="Nardo Grey"
              />
            </div>
            <div className="form-field">
              <label>Transmission</label>
              <select name="transmission" value={formData.transmission} onChange={handleFormChange}>
                <option value="">Select...</option>
                <option value="Automatic">Automatic</option>
                <option value="Manual">Manual</option>
              </select>
            </div>
          </div>

          <div className="form-field">
            <label>Fuel Type</label>
            <select name="fuelType" value={formData.fuelType} onChange={handleFormChange}>
              <option value="">Select...</option>
              <option value="Petrol">Petrol</option>
              <option value="Diesel">Diesel</option>
              <option value="Electric">Electric</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>

          <div className="form-field">
            <label>Image URL</label>
            <input
              type="text"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleFormChange}
              placeholder="https://example.com/car.jpg"
            />
          </div>

          <div className="form-field">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleFormChange}
              placeholder="Full service history, one owner..."
              rows={3}
            />
          </div>

          {formError && <p className="form-error">{formError}</p>}

          <div className="add-listing-actions">
            <button type="button" className="modal-cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="modal-submit-btn" disabled={submitting}>
              {submitting ? "Adding..." : "Add Listing"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}