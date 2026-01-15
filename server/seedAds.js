import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import Ad from "./models/Ad.js";

dotenv.config();
await connectDB(process.env.MONGO_URI);

const ads = [
  { title: "Sponsored: Self-defense training", body: "Learn basic self-defense skills safely.", advertiser: "Partner A", active: true },
  { title: "Sponsored: Wellness counseling", body: "Affordable counseling resources.", advertiser: "Partner B", active: true },
  { title: "Sponsored: Community support groups", body: "Find support near you.", advertiser: "Partner C", active: true }
];

await Ad.deleteMany({});
await Ad.insertMany(ads);

console.log("Ads seeded");
process.exit(0);