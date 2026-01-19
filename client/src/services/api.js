const API_BASE =
  import.meta.env.VITE_API_BASE || "https://dc-emergency.onrender.com/api";

let authToken = localStorage.getItem("token") || null;

export function setAuthToken(token) {
  authToken = token || null;
  if (authToken) localStorage.setItem("token", authToken);
  else localStorage.removeItem("token");
}

async function request(method, path, body) {
  const headers = { "Content-Type": "application/json" };
  if (authToken) headers.Authorization = "Bearer " + authToken;

  const res = await fetch(API_BASE + path, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    credentials: "include",
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error || ("HTTP " + res.status));
  return data;
}

export const tryPost = (path, body) => request("POST", path, body);
export const tryGet = (path) => request("GET", path);

export default { tryPost, tryGet, setAuthToken };
