import RiskResult from "../models/RiskResult.js";

function computeScore(answers) {
  // Simple v1 rules engine (expand later)
  // Expected answers keys: q1..q8 with values 0..3
  let score = 0;
  for (const k of Object.keys(answers || {})) {
    const v = Number(answers[k] || 0);
    if (!isNaN(v)) score += v;
  }
  return score;
}

function levelFromScore(score) {
  if (score >= 16) return "high";
  if (score >= 8) return "medium";
  return "low";
}

export async function assessRisk(req, res) {
  const answers = (req.body && req.body.answers) ? req.body.answers : {};
  const score = computeScore(answers);
  const level = levelFromScore(score);

  const doc = await RiskResult.create({
    userId: req.user._id,
    score,
    level,
    answers
  });

  const recommendations = [];
  if (level === "high") {
    recommendations.push("Consider triggering SOS if you are in danger.");
    recommendations.push("Contact a trusted person and share your location.");
    recommendations.push("Call GBV helpline 0800 428 428.");
  } else if (level === "medium") {
    recommendations.push("Speak to someone you trust and create a safety plan.");
    recommendations.push("Use the therapist chat for support.");
  } else {
    recommendations.push("Keep monitoring your situation and stay connected to support.");
  }

  res.json({ ok: true, score, level, recommendations, savedId: doc._id });
}

export async function myLatest(req, res) {
  const doc = await RiskResult.findOne({ userId: req.user._id }).sort({ createdAt: -1 });
  res.json({ doc });
}

export async function adminSummary(req, res) {
  const total = await RiskResult.countDocuments();
  const high = await RiskResult.countDocuments({ level: "high" });
  const medium = await RiskResult.countDocuments({ level: "medium" });
  const low = await RiskResult.countDocuments({ level: "low" });
  res.json({ total, high, medium, low });
}