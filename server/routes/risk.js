import express from "express";
const router = express.Router();

// In-memory risk submissions (replace with Mongo Risk model later)
const submissions = [];

router.post("/submit", (req, res) => {
  const { province = "", answers = {} } = req.body || {};

  // Simple scoring (example): count "yes" answers
  let score = 0;
  Object.keys(answers || {}).forEach(k => { if (String(answers[k]).toLowerCase() === "yes") score += 10; });

  const flags = [];
  if (score >= 40) flags.push("high_risk");
  if (answers && (answers.threats === "yes" || answers.weapons === "yes")) flags.push("urgent");

  const item = { id:"r_"+Date.now(), province, score, flags, answers, createdAt:new Date().toISOString() };
  submissions.push(item);

  res.json({ ok:true, result:item, guidance: guidanceFor(score, flags) });
});

router.get("/history", (req, res) => {
  res.json({ ok:true, items: submissions.slice(-50).reverse() });
});

function guidanceFor(score, flags){
  if (flags.includes("urgent")) return "Urgent risk detected. Consider contacting emergency services and a trusted contact immediately.";
  if (score >= 40) return "High risk detected. Consider creating a safety plan and contacting support services.";
  if (score >= 20) return "Moderate risk. Consider speaking to a counselor and keeping evidence of incidents.";
  return "Low risk indicated. Stay aware and reach out for support if you feel unsafe.";
}

export default router;