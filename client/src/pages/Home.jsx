import React from "react";
import { useNavigate } from "react-router-dom";
import { IconCommunity, IconHotspots, IconRisk } from "../components/Icons";

export default function Home() {
    const nav = useNavigate();

    return (
        <div className="space-y-4">
            <div className="glass rounded-3xl p-4">
                <div className="text-sm text-white/70">DC Emergency</div>
                <div className="mt-1 text-xl font-semibold">You’re not alone.</div>
                <div className="mt-1 text-sm text-white/70">
                    Quick SOS, trusted contacts, community support, and risk guidance.
                </div>
            </div>

            {/* MAIN SOS */}
            <button
                onClick={() => nav("/sos")}
                className="w-full glass-strong rounded-3xl p-5 active:scale-[0.99] transition"
            >
                <div className="flex items-center justify-between">
                    <div className="text-left">
                        <div className="text-sm text-white/70">Emergency</div>
                        <div className="mt-1 text-xl font-bold">Send SOS</div>
                        <div className="mt-1 text-sm text-white/70">
                            Tap to share location and alert contacts (demo)
                        </div>
                    </div>

                    <div
                        className="sos-ring flex items-center justify-center"
                        style={{
                            width: 96,
                            height: 96,
                            borderRadius: 999,
                            background:
                                "radial-gradient(circle at 30% 20%, rgba(255,255,255,0.35), transparent 55%), #ff2f45",
                            border: "1px solid rgba(255,255,255,0.18)",
                        }}
                    >
                        <div className="text-center leading-none">
                            <div className="font-black text-2xl">SOS</div>
                            <div className="mt-1 text-[11px] opacity-90">Tap</div>
                        </div>
                    </div>
                </div>
            </button>

            {/* Quick actions */}
            <div className="grid grid-cols-2 gap-3">
                <button onClick={() => (window.location.href = "tel:112")} className="glass rounded-3xl p-4 text-left">
                    <div className="text-sm font-semibold">Call 112</div>
                    <div className="mt-1 text-xs text-white/70">SA emergency</div>
                </button>

                <button onClick={() => nav("/hotspots")} className="glass rounded-3xl p-4 text-left">
                    <div className="flex items-center gap-2">
                        <IconHotspots />
                        <div className="text-sm font-semibold">Hotspots</div>
                    </div>
                    <div className="mt-1 text-xs text-white/70">Nearby risk areas</div>
                </button>

                <button onClick={() => nav("/community")} className="glass rounded-3xl p-4 text-left">
                    <div className="flex items-center gap-2">
                        <IconCommunity />
                        <div className="text-sm font-semibold">Community</div>
                    </div>
                    <div className="mt-1 text-xs text-white/70">Local & national</div>
                </button>

                <button onClick={() => nav("/risk")} className="glass rounded-3xl p-4 text-left">
                    <div className="flex items-center gap-2">
                        <IconRisk />
                        <div className="text-sm font-semibold">Risk Check</div>
                    </div>
                    <div className="mt-1 text-xs text-white/70">Quick assessment</div>
                </button>
            </div>
        </div>
    );
}
