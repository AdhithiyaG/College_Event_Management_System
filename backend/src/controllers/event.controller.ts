import { Request, Response } from "express";
import prisma from "../config/prisma";
import { AuthRequest } from "../middleware/auth.middleware";

// Admin - Create Event
export const createEvent = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, date, venue, capacity, imageUrl } = req.body;

    if (!title || !description || !date || !venue || !capacity) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const event = await prisma.event.create({
      data: {
        title,
        description,
        date: new Date(date),
        venue,
        capacity: parseInt(capacity),
        imageUrl,
      },
    });

    res.status(201).json({ message: "Event created successfully", event });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// Public - Get All Events
export const getAllEvents = async (req: Request, res: Response) => {
  try {
    const events = await prisma.event.findMany({
      where: { isActive: true },
      orderBy: { date: "asc" },
      include: {
        _count: {
          select: { registrations: true },
        },
      },
    });

    const eventsWithSlots = events.map((event) => ({
      ...event,
      registeredCount: event._count.registrations,
      availableSlots: event.capacity - event._count.registrations,
    }));

    res.json({ events: eventsWithSlots });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// Public - Get Single Event
export const getEventById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const event = await prisma.event.findUnique({
      where: { id: Array.isArray(id) ? id[0] : id },
      include: {
        _count: {
          select: { registrations: true },
        },
      },
    });

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json({
      event: {
        ...event,
        registeredCount: event._count.registrations,
        availableSlots: event.capacity - event._count.registrations,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// Admin - Update Event
export const updateEvent = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, date, venue, capacity, imageUrl, isActive } =
      req.body;

    const existingEvent = await prisma.event.findUnique({
      where: { id: Array.isArray(id) ? id[0] : id },
    });
    if (!existingEvent) {
      return res.status(404).json({ message: "Event not found" });
    }

    const event = await prisma.event.update({
      where: { id: Array.isArray(id) ? id[0] : id },
      data: {
        title,
        description,
        date: date ? new Date(date) : undefined,
        venue,
        capacity: capacity ? parseInt(capacity) : undefined,
        imageUrl,
        isActive,
      },
    });

    res.json({ message: "Event updated successfully", event });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// Admin - Delete Event
export const deleteEvent = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const existingEvent = await prisma.event.findUnique({
      where: { id: Array.isArray(id) ? id[0] : id },
    });
    if (!existingEvent) {
      return res.status(404).json({ message: "Event not found" });
    }

    await prisma.event.delete({
      where: { id: Array.isArray(id) ? id[0] : id },
    });

    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// Admin - Get All Events including inactive
export const adminGetAllEvents = async (req: AuthRequest, res: Response) => {
  try {
    const events = await prisma.event.findMany({
      orderBy: { date: "asc" },
      include: {
        _count: {
          select: { registrations: true },
        },
      },
    });

    const eventsWithSlots = events.map((event) => ({
      ...event,
      registeredCount: event._count.registrations,
      availableSlots: event.capacity - event._count.registrations,
    }));

    res.json({ events: eventsWithSlots });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
