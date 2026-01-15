import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    scope: { type: String, enum: ["national","province"], default: "national" },
    province: { type: String, default: "" },
    title: { type: String, default: "Update" },
    body: { type: String, default: "" },
    isVerified: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export default mongoose.model("Post", postSchema);