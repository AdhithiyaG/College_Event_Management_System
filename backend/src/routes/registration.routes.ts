import { Router } from "express";
import {
  registerForEvent,
  getMyRegistrations,
  cancelRegistration,
  getEventRegistrations,
  markAttendance,
} from "../controllers/registration.controller";
import { authenticate, authorizeAdmin } from "../middleware/auth.middleware";

const router = Router();

// Student routes
router.post("/register", authenticate, registerForEvent);
router.get("/my-registrations", authenticate, getMyRegistrations);
router.delete("/:id", authenticate, cancelRegistration);

// Admin routes
router.get(
  "/event/:eventId",
  authenticate,
  authorizeAdmin,
  getEventRegistrations,
);
router.post("/attendance", authenticate, authorizeAdmin, markAttendance);

export default router;
