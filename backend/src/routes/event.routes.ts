import { Router } from "express";
import {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  adminGetAllEvents,
} from "../controllers/event.controller";
import { authenticate, authorizeAdmin } from "../middleware/auth.middleware";

const router = Router();

// Public routes
router.get("/", getAllEvents);
router.get("/:id", getEventById);

// Admin only routes
router.post("/", authenticate, authorizeAdmin, createEvent);
router.put("/:id", authenticate, authorizeAdmin, updateEvent);
router.delete("/:id", authenticate, authorizeAdmin, deleteEvent);
router.get("/admin/all", authenticate, authorizeAdmin, adminGetAllEvents);

export default router;
