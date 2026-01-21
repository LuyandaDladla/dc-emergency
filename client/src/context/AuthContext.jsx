import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import api, { setAuthToken, getAuthToken, tryPost, tryGet } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [token, setToken] = useState(getAuthToken());
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    async function loadMe(t) {
        if (!t) {
            setUser(null);
            return;
        }
        try {
            const res = await tryGet("/users/me");
            setUser(res?.user || null);
        } catch {
            setUser(null);
            setAuthToken(null);
            setToken(null);
        }
    }

    useEffect(() => {
        const t = getAuthToken();
        setAuthToken(t);
        setToken(t);
        loadMe(t).finally(() => setLoading(false));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function login(email, password) {
        const res = await tryPost("/auth/login", { email, password });
        if (res?.token) {
            setAuthToken(res.token);
            setToken(res.token);
            await loadMe(res.token);
        }
        return res;
    }

    async function register({ email, password, name }) {
        // register lives under /users/register in your backend
        const res = await tryPost("/users/register", { email, password, name });
        if (res?.token) {
            setAuthToken(res.token);
            setToken(res.token);
            await loadMe(res.token);
        }
        return res;
    }

    function logout() {
        setAuthToken(null);
        setToken(null);
        setUser(null);
    }

    const value = useMemo(
        () => ({ token, user, loading, login, register, logout }),
        [token, user, loading]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    return useContext(AuthContext);
}
