import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Events from "./pages/Events";
import MyRegistrations from "./pages/MyRegistrations";
import Dashboard from "./pages/admin/Dashboard";
import ManageEvents from "./pages/admin/ManageEvents";
import EventRegistrations from "./pages/admin/EventRegistrations";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  return user ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  if (!user) return <Navigate to="/login" />;
  return user.role === "ADMIN" ? children : <Navigate to="/events" />;
};

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<Navigate to={user ? "/events" : "/login"} />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/events"
        element={
          <ProtectedRoute>
            <Events />
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-registrations"
        element={
          <ProtectedRoute>
            <MyRegistrations />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <Dashboard />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/events"
        element={
          <AdminRoute>
            <ManageEvents />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/events/:eventId/registrations"
        element={
          <AdminRoute>
            <EventRegistrations />
          </AdminRoute>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
