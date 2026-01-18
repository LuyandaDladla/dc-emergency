import mongoose from "mongoose";

import bcrypt from "bcryptjs";
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


userSchema.pre("save", async function(next) {
  try {
    if (!this.isModified("password")) return next();

userSchema.methods.matchPassword = async function(enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    return next();
  } catch (err) {
    return next(err);
  }
});
export default mongoose.model("User", userSchema);
