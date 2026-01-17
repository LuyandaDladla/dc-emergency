import React, { useEffect, useState } from "react";
import api from "../services/api";

export default function Community() {
  const [province, setProvince] = useState("Gauteng");
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    (async () => {
      try {
        setStatus("loading");
        // If your backend has /hotspots/stories, use it; otherwise this will show empty but not crash.
        const res = await api.get("/hotspots/stories", { params: { province } });
        setItems(Array.isArray(res.data) ? res.data : (res.data?.items || []));
        setStatus("ok");
      } catch {
        setItems([]);
        setStatus("empty");
      }
    })();
  }, [province]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xl font-semibold">Community</h2>
        <select
          value={province}
          onChange={(e) => setProvince(e.target.value)}
          className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm"
        >
          {["Gauteng","KwaZulu-Natal","Western Cape","Eastern Cape","Free State","Limpopo","Mpumalanga","North West","Northern Cape"].map(p => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
        <div className="text-sm text-white/60">Feed</div>
        <div className="text-white/50 text-sm mt-2">
          {status === "loading" && "Loading stories..."}
          {status !== "loading" && items.length === 0 && "No stories yet for this province."}
        </div>

        <div className="mt-4 space-y-3">
          {items.map((it, idx) => (
            <div key={idx} className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="font-semibold">{it.title || "Update"}</div>
              <div className="text-sm text-white/60 mt-1">{it.body || it.text || "..."}</div>
              <div className="text-xs text-white/40 mt-2">{it.createdAt ? new Date(it.createdAt).toLocaleString() : ""}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}