import React, { useMemo, useState } from "react";
import { tryPost } from "../services/api";

export default function SOS() {
    const [busy, setBusy] = useState(false);
    const [msg, setMsg] = useState("");

    const contacts = useMemo(
        () => [
            { label: "Police (10111)", href: "tel:10111" },
            { label: "Ambulance (10177)", href: "tel:10177" },
            { label: "Emergency (112)", href: "tel:112" }
        ],
        []
    );

    async function triggerSOS() {
        setMsg("");
        setBusy(true);
        try {
            const payload = {
                type: "panic",
                message: "SOS triggered (demo)",
                location: null
            };

            // try to attach location (best-effort)
            await new Promise((resolve) => {
                if (!navigator.geolocation) return resolve();
                navigator.geolocation.getCurrentPosition(
                    (pos) => {
                        payload.location = {
                            lat: pos.coords.latitude,
                            lng: pos.coords.longitude,
                            accuracy: pos.coords.accuracy
                        };
                        resolve();
                    },
                    () => resolve(),
                    { enableHighAccuracy: true, timeout: 5000 }
                );
            });

            await tryPost("/sos", payload);
            setMsg("✅ SOS sent (demo).");
        } catch (e) {
            setMsg(e?.message || "Failed to send SOS");
        } finally {
            setBusy(false);
        }
    }

    return (
        <div className="min-h-screen bg-black px-4 pb-28 pt-6 text-white">
            <h1 className="text-xl font-semibold">SOS</h1>
            <p className="mt-1 text-sm text-white/70">
                Press the button to send an emergency alert (demo).
            </p>

            <div className="mt-6 flex items-center justify-center">
                <button
                    onClick={triggerSOS}
                    disabled={busy}
                    className="h-56 w-56 rounded-full border border-white/15 bg-red-500/90 shadow-[0_0_60px_rgba(239,68,68,.35)] transition active:scale-[0.98] disabled:opacity-60"
                >
                    <div className="flex flex-col items-center justify-center">
                        <div className="font-black text-4xl tracking-wider">SOS</div>
                        <div className="mt-2 text-sm text-white/90">
                            {busy ? "Sending..." : "Tap to alert"}
                        </div>
                    </div>
                </button>
            </div>

            {msg ? (
                <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm backdrop-blur-xl">
                    {msg}
                </div>
            ) : null}

            <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
                <div className="font-semibold">Quick dial</div>
                <div className="mt-3 space-y-2">
                    {contacts.map((c) => (
                        <a
                            key={c.href}
                            href={c.href}
                            className="block w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3"
                        >
                            {c.label}
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
}
