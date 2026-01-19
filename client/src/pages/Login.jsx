import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login, loading } = useAuth();
  const [email, setEmail] = useState("demo@dcacademy.app");
  const [password, setPassword] = useState("Demo@12345");
  const [error, setError] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    const r = await login(email, password);
    if (!r.ok) setError(r.error);
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)", display: "grid", placeItems: "center", padding: 16 }}>
      <div className="dc-card" style={{ width: "min(520px, 100%)" }}>
        <h1 style={{ margin: 0, fontSize: 28 }}>Sign in</h1>
        <p style={{ marginTop: 8, color: "var(--muted)" }}>Demo credentials are prefilled.</p>

        <form onSubmit={onSubmit} style={{ marginTop: 16, display: "grid", gap: 12 }}>
          <label style={{ display: "grid", gap: 6 }}>
            <span style={{ color: "var(--muted)" }}>Email</span>
            <input value={email} onChange={(e) => setEmail(e.target.value)} style={{ padding: 12, borderRadius: 12 }} />
          </label>

          <label style={{ display: "grid", gap: 6 }}>
            <span style={{ color: "var(--muted)" }}>Password</span>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ padding: 12, borderRadius: 12 }} />
          </label>

          {error ? (
            <div style={{ border: "1px solid rgba(255,59,59,0.35)", background: "rgba(255,59,59,0.08)", padding: 12, borderRadius: 12 }}>
              {error}
            </div>
          ) : null}

          <button className="dc-btn" disabled={loading} type="submit">
            {loading ? "Signing in..." : "Sign in"}
          </button>

          <a href="/register" style={{ textAlign: "center", color: "var(--accent)" }}>Create an account</a>
        </form>
      </div>
    </div>
  );
}