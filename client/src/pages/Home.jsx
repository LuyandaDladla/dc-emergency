import React, { useEffect, useMemo, useState } from "react";
import api from "../services/api";

function getStoredContacts() {
  try {
    const raw = localStorage.getItem("dc_contacts");
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

export default function Home() {
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState(null); // {type:'ok'|'err'|'info', text:string}
  const contacts = useMemo(() => getStoredContacts(), []);

  async function getBrowserLocation() {
    return new Promise((resolve) => {
      if (!navigator.geolocation) return resolve(null);
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => resolve(null),
        { enableHighAccuracy: true, timeout: 8000 }
      );
    });
  }

  const sendSOS = async () => {
    setSending(true);
    setStatus({ type: "info", text: "Sending SOS..." });

    try {
      const location = await getBrowserLocation();

      const payload = {
        location: location || { lat: "", lng: "" },
        contacts,
        note: "SOS button pressed from app",
      };

      const res = await api.post("/sos", payload);
      const msg = res?.data?.message || "SOS sent";

      if (res?.data?.received?.hasLocation) {
        setStatus({ type: "ok", text: msg + " (Location attached)" });
      } else {
        setStatus({ type: "ok", text: msg + " (No GPS â€” allow location permissions)" });
      }
    } catch (e) {
      const serverMsg =
        e?.response?.data?.message ||
        e?.message ||
        "Failed to send SOS";
      setStatus({ type: "err", text: serverMsg });
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    // Helpful hint on first load
    if (!contacts.length) {
      setStatus({ type: "info", text: "Tip: Add emergency contacts in Profile so SOS can notify them." });
    }
  }, [contacts.length]);

  const badgeClass =
    status?.type === "ok"
      ? "bg-emerald-500/15 text-emerald-200 border-emerald-500/30"
      : status?.type === "err"
      ? "bg-red-500/15 text-red-200 border-red-500/30"
      : "bg-white/5 text-white/70 border-white/10";

  return (
    <div className="min-h-[calc(100vh-72px)] flex items-center justify-center p-6">
      <div className="w-full max-w-md text-center space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">DC Emergency</h1>
          <p className="text-white/60 mt-2">Press SOS to send your location + alert your emergency contacts.</p>
        </div>

        <button
          onClick={sendSOS}
          disabled={sending}
          className="w-56 h-56 rounded-full bg-red-600 hover:bg-red-500 disabled:opacity-60 active:scale-95 transition font-extrabold text-5xl shadow-2xl shadow-red-600/40 mx-auto block select-none"
          aria-label="Send SOS"
        >
          {sending ? "..." : "SOS"}
        </button>

        {status && (
          <div className={"mx-auto max-w-md border rounded-2xl px-4 py-3 text-sm " + badgeClass}>
            {status.text}
          </div>
        )}

        <div className="text-xs text-white/40">
          If SOS says â€œNo GPSâ€, allow location permission in your browser settings, then retry.
        </div>
      </div>
    </div>
  );
}