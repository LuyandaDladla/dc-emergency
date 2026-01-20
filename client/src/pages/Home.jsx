import React from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const nav = useNavigate();

  return (
    <div className="mx-auto max-w-md px-4 pb-28 pt-5">
      {/* Header */}
      <div className="mb-4">
        <div className="text-xl font-semibold text-white">Home</div>
        <div className="text-sm text-white/70">
          Quick access to safety tools and support.
        </div>
      </div>

      {/* Primary SOS */}
      <button
        type="button"
        onClick={() => nav("/sos")}
        className="w-full rounded-3xl p-4 active:scale-[0.99] transition"
        style={{
          background:
            "linear-gradient(135deg, rgba(220,38,38,0.98), rgba(127,29,29,0.98))",
          boxShadow:
            "0 14px 40px rgba(220,38,38,0.25), inset 0 0 0 1px rgba(255,255,255,0.08)",
        }}
        aria-label="Open SOS"
      >
        <div className="flex items-center justify-between">
          <div className="text-left">
            <div className="text-lg font-semibold text-white">SOS</div>
            <div className="text-sm text-white/80">
              Tap for emergency help and sharing location
            </div>
          </div>

          {/* Big round icon bubble */}
          <div
            className="grid place-items-center rounded-full"
            style={{
              width: 56,
              height: 56,
              background: "rgba(0,0,0,0.25)",
              border: "1px solid rgba(255,255,255,0.18)",
            }}
          >
            <span style={{ fontSize: 22, lineHeight: 1 }}>🚨</span>
          </div>
        </div>
      </button>

      {/* Quick actions (demo) */}
      <div className="mt-5 grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => nav("/community")}
          className="rounded-2xl p-4 text-left bg-white/5 border border-white/10 hover:bg-white/7 active:scale-[0.99] transition"
        >
          <div className="font-medium text-white">Community</div>
          <div className="mt-1 text-xs text-white/70">Stories & support</div>
        </button>

        <button
          type="button"
          onClick={() => nav("/therapist")}
          className="rounded-2xl p-4 text-left bg-white/5 border border-white/10 hover:bg-white/7 active:scale-[0.99] transition"
        >
          <div className="font-medium text-white">AI Therapist</div>
          <div className="mt-1 text-xs text-white/70">Guided help (demo)</div>
        </button>

        <button
          type="button"
          onClick={() => nav("/risk")}
          className="rounded-2xl p-4 text-left bg-white/5 border border-white/10 hover:bg-white/7 active:scale-[0.99] transition"
        >
          <div className="font-medium text-white">Risk Check</div>
          <div className="mt-1 text-xs text-white/70">Quick assessment</div>
        </button>

        <a
          href="tel:112"
          className="block rounded-2xl border border-white/10 bg-white/5 p-4 text-left transition hover:bg-white/7 active:scale-[0.99]"
        >
          <div className="font-medium text-white">Call 112</div>
          <div className="mt-1 text-xs text-white/70">SA emergency</div>
        </a>
      </div>
    </div>
  );
}
