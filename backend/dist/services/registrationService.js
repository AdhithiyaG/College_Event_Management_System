"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerForEvent = registerForEvent;
exports.getUserRegistrations = getUserRegistrations;
exports.cancelRegistration = cancelRegistration;
exports.markAttendance = markAttendance;
const qrcode_1 = __importDefault(require("qrcode"));
const db_1 = __importDefault(require("../config/db"));
const email_1 = __importDefault(require("../config/email"));
async function registerForEvent(userId, eventId) {
    const event = await db_1.default.event.findUnique({
        where: { id: eventId },
        include: { _count: { select: { registrations: true } } },
    });
    if (!event)
        throw new Error("Event not found");
    if (!event.isActive)
        throw new Error("Event is no longer active");
    if (event._count.registrations >= event.capacity)
        throw new Error("Event is full");
    const existing = await db_1.default.registration.findUnique({
        where: { userId_eventId: { userId, eventId } },
    });
    if (existing)
        throw new Error("Already registered for this event");
    const registration = await db_1.default.registration.create({
        data: { userId, eventId },
    });
    // Generate QR code as data URL
    const qrData = JSON.stringify({ registrationId: registration.id, eventId, userId });
    const qrCode = await qrcode_1.default.toDataURL(qrData);
    const updated = await db_1.default.registration.update({
        where: { id: registration.id },
        data: { qrCode },
        include: {
            event: true,
            user: { select: { name: true, email: true } },
        },
    });
    // Send confirmation email (fire-and-forget)
    sendConfirmationEmail(updated.user.email, updated.user.name, updated.event.title, updated.event.date).catch(() => { });
    return updated;
}
async function sendConfirmationEmail(email, name, eventTitle, eventDate) {
    await email_1.default.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: `Registration Confirmed: ${eventTitle}`,
        html: `
      <h2>Hello ${name},</h2>
      <p>You have successfully registered for <strong>${eventTitle}</strong>.</p>
      <p><strong>Date:</strong> ${eventDate.toLocaleDateString()}</p>
      <p>Please bring your QR code for check-in.</p>
    `,
    });
}
async function getUserRegistrations(userId) {
    return db_1.default.registration.findMany({
        where: { userId },
        include: { event: true },
        orderBy: { createdAt: "desc" },
    });
}
async function cancelRegistration(userId, eventId) {
    const registration = await db_1.default.registration.findUnique({
        where: { userId_eventId: { userId, eventId } },
    });
    if (!registration)
        throw new Error("Registration not found");
    return db_1.default.registration.delete({ where: { id: registration.id } });
}
async function markAttendance(registrationId) {
    const registration = await db_1.default.registration.findUnique({ where: { id: registrationId } });
    if (!registration)
        throw new Error("Registration not found");
    return db_1.default.registration.update({
        where: { id: registrationId },
        data: { attended: true },
        include: {
            user: { select: { id: true, name: true, email: true } },
            event: { select: { id: true, title: true } },
        },
    });
}
