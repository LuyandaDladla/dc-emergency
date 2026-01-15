import { useState } from "react";
import { api } from "../services/api.js";

export default function Admin() {
  const [stats, setStats] = useState(null);
  const [events, setEvents] = useState([]);

  const load = async () => {
    const s = await api.get("/admin/stats");
    setStats(s.data);
    const e = await api.get("/admin/sos");
    setEvents(e.data.items || []);
  };

  return (
    <div>
      <div className="card">
        <div style={{ fontWeight: 700 }}>Admin dashboard (scaffold)</div>
        <button className="btn" onClick={load}>Load</button>
        <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>{JSON.stringify(stats, null, 2)}</pre>
      </div>

      {events.map(ev => (
        <div className="card" key={ev._id}>
          <div style={{ fontWeight: 700 }}>SOS</div>
          <div className="small">Province: {ev.province || "Unknown"}</div>
          <div className="small">Time: {ev.createdAt}</div>
        </div>
      ))}
      <div className="small">Admin endpoints require admin token in next phase.</div>
    </div>
  );
}
