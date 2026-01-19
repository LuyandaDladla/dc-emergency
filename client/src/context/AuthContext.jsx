import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { authApi } from "../services/api";

const AuthContext = createContext(null);
const LS_KEY = "dc_auth_user";

function loadUser() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => loadUser());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) localStorage.setItem(LS_KEY, JSON.stringify(user));
    else localStorage.removeItem(LS_KEY);
  }, [user]);

  const value = useMemo(() => ({
    user,
    loading,
    isAuthed: !!user,
    async login(email, password) {
      setLoading(true);
      try {
        const data = await authApi.login(email, password);
        setUser(data.user);
        return { ok: true };
      } catch (e) {
        return { ok: false, error: e?.message || "Invalid credentials" };
      } finally {
        setLoading(false);
      }
    },
    async register(name, email, password) {
      setLoading(true);
      try {
        const data = await authApi.register(name, email, password);
        setUser(data.user);
        return { ok: true };
      } catch (e) {
        return { ok: false, error: e?.message || "Registration failed" };
      } finally {
        setLoading(false);
      }
    },
    logout() { setUser(null); },
  }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}