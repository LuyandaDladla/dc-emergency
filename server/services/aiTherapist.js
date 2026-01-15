export async function therapistReply(message) {
  // Stub: replace with real model call (OpenAI or other)
  // Keep responses supportive and non-medical.
  if (!message || !message.trim()) return "Tell me what is going on.";

  const lower = message.toLowerCase();
  if (lower.includes("suicide") || lower.includes("kill myself")) {
    return "I am really sorry you are feeling this way. If you are in immediate danger, use the SOS button now or call local emergency services. You are not alone. If you can, reach out to someone you trust right now.";
  }

  return "I hear you. Take a slow breath in for 4 seconds, hold for 2, and out for 6. What is the main thing you are feeling right now?";
}
