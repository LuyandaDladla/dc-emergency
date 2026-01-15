import mongoose from "mongoose";

const analyticsEventSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    event: { type: String, required: true },
    meta: { type: Object, default: {} }
  },
  { timestamps: true }
);

export default mongoose.model("AnalyticsEvent", analyticsEventSchema);