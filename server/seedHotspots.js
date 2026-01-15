import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import Hotspot from "./models/Hotspot.js";

dotenv.config();
await connectDB(process.env.MONGO_URI);

// Example starter hotspots (adjust to real data later)
const items = [
  { title:"CBD Safety Alert", province:"Gauteng", severity:"high", centerLat:-26.2041, centerLng:28.0473, radiusMeters:1200, verified:true, notes:"Example hotspot" },
  { title:"Night Travel Caution", province:"KwaZulu-Natal", severity:"medium", centerLat:-29.8587, centerLng:31.0218, radiusMeters:900, verified:true, notes:"Example hotspot" },
  { title:"Community Watch Area", province:"Western Cape", severity:"medium", centerLat:-33.9249, centerLng:18.4241, radiusMeters:800, verified:true, notes:"Example hotspot" }
];

await Hotspot.deleteMany({});
await Hotspot.insertMany(items);

console.log("Hotspots seeded");
process.exit(0);