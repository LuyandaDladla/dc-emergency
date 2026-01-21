import React, { useEffect, useMemo, useState } from "react";
import { tryGet, tryPost } from "../services/api";
import { useLiveLocation } from "../hooks/useLiveLocation";

function distMeters(a, b) {
    const R = 6371000;
    const dLat = ((b.lat - a.lat) * Math.PI) / 180;
    const dLng = ((b.lng - a.lng) * Math.PI) / 180;
    const sa = Math.sin(dLat / 2) ** 2 +
        Math.cos((a.lat * Math.PI) / 180) * Math.cos((b.lat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(sa));
}

export default function Hotspots() {
    const [hotspots, setHotspots] = useState([]);
    const [loading, setLoading] = useState(true);
    const { coords, province } = useLiveLocation();

    async function load() {
        setLoading(true);
        try {
            const res = await tryGet("/hotspots");
            setHotspots(res?.hotspots || []);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => { load(); }, []);

    const nearby = useMemo(() => {
        if (!coords) return [];
        return hotspots
            .map((h) => ({
                ...h,
                distance: distMeters(coords, { lat: h.lat, lng: h.lng }),
            }))
            .filter((h) => h.distance <= (h.radiusMeters || 500))
            .sort((a, b) => a.distance - b.distance);
    }, [coords, hotspots]);

    return (
        <div className="px-4 pb-24 pt-4">
            <div className="rounded-3xl border border-white/10 bg-black/70 p-4 backdrop-blur-xl">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="text-lg font-semibold text-white">Hotspots</div>
                        <div className="text-sm text-white/60">
                            {province ? `Detected province: ${province}` : "Detecting province…"}
                        </div>
                    </div>
                    <button
                        className="rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-sm text-white"
                        onClick={load}
                    >
                        Refresh
                    </button>
                </div>

                {nearby.length > 0 && (
                    <div className="mt-4 rounded-2xl border border-red-500/30 bg-red-500/10 p-3">
                        <div className="font-semibold text-red-200">Nearby alert</div>
                        <div className="text-sm text-red-200/80">
                            You are inside {nearby.length} hotspot zone(s).
                        </div>
                    </div>
                )}

                <div className="mt-4 flex gap-2">
                    <button
                        className="flex-1 rounded-2xl bg-white px-3 py-3 font-semibold text-black"
                        onClick={async () => {
                            await tryPost("/hotspots/seed", {});
                            await load();
                        }}
                    >
                        Seed demo hotspots
                    </button>
                </div>
            </div>

            <div className="mt-4 space-y-3">
                {loading && (
                    <div className="text-sm text-white/60">Loading…</div>
                )}
                {!loading && hotspots.length === 0 && (
                    <div className="text-sm text-white/60">No hotspots yet. Tap “Seed demo hotspots”.</div>
                )}

                {hotspots.map((h) => (
                    <div key={h._id} className="rounded-3xl border border-white/10 bg-black/60 p-4 backdrop-blur-xl">
                        <div className="flex items-center justify-between">
                            <div className="font-semibold text-white">{h.name}</div>
                            <div className="text-xs text-white/60">{h.province || "—"}</div>
                        </div>
                        <div className="mt-1 text-sm text-white/60">
                            Radius: {h.radiusMeters || 500}m · Risk: {h.riskLevel}
                        </div>
                        {coords && (
                            <div className="mt-1 text-xs text-white/50">
                                Distance approx: {Math.round(distMeters(coords, { lat: h.lat, lng: h.lng }))}m
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
