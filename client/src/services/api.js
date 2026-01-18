import axios from "axios";

// Priority order:
// 1) VITE_API_BASE (Vercel/Netlify env)
// 2) localhost server (dev)
// 3) Render fallback (prod)
const ENV_BASE =
  (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_API_BASE) ||
  "";

const FALLBACK_BASE =
  ENV_BASE ||
  (location.hostname === "localhost" ? "http://localhost:10000/api" : "https://dc-emergency.onrender.com/api");

const api = axios.create({
  baseURL: FALLBACK_BASE,
  withCredentials: false,
  headers: { "Content-Type": "application/json" },
});

// Attach/remove token globally
export function setAuthToken(token) {
  if (token) api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  else delete api.defaults.headers.common["Authorization"];
}

// Helpers that always return { ok, ... } shape
export async function tryGet(path, config = {}) {
  try {
    const res = await api.get(path, config);
    return res?.data ?? { ok: true };
  } catch (e) {
    const data = e?.response?.data;
    return data ?? { ok: false, error: e?.message || "Request failed" };
  }
}

export async function tryPost(path, body = {}, config = {}) {
  try {
    const res = await api.post(path, body, config);
    return res?.data ?? { ok: true };
  } catch (e) {
    const data = e?.response?.data;
    return data ?? { ok: false, error: e?.message || "Request failed" };
  }
}

export default api;