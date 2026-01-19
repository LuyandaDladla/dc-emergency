import React from "react";
import BottomNav from "./BottomNav";
import { useAuth } from "../context/AuthContext";

export default function AppShell({ children }) {
  const { user, logout } = useAuth();

  return (
    <div style={{ minHeight: "100vh", paddingBottom: 74, background: "var(--bg)", color: "var(--text)" }}>
      <header style={{ position: "sticky", top: 0, zIndex: 10, background: "rgba(7,10,15,0.9)", backdropFilter: "blur(10px)", borderBottom: "1px solid var(--border)", padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <b>DC Emergency</b>
        <div style={{ display: "flex", gap: 10, alignItems: "center", color: "var(--muted)" }}>
          {user?.email ? <span style={{ fontSize: 12 }}>{user.email}</span> : null}
          <button className="dc-btn-secondary" onClick={logout}>Logout</button>
        </div>
      </header>

      <main>{children}</main>

      <a href="/sos" aria-label="SOS" style={{ position: "fixed", right: 16, bottom: 86, width: 64, height: 64, borderRadius: 999, display: "grid", placeItems: "center", background: "rgba(255,59,59,0.18)", border: "1px solid rgba(255,59,59,0.40)", color: "var(--text)", fontWeight: 900, textDecoration: "none", boxShadow: "0 10px 30px rgba(0,0,0,0.35)" }}>
        SOS
      </a>

      <BottomNav />
    </div>
  );
}