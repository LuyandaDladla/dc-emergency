import React, { useEffect, useMemo, useRef, useState } from "react";
import { MapPin, Siren, PhoneCall, ShieldAlert, LocateFixed, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

function cx(...classes) {
    return classes.filter(Boolean).join(" ");
}

function nowIso() {
    return new Date().toISOString();
}

function haversineMeters(a, b) {
    const R = 6371000;
    const toRad = (x) => (x * Math.PI) / 180;
    const dLat = toRad(b.lat - a.lat);
    const dLon = toRad(b.lon - a.lon);
    const lat1 = toRad(a.lat);
    const lat2 = toRad(b.lat);
    const s =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
    return 2 * R * Math.asin(Math.min(1, Math.sqrt(s)));
}

export default function SOS() {
    const nav = useNavigate();

    const [status, setStatus] = useState("idle"); // idle | locating | sending | sent | error
    const [error, setError] = useState("");
    const [coords, setCoords] = useState(null);
    const [shakeEnabled, setShakeEnabled] = useState(
        localStorage.getItem("dc_shake_sos") === "1"
    );

    // Simple "shake" detector (web demo)
    const lastAcc = useRef({ x: 0, y: 0, z: 0, t: 0 });
    const shakeCount = useRef(0);

    const province = useMemo(() => localStorage.getItem("dc_province") || "", []);
    const token = useMemo(() => localStorage.getItem("token") || "", []);

    async function fetchLocation() {
        if (!("geolocation" in navigator)) throw new Error("Geolocation not supported on this device.");
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
                (pos) => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
                (err) => reject(err),
                { enableHighAccuracy: true, timeout: 12000, maximumAge: 15000 }
            );
        });
    }

    async function sendSOS(payload) {
        const base = import.meta.env.VITE_API_BASE || "https://dc-emergency.onrender.com/api";
        const res = await fetch(base + "/sos", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: "Bearer " + token } : {}),
            },
            body: JSON.stringify(payload),
            credentials: "include",
        });

        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`);
        return data;
    }

    async function triggerSOS(source = "button") {
        setError("");
        try {
            setStatus("locating");
            const loc = await fetchLocation();
            setCoords(loc);

            const payload = {
                source,
                province: province || null,
                location: { lat: loc.lat, lon: loc.lon },
                at: nowIso(),
                message: "SOS triggered from app",
            };

            setStatus("sending");
            await sendSOS(payload);
            setStatus("sent");
        } catch (e) {
            setStatus("error");
            setError(e?.message || "Failed to send SOS");
        }
    }

    // Demo shake detection (web)
    useEffect(() => {
        localStorage.setItem("dc_shake_sos", shakeEnabled ? "1" : "0");

        if (!shakeEnabled) return;

        const onMotion = (ev) => {
            const a = ev.accelerationIncludingGravity;
            if (!a) return;

            const x = a.x || 0;
            const y = a.y || 0;
            const z = a.z || 0;
            const t = Date.now();

            const prev = lastAcc.current;
            const dt = t - prev.t || 16;

            // crude magnitude delta
            const dx = x - prev.x;
            const dy = y - prev.y;
            const dz = z - prev.z;
            const mag = Math.sqrt(dx * dx + dy * dy + dz * dz);

            lastAcc.current = { x, y, z, t };

            // threshold tuned for demo
            if (mag > 12) {
                // prevent spam
                if (dt < 50) return;
                shakeCount.current += 1;

                // 2 strong shakes within short time triggers SOS
                if (shakeCount.current >= 2) {
                    shakeCount.current = 0;
                    triggerSOS("shake");
                }

                // reset count after 1.2s
                setTimeout(() => {
                    shakeCount.current = 0;
                }, 1200);
            }
        };

        // iOS 13+ requires user gesture + permission for motion sensors in Safari
        window.addEventListener("devicemotion", onMotion);
        return () => window.removeEventListener("devicemotion", onMotion);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [shakeEnabled]);

    const bigBtnLabel =
        status === "sending" ? "Sending…" :
            status === "locating" ? "Locating…" :
                status === "sent" ? "Sent" :
                    "HOLD TO SEND";

    const bigBtnHint =
        status === "sent"
            ? "Your SOS request was sent."
            : "Press & hold for 1 second to avoid accidental triggers.";

    // Long-press handling
    const holdTimer = useRef(null);

    function onHoldStart() {
        if (status === "sending" || status === "locating") return;
        holdTimer.current = setTimeout(() => triggerSOS("hold_button"), 900);
    }
    function onHoldEnd() {
        if (holdTimer.current) clearTimeout(holdTimer.current);
        holdTimer.current = null;
    }

    return (
        <div className="pt-6">
            <div className="rounded-2xl border border-white/10 bg-white/6 p-5 shadow-2xl shadow-black/40 backdrop-blur-2xl">
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <div className="text-2xl font-semibold">SOS</div>
                        <div className="mt-1 text-sm text-white/70">
                            Emergency signal • live location • rapid actions
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => nav("/")}
                        className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm hover:bg-black/40 transition"
                    >
                        Back
                    </button>
                </div>

                {/* Big main button */}
                <div className="mt-6 flex flex-col items-center">
                    <div
                        className={cx(
                            "relative",
                            "h-56 w-56 rounded-full",
                            "border border-red-300/25 bg-red-500/20",
                            "backdrop-blur-2xl shadow-2xl shadow-black/60",
                            "flex items-center justify-center",
                            status === "sent" ? "ring-2 ring-emerald-300/40" : "ring-2 ring-red-300/20"
                        )}
                    >
                        <button
                            type="button"
                            onMouseDown={onHoldStart}
                            onMouseUp={onHoldEnd}
                            onMouseLeave={onHoldEnd}
                            onTouchStart={onHoldStart}
                            onTouchEnd={onHoldEnd}
                            className={cx(
                                "h-44 w-44 rounded-full",
                                "border border-red-200/25 bg-red-500/25",
                                "backdrop-blur-2xl",
                                "flex flex-col items-center justify-center",
                                "active:scale-[0.99] transition"
                            )}
                            aria-label="Hold to send SOS"
                        >
                            <Siren size={42} className="text-red-50" />
                            <div className="mt-2 text-sm font-semibold tracking-wide">{bigBtnLabel}</div>
                            <div className="mt-1 px-4 text-center text-[11px] text-white/70">{bigBtnHint}</div>
                        </button>

                        {(status === "locating" || status === "sending") && (
                            <div className="-translate-x-1/2 absolute bottom-4 left-1/2 flex items-center gap-2 text-xs text-white/80">
                                <Loader2 className="animate-spin" size={14} />
                                Working…
                            </div>
                        )}
                    </div>

                    {error && (
                        <div className="mt-4 w-full rounded-xl border border-red-300/20 bg-red-500/10 p-3 text-sm text-red-50">
                            <div className="font-semibold">Couldn’t send SOS</div>
                            <div className="mt-1 text-white/80">{error}</div>
                        </div>
                    )}

                    {/* Location preview */}
                    <div className="mt-4 w-full rounded-xl border border-white/10 bg-black/25 p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm font-semibold">
                                <MapPin size={16} className="text-white/80" />
                                Live location
                            </div>
                            <button
                                type="button"
                                onClick={async () => {
                                    setError("");
                                    try {
                                        setStatus("locating");
                                        const loc = await fetchLocation();
                                        setCoords(loc);
                                        setStatus("idle");
                                    } catch (e) {
                                        setStatus("error");
                                        setError(e?.message || "Location failed");
                                    }
                                }}
                                className="rounded-lg border border-white/10 bg-white/6 px-3 py-1.5 text-xs hover:bg-white/10 transition"
                            >
                                <span className="inline-flex items-center gap-1">
                                    <LocateFixed size={14} /> Refresh
                                </span>
                            </button>
                        </div>

                        <div className="mt-2 text-xs text-white/70">
                            {coords ? (
                                <>
                                    Lat {coords.lat.toFixed(6)}, Lon {coords.lon.toFixed(6)}
                                    {province ? <span className="ml-2 text-white/60">• {province}</span> : null}
                                </>
                            ) : (
                                "Not captured yet — press Refresh or send SOS."
                            )}
                        </div>
                    </div>

                    {/* Quick actions */}
                    <div className="mt-4 grid w-full grid-cols-2 gap-3">
                        <a
                            href="tel:112"
                            className="rounded-xl border border-white/10 bg-black/25 p-4 transition hover:bg-black/35"
                        >
                            <div className="flex items-center gap-2">
                                <PhoneCall size={18} className="text-white/80" />
                                <div className="font-semibold">Call 112</div>
                            </div>
                            <div className="mt-1 text-xs text-white/70">SA emergency (mobile)</div>
                        </a>

                        <a
                            href="tel:10111"
                            className="rounded-xl border border-white/10 bg-black/25 p-4 transition hover:bg-black/35"
                        >
                            <div className="flex items-center gap-2">
                                <ShieldAlert size={18} className="text-white/80" />
                                <div className="font-semibold">Call 10111</div>
                            </div>
                            <div className="mt-1 text-xs text-white/70">Police (SA)</div>
                        </a>
                    </div>

                    {/* Accessibility controls (demo) */}
                    <div className="mt-4 w-full rounded-2xl border border-white/10 bg-white/6 p-5 shadow-2xl shadow-black/40 backdrop-blur-2xl">
                        <div className="text-base font-semibold">Accessibility</div>
                        <div className="mt-1 text-sm text-white/70">
                            Investors/NGOs demo: hands-free triggering options.
                        </div>

                        <div className="mt-4 flex items-start justify-between gap-3">
                            <div>
                                <div className="text-sm font-semibold">Shake to trigger (web demo)</div>
                                <div className="mt-1 text-xs text-white/70">
                                    If supported, two strong shakes triggers SOS.
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShakeEnabled((v) => !v)}
                                className={cx(
                                    "rounded-xl px-3 py-2 text-sm font-semibold border",
                                    shakeEnabled
                                        ? "border-emerald-300/20 bg-emerald-500/15 text-emerald-50"
                                        : "border-white/10 bg-white/6 text-white/80 hover:bg-white/10"
                                )}
                            >
                                {shakeEnabled ? "Enabled" : "Enable"}
                            </button>
                        </div>

                        <div className="mt-4 rounded-xl border border-white/10 bg-black/25 p-4 text-xs text-white/70">
                            <div className="font-semibold text-white/80">Power button triple-press</div>
                            <div className="mt-1">
                                On iPhone/Android, triple-press power is handled by the OS for SOS/Emergency features.
                                For a real app, we implement this via native wrappers (React Native / Capacitor) and
                                platform integrations where allowed. For the web demo, we show shake + big SOS + quick-dial.
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Demo: Nearby authorities / hotspots placeholders */}
            <div className="mt-4 rounded-2xl border border-white/10 bg-white/6 p-5 shadow-2xl shadow-black/40 backdrop-blur-2xl">
                <div className="text-base font-semibold">Nearby & Hotspots (Next)</div>
                <div className="mt-1 text-sm text-white/70">
                    Next we’ll add: nearby authority contacts + hotspot alerts when entering high-risk zones.
                </div>

                <div className="mt-4 grid grid-cols-1 gap-2">
                    <div className="rounded-xl border border-white/10 bg-black/25 p-4 text-sm text-white/70">
                        • Nearby police station / clinic suggestions (location-based)
                    </div>
                    <div className="rounded-xl border border-white/10 bg-black/25 p-4 text-sm text-white/70">
                        • Hotspot banner + notification (demo dataset per province)
                    </div>
                </div>
            </div>
        </div>
    );
}
