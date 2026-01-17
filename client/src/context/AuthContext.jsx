import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import api, { setAuthToken, tryPost } from "../services/api";

const AuthContext = createContext({
  user: null,
  token: null,
  loading: false,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  refreshMe: async () => {},
});

function pickToken(data) {
  return data?.token || data?.accessToken || data?.jwt || data?.data?.token || null;
}
function pickUser(data) {
  return data?.user || data?.data?.user || data?.profile || null;
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("dc_token") || null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshMe = async () => {
    if (!token) { setUser(null); return; }
    try {
      const res = await api.get("/users/me");
      setUser(res.data?.user || res.data || null);
    } catch {
      setUser(null);
    }
  };

  useEffect(() => {
    setAuthToken(token);
    (async () => {
      setLoading(true);
      await refreshMe();
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const login = async (email, password) => {
    const res = await tryPost(
      ["/auth/login", "/users/login", "/login", "/users/signin", "/auth/signin"],
      { email, password }
    );

    const data = res.data;
    const t = pickToken(data);
    const u = pickUser(data);

    if (t) {
      localStorage.setItem("dc_token", t);
      setToken(t);
    }
    if (u) setUser(u);

    return data;
  };

  const register = async (name, email, password) => {
    const res = await tryPost(
      ["/auth/register", "/users/register", "/register", "/users/signup", "/auth/signup"],
      { name, email, password }
    );

    const data = res.data;
    const t = pickToken(data);
    const u = pickUser(data);

    if (t) {
      localStorage.setItem("dc_token", t);
      setToken(t);
    }
    if (u) setUser(u);

    return data;
  };

  const logout = () => {
    localStorage.removeItem("dc_token");
    setToken(null);
    setUser(null);
  };

  const value = useMemo(() => ({ user, token, loading, login, register, logout, refreshMe }), [user, token, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}