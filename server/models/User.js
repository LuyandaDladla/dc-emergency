import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, default: "" },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    province: { type: String, default: "Gauteng" },
    avatarUrl: { type: String, default: "" },
    emergencyContacts: [
      { name: { type: String }, phone: { type: String } }
    ],
    isAdmin: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);