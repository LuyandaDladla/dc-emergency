import { therapistReply } from "../services/aiTherapist.js";

export async function therapy(req, res) {
  const { message } = req.body || {};
  const reply = await therapistReply(message || "");
  res.json({ reply });
}
