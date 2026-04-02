"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUser = registerUser;
exports.loginUser = loginUser;
exports.getUserProfile = getUserProfile;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const db_1 = __importDefault(require("../config/db"));
const jwt_1 = require("../utils/jwt");
async function registerUser(data) {
    const existing = await db_1.default.user.findUnique({ where: { email: data.email } });
    if (existing) {
        throw new Error("Email already registered");
    }
    const hashedPassword = await bcryptjs_1.default.hash(data.password, 10);
    const user = await db_1.default.user.create({
        data: {
            name: data.name,
            email: data.email,
            password: hashedPassword,
            department: data.department,
            year: data.year,
        },
    });
    const token = (0, jwt_1.generateToken)({ userId: user.id, role: user.role });
    return {
        token,
        user: { id: user.id, name: user.name, email: user.email, role: user.role },
    };
}
async function loginUser(email, password) {
    const user = await db_1.default.user.findUnique({ where: { email } });
    if (!user) {
        throw new Error("Invalid credentials");
    }
    const isMatch = await bcryptjs_1.default.compare(password, user.password);
    if (!isMatch) {
        throw new Error("Invalid credentials");
    }
    const token = (0, jwt_1.generateToken)({ userId: user.id, role: user.role });
    return {
        token,
        user: { id: user.id, name: user.name, email: user.email, role: user.role },
    };
}
async function getUserProfile(userId) {
    const user = await db_1.default.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            department: true,
            year: true,
            createdAt: true,
        },
    });
    if (!user) {
        throw new Error("User not found");
    }
    return user;
}
