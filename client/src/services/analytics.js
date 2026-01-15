import { api } from "./api.js";

export async function track(event, meta = {}) {
  try { await api.post("/analytics/track", { event, meta }); }
  catch { /* silent */ }
}