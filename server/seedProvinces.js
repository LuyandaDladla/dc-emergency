import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import Province from "./models/Province.js";

dotenv.config();
await connectDB(process.env.MONGO_URI);

const provinces = [
  "Eastern Cape","Free State","Gauteng","KwaZulu-Natal","Limpopo",
  "Mpumalanga","North West","Northern Cape","Western Cape"
].map(name => ({
  name,
  emergencyNumbers: {
    police: "10111",
    ambulance: "10177",
    gbvHelpline: "0800 428 428",
    childline: "116",
    additional: [
      "GBV Command Centre: 0800 428 428",
      "Childline: 116",
      "Ambulance: 10177",
      "Police: 10111"
    ]
  }
}));

await Province.deleteMany({});
await Province.insertMany(provinces);

console.log("Provinces seeded");
process.exit(0);