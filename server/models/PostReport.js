// server/models/PostReport.js
import mongoose from "mongoose";

const PostReportSchema = new mongoose.Schema(
  {
    postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
    reporterUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
    reason: { type: String, default: "unspecified" },
    note: { type: String, default: "" },
    status: { type: String, default: "open" }, // open | reviewed | removed
  },
  { timestamps: true }
);

export default mongoose.model("PostReport", PostReportSchema);
