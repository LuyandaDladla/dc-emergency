const API_BASE =
    import.meta.env.VITE_API_BASE || "https://dc-emergency.onrender.com/api";

let authToken = localStorage.getItem("token") || null;

export function setAuthToken(token) {
    authToken = token || null;
    if (authToken) localStorage.setItem("token", authToken);
    else localStorage.removeItem("token");
}

export function getAuthToken() {
    return authToken;
}

async function request(method, path, body) {
    const headers = { "Content-Type": "application/json" };
    if (authToken) headers.Authorization = "Bearer " + authToken;

    const res = await fetch(API_BASE + path, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
        // keep this true
        credentials: "include"
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

// nice default wrapper for old code
export default {
    tryGet,
    tryPost,
    setAuthToken,
    getAuthToken
};
