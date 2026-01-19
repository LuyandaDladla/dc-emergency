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
    if (authToken) headers.Authorization = `Bearer ${authToken}`;

    const res = await fetch(`${API_BASE}${path}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
        credentials: "include",
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
        const msg = data?.error || data?.message || `HTTP ${res.status}`;
        const err = new Error(msg);
        err.status = res.status;
        err.data = data;
        throw err;
    }
    return data;
}

export const tryPost = (path, body) => request("POST", path, body);
export const tryGet = (path) => request("GET", path);

const api = {
    get: (path) => request("GET", path),
    post: (path, body) => request("POST", path, body),
    put: (path, body) => request("PUT", path, body),
    patch: (path, body) => request("PATCH", path, body),
    del: (path) => request("DELETE", path),
};

export default api;
