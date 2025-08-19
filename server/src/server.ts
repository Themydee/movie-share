import express, { Application, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { DB } from "./config/db";
import authRoutes from "./routes/auth.route";
import moviesRoutes from "./routes/movie.route";

dotenv.config();

const app: Application = express();
const PORT: number = Number(process.env.PORT) || 5000;

// CORS
app.use(
  cors({
    origin: "*", // Adjust this to your frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// JSON parsing
app.use(express.json());

// Rate Limiting
const limiter = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOWS_MS) || 60000, 
  max: Number(process.env.RATE_LIMIT_MAX) || 100, 
});
app.use(limiter);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/movies", moviesRoutes)

// Health check route (useful for deployment testing)
app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({ status: "OK" });
});

// Start server after DB connects
(async () => {
  try {
    await DB();
    app.listen(PORT, () => {
      console.log(`✅ Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
})();
