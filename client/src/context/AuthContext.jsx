import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import api, { setAuthToken, getAuthToken, tryGet, tryPost } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [token, setToken] = useState(() => getAuthToken());
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    async function refreshMe(tk = token) {
        if (!tk) {
            setUser(null);
            setLoading(false);
            return;
        }
        try {
            setAuthToken(tk);
            const res = await tryGet("/users/me");
            setUser(res?.user || null);
        } catch {
            setUser(null);
        } finally {
            setLoading(false);
        }
    }

    async function login(email, password) {
        const res = await tryPost("/auth/login", { email, password });
        const tk = res?.token;
        if (!tk) throw new Error("No token returned");
        setAuthToken(tk);
        setToken(tk);
        await refreshMe(tk);
        return true;
    }

    async function register(name, email, password) {
        // register is under /users/register in your backend
        const res = await tryPost("/users/register", { name, email, password });
        const tk = res?.token;
        if (tk) {
            setAuthToken(tk);
            setToken(tk);
            await refreshMe(tk);
        }
        return true;
    }

    function logout() {
        setAuthToken(null);
        setToken(null);
        setUser(null);
    }

    useEffect(() => {
        refreshMe(token);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const value = useMemo(
        () => ({
            token,
            user,
            loading,
            login,
            register,
            logout
        }),
        [token, user, loading]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    return useContext(AuthContext);
}
