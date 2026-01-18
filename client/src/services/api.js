import axios from "axios";

const API_BASE =
  import.meta.env.VITE_API_BASE ||
  "https://dc-emergency.onrender.com/api";

const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

// ----- token helpers (what AuthContext expects) -----
export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    localStorage.setItem("dc_token", token);
  } else {
    delete api.defaults.headers.common["Authorization"];
    localStorage.removeItem("dc_token");
  }
}

// Keep token attached for every request (in case page refresh)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("dc_token");
  if (token && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Small helper used by some pages/contexts:
// tries POST and returns { ok, data, error }
export async function tryPost(path, payload = {}, config = {}) {
  try {
    const res = await api.post(path, payload, config);
    return { ok: true, data: res.data };
  } catch (err) {
    const data = err?.response?.data;
    const msg =
      data?.error ||
      data?.message ||
      err?.message ||
      "Request failed";
    return { ok: false, error: msg, data };
  }
}

export { api };
export default api;