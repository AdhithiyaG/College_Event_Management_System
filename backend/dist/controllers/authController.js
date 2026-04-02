"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = register;
exports.login = login;
exports.profile = profile;
const authService_1 = require("../services/authService");
async function register(req, res) {
    try {
        const { name, email, password, department, year } = req.body;
        if (!name || !email || !password) {
            res.status(400).json({ error: "Name, email, and password are required" });
            return;
        }
        const result = await (0, authService_1.registerUser)({ name, email, password, department, year });
        res.status(201).json(result);
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
}
async function login(req, res) {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ error: "Email and password are required" });
            return;
        }
        const result = await (0, authService_1.loginUser)(email, password);
        res.json(result);
    }
    catch (err) {
        res.status(401).json({ error: err.message });
    }
}
async function profile(req, res) {
    try {
        const user = await (0, authService_1.getUserProfile)(req.user.userId);
        res.json(user);
    }
    catch (err) {
        res.status(404).json({ error: err.message });
    }
}
