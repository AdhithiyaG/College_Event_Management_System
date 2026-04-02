import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Automatically attach token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const registerUser = (data) => api.post("/auth/register", data);
export const loginUser = (data) => api.post("/auth/login", data);
export const getMe = () => api.get("/auth/me");

// Events
export const getAllEvents = () => api.get("/events");
export const getEventById = (id) => api.get(`/events/${id}`);
export const createEvent = (data) => api.post("/events", data);
export const updateEvent = (id, data) => api.put(`/events/${id}`, data);
export const deleteEvent = (id) => api.delete(`/events/${id}`);
export const adminGetAllEvents = () => api.get("/events/admin/all");

// Registrations
export const registerForEvent = (eventId) =>
  api.post("/registrations/register", { eventId });
export const getMyRegistrations = () =>
  api.get("/registrations/my-registrations");
export const cancelRegistration = (id) => api.delete(`/registrations/${id}`);
export const getEventRegistrations = (eventId) =>
  api.get(`/registrations/event/${eventId}`);
export const markAttendance = (registrationId) =>
  api.post("/registrations/attendance", { registrationId });

export default api;
