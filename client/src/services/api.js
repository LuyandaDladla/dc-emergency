const API_BASE =
  import.meta?.env?.VITE_API_BASE_URL ||
  "http://localhost:4000";

export async function api(path, { method = "GET", body, headers } = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: { "Content-Type": "application/json", ...(headers || {}) },
    body: body ? JSON.stringify(body) : undefined,
    credentials: "include",
  });

  let data = null;
  try { data = await res.json(); } catch {}

  if (!res.ok) {
    const msg = data?.error || `Request failed (${res.status})`;
    throw new Error(msg);
  }
  return data;
}

export const authApi = {
  login: (email, password) => api("/auth/login", { method: "POST", body: { email, password } }),
  register: (name, email, password) => api("/auth/register", { method: "POST", body: { name, email, password } }),
};