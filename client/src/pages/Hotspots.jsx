// client/src/pages/Hotspots.jsx
import React, { useMemo, useState } from "react";
import { AlertTriangle, MapPin } from "lucide-react";

export default function Hotspots() {
    const [mode, setMode] = useState("nearby"); // nearby|national

    const items = useMemo(
        () => [
            { name: "CBD Corridor", level: "High", note: "Reported incidents increased (demo)." },
            { name: "Taxi Rank Zone", level: "Medium", note: "Stay alert and share location (demo)." },
            { name: "Park & Footbridge", level: "High", note: "Avoid at night (demo)." },
        ],
        []
    );

    return (
        <div className="space-y-4">
            <div className="glass rounded-3xl p-4">
                <div className="text-lg font-semibold">Hotspots</div>
                <div className="mt-1 text-sm text-white/70">
                    Demo hotspot awareness. Phase 3 adds geofencing + push alerts.
                </div>

                <div className="mt-3 flex gap-2">
                    <button
                        onClick={() => setMode("nearby")}
                        className={["px-3 py-2 rounded-2xl text-sm", mode === "nearby" ? "bg-white/12" : "bg-white/6 hover:bg-white/10"].join(" ")}
                    >
                        Nearby
                    </button>
                    <button
                        onClick={() => setMode("national")}
                        className={["px-3 py-2 rounded-2xl text-sm", mode === "national" ? "bg-white/12" : "bg-white/6 hover:bg-white/10"].join(" ")}
                    >
                        National
                    </button>
                </div>
            </div>

            <div className="space-y-3">
                {items.map((h) => (
                    <div key={h.name} className="glass rounded-3xl p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 font-semibold">
                                <MapPin size={16} className="opacity-80" /> {h.name}
                            </div>
                            <div className="flex items-center gap-1 text-xs">
                                <AlertTriangle size={14} className="opacity-80" />
                                <span className={h.level === "High" ? "text-red-300" : "text-amber-200"}>{h.level}</span>
                            </div>
                        </div>
                        <div className="mt-1 text-xs text-white/70">{h.note}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}
