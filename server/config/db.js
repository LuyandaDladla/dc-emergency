import mongoose from "mongoose";

export default async function connectDB() {
  try {
    const uri = process.env.MONGO_URI || "";
    if (!uri) {
      console.log("MONGO_URI missing - continuing without DB (stub mode).");
      return;
    }
    await mongoose.connect(uri);
    console.log("MongoDB connected");
  } catch (e) {
    console.log("MongoDB connect failed - continuing without DB:", e?.message || e);
  }
}