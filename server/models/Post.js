import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    scope: { type: String, enum: ["national", "province"], default: "national" },
    province: { type: String, default: "" },
    text: { type: String, required: true },
    comments: [{ text: String, createdAt: Date }]
  },
  { timestamps: true }
);

export default mongoose.model("Post", postSchema);