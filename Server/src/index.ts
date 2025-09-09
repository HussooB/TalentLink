import express, { type Request, type Response } from "express";
import cors from "cors"
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";

// Load env
dotenv.config();

// Init
const app = express();
const PORT = process.env.PORT || 5467;

// Middleware
app.use(cors());
app.use(express.json());
console.log("SMTP Config:", {
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  user: process.env.SMTP_USER,
});
// Routes
app.use("/api/auth", authRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
