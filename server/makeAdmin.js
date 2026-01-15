import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { connectDB } from "./config/db.js";
import User from "./models/User.js";

dotenv.config();
await connectDB(process.env.MONGO_URI);

const email = process.argv[2];
const password = process.argv[3] || "Admin123!";

if (!email) {
  console.log("Usage: node makeAdmin.js admin@email.com Admin123!");
  process.exit(1);
}

let user = await User.findOne({ email });
if (!user) {
  const passwordHash = await bcrypt.hash(password, 10);
  user = await User.create({ email, passwordHash, name: "Admin", isAdmin: true });
} else {
  user.isAdmin = true;
  await user.save();
}

console.log("Admin ready:", user.email);
process.exit(0);