import mongoose from "mongoose";

const sosSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    province: String,
    latitude: Number,
    longitude: Number,
    message: String
  },
  { timestamps: true }
);

export default mongoose.model("SosEvent", sosSchema);
