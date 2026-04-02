import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white/95 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50 shadow-lg">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link
          to="/events"
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center shadow-md">
            <span className="text-white font-black text-lg">CE</span>
          </div>
          <span
            className="text-2xl font-black text-gradient"
            style={{ fontFamily: "Syne, sans-serif" }}
          >
            College<span className="text-blue-700">Events</span>
          </span>
        </Link>

        <div className="flex items-center gap-8">
          {user?.role === "STUDENT" && (
            <div className="flex items-center gap-6">
              <Link
                to="/events"
                className="text-gray-600 hover:text-blue-700 font-semibold transition-all duration-300 text-sm group"
              >
                <span className="relative">
                  Events
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-700 group-hover:w-full transition-all duration-300" />
                </span>
              </Link>
              <Link
                to="/my-registrations"
                className="text-gray-600 hover:text-blue-700 font-semibold transition-all duration-300 text-sm group"
              >
                <span className="relative">
                  My Registrations
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-700 group-hover:w-full transition-all duration-300" />
                </span>
              </Link>
            </div>
          )}

          {user?.role === "ADMIN" && (
            <div className="flex items-center gap-6">
              <Link
                to="/admin"
                className="text-gray-600 hover:text-blue-700 font-semibold transition-all duration-300 text-sm group"
              >
                <span className="relative">
                  Dashboard
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-700 group-hover:w-full transition-all duration-300" />
                </span>
              </Link>
              <Link
                to="/admin/events"
                className="text-gray-600 hover:text-blue-700 font-semibold transition-all duration-300 text-sm group"
              >
                <span className="relative">
                  Manage Events
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-700 group-hover:w-full transition-all duration-300" />
                </span>
              </Link>
            </div>
          )}

          <div className="flex items-center gap-3 pl-8 border-l border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-sm">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-semibold text-gray-900">
                  {user?.name}
                </p>
                <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="ml-2 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50 rounded-lg transition-all duration-300"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
