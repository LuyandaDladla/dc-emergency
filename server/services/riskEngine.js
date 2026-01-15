export function assessRisk(input) {
  // Simple rule-based v1 (upgrade to ML later)
  // Input can include province, recent incidents, time, user answers, etc.
  let score = 0;
  if (input.timeOfDay === "night") score += 2;
  if (input.hasThreats) score += 3;
  if (input.province) score += 1;

  const level = score >= 5 ? "high" : score >= 3 ? "medium" : "low";
  return { score, level };
}
