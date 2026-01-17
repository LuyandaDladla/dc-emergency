import mongoose from "mongoose";

export default async function connectDB() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error("MONGO_URI missing. Add it to server/.env");
  }

  try {
    const conn = await mongoose.connect(uri);
    console.log("MongoDB connected:", conn.connection.host);
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  }
}