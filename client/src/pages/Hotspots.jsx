import React from "react";
import { useProvince } from "../context/ProvinceContext.jsx";

export default function Hotspots() {
    const { province } = useProvince();

    return (
        <div className="p-4">
            <div className="glass rounded-3xl p-4">
                <h2 className="text-lg font-semibold">Hotspots</h2>
                <p className="mt-1 text-sm text-white/70">
                    Showing demo hotspots for <span className="text-white">{province}</span>. Alerts + geofencing will be enabled in Phase 3.
                </p>

                <div className="mt-4 space-y-3">
                    {[
                        { area: "CBD / Transport Hub", risk: "High", note: "Reported incidents (demo data)" },
                        { area: "Campus / Residence Zone", risk: "Medium", note: "Increase patrols (demo)" },
                        { area: "Taxi Rank / Night Route", risk: "High", note: "Stay in groups (demo)" },
                    ].map((h) => (
                        <div key={h.area} className="glass2 flex items-center justify-between rounded-2xl p-3">
                            <div>
                                <div className="font-medium">{h.area}</div>
                                <div className="text-xs text-white/60">{h.note}</div>
                            </div>
                            <div className="rounded-full border border-white/10 bg-white/10 px-2 py-1 text-xs">
                                {h.risk}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
