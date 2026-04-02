"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEvent = createEvent;
exports.getAllEvents = getAllEvents;
exports.getEventById = getEventById;
exports.updateEvent = updateEvent;
exports.deleteEvent = deleteEvent;
const db_1 = __importDefault(require("../config/db"));
async function createEvent(data) {
    return db_1.default.event.create({
        data: {
            title: data.title,
            description: data.description,
            date: new Date(data.date),
            venue: data.venue,
            capacity: data.capacity,
            imageUrl: data.imageUrl,
        },
    });
}
async function getAllEvents() {
    return db_1.default.event.findMany({
        where: { isActive: true },
        orderBy: { date: "asc" },
        include: {
            _count: { select: { registrations: true } },
        },
    });
}
async function getEventById(id) {
    const event = await db_1.default.event.findUnique({
        where: { id },
        include: {
            _count: { select: { registrations: true } },
            registrations: {
                include: { user: { select: { id: true, name: true, email: true, department: true } } },
            },
        },
    });
    if (!event) {
        throw new Error("Event not found");
    }
    return event;
}
async function updateEvent(id, data) {
    const updateData = { ...data };
    if (data.date) {
        updateData.date = new Date(data.date);
    }
    return db_1.default.event.update({ where: { id }, data: updateData });
}
async function deleteEvent(id) {
    await db_1.default.registration.deleteMany({ where: { eventId: id } });
    return db_1.default.event.delete({ where: { id } });
}
