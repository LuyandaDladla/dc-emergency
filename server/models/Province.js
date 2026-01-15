import mongoose from "mongoose";

const provinceSchema = new mongoose.Schema(
  {
    name: { type: String, unique: true, required: true },
    emergencyNumbers: {
      police: { type: String, default: "10111" },
      ambulance: { type: String, default: "10177" },
      gbvHelpline: { type: String, default: "0800 428 428" },
      childline: { type: String, default: "116" },
      additional: { type: [String], default: [] }
    }
  },
  { timestamps: true }
);

export default mongoose.model("Province", provinceSchema);