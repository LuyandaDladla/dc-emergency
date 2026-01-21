// server/models/Post.js
import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
        anonymousId: { type: String, required: false }, // for anonymous mode later
        displayName: { type: String, required: false },

        text: { type: String, required: true, maxlength: 1000 },

        province: { type: String, default: "Unknown" },
        lat: { type: Number },
        lng: { type: Number },

        replyToPostId: { type: mongoose.Schema.Types.ObjectId, ref: "Post", default: null },
        rootPostId: { type: mongoose.Schema.Types.ObjectId, ref: "Post", default: null },

        likesCount: { type: Number, default: 0 },
        repostCount: { type: Number, default: 0 },
        repliesCount: { type: Number, default: 0 },

        // arrays kept minimal for demo; later we move to separate collections
        likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
        repostedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

        isDeleted: { type: Boolean, default: false },
    },
    { timestamps: true }
);

export default mongoose.model("Post", PostSchema);
