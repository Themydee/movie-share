import express, { Application } from "express";
import dotenv from "dotenv";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { DB } from "./config/db"; // adjust path to your DB file

dotenv.config();

const app: Application = express();
const PORT: number = parseInt(process.env.PORT || "3000", 10);

// CORS
app.use(
  cors({
    origin: "*",
  })
);

// JSON parsing
app.use(express.json());


// Rate Limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOWS_MS || "60000", 10),
  max: parseInt(process.env.RATE_LIMIT_MAX || "100", 10),
});
app.use(limiter);


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
