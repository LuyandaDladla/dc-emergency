const API_BASE =
  (import.meta.env.VITE_API_BASE || import.meta.env.VITE_API_URL || "https://dc-emergency.onrender.com/api").replace(/\/$/, "");

let authToken = null;

export function setAuthToken(token) {
  authToken = token || null;
  try {
    if (authToken) localStorage.setItem("dc_token", authToken);
    else localStorage.removeItem("dc_token");
  } catch {}
}

export function getAuthToken() {
  if (authToken) return authToken;
  try {
    authToken = localStorage.getItem("dc_token") || null;
    return authToken;
  } catch {
    return null;
  }
}

async function request(path, { method = "GET", body, headers } = {}) {
  const token = getAuthToken();

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(headers || {})
    },
    body: body ? JSON.stringify(body) : undefined,
    credentials: "include"
  });

  const ct = res.headers.get("content-type") || "";
  let data = null;
  if (ct.includes("application/json")) data = await res.json().catch(() => null);
  else data = await res.text().catch(() => null);

  if (!res.ok) {
    const msg =
      (data && data.error) ||
      (typeof data === "string" && data) ||
      `Request failed (${res.status})`;

    const err = new Error(msg);
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
}

export const tryGet = (path) => request(path, { method: "GET" });
export const tryPost = (path, body) => request(path, { method: "POST", body });

const api = { base: API_BASE, request, tryGet, tryPost, setAuthToken, getAuthToken };
export default api;