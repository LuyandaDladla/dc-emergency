import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import api, { setAuthToken, tryPost, tryGet } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [token, setToken] = useState(localStorage.getItem("token") || null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [authError, setAuthError] = useState(null);

    useEffect(() => {
        setAuthToken(token);
    }, [token]);

    async function loadMe() {
        if (!token) {
            setUser(null);
            setLoading(false);
            return;
        }
        setLoading(true);
        setAuthError(null);
        try {
            const res = await tryGet("/users/me");
            setUser(res?.user || null);
        } catch (e) {
            // invalid/expired token
            setUser(null);
            setToken(null);
            setAuthToken(null);
            localStorage.removeItem("token");
            setAuthError(e?.message || "Session expired");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadMe();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function register({ email, password, name }) {
        setAuthError(null);
        const res = await tryPost("/users/register", { email, password, name });
        if (res?.token) {
            setToken(res.token);
            setAuthToken(res.token);
            await loadMe();
        }
        return res;
    }

    async function login({ email, password }) {
        setAuthError(null);
        const res = await tryPost("/auth/login", { email, password });
        if (res?.token) {
            setToken(res.token);
            setAuthToken(res.token);
            await loadMe();
        }
        return res;
    }

    function logout() {
        setAuthError(null);
        setUser(null);
        setToken(null);
        setAuthToken(null);
        localStorage.removeItem("token");
    }

    const value = useMemo(
        () => ({ token, user, loading, authError, login, register, logout, refreshMe: loadMe }),
        [token, user, loading, authError]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
    return ctx;
}
