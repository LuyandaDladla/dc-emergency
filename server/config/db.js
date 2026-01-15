import mongoose from "mongoose";

export default async function connectDB() {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) {
      console.error("MONGO_URI is missing. Set it in Render environment variables.");
      process.exit(1);
    }

    await mongoose.connect(uri);
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  }
}