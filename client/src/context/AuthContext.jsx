// client/src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import api, { setAuthToken, getAuthToken, tryGet, tryPost } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [token, setTokenState] = useState(getAuthToken());
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const setToken = (t) => {
        setAuthToken(t);
        setTokenState(t || null);
    };

    async function refreshMe() {
        const t = getAuthToken();
        if (!t) {
            setUser(null);
            return null;
        }
        const res = await tryGet("/users/me");
        setUser(res?.user || null);
        return res?.user || null;
    }

    async function login(email, password) {
        const res = await tryPost("/auth/login", { email, password });
        if (!res?.token) throw new Error("No token returned");
        setToken(res.token);
        await refreshMe();
        return true;
    }

    async function register(name, email, password) {
        // Your backend register is on /api/users/register
        const res = await tryPost("/users/register", { name, email, password });
        if (!res?.token) throw new Error("No token returned");
        setToken(res.token);
        await refreshMe();
        return true;
    }

    function logout() {
        setToken(null);
        setUser(null);
    }

    useEffect(() => {
        (async () => {
            try {
                if (getAuthToken()) await refreshMe();
            } catch {
                // token bad / expired
                setToken(null);
                setUser(null);
            } finally {
                setLoading(false);
            }
        })();
        
    }, []);

    const value = useMemo(
        () => ({
            token,
            user,
            loading,
            login,
            register,
            logout,
            refreshMe,
            apiBase: api.base,
        }),
        [token, user, loading]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    return useContext(AuthContext);
}
