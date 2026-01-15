import mongoose from "mongoose";

const therapistMessageSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    role: { type: String, enum: ["user", "assistant"], required: true },
    text: { type: String, required: true }
  },
  { timestamps: true }
);

export default mongoose.model("TherapistMessage", therapistMessageSchema);