import "./Dashboard.css";
import { useEffect, useState } from "react";
import Navbar from "../Components/Navbar";
import { apiFetch } from "../api/client";
import AddNewListing from "../Modals/AddNewListing";
import EditListing from "../Modals/EditListing";

export default function Dashboard({ user }) {
  const [listings, setListings] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [selectedContactId, setSelectedContactId] = useState(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [sendingReply, setSendingReply] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCar, setEditingCar] = useState(null);
  const [messageView, setMessageView] = useState("seller");
  const [openedThreads, setOpenedThreads] = useState([]);

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      setError("You must be logged in to access this page.");
      return;
    }

    loadData();
  }, [user?.id]);

  async function loadData() {
    setLoading(true);
    try {
      const [carsData, contactsData] = await Promise.all([
        apiFetch(`/cars?sellerId=${user.id}`),
        apiFetch("/contact"),
      ]);
      setListings(carsData || []);
      const normalizedContacts = Array.isArray(contactsData) ? contactsData : [];
      setContacts(normalizedContacts);

      if (!selectedContactId && normalizedContacts.length > 0) {
        const firstContactId = normalizedContacts[0]._id;
        setSelectedContactId(firstContactId);
        setOpenedThreads((prev) =>
          prev.includes(firstContactId) ? prev : [...prev, firstContactId],
        );
      }
    } catch (err) {
      console.error("Dashboard load error:", err);
      setError("Could not load dashboard data.");
    } finally {
      setLoading(false);
    }
  }

  const handleEdit = (car) => {
    setEditingCar(car);
  };

  const handleUpdateListing = async (carId, payload) => {
    await apiFetch(`/cars/${carId}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
    setEditingCar(null);
    loadData(); // refresh listings so changes appear immediately
  };

  const handleDelete = async (carId) => {
    try {
      await apiFetch(`/cars/${carId}`, { method: "DELETE" });
      setListings((prev) => prev.filter((c) => c._id !== carId));
    } catch (err) {
      console.error("Failed to delete car:", err);
    }
  };

  const handleAddListing = async (payload) => {
    await apiFetch("/cars", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    setShowAddModal(false);
    loadData(); // refresh listings so the new car appears immediately
  };

  const sellerContacts = contacts.filter(
    (contact) => String(contact.sellerId) === String(user?.id),
  );
  const buyerContacts = contacts.filter(
    (contact) => String(contact.buyerId) === String(user?.id),
  );
  const activeContacts = (messageView === "seller" ? sellerContacts : buyerContacts)
    .slice()
    .sort(
      (a, b) =>
        new Date(b.updatedAt || b.createdAt || 0) -
        new Date(a.updatedAt || a.createdAt || 0),
    );
  const selectedContact =
    activeContacts.find((contact) => contact._id === selectedContactId) || null;

  const formatTimestamp = (value) => {
    if (!value) return "";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";

    return new Intl.DateTimeFormat("en-ZA", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const handleOpenConversation = (contactId) => {
    setSelectedContactId(contactId);
    setOpenedThreads((prev) =>
      prev.includes(contactId) ? prev : [...prev, contactId],
    );
  };

  const handleSendReply = async (event) => {
    event.preventDefault();

    if (!selectedContact || !replyMessage.trim()) {
      return;
    }

    try {
      setSendingReply(true);
      await apiFetch(`/contact/${selectedContact._id}/reply`, {
        method: "POST",
        body: JSON.stringify({ message: replyMessage.trim() }),
      });
      setReplyMessage("");
      await loadData();
    } catch (err) {
      console.error("Failed to send reply:", err);
      setError(err.message || "Could not send your reply.");
    } finally {
      setSendingReply(false);
    }
  };

  const getMessageThread = (contact) => {
    const initialMessages = [
      {
        senderId: contact.buyerId,
        senderName: contact.name || "Buyer",
        senderRole: "buyer",
        message: contact.message,
        createdAt: contact.createdAt,
      },
      ...(Array.isArray(contact.replies) ? contact.replies : []),
    ];

    return initialMessages.sort(
      (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    );
  };

  return (
    <div className="dashboard-page">
      <Navbar user={user} />

      <section className="dashboard-content">
        <div className="dashboard-header">
          <h1>Welcome, {user?.name?.split(" ")[0] || "there"}!</h1>
          <p>Manage your listings and conversations below.</p>
        </div>

        {error && <p className="dashboard-error">{error}</p>}

        <div className="dashboard-grid">
          <div className="dashboard-panel">
            <div className="panel-header">
              <h2>My Listing</h2>
              <button
                className="add-listing-btn"
                onClick={() => setShowAddModal(true)}
              >
                Add new Listing
              </button>
            </div>

            {loading ? (
              <p className="panel-empty">Loading listings...</p>
            ) : listings.length === 0 ? (
              <p className="panel-empty">No listings yet.</p>
            ) : (
              <div className="listing-list">
                {listings.map((car) => (
                  <div className="listing-card" key={car._id}>
                    {car.images?.[0] ? (
                      <img
                        className="listing-image"
                        src={car.images[0]}
                        alt={`${car.brand} ${car.model}`}
                      />
                    ) : (
                      <div className="listing-image-placeholder" />
                    )}
                    <div className="listing-details">
                      <p className="listing-title">
                        {car.year} {car.brand} {car.model}
                      </p>
                      <p className="listing-price">
                        R{Number(car.price).toLocaleString()}
                      </p>
                      <div className="listing-actions">
                        <button
                          className="edit-btn"
                          onClick={() => handleEdit(car)}
                        >
                          Edit
                        </button>
                        <button
                          className="delete-btn"
                          onClick={() => handleDelete(car._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="dashboard-side">
            <div className="dashboard-panel">
              <div className="message-toggle-row">
                <button
                  type="button"
                  className={`message-toggle ${messageView === "seller" ? "active" : ""}`}
                  onClick={() => {
                    setMessageView("seller");
                    setSelectedContactId(null);
                  }}
                >
                  Seller inbox
                </button>
                <button
                  type="button"
                  className={`message-toggle ${messageView === "buyer" ? "active" : ""}`}
                  onClick={() => {
                    setMessageView("buyer");
                    setSelectedContactId(null);
                  }}
                >
                  My messages
                </button>
              </div>

              {activeContacts.length === 0 ? (
                <p className="panel-empty">
                  {messageView === "seller"
                    ? "No incoming messages yet."
                    : "You have not sent any messages yet."}
                </p>
              ) : (
                <div className="message-list">
                  {activeContacts.map((c) => {
                    const isUnread = !openedThreads.includes(c._id);

                    return (
                      <button
                        type="button"
                        className={`message-row ${selectedContactId === c._id ? "active" : ""}`}
                        key={c._id}
                        onClick={() => handleOpenConversation(c._id)}
                      >
                        <div className="message-avatar">
                          {c.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="message-body">
                          <div className="message-header-row">
                            <p className="message-name">{c.name}</p>
                            {isUnread && <span className="unread-badge">New</span>}
                          </div>
                          <div className="message-preview-row">
                            <p className="message-preview">
                              {c.lastMessage || c.message || "New message"}
                            </p>
                            <span className="message-time">
                              {formatTimestamp(c.updatedAt || c.createdAt)}
                            </span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="dashboard-panel">
              <h2>{messageView === "seller" ? "Seller conversation" : "Buyer conversation"}</h2>
              {!selectedContact ? (
                <p className="panel-empty">Select a conversation to view details.</p>
              ) : (
                <>
                  <div className="conversation-header">
                    <p className="conversation-name">{selectedContact.name}</p>
                    <p className="conversation-meta">
                      {selectedContact.email || "No email provided"}
                    </p>
                  </div>

                  <div className="conversation-thread">
                    {getMessageThread(selectedContact).map((item, index) => {
                      const isOutgoing =
                        item.senderRole ===
                        (messageView === "seller" ? "seller" : "buyer");

                      return (
                        <div
                          key={`${item.createdAt || index}-${index}`}
                          className={`conversation-bubble ${
                            item.senderRole === "seller" ? "seller" : "buyer"
                          }`}
                        >
                          <div className="bubble-header">
                            <span className="bubble-sender">{item.senderName}</span>
                            <span className="bubble-tag">
                              {isOutgoing ? "Sent" : "Received"}
                            </span>
                          </div>
                          <p>{item.message}</p>
                          <span className="bubble-time">
                            {formatTimestamp(item.createdAt)}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  <form className="reply-form" onSubmit={handleSendReply}>
                    <textarea
                      rows="3"
                      value={replyMessage}
                      onChange={(event) => setReplyMessage(event.target.value)}
                      placeholder="Write a reply to this message..."
                    />
                    <button type="submit" disabled={sendingReply || !replyMessage.trim()}>
                      {sendingReply ? "Sending..." : "Reply"}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {showAddModal && (
        <AddNewListing
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddListing}
        />
      )}

      {editingCar && (
        <EditListing
          car={editingCar}
          onClose={() => setEditingCar(null)}
          onSubmit={handleUpdateListing}
        />
      )}
    </div>
  );
}
