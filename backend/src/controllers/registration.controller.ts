import { Response } from "express";
import prisma from "../config/prisma";
import { AuthRequest } from "../middleware/auth.middleware";
import { generateQRCode } from "../utils/qrcode";
import { sendRegistrationConfirmation } from "../services/email.service";

// Student - Register for Event
export const registerForEvent = async (req: AuthRequest, res: Response) => {
  try {
    const { eventId } = req.body;
    const userId = req.userId!;

    // Check event exists
    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Check event is active
    if (!event.isActive) {
      return res.status(400).json({ message: "Event is no longer active" });
    }

    // Check event date has not passed
    if (new Date(event.date) < new Date()) {
      return res.status(400).json({ message: "Event has already passed" });
    }

    // Check already registered
    const existingRegistration = await prisma.registration.findUnique({
      where: { userId_eventId: { userId, eventId } },
    });
    if (existingRegistration) {
      return res
        .status(400)
        .json({ message: "Already registered for this event" });
    }

    // Check capacity
    const registrationCount = await prisma.registration.count({
      where: { eventId },
    });
    if (registrationCount >= event.capacity) {
      return res.status(400).json({ message: "Event is full" });
    }

    // Create registration
    const registration = await prisma.registration.create({
      data: { userId, eventId },
      include: { user: true, event: true },
    });

    // Generate QR Code
    const qrCode = await generateQRCode(registration.id);

    // Update registration with QR code
    await prisma.registration.update({
      where: { id: registration.id },
      data: { qrCode },
    });

    // Send confirmation email in background so registration does not hang if SMTP is slow.
    void sendRegistrationConfirmation(
      registration.user.email,
      registration.user.name,
      registration.event.title,
      registration.event.date,
      registration.event.venue,
      qrCode,
    ).catch((emailError) => {
      console.error("Registration email failed:", emailError);
    });

    res.status(201).json({
      message: "Registered successfully.",
      registration: {
        id: registration.id,
        event: registration.event,
        qrCode,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Student - Get My Registrations
export const getMyRegistrations = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;

    const registrations = await prisma.registration.findMany({
      where: { userId },
      include: {
        event: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const registrationsWithQr = await Promise.all(
      registrations.map(async (registration) => {
        if (registration.qrCode) {
          return registration;
        }

        const generatedQr = await generateQRCode(registration.id);

        await prisma.registration.update({
          where: { id: registration.id },
          data: { qrCode: generatedQr },
        });

        return {
          ...registration,
          qrCode: generatedQr,
        };
      }),
    );

    res.json({ registrations: registrationsWithQr });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// Student - Cancel Registration
export const cancelRegistration = async (req: AuthRequest, res: Response) => {
  try {
    const rawId = req.params.id;
    const id = Array.isArray(rawId) ? rawId[0] : rawId;
    if (!id) {
      return res.status(400).json({ message: "Registration id is required" });
    }
    const userId = req.userId!;

    const registration = await prisma.registration.findUnique({
      where: { id },
      include: { event: true },
    });

    if (!registration) {
      return res.status(404).json({ message: "Registration not found" });
    }

    if (registration.userId !== userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (new Date(registration.event.date) < new Date()) {
      return res
        .status(400)
        .json({ message: "Cannot cancel past event registration" });
    }

    await prisma.registration.delete({ where: { id } });

    res.json({ message: "Registration cancelled successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// Admin - Get All Registrations for an Event
export const getEventRegistrations = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const rawEventId = req.params.eventId;
    const eventId = Array.isArray(rawEventId) ? rawEventId[0] : rawEventId;
    if (!eventId) {
      return res.status(400).json({ message: "Event id is required" });
    }

    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const registrations = await prisma.registration.findMany({
      where: { eventId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            department: true,
            year: true,
          },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    res.json({
      event,
      totalRegistrations: registrations.length,
      availableSlots: event.capacity - registrations.length,
      registrations,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// Admin - Mark Attendance via QR Code
export const markAttendance = async (req: AuthRequest, res: Response) => {
  try {
    const { registrationId } = req.body;

    const registration = await prisma.registration.findUnique({
      where: { id: registrationId },
      include: {
        user: true,
        event: true,
      },
    });

    if (!registration) {
      return res.status(404).json({ message: "Invalid QR Code" });
    }

    if (registration.attended) {
      return res.status(400).json({
        message: "Attendance already marked",
        student: registration.user.name,
      });
    }

    await prisma.registration.update({
      where: { id: registrationId },
      data: { attended: true },
    });

    res.json({
      message: "Attendance marked successfully",
      student: registration.user.name,
      event: registration.event.title,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
