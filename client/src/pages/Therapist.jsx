import { useEffect, useState } from "react";
import { api } from "../services/api.js";
import { track } from "../services/analytics.js";

export default function Therapist() {
  const [msgs, setMsgs] = useState([]);
  const [text, setText] = useState("");

  const load = async () => {
    const r = await api.get("/therapist/history");
    setMsgs(r.data.msgs || []);
  };

  useEffect(() => { load(); }, []);

  const send = async () => {
    const t = text.trim();
    if (!t) return;
    setText("");
    track("therapist_message", {});
    const r = await api.post("/therapist/message", { text: t });
    // reload to include saved messages
    await load();
  };

  return (
    <div>
      <div className="card">
        <div style={{ fontWeight: 800 }}>AI Therapist</div>
        <div className="small">Supportive chat. If you are in danger, use SOS immediately.</div>
      </div>

      <div className="card" style={{ minHeight: 260 }}>
        {msgs.map((m, idx) => (
          <div key={idx} style={{ marginBottom: 10 }}>
            <div className="small" style={{ fontWeight: 700 }}>{m.role.toUpperCase()}</div>
            <div>{m.text}</div>
          </div>
        ))}
      </div>

      <div className="row">
        <input className="input" value={text} onChange={(e) => setText(e.target.value)} placeholder="Type here..." />
        <button className="btn primary" onClick={send}>Send</button>
      </div>
    </div>
  );
}