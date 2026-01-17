import React, { useState } from "react";
import api from "../services/api";

function Card({ children }) {
  return <div className="rounded-2xl bg-white/5 border border-white/10">{children}</div>;
}

export default function Therapist() {
  const [message, setMessage] = useState("");
  const [log, setLog] = useState([{ role:"assistant", text:"I am here with you. Tell me what is happening." }]);
  const [busy, setBusy] = useState(false);

  async function send() {
    if (!message.trim()) return;
    const m = message.trim();
    setMessage("");
    setLog(prev => [...prev, { role:"user", text:m }]);
    setBusy(true);
    try {
      const res = await api.post("/therapist/message", { message: m });
      setLog(prev => [...prev, { role:"assistant", text: res.data?.reply || "..." }]);
    } catch (e) {
      setLog(prev => [...prev, { role:"assistant", text:"Therapist is unavailable right now." }]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
      <div className="lg:col-span-3">
        <Card>
          <div className="p-5 flex flex-col h-[70vh]">
            <div className="text-sm text-white/70">Chat</div>
            <div className="mt-3 flex-1 overflow-auto space-y-3 pr-2">
              {log.map((m, idx) => (
                <div key={idx} className={m.role==="user" ? "flex justify-end" : "flex justify-start"}>
                  <div className={(m.role==="user" ? "bg-white text-black" : "bg-white/5 text-white") + " max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed border border-white/10"}>
                    {m.text}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 flex gap-2">
              <input
                value={message}
                onChange={(e)=>setMessage(e.target.value)}
                placeholder="Type here..."
                className="flex-1 bg-black/30 border border-white/10 rounded-xl px-3 py-3"
              />
              <button
                onClick={send}
                disabled={busy}
                className="rounded-xl bg-white text-black font-semibold px-5"
              >
                Send
              </button>
            </div>

            <div className="mt-3 text-xs text-white/50">
              If you are in immediate danger, call 10111 or 112.
            </div>
          </div>
        </Card>
      </div>

      <div className="lg:col-span-2 space-y-4">
        <Card>
          <div className="p-5">
            <div className="font-semibold">Grounding</div>
            <div className="mt-2 text-sm text-white/70">
              Breathe in 4 seconds, hold 4, out 6. Repeat 5 times.
            </div>
          </div>
        </Card>
        <Card>
          <div className="p-5">
            <div className="font-semibold">Quick help</div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <a href="tel:10111" className="rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-center hover:bg-white/10">Police</a>
              <a href="tel:112" className="rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-center hover:bg-white/10">112</a>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}