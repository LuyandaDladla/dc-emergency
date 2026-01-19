import React from "react";

export default function Home() {
  return (
    <div style={{ padding: 16 }}>
      <div className="dc-card">
        <h2 style={{ marginTop: 0 }}>DC Emergency & Wellness</h2>
        <p style={{ color: "var(--muted)" }}>Auth + SOS + Community + PWA demo build.</p>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 12 }}>
          <a className="dc-btn" href="/sos">Open SOS</a>
          <a className="dc-btn-secondary" href="/community">Community</a>
        </div>
      </div>
    </div>
  );
}