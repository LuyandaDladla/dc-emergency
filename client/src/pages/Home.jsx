import React from "react";

export default function Home() {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
        <h2 className="text-xl font-semibold">Dashboard</h2>
        <p className="text-white/60 mt-2">
          Use the center <span className="font-semibold text-white">SOS</span> tab anytime. Community and Risk tools are below.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
          <div className="text-sm text-white/60">Community</div>
          <div className="text-lg font-semibold mt-1">Province updates</div>
          <p className="text-white/55 mt-2 text-sm">
            View posts and alerts per province (like a feed).
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
          <div className="text-sm text-white/60">Risk</div>
          <div className="text-lg font-semibold mt-1">Quick assessment</div>
          <p className="text-white/55 mt-2 text-sm">
            A cleaner assessment UI (no tacky sliders) â€” step-by-step questions.
          </p>
        </div>
      </div>
    </div>
  );
}