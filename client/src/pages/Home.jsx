import React from "react";
import { useNavigate } from "react-router-dom";
import { useLiveLocation } from "../hooks/useLiveLocation";

function Card({ children, className = "" }) {
    return (
        <div className={`rounded-3xl border border-white/10 bg-black/60 backdrop-blur-xl ${className}`}>
            {children}
        </div>
    );
}

export default function Home() {
    const nav = useNavigate();
    const { status, coords, province } = useLiveLocation();

    return (
        <div className="px-4 pb-6 pt-4">
            <div className="mb-4">
                <div className="text-xl font-semibold tracking-tight">DC Emergency</div>
                <div className="mt-1 text-sm text-white/60">
                    {status === "ok"
                        ? `Location ready · ${province || "Province unknown"}`
                        : status === "denied"
                            ? "Location permission denied"
                            : "Detecting your location…"}
                </div>
                {coords && (
                    <div className="mt-1 text-xs text-white/40">
                        {coords.lat.toFixed(5)}, {coords.lng.toFixed(5)} · ±{Math.round(coords.accuracy)}m
                    </div>
                )}
            </div>

            {/* MAIN SOS */}
            <Card className="p-5">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="font-semibold text-white">Emergency SOS</div>
                        <div className="mt-1 text-sm text-white/60">
                            Sends location + province + alert (demo flow, Phase 4+ adds SMS/WhatsApp/Twilio).
                        </div>
                    </div>
                    <button
                        className="rounded-2xl border border-white/10 bg-white/10 px-3 py-2 text-sm text-white"
                        onClick={() => nav("/sos")}
                    >
                        Open
                    </button>
                </div>

                <div className="mt-5 flex justify-center">
                    <button
                        onClick={() => nav("/sos")}
                        className="w-44 h-44 rounded-full bg-red-600 text-white font-extrabold text-3xl
                       shadow-2xl shadow-red-500/30 active:scale-95 transition"
                    >
                        SOS
                    </button>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-2">
                    <button
                        onClick={() => nav("/hotspots")}
                        className="rounded-2xl bg-white/5 border border-white/10 p-3 text-left"
                    >
                        <div className="font-semibold text-white">Hotspots</div>
                        <div className="mt-1 text-xs text-white/60">Alerts when nearby</div>
                    </button>
                    <button
                        onClick={() => nav("/chat")}
                        className="rounded-2xl bg-white/5 border border-white/10 p-3 text-left"
                    >
                        <div className="font-semibold text-white">Live Chat</div>
                        <div className="mt-1 text-xs text-white/60">Support (demo)</div>
                    </button>
                    <button
                        onClick={() => nav("/community")}
                        className="rounded-2xl bg-white/5 border border-white/10 p-3 text-left"
                    >
                        <div className="font-semibold text-white">Community</div>
                        <div className="mt-1 text-xs text-white/60">Local + national</div>
                    </button>
                    <a
                        href="tel:112"
                        className="rounded-2xl border border-white/10 bg-white/5 p-3 text-left"
                    >
                        <div className="font-semibold text-white">Call 112</div>
                        <div className="mt-1 text-xs text-white/60">SA mobile emergency</div>
                    </a>
                </div>
            </Card>

            {/* INFO CARDS */}
            <div className="mt-4 grid grid-cols-1 gap-3">
                <Card className="p-4">
                    <div className="font-semibold text-white">Safety Plan</div>
                    <div className="mt-1 text-sm text-white/60">
                        Create a plan, store emergency contacts, and keep SOS always accessible.
                    </div>
                </Card>

                <Card className="p-4">
                    <div className="font-semibold text-white">Anonymous Mode</div>
                    <div className="mt-1 text-sm text-white/60">
                        Post anonymously in Community. Phase 4 adds moderation + admin tools.
                    </div>
                </Card>
            </div>
        </div>
    );
}
