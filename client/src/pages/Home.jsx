import React from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
    const nav = useNavigate();

    return (
        <div className="mx-auto max-w-md space-y-5">
            {/* Header */}
            <div className="dc-glass dc-card p-5">
                <div className="text-[13px] text-white/60">DC Emergency</div>
                <div className="mt-1 text-2xl font-semibold tracking-tight">Home</div>
                <div className="mt-1 text-sm text-white/70">
                    Quick access to safety tools and support.
                </div>
            </div>

            {/* BIG SOS BUTTON (Home main feature) */}
            <button
                type="button"
                onClick={() => nav("/sos")}
                className="w-full dc-press"
                aria-label="Open SOS"
            >
                <div
                    className="dc-card p-5"
                    style={{
                        background:
                            "linear-gradient(135deg, rgba(255,59,48,0.95), rgba(138,18,18,0.95))",
                        boxShadow:
                            "0 22px 65px rgba(255,59,48,0.24), inset 0 0 0 1px rgba(255,255,255,0.14)",
                    }}
                >
                    <div className="flex items-center justify-between">
                        <div className="text-left">
                            <div className="text-xl font-extrabold tracking-tight">SOS</div>
                            <div className="mt-1 text-sm text-white/90">
                                Tap to alert + share your location
                            </div>
                            <div className="mt-2 text-xs text-white/80">
                                Always available via the floating button too.
                            </div>
                        </div>

                        <div
                            className="grid place-items-center rounded-full"
                            style={{
                                width: 74,
                                height: 74,
                                background: "rgba(0,0,0,0.22)",
                                border: "1px solid rgba(255,255,255,0.20)",
                            }}
                        >
                            <span style={{ fontSize: 26, lineHeight: 1 }}>🚨</span>
                        </div>
                    </div>
                </div>
            </button>

            {/* Quick actions */}
            <div className="grid grid-cols-2 gap-3">
                <button
                    type="button"
                    onClick={() => nav("/community")}
                    className="dc-glass-soft dc-card p-4 text-left dc-press"
                >
                    <div className="font-semibold">Community</div>
                    <div className="mt-1 text-xs text-white/70">Stories & support</div>
                </button>

                <button
                    type="button"
                    onClick={() => nav("/therapist")}
                    className="dc-glass-soft dc-card p-4 text-left dc-press"
                >
                    <div className="font-semibold">AI Therapist</div>
                    <div className="mt-1 text-xs text-white/70">Guided help</div>
                </button>

                <button
                    type="button"
                    onClick={() => nav("/risk")}
                    className="dc-glass-soft dc-card p-4 text-left dc-press"
                >
                    <div className="font-semibold">Risk Check</div>
                    <div className="mt-1 text-xs text-white/70">Quick assessment</div>
                </button>

                <a
                    href="tel:112"
                    className="dc-glass-soft dc-card dc-press block p-4 text-left"
                >
                    <div className="font-semibold">Call 112</div>
                    <div className="mt-1 text-xs text-white/70">SA emergency</div>
                </a>
            </div>
        </div>
    );
}
