import React, { useEffect, useRef, useState } from "react";
import api from "../services/api";

async function getGeo() {
    return new Promise((resolve) => {
        if (!navigator.geolocation) return resolve(null);
        navigator.geolocation.getCurrentPosition(
            (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
            () => resolve(null),
            { enableHighAccuracy: true, timeout: 8000 }
        );
    });
}

function useShake(enabled, onShake) {
    const last = useRef(0);

    useEffect(() => {
        if (!enabled) return;

        let mounted = true;

        async function enable() {
            try {
                if (
                    typeof DeviceMotionEvent !== "undefined" &&
                    typeof DeviceMotionEvent.requestPermission === "function"
                ) {
                    const res = await DeviceMotionEvent.requestPermission();
                    if (res !== "granted") return;
                }

                const handler = (e) => {
                    if (!mounted) return;
                    const acc = e.accelerationIncludingGravity;
                    if (!acc) return;

                    const x = acc.x || 0;
                    const y = acc.y || 0;
                    const z = acc.z || 0;

                    const mag = Math.sqrt(x * x + y * y + z * z);
                    const now = Date.now();

                    if (mag > 22 && now - last.current > 2500) {
                        last.current = now;
                        onShake();
                    }
                };

                window.addEventListener("devicemotion", handler, { passive: true });
                return () => window.removeEventListener("devicemotion", handler);
            } catch {
                // ignore
            }
        }

        let cleanup;
        enable().then((c) => (cleanup = c));

        return () => {
            mounted = false;
            if (cleanup) cleanup();
        };
    }, [enabled, onShake]);
}

export default function SOS() {
    const [sending, setSending] = useState(false);
    const [status, setStatus] = useState(null);
    const [shakeEnabled, setShakeEnabled] = useState(false);

    const sendSOS = async (source = "button") => {
        if (sending) return;
        setSending(true);
        setStatus({ type: "info", text: "Sending SOS…" });

        try {
            const location = await getGeo();
            const payload = {
                location: location || { lat: "", lng: "" },
                note: `SOS triggered (${source})`,
            };

            const res = await api.post("/sos", payload);
            setStatus({
                type: "ok",
                text: res?.message || "SOS sent (demo).",
            });
        } catch (e) {
            setStatus({ type: "err", text: e?.message || "Failed to send SOS" });
        } finally {
            setSending(false);
        }
    };

    useShake(shakeEnabled, () => sendSOS("shake"));

    const badge =
        status?.type === "ok"
            ? "bg-emerald-500/15 text-emerald-200 border-emerald-500/30"
            : status?.type === "err"
                ? "bg-red-500/15 text-red-200 border-red-500/30"
                : "bg-white/5 text-white/70 border-white/10";

    return (
        <div className="min-h-[calc(100vh-140px)] flex items-center justify-center">
            <div className="w-full max-w-md space-y-6 text-center">
                <h1 className="font-black text-2xl tracking-tight">Emergency SOS</h1>
                <p className="text-white/70">
                    Tap to alert emergency contacts and send your location.
                </p>

                <button
                    onClick={() => sendSOS("button")}
                    disabled={sending}
                    className="w-[18rem] h-[18rem] rounded-full bg-red-600 hover:bg-red-500 disabled:opacity-60 active:scale-95 transition font-extrabold text-6xl shadow-2xl shadow-red-600/40 mx-auto block"
                >
                    {sending ? "…" : "SOS"}
                </button>

                <div className="flex items-center justify-center gap-2">
                    <input
                        id="shake"
                        type="checkbox"
                        checked={shakeEnabled}
                        onChange={(e) => setShakeEnabled(e.target.checked)}
                    />
                    <label htmlFor="shake" className="text-sm text-white/70">
                        Enable shake-to-trigger (demo)
                    </label>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <a
                        className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl transition hover:bg-white/10"
                        href="tel:112"
                    >
                        <div className="font-bold">Call 112</div>
                        <div className="mt-1 text-xs text-white/60">SA mobile emergency</div>
                    </a>

                    <a
                        className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl transition hover:bg-white/10"
                        href="tel:10111"
                    >
                        <div className="font-bold">Call 10111</div>
                        <div className="mt-1 text-xs text-white/60">Police</div>
                    </a>
                </div>

                {status && (
                    <div className={"mx-auto max-w-md border rounded-2xl px-4 py-3 text-sm " + badge}>
                        {status.text}
                    </div>
                )}

                <div className="space-y-1 text-xs text-white/50">
                    <div>Hardware power-button triple press is not possible in web/PWA.</div>
                    <div>For native iOS/Android we can add real triggers later.</div>
                </div>
            </div>
        </div>
    );
}
