import React, { useMemo } from "react";
import { useProvince } from "../context/ProvinceContext";

function demoHotspotsForProvince(name = "") {
    // Demo hotspots � replace with real analytics later
    const base = [
        { area: "CBD / Taxi rank", risk: "High", note: "Higher reports after 18:00" },
        { area: "Transport hub", risk: "Medium", note: "Stay in lit areas" },
        { area: "Park / isolated route", risk: "Medium", note: "Avoid walking alone" }
    ];
    return base.map((x) => ({ ...x, province: name }));
}

export default function Hotspots() {
    const { province, coords } = useProvince();
    const items = useMemo(() => demoHotspotsForProvince(province?.name), [province]);

    return (
        <div>
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-semibold">Hotspots</h1>
                <div className="text-xs text-white/70">{province?.name}</div>
            </div>

            <div className="mt-4 rounded-3xl border border-white/10 bg-red-500/10 p-4 backdrop-blur-2xl">
                <div className="font-semibold text-red-200">Awareness</div>
                <div className="mt-1 text-sm text-white/80">
                    Demo hotspots are sample data. Next phase uses live reports + analytics.
                </div>
                {coords ? (
                    <div className="mt-2 text-xs text-white/60">
                        Current location: {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)} (�{Math.round(coords.accuracy)}m)
                    </div>
                ) : null}
            </div>

            <div className="mt-4 space-y-2">
                {items.map((h, i) => (
                    <div key={i} className="rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur-2xl">
                        <div className="flex items-center justify-between">
                            <div className="font-semibold">{h.area}</div>
                            <span
                                className={[
                                    "text-xs px-2 py-1 rounded-lg border",
                                    h.risk === "High"
                                        ? "border-red-500/30 bg-red-500/15 text-red-200"
                                        : "border-yellow-500/30 bg-yellow-500/15 text-yellow-200"
                                ].join(" ")}
                            >
                                {h.risk} risk
                            </span>
                        </div>
                        <div className="mt-1 text-sm text-white/80">{h.note}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}
