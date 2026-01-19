import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register, loading } = useAuth();
  const [name, setName] = useState("New User");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    const r = await register(name, email, password);
    if (!r.ok) setError(r.error);
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)", display: "grid", placeItems: "center", padding: 16 }}>
      <div className="dc-card" style={{ width: "min(520px, 100%)" }}>
        <h1 style={{ margin: 0, fontSize: 28 }}>Register</h1>

        <form onSubmit={onSubmit} style={{ marginTop: 16, display: "grid", gap: 12 }}>
          <label style={{ display: "grid", gap: 6 }}>
            <span style={{ color: "var(--muted)" }}>Name</span>
            <input value={name} onChange={(e) => setName(e.target.value)} style={{ padding: 12, borderRadius: 12 }} />
          </label>

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
            {loading ? "Creating..." : "Create account"}
          </button>

          <a href="/login" style={{ textAlign: "center", color: "var(--accent)" }}>Back to sign in</a>
        </form>
      </div>
    </div>
  );
}