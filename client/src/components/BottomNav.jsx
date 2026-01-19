import React from "react";

export default function BottomNav() {
  const item = (href, label) => (
    <a href={href} style={{ flex: 1, textAlign: "center", padding: "10px 6px", color: "var(--muted)", textDecoration: "none", fontWeight: 700 }}>
      {label}
    </a>
  );

  return (
    <div style={{ position: "fixed", left: 0, right: 0, bottom: 0, background: "rgba(11,15,20,0.95)", borderTop: "1px solid var(--border)", display: "flex", paddingBottom: "max(0px, env(safe-area-inset-bottom))" }}>
      {item("/", "Home")}
      {item("/community", "Community")}
      {item("/sos", "SOS")}
    </div>
  );
}