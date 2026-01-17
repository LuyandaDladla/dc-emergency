import axios from "axios";

const baseURL =
  import.meta.env.VITE_API_BASE ||
  "http://localhost:5000/api";

const api = axios.create({
  baseURL,
  withCredentials: false,
  headers: { "Content-Type": "application/json" },
});

export function setAuthToken(token) {
  if (token) api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  else delete api.defaults.headers.common["Authorization"];
}

export async function tryPost(paths, body) {
  let lastErr;
  for (const p of paths) {
    try {
      const res = await api.post(p, body);
      return res;
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr;
}

export { api };
export default api;