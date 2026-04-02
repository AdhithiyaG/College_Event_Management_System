import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { getEventRegistrations, markAttendance } from "../../services/api";
import QRScanner from "../../components/QRScanner";
const EventRegistrations = () => {
  const { eventId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [markingId, setMarkingId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [scanInput, setScanInput] = useState("");
  const [showScanner, setShowScanner] = useState(false);

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      const res = await getEventRegistrations(eventId);
      setData(res.data);
    } catch {
      setError("Failed to load registrations");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAttendance = async (registrationId) => {
    setMarkingId(registrationId);
    setMessage("");
    setError("");
    try {
      const res = await markAttendance(registrationId);
      setMessage(res.data.message);
      fetchRegistrations();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to mark attendance");
    } finally {
      setMarkingId(null);
    }
  };
  const handleScanSuccess = async (registrationId) => {
    setShowScanner(false);
    await handleMarkAttendance(registrationId);
  };
  const handleQRScan = async (e) => {
    e.preventDefault();
    if (!scanInput.trim()) return;
    await handleMarkAttendance(scanInput.trim());
    setScanInput("");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <Navbar />
        <div className="flex justify-center items-center h-96">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
            <p className="text-gray-500 font-medium">
              Loading registrations...
            </p>
          </div>
        </div>
      </div>
    );
  }

  const attendedCount =
    data?.registrations.filter((r) => r.attended).length || 0;

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
          <Link
            to="/admin"
            className="text-blue-200 hover:text-white text-sm font-bold mb-4 inline-flex items-center gap-2 transition-colors group"
          >
            <span className="group-hover:-translate-x-1 transition-transform">
              ←
            </span>{" "}
            Back to Dashboard
          </Link>
          {data && (
            <>
              <h1
                className="text-5xl font-black mb-4 mt-4"
                style={{ fontFamily: "Syne, sans-serif" }}
              >
                {data.event.title}
              </h1>
              <p className="text-blue-100 text-lg font-medium">
                📍 {data.event.venue} · 📅{" "}
                {new Date(data.event.date).toLocaleDateString("en-IN", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </>
          )}
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

        {data && (
          <>
            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-6 mb-12">
              <div className="card p-8 text-center bg-gradient-to-br from-blue-50 to-white hover:shadow-lg transition-all duration-300">
                <p
                  className="text-4xl font-black text-blue-700"
                  style={{ fontFamily: "Syne, sans-serif" }}
                >
                  {data.totalRegistrations}
                </p>
                <p className="text-sm text-gray-600 mt-2 font-semibold">
                  📊 Total Registered
                </p>
              </div>
              <div className="card p-8 text-center bg-gradient-to-br from-emerald-50 to-white hover:shadow-lg transition-all duration-300">
                <p
                  className="text-4xl font-black text-emerald-600"
                  style={{ fontFamily: "Syne, sans-serif" }}
                >
                  {attendedCount}
                </p>
                <p className="text-sm text-gray-600 mt-2 font-semibold">
                  ✓ Attended
                </p>
              </div>
              <div className="card p-8 text-center bg-gradient-to-br from-amber-50 to-white hover:shadow-lg transition-all duration-300">
                <p
                  className="text-4xl font-black text-amber-600"
                  style={{ fontFamily: "Syne, sans-serif" }}
                >
                  {data.availableSlots}
                </p>
                <p className="text-sm text-gray-600 mt-2 font-semibold">
                  🎟️ Slots Remaining
                </p>
              </div>
            </div>

            {/* QR Scanner */}
            {/* QR Scanner */}
            <div className="card p-6 mb-6 border-l-4 border-blue-700">
              <h2 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                <span className="text-xl">📷</span> Mark Attendance via QR Code
              </h2>

              <div className="flex gap-3">
                {/* Camera Scan Button */}
                <button
                  onClick={() => setShowScanner(true)}
                  className="btn-primary flex items-center gap-2"
                >
                  <span>📷</span> Scan with Camera
                </button>

                {/* Manual Input */}
                <form onSubmit={handleQRScan} className="flex gap-3 flex-1">
                  <input
                    type="text"
                    value={scanInput}
                    onChange={(e) => setScanInput(e.target.value)}
                    placeholder="Or paste registration ID manually..."
                    className="input-field flex-1"
                  />
                  <button
                    type="submit"
                    className="btn-secondary whitespace-nowrap"
                  >
                    Mark Present ✓
                  </button>
                </form>
              </div>

              <p className="text-xs text-gray-400 mt-2">
                Use camera to scan student QR code or manually enter
                registration ID
              </p>
            </div>

            {/* QR Scanner Modal */}
            {showScanner && (
              <QRScanner
                onScanSuccess={handleScanSuccess}
                onClose={() => setShowScanner(false)}
              />
            )}
            {/* Registrations Table */}
            <div className="card overflow-hidden shadow-lg">
              <div className="px-8 py-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">
                  Registered Students
                </h2>
                <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-bold text-sm">
                  {data.registrations.length} students
                </span>
              </div>

              {data.registrations.length === 0 ? (
                <div className="text-center py-24 text-gray-400">
                  <div className="text-6xl mb-4">👥</div>
                  <p className="font-bold text-lg">No registrations yet</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-200">
                      <tr>
                        {[
                          "Student",
                          "Email",
                          "Department",
                          "Year",
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
                      {data.registrations.map((reg) => (
                        <tr
                          key={reg.id}
                          className={`hover:bg-blue-50/50 transition-colors duration-200 border-b border-gray-100 ${
                            reg.attended ? "bg-emerald-50/40" : ""
                          }`}
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md">
                                {reg.user.name.charAt(0).toUpperCase()}
                              </div>
                              <span className="font-bold text-gray-900">
                                {reg.user.name}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-gray-600 font-medium">
                            {reg.user.email}
                          </td>
                          <td className="px-6 py-4 text-gray-600">
                            {reg.user.department || "—"}
                          </td>
                          <td className="px-6 py-4 text-gray-600">
                            {reg.user.year ? `Year ${reg.user.year}` : "—"}
                          </td>
                          <td className="px-6 py-4">
                            {reg.attended ? (
                              <span className="badge-green">✓ Attended</span>
                            ) : (
                              <span className="badge-yellow">⏳ Pending</span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            {!reg.attended && (
                              <button
                                onClick={() => handleMarkAttendance(reg.id)}
                                disabled={markingId === reg.id}
                                className="text-blue-700 font-bold hover:text-blue-900 hover:underline transition-colors text-sm disabled:opacity-50"
                              >
                                {markingId === reg.id
                                  ? "Marking..."
                                  : "Mark Present"}
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EventRegistrations;
