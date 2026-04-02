"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const eventRoutes_1 = __importDefault(require("./routes/eventRoutes"));
const registrationRoutes_1 = __importDefault(require("./routes/registrationRoutes"));
const app = (0, express_1.default)();
const port = Number(process.env.PORT) || 5000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get("/health", (_req, res) => {
    res.status(200).json({ status: "ok" });
});
app.use("/api/auth", authRoutes_1.default);
app.use("/api/events", eventRoutes_1.default);
app.use("/api/registrations", registrationRoutes_1.default);
app.listen(port, () => {
    console.log(`Backend server running on port ${port}`);
});
