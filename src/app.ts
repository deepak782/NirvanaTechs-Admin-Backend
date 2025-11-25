import express from "express";
import cors from "cors";
import path from "path";

import authRoutes from "./routes/auth.routes";
import leadsRoutes from "./routes/lead.routes";
import quotationsRoutes from "./routes/quotation.routes";

import { notFound } from "./middleware/notFound";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const uploadsPath = path.resolve("uploads");
app.use("/uploads", express.static(uploadsPath));

console.log("Serving uploads from:", uploadsPath);

// Public routes (no auth)
app.use("/api/auth", authRoutes);

// Protected routes
app.use("/api/leads", leadsRoutes);
app.use("/api/quotations", quotationsRoutes);

// Errors
app.use(notFound);
app.use(errorHandler);

export default app;