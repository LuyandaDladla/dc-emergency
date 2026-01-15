import mongoose from "mongoose";

const analyticsSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    event: { type: String, required: true },
    props: { type: Object, default: {} }
  },
  { timestamps: true }
);

export default mongoose.model("AnalyticsEvent", analyticsSchema);