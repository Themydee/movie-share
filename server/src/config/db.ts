import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const DB = async (): Promise<void> => {
  try {
    const mongoUrl = process.env.MONGO_URL as string;

    if (!mongoUrl) {
      throw new Error("MONGO_URL environment variable is not defined");
    }

    const conn = await mongoose.connect(mongoUrl);
    console.log(`✅ MONGODB connection successful: ${conn.connection.host}`);
  } catch (error) {
    if (error instanceof Error) {
      console.error("❌ MONGODB connection unsuccessful:", error.message);
    } else {
      console.error("❌ MONGODB connection unsuccessful:", error);
    }
    process.exit(1);
  }
};
