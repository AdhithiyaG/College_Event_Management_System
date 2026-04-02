import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { adminGetAllEvents } from "../../services/api";

const StatCard = ({ value, label, color, icon }) => (
  <div className="card p-6 flex items-center gap-4">
    <div
      className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${color}`}
    >
      {icon}
    </div>
    <div>
      <p
        className="text-3xl font-black text-gray-900"
        style={{ fontFamily: "Syne, sans-serif" }}
      >
        {value}
      </p>
      <p className="text-sm text-gray-500 font-medium">{label}</p>
    </div>
  </div>
);

const Dashboard = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminGetAllEvents()
      .then((res) => setEvents(res.data.events))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const totalEvents = events.length;
  const activeEvents = events.filter((e) => e.isActive).length;
  const totalRegistrations = events.reduce(
    (sum, e) => sum + e.registeredCount,
    0,
  );
  const totalCapacity = events.reduce((sum, e) => sum + e.capacity, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <Navbar />
        <div className="flex justify-center items-center h-96">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
            <p className="text-gray-500 font-medium">Loading dashboard...</p>
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
          <h1
            className="text-5xl font-black mb-3"
            style={{ fontFamily: "Syne, sans-serif" }}
          >
            Admin Dashboard 📊
          </h1>
          <p className="text-blue-100 text-xl">
            Manage events and track attendance
          </p>
        </div>
      </div>

      <div className="page-container">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <StatCard
            value={totalEvents}
            label="Total Events"
            color="bg-gradient-to-br from-blue-100 to-blue-50"
            icon="📅"
          />
          <StatCard
            value={activeEvents}
            label="Active Events"
            color="bg-gradient-to-br from-emerald-100 to-emerald-50"
            icon="✅"
          />
          <StatCard
            value={totalRegistrations}
            label="Total Registrations"
            color="bg-gradient-to-br from-purple-100 to-purple-50"
            icon="🎫"
          />
          <StatCard
            value={totalCapacity}
            label="Total Capacity"
            color="bg-gradient-to-br from-amber-100 to-amber-50"
            icon="👥"
          />
        </div>

        {/* Quick Actions */}
        <div className="mb-12">
          <Link to="/admin/events" className="btn-primary shadow-lg">
            + Create New Event
          </Link>
        </div>

        {/* Events Table */}
        <div className="card overflow-hidden shadow-lg">
          <div className="px-8 py-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">All Events</h2>
            <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-bold text-sm">
              {events.length} total
            </span>
          </div>

          {events.length === 0 ? (
            <div className="text-center py-24 text-gray-400">
              <div className="text-6xl mb-4">📭</div>
              <p className="font-bold text-lg">No events created yet</p>
              <p className="text-sm mt-2">Start by creating your first event</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-200">
                  <tr>
                    {[
                      "Event",
                      "Date",
                      "Venue",
                      "Registrations",
                      "Status",
                      "Action",
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
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-6 py-4 text-gray-600">{event.venue}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-24 bg-gray-200 rounded-full h-2.5 overflow-hidden">
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
                        <Link
                          to={`/admin/events/${event.id}/registrations`}
                          className="text-blue-700 font-bold hover:text-blue-900 hover:underline transition-colors text-sm"
                        >
                          Registrations →
                        </Link>
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

export default Dashboard;
