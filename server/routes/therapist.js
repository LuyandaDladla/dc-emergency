import express from "express";
const router = express.Router();

// For deploy-today: keep it stable with a safe stub.
// We'll switch to real Gemini call once your GEMINI_API_KEY is set on Render.
router.post("/message", async (req, res) => {
  const { message = "" } = req.body || {};
  if (!message) return res.status(400).json({ ok:false, error:"message required" });

  const enabled = (process.env.GEMINI_ENABLED || "0") === "1";
  if (!enabled) {
    return res.json({ ok:true, reply:"I am here with you. Tell me what is happening and how you feel right now." });
  }

  // If enabled, implement server-side Gemini call here (next step).
  return res.json({ ok:true, reply:"Gemini enabled but implementation not added yet. (Next step.)" });
});

export default router;