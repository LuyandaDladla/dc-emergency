import React, { useMemo, useState } from "react";
import api from "../services/api";

function Card({ children }) {
  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 shadow-sm">
      {children}
    </div>
  );
}

export default function SOSHero() {
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");

  const now = useMemo(() => new Date().toLocaleString(), []);

  async function sendSOS() {
    setBusy(true);
    setStatus("Getting location...");
    try {
      const pos = await new Promise((resolve, reject) => {
        if (!navigator.geolocation) return reject(new Error("Geolocation not supported"));
        navigator.geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: true, timeout: 15000 });
      });

      const payload = {
        location: { lat: pos.coords.latitude, lng: pos.coords.longitude },
        createdAt: new Date().toISOString()
      };

      setStatus("Sending SOS...");
      // If your backend has /api/sos later, switch to that.
      // For deploy-today, track it as analytics event so button works.
      await api.post("/analytics/track", { event: "sos_clicked", props: payload });

      setStatus("SOS recorded. If in danger, call 10111 (police) or 112 (mobile).");
    } catch (e) {
      setStatus("Could not send SOS: " + (e?.message || e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
      <div className="lg:col-span-3">
        <Card>
          <div className="p-5">
            <div className="flex items-center justify-between">
              <div className="text-white/80 text-sm">Main emergency feature</div>
              <div className="text-white/50 text-xs">{now}</div>
            </div>

            <div className="mt-6 flex items-center justify-center">
              <button
                onClick={sendSOS}
                disabled={busy}
                className="
                  w-44 h-44 md:w-56 md:h-56 rounded-full
                  bg-red-600 hover:bg-red-500 active:bg-red-700
                  shadow-[0_20px_60px_rgba(239,68,68,0.30)]
                  border border-white/10
                  flex flex-col items-center justify-center
                  select-none
                "
              >
                <div className="text-4xl font-black tracking-tight">SOS</div>
                <div className="text-xs text-white/80 mt-2">Press and hold if possible</div>
              </button>
            </div>

            <div className="mt-6 text-center text-sm text-white/70">
              {status || "Press SOS to log your location and trigger emergency flow."}
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <a
                href="tel:10111"
                className="rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-center hover:bg-white/10"
              >
                Call Police (10111)
              </a>
              <a
                href="tel:112"
                className="rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-center hover:bg-white/10"
              >
                Call Emergency (112)
              </a>
            </div>
          </div>
        </Card>
      </div>

      <div className="lg:col-span-2 space-y-4">
        <Card>
          <div className="p-5">
            <div className="font-semibold">Quick actions</div>
            <div className="mt-3 text-sm text-white/70">
              These will be fully wired to your contacts, messages, and province directory next.
            </div>
            <div className="mt-4 grid gap-2">
              <button className="rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-left hover:bg-white/10">
                Add emergency contacts
              </button>
              <button className="rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-left hover:bg-white/10">
                View province numbers
              </button>
              <button className="rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-left hover:bg-white/10">
                Share live location link
              </button>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-5">
            <div className="font-semibold">Safety tip</div>
            <div className="mt-3 text-sm text-white/70">
              If you can, move to a safer, brighter area and call a trusted person immediately.
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}