import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import api, { setAuthToken, getAuthToken, tryGet, tryPost } from "../services/api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [token, setToken] = useState(getAuthToken());
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    async function refreshMe() {
        if (!getAuthToken()) {
            setUser(null);
            return null;
        }
        const res = await tryGet("/users/me");
        setUser(res?.user || null);
        return res?.user || null;
    }

    async function login(email, password) {
        const res = await tryPost("/auth/login", { email, password });
        setAuthToken(res?.token);
        setToken(res?.token || null);
        await refreshMe();
        return true;
    }

    async function register(name, email, password) {
        const res = await tryPost("/users/register", { name, email, password });
        setAuthToken(res?.token);
        setToken(res?.token || null);
        await refreshMe();
        return true;
    }

    function logout() {
        setAuthToken(null);
        setToken(null);
        setUser(null);
    }

    useEffect(() => {
        (async () => {
            try {
                await refreshMe();
            } catch {
                setAuthToken(null);
                setToken(null);
                setUser(null);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const value = useMemo(
        () => ({ token, user, loading, login, register, logout, refreshMe, apiBase: api.base }),
        [token, user, loading]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    return useContext(AuthContext);
}
