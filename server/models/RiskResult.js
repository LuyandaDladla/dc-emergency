import mongoose from "mongoose";

const riskResultSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    score: { type: Number, required: true },
    level: { type: String, required: true }, // low/medium/high
    answers: { type: Object, default: {} }
  },
  { timestamps: true }
);

export default mongoose.model("RiskResult", riskResultSchema);