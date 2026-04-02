"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = authenticate;
exports.adminOnly = adminOnly;
const jwt_1 = require("../utils/jwt");
function authenticate(req, res, next) {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
        res.status(401).json({ error: "Authentication required" });
        return;
    }
    try {
        const token = header.split(" ")[1];
        req.user = (0, jwt_1.verifyToken)(token);
        next();
    }
    catch {
        res.status(401).json({ error: "Invalid or expired token" });
    }
}
function adminOnly(req, res, next) {
    if (req.user?.role !== "ADMIN") {
        res.status(403).json({ error: "Admin access required" });
        return;
    }
    next();
}
