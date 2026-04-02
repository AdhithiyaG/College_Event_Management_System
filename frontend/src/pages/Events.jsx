import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import EventCard from "../components/EventCard";
import {
  getAllEvents,
  registerForEvent,
  getMyRegistrations,
} from "../services/api";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [myRegistrations, setMyRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [registeringId, setRegisteringId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [eventsRes, registrationsRes] = await Promise.all([
        getAllEvents(),
        getMyRegistrations(),
      ]);
      setEvents(eventsRes.data.events);
      setMyRegistrations(registrationsRes.data.registrations);
    } catch (err) {
      setError("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (eventId) => {
    setRegisteringId(eventId);
    setMessage("");
    setError("");
    try {
      await registerForEvent(eventId);
      setMessage(
        "Successfully registered! Check your email for confirmation and QR code.",
      );
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setRegisteringId(null);
    }
  };

  const registeredEventIds = myRegistrations.map((r) => r.eventId);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <Navbar />
        <div className="flex justify-center items-center h-96">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
            <p className="text-gray-500 font-medium">
              Loading amazing events...
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
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-400 rounded-full blur-3xl" />
        </div>
        <div className="page-container py-16 relative z-10">
          <div className="max-w-3xl">
            <h1
              className="text-5xl font-black mb-4"
              style={{ fontFamily: "Syne, sans-serif" }}
            >
              Discover Events 🎉
            </h1>
            <p className="text-blue-100 text-xl font-semibold">
              Explore and register for exciting college events happening this
              semester
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

        {events.length === 0 ? (
          <div className="text-center py-32 card p-12">
            <div className="text-7xl mb-6">📭</div>
            <h3 className="text-3xl font-bold text-gray-800 mb-2">
              No Events Yet
            </h3>
            <p className="text-gray-500 text-lg">
              Check back soon for upcoming amazing events
            </p>
          </div>
        ) : (
          <div className="animate-fadeInUp">
            <div className="flex justify-between items-center mb-10">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Available Events
                </h2>
                <p className="text-gray-600 font-medium">
                  {events.length} events available
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map((event, idx) => (
                <div
                  key={event.id}
                  style={{ animationDelay: `${idx * 0.1}s` }}
                  className="animate-fadeInUp"
                >
                  <EventCard
                    event={event}
                    onRegister={handleRegister}
                    isRegistered={registeredEventIds.includes(event.id)}
                    loading={registeringId === event.id}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;
