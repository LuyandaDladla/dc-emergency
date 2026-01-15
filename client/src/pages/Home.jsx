import { useEffect, useState } from "react";
import { api } from "../services/api.js";

export default function Home() {
  const [health, setHealth] = useState(null);

  useEffect(() => {
    api.get("/health").then(r => setHealth(r.data)).catch(() => setHealth({ status: "Backend not reachable" }));
  }, []);

  return (
    <div>
      <div className="card">
        <div style={{ fontWeight: 700, marginBottom: 8 }}>System status</div>
        <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>{JSON.stringify(health, null, 2)}</pre>
      </div>

      <div className="card">
        <div style={{ fontWeight: 700 }}>Instagram-like feed direction</div>
        <div className="small">
          This scaffold uses a feed + bottom nav pattern. Next phase: real feed cards, alerts, stories-style UI.
        </div>
      </div>
    </div>
  );
}
