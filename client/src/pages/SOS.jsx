// client/src/pages/SOS.jsx
import React, { useEffect, useRef, useState } from "react";
import { ShieldAlert, Phone, MapPin, CheckCircle2 } from "lucide-react";

export default function SOS() {
    const [status, setStatus] = useState("idle"); // idle|sending|sent
    const [shakeEnabled, setShakeEnabled] = useState(false);
    const last = useRef({ x: 0, y: 0, z: 0, t: 0 });

    async function triggerSOS(source = "tap") {
        if (status === "sending") return;
        setStatus("sending");

        // Demo action: show a success state quickly.
        // Phase 3: POST to /api/sos/trigger with coords + contacts.
        setTimeout(() => setStatus("sent"), 900);

        // Optional: open dialer for emergencies
        // window.location.href = "tel:112";
        console.log("SOS triggered via:", source);
    }

    async function requestMotionPermissionIfNeeded() {
        // iOS requires permission prompt
        const dm = window.DeviceMotionEvent;
        // eslint-disable-next-line no-undef
        if (dm && typeof dm.requestPermission === "function") {
            const res = await dm.requestPermission();
            return res === "granted";
        }
        return true;
    }

    useEffect(() => {
        if (!shakeEnabled) return;

        let handler = async (e) => {
            const a = e.accelerationIncludingGravity;
            if (!a) return;
            const now = Date.now();
            if (now - last.current.t < 120) return;

            const dx = Math.abs((a.x || 0) - last.current.x);
            const dy = Math.abs((a.y || 0) - last.current.y);
            const dz = Math.abs((a.z || 0) - last.current.z);

            last.current = { x: a.x || 0, y: a.y || 0, z: a.z || 0, t: now };

            // threshold tuned for demo
            const magnitude = dx + dy + dz;
            if (magnitude > 20) {
                triggerSOS("shake");
            }
        };

        window.addEventListener("devicemotion", handler);
        return () => window.removeEventListener("devicemotion", handler);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [shakeEnabled]);

    return (
        <div className="space-y-4">
            <div className="glass rounded-3xl p-4">
                <div className="text-lg font-semibold">SOS</div>
                <div className="mt-1 text-sm text-white/70">
                    One-tap emergency action. Sends location + alerts (demo ready).
                </div>
            </div>

            <div className="glass flex flex-col items-center justify-center rounded-3xl p-5">
                <button
                    onClick={() => triggerSOS("tap")}
                    className="sos-giant active:scale-95 transition"
                    aria-label="Trigger SOS"
                >
                    <ShieldAlert size={34} />
                    <div className="mt-1 text-lg font-semibold">TRIGGER SOS</div>
                    <div className="text-xs opacity-85">Hold-to-confirm in Phase 3</div>
                </button>

                <div className="mt-4 w-full">
                    {status === "idle" && (
                        <div className="flex items-center gap-2 text-sm text-white/70">
                            <MapPin size={16} /> Ready to capture live location
                        </div>
                    )}
                    {status === "sending" && <div className="text-sm text-white/80">Sending alerts…</div>}
                    {status === "sent" && (
                        <div className="flex items-center gap-2 text-sm text-emerald-300">
                            <CheckCircle2 size={16} /> Alert sent (demo)
                        </div>
                    )}
                </div>
            </div>

            <div className="glass rounded-3xl p-4">
                <div className="text-sm font-semibold">Accessibility</div>
                <div className="mt-1 text-xs text-white/70">
                    Shake SOS can work in iOS PWA if motion permission is granted. Power-button triggers are not available from web apps.
                </div>

                <div className="mt-3 flex items-center justify-between">
                    <div className="text-sm">Enable Shake SOS</div>
                    <button
                        onClick={async () => {
                            const ok = await requestMotionPermissionIfNeeded();
                            if (!ok) return;
                            setShakeEnabled((v) => !v);
                        }}
                        className={[
                            "px-3 py-2 rounded-2xl text-sm transition",
                            shakeEnabled ? "bg-white/12" : "bg-white/6 hover:bg-white/10",
                        ].join(" ")}
                    >
                        {shakeEnabled ? "On" : "Off"}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <button onClick={() => (window.location.href = "tel:112")} className="glass rounded-3xl p-4 text-left">
                    <div className="flex items-center gap-2">
                        <Phone size={18} />
                        <div className="font-semibold">Call 112</div>
                    </div>
                    <div className="mt-1 text-xs text-white/70">Emergency number</div>
                </button>

                <button onClick={() => (window.location.href = "tel:10111")} className="glass rounded-3xl p-4 text-left">
                    <div className="flex items-center gap-2">
                        <Phone size={18} />
                        <div className="font-semibold">Police 10111</div>
                    </div>
                    <div className="mt-1 text-xs text-white/70">SAP Service</div>
                </button>
            </div>
        </div>
    );
}
