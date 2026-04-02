import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getMyRegistrations, cancelRegistration } from "../services/api";

const MyRegistrations = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      const res = await getMyRegistrations();
      setRegistrations(res.data.registrations);
    } catch (err) {
      setError("Failed to load registrations");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!confirm("Are you sure you want to cancel this registration?")) return;
    setCancellingId(id);
    try {
      await cancelRegistration(id);
      setMessage("Registration cancelled successfully");
      fetchRegistrations();
    } catch (err) {
      setError(err.response?.data?.message || "Cancellation failed");
    } finally {
      setCancellingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <Navbar />
        <div className="flex justify-center items-center h-96">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
            <p className="text-gray-500 font-medium">
              Loading your registrations...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Navbar />

      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-400 rounded-full blur-3xl" />
        </div>
        <div className="page-container py-16 relative z-10">
          <div className="max-w-3xl">
            <h1
              className="text-5xl font-black mb-4"
              style={{ fontFamily: "Syne, sans-serif" }}
            >
              My Registrations 🎫
            </h1>
            <p className="text-blue-100 text-xl font-semibold">
              View your registered events and QR codes
            </p>
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

        {registrations.length === 0 ? (
          <div className="text-center py-32 card p-12">
            <div className="text-7xl mb-6">🎟️</div>
            <h3 className="text-3xl font-bold text-gray-800 mb-2">
              No Registrations Yet
            </h3>
            <p className="text-gray-500 text-lg mb-8">
              Browse events and register to see them here
            </p>
            <Link to="/events" className="btn-primary inline-block">
              Browse Events →
            </Link>
          </div>
        ) : (
          <div className="space-y-5 animate-fadeInUp">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Your Events ({registrations.length})
            </h2>
            {registrations.map((reg, idx) => {
              const eventDate = new Date(reg.event.date);
              const isPast = eventDate < new Date();

              return (
                <div
                  key={reg.id}
                  style={{ animationDelay: `${idx * 0.1}s` }}
                  className="card p-8 hover:-translate-y-1 transition-all duration-300 animate-fadeInUp border-l-4 border-l-blue-600"
                >
                  <div className="flex flex-col lg:flex-row justify-between items-start gap-8">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl flex items-center justify-center text-2xl">
                          🎓
                        </div>
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold text-gray-900">
                            {reg.event.title}
                          </h3>
                          <div className="flex gap-2 mt-2">
                            {reg.attended ? (
                              <span className="badge-green">✓ Attended</span>
                            ) : isPast ? (
                              <span className="badge-gray">📭 Past</span>
                            ) : (
                              <span className="badge-blue">📅 Upcoming</span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2.5 text-gray-600 font-medium">
                        <div className="flex items-center gap-3">
                          <span className="text-lg">📅</span>
                          <span>
                            {eventDate.toLocaleDateString("en-IN", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-lg">🕐</span>
                          <span>
                            {eventDate.toLocaleTimeString("en-IN", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-lg">📍</span>
                          <span>{reg.event.venue}</span>
                        </div>
                      </div>

                      {!isPast && !reg.attended && (
                        <button
                          onClick={() => handleCancel(reg.id)}
                          disabled={cancellingId === reg.id}
                          className="btn-danger mt-6 disabled:opacity-50"
                        >
                          {cancellingId === reg.id
                            ? "Cancelling..."
                            : "Cancel Registration"}
                        </button>
                      )}
                    </div>

                    {reg.qrCode && (
                      <div className="flex flex-col items-center gap-3 bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-2xl">
                        <div className="p-4 bg-white rounded-xl shadow-lg border-2 border-gray-200 hover:shadow-xl transition-all duration-300">
                          <img
                            src={reg.qrCode}
                            alt="QR Code"
                            className="w-40 h-40"
                          />
                        </div>
                        <p className="text-xs text-gray-500 font-semibold text-center">
                          📱 Show at entrance
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyRegistrations;
