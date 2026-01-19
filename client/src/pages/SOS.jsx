import React, { useState } from "react";

export default function SOS() {
  const [status, setStatus] = useState("");

  async function sendSOS() {
    setStatus("Getting location...");
    try {
      const loc = await new Promise((resolve, reject) => {
        if (!navigator.geolocation) return reject(new Error("Geolocation not supported"));
        navigator.geolocation.getCurrentPosition(
          (p) => resolve(p.coords),
          () => reject(new Error("Permission denied")),
          { enableHighAccuracy: true, timeout: 10000 }
        );
      });
      setStatus(`SOS triggered. Location: ${loc.latitude.toFixed(5)}, ${loc.longitude.toFixed(5)} (demo)`);
    } catch {
      setStatus("Could not get location. Enable location permissions.");
    }
  }

  return (
    <div style={{ padding: 16 }}>
      <div className="dc-card">
        <h2 style={{ marginTop: 0 }}>SOS</h2>
        <p style={{ color: "var(--muted)" }}>Demo SOS: grabs your current location.</p>

        <button
          onClick={sendSOS}
          style={{
            marginTop: 12,
            width: "100%",
            padding: 16,
            borderRadius: 16,
            border: "1px solid rgba(255,59,59,0.35)",
            background: "rgba(255,59,59,0.12)",
            color: "var(--text)",
            fontWeight: 900,
            fontSize: 18,
          }}
        >
          TRIGGER SOS
        </button>

        {status ? <div style={{ marginTop: 12, color: "var(--muted)" }}>{status}</div> : null}
      </div>
    </div>
  );
}