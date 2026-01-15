import mongoose from "mongoose";

const RiskSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
    province: { type: String, default: "" },
    score: { type: Number, default: 0 },
    answers: { type: Object, default: {} },
    flags: { type: [String], default: [] }
  },
  { timestamps: true }
);

export default mongoose.model("Risk", RiskSchema);