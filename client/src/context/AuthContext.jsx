import { createContext, useContext, useEffect, useMemo, useState } from "react";
import api, { setAuthToken } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setAuthToken(token);
  }, [token]);

  async function login(email, password) {
    setError("");
    setLoading(true);
    try {
      const res = await api.tryPost("/auth/login", { email, password });
      setToken(res.token);
      return true;
    } catch (e) {
      setError(e?.message || "Login failed");
      return false;
    } finally {
      setLoading(false);
    }
  }

  async function register(email, password, name) {
    setError("");
    setLoading(true);
    try {
      const res = await api.tryPost("/users/register", { email, password, name });
      setToken(res.token);
      return true;
    } catch (e) {
      setError(e?.message || "Register failed");
      return false;
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    setToken(null);
    setAuthToken(null);
  }

  const value = useMemo(
    () => ({ token, loading, error, login, register, logout }),
    [token, loading, error]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
