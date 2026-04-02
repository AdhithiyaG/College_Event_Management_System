"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerForEvent = registerForEvent;
exports.getMyRegistrations = getMyRegistrations;
exports.cancel = cancel;
exports.markAttendance = markAttendance;
const registrationService = __importStar(require("../services/registrationService"));
async function registerForEvent(req, res) {
    try {
        const { eventId } = req.body;
        if (!eventId) {
            res.status(400).json({ error: "eventId is required" });
            return;
        }
        const registration = await registrationService.registerForEvent(req.user.userId, eventId);
        res.status(201).json(registration);
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
}
async function getMyRegistrations(req, res) {
    try {
        const registrations = await registrationService.getUserRegistrations(req.user.userId);
        res.json(registrations);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}
async function cancel(req, res) {
    try {
        await registrationService.cancelRegistration(req.user.userId, req.params.eventId);
        res.json({ message: "Registration cancelled" });
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
}
async function markAttendance(req, res) {
    try {
        const { registrationId } = req.body;
        if (!registrationId) {
            res.status(400).json({ error: "registrationId is required" });
            return;
        }
        const result = await registrationService.markAttendance(registrationId);
        res.json(result);
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
}
