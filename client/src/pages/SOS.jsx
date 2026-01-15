import { useState } from "react";
import { api } from "../services/api.js";

export default function SOS() {
  const [status, setStatus] = useState("Ready");
  const [province, setProvince] = useState("Gauteng");

  const trigger = () => {
    setStatus("Getting location...");
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const payload = {
        province,
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
        message: "Emergency SOS"
      };
      setStatus("Sending...");
      await api.post("/sos", payload);
      setStatus("Sent");
    }, async () => {
      setStatus("Location blocked. Sending without GPS...");
      await api.post("/sos", { province, message: "Emergency SOS (no GPS)" });
      setStatus("Sent");
    });
  };

  return (
    <div>
      <div className="card">
        <div style={{ fontWeight: 700 }}>SOS</div>
        <div className="small">
          Main feature: big SOS button centered. Uses /api/sos (requires login).
        </div>
      </div>

      <div className="card">
        <select className="input" value={province} onChange={(e) => setProvince(e.target.value)}>
          <option>Eastern Cape</option>
          <option>Free State</option>
          <option>Gauteng</option>
          <option>KwaZulu-Natal</option>
          <option>Limpopo</option>
          <option>Mpumalanga</option>
          <option>North West</option>
          <option>Northern Cape</option>
          <option>Western Cape</option>
        </select>
      </div>

      <div className="sos-center">
        <button className="sos-button" onClick={trigger} aria-label="Trigger SOS">SOS</button>
        <div className="small" style={{ marginTop: 14 }}>Status: {status}</div>
      </div>
    </div>
  );
}