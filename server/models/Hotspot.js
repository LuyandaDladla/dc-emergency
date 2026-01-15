import mongoose from "mongoose";

const hotspotSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    province: { type: String, required: true },
    severity: { type: String, enum: ["low","medium","high"], default: "medium" },
    // Circle geofence
    centerLat: { type: Number, required: true },
    centerLng: { type: Number, required: true },
    radiusMeters: { type: Number, required: true },
    verified: { type: Boolean, default: true },
    notes: { type: String, default: "" },
    active: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.model("Hotspot", hotspotSchema);