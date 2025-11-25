"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const lead_routes_1 = __importDefault(require("./routes/lead.routes"));
const quotation_routes_1 = __importDefault(require("./routes/quotation.routes"));
const notFound_1 = require("./middleware/notFound");
const errorHandler_1 = require("./middleware/errorHandler");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
const uploadsPath = path_1.default.resolve("uploads");
app.use("/uploads", express_1.default.static(uploadsPath));
console.log("Serving uploads from:", uploadsPath);
// Public routes (no auth)
app.use("/api/auth", auth_routes_1.default);
// Protected routes
app.use("/api/leads", lead_routes_1.default);
app.use("/api/quotations", quotation_routes_1.default);
// Errors
app.use(notFound_1.notFound);
app.use(errorHandler_1.errorHandler);
exports.default = app;
