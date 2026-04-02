import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { loginUser } from "../services/api";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await loginUser(formData);
      login(res.data.accessToken, res.data.user);
      if (res.data.user.role === "ADMIN") navigate("/admin");
      else navigate("/events");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-800 to-blue-600 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background blurs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl animate-pulse-gentle" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-amber-400 opacity-10 rounded-full blur-3xl animate-pulse-gentle" />
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-blue-400 opacity-5 rounded-full blur-3xl animate-pulse-gentle" />
      </div>

      <div className="w-full max-w-md relative z-10 animate-fadeInUp">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl transform hover:scale-110 transition-transform duration-300">
            <span
              className="text-gradient text-3xl font-black"
              style={{ fontFamily: "Syne, sans-serif" }}
            >
              CE
            </span>
          </div>
          <h1
            className="text-4xl font-black text-white mb-3"
            style={{ fontFamily: "Syne, sans-serif" }}
          >
            Welcome Back
          </h1>
          <p className="text-blue-100 text-base">
            Sign in to your college events account
          </p>
        </div>

        {/* Card */}
        <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl p-10 border border-white/20">
          {error && (
            <div className="alert-error mb-6 animate-slideInLeft border-l-4">
              <span className="inline-block mr-2">⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <label className="block text-sm font-bold text-gray-900 mb-2.5">
                📧 Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="input-field"
                placeholder="you@college.edu"
              />
            </div>

            <div className="relative">
              <label className="block text-sm font-bold text-gray-900 mb-2.5">
                🔐 Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="input-field"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-700 to-blue-800 text-white py-4 rounded-xl font-bold text-base hover:shadow-xl hover:-translate-y-1 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 active:translate-y-0"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </div>
              ) : (
                "Sign In →"
              )}
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500 font-medium">
                or
              </span>
            </div>
          </div>

          <p className="text-center text-gray-700 text-sm font-medium">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-blue-700 font-bold hover:text-blue-800 hover:underline transition-all duration-300"
            >
              Create one now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
