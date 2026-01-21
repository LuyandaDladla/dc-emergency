

const API_BASE =
    import.meta.env.VITE_API_BASE || "https://dc-emergency.onrender.com/api";

const TOKEN_KEY = "dc_token";

export function getAuthToken() {
    return localStorage.getItem(TOKEN_KEY);
}

export function setAuthToken(token) {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
}

async function request(method, path, body) {
    const token = getAuthToken();
    const headers = { "Content-Type": "application/json" };
    if (token) headers.Authorization = `Bearer ${token}`;

    const res = await fetch(`${API_BASE}${path}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
        // Keep this "omit" unless you are actually using cookie sessions.
        credentials: "omit",
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
        const msg = data?.error || data?.message || `HTTP ${res.status}`;
        throw new Error(msg);
    }
    return data;
}

export const tryGet = (path) => request("GET", path);
export const tryPost = (path, body) => request("POST", path, body);

const api = {
    base: API_BASE,
    getAuthToken,
    setAuthToken,
    tryGet,
    tryPost,
};

export default api;
