import mongoose from "mongoose";

const adSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    body: { type: String, default: "" },
    advertiser: { type: String, default: "Sponsor" },
    active: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.model("Ad", adSchema);