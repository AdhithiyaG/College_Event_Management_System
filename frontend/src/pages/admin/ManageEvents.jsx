import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import {
  adminGetAllEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} from "../../services/api";

const ManageEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const emptyForm = {
    title: "",
    description: "",
    date: "",
    venue: "",
    capacity: "",
    imageUrl: "",
  };
  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await adminGetAllEvents();
      setEvents(res.data.events);
    } catch {
      setError("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description,
      date: new Date(event.date).toISOString().slice(0, 16),
      venue: event.venue,
      capacity: event.capacity,
      imageUrl: event.imageUrl || "",
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage("");
    setError("");
    try {
      if (editingEvent) {
        await updateEvent(editingEvent.id, formData);
        setMessage("Event updated successfully");
      } else {
        await createEvent(formData);
        setMessage("Event created successfully");
      }
      setShowForm(false);
      setEditingEvent(null);
      setFormData(emptyForm);
      fetchEvents();
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this event?")) return;
    try {
      await deleteEvent(id);
      setMessage("Event deleted successfully");
      fetchEvents();
    } catch (err) {
      setError(err.response?.data?.message || "Delete failed");
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingEvent(null);
    setFormData(emptyForm);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <Navbar />
        <div className="flex justify-center items-center h-96">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
            <p className="text-gray-500 font-medium">Loading events...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Navbar />

      {/* Hero */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-400 rounded-full blur-3xl" />
        </div>
        <div className="page-container py-16 relative z-10">
          <div className="flex justify-between items-start">
            <div>
              <h1
                className="text-5xl font-black mb-4"
                style={{ fontFamily: "Syne, sans-serif" }}
              >
                Manage Events ⚙️
              </h1>
              <p className="text-blue-100 text-xl font-semibold">
                Create, edit and manage college events
              </p>
            </div>
            {!showForm && (
              <button onClick={() => setShowForm(true)} className="btn-primary">
                ✨ Create Event
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="page-container">
        {message && (
          <div className="alert-success mb-8 border-l-4 border-emerald-500 animate-slideInLeft">
            <span className="inline-block mr-2">✅</span> {message}
          </div>
        )}
        {error && (
          <div className="alert-error mb-8 border-l-4 border-red-500 animate-slideInLeft">
            <span className="inline-block mr-2">❌</span> {error}
          </div>
        )}

        {/* Event Form */}
        {showForm && (
          <div className="card-accent p-10 mb-10 shadow-xl border-l-4 border-l-blue-600 bg-gradient-to-br from-white to-blue-50/30">
            <div className="flex justify-between items-center mb-8">
              <h2
                className="text-3xl font-bold text-gray-900"
                style={{ fontFamily: "Syne, sans-serif" }}
              >
                {editingEvent ? "✏️ Edit Event" : "✨ Create New Event"}
              </h2>
              <button
                onClick={handleCancel}
                className="w-10 h-10 rounded-lg bg-red-100 hover:bg-red-200 text-red-600 font-bold text-xl transition-all duration-300 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2.5">
                    📌 Event Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="input-field"
                    placeholder="Tech Fest 2026"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2.5">
                    📍 Venue
                  </label>
                  <input
                    type="text"
                    name="venue"
                    value={formData.venue}
                    onChange={handleChange}
                    required
                    className="input-field"
                    placeholder="Main Auditorium"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2.5">
                    📅 Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2.5">
                    👥 Capacity
                  </label>
                  <input
                    type="number"
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleChange}
                    required
                    min="1"
                    className="input-field"
                    placeholder="100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2.5">
                  📝 Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="input-field resize-none"
                  placeholder="Describe the event..."
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary disabled:opacity-50 min-w-40"
                >
                  {submitting
                    ? "Saving..."
                    : editingEvent
                      ? "Update Event"
                      : "Create Event"}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="btn-secondary min-w-40"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Events Table */}
        <div className="card overflow-hidden shadow-lg">
          <div className="px-8 py-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">All Events</h2>
            <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-bold text-sm">
              {events.length} total
            </span>
          </div>

          {events.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <div className="text-6xl mb-4">📭</div>
              <p className="font-bold text-lg">No events yet</p>
              <p className="text-sm mt-2">Click Create Event to get started</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-200">
                  <tr>
                    {[
                      "Title",
                      "Date",
                      "Venue",
                      "Capacity",
                      "Status",
                      "Actions",
                    ].map((h) => (
                      <th
                        key={h}
                        className="text-left px-6 py-4 text-gray-700 font-bold text-xs uppercase tracking-wider"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {events.map((event) => (
                    <tr
                      key={event.id}
                      className="hover:bg-blue-50/50 transition-colors duration-200 border-b border-gray-100"
                    >
                      <td className="px-6 py-4 font-bold text-gray-900">
                        {event.title}
                      </td>
                      <td className="px-6 py-4 text-gray-600 font-medium">
                        {new Date(event.date).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-6 py-4 text-gray-600">{event.venue}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2.5 overflow-hidden">
                            <div
                              className="bg-gradient-to-r from-blue-600 to-blue-800 h-2.5 rounded-full"
                              style={{
                                width: `${Math.min((event.registeredCount / event.capacity) * 100, 100)}%`,
                              }}
                            />
                          </div>
                          <span className="text-gray-600 font-bold text-sm whitespace-nowrap">
                            {event.registeredCount}/{event.capacity}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {event.isActive ? (
                          <span className="badge-green">✓ Active</span>
                        ) : (
                          <span className="badge-gray">Inactive</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <button
                            onClick={() => handleEdit(event)}
                            className="text-blue-700 font-bold hover:text-blue-900 hover:underline transition-colors text-sm"
                          >
                            ✏️ Edit
                          </button>
                          <button
                            onClick={() => handleDelete(event.id)}
                            className="text-red-600 font-bold hover:text-red-700 hover:underline transition-colors text-sm"
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageEvents;
