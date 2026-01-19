import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

async function getGeo() {
    return new Promise((resolve) => {
        if (!navigator.geolocation) return resolve(null);
        navigator.geolocation.getCurrentPosition(
            (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
            () => resolve(null),
            { enableHighAccuracy: true, timeout: 8000 }
        );
    });
}

export default function Home() {
    const nav = useNavigate();
    const [loc, setLoc] = useState(null);
    const [locStatus, setLocStatus] = useState("idle"); // idle | ok | denied

    useEffect(() => {
        (async () => {
            setLocStatus("idle");
            const got = await getGeo();
            if (got) {
                setLoc(got);
                setLocStatus("ok");
            } else {
                setLocStatus("denied");
            }
        })();
    }, []);

    const sub = useMemo(() => {
        if (locStatus === "ok" && loc)
            return `Auto location: ${loc.lat.toFixed(4)}, ${loc.lng.toFixed(4)} (Province: Auto — demo)`;
        if (locStatus === "denied")
            return "Location not available (allow permission for auto province + hotspots).";
        return "Detecting location…";
    }, [locStatus, loc]);

    return (
        <div className="space-y-6">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
                <h2 className="font-black text-xl tracking-tight">DC Emergency</h2>
                <p className="mt-1 text-sm text-white/70">{sub}</p>
            </div>

            {/* BIG SOS primary feature */}
            <div className="rounded-3xl border border-red-500/30 bg-red-500/10 p-5 backdrop-blur-xl">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <div className="text-sm text-white/70">Main feature</div>
                        <div className="font-black mt-1 text-2xl">Emergency SOS</div>
                        <p className="mt-2 text-sm text-white/70">
                            Sends location, notifies emergency contacts, and logs the incident.
                        </p>
                    </div>

                    <button
                        onClick={() => nav("/sos")}
                        className="shrink-0 w-28 h-28 rounded-full bg-red-600 hover:bg-red-500 active:scale-95 transition shadow-2xl shadow-red-600/40 text-3xl font-black"
                    >
                        SOS
                    </button>
                </div>
            </div>

            {/* Quick actions */}
            <div className="grid gap-4 md:grid-cols-2">
                <button
                    onClick={() => nav("/community")}
                    className="text-left rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-5 hover:bg-white/10 active:scale-[0.99] transition"
                >
                    <div className="text-sm text-white/60">Community</div>
                    <div className="mt-1 text-lg font-bold">Local feed + live chat (demo)</div>
                    <p className="mt-2 text-sm text-white/60">
                        Hotspots + NGO alerts + moderated chat.
                    </p>
                </button>

                <button
                    onClick={() => nav("/risk")}
                    className="text-left rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-5 hover:bg-white/10 active:scale-[0.99] transition"
                >
                    <div className="text-sm text-white/60">Risk Analysis</div>
                    <div className="mt-1 text-lg font-bold">Quick assessment</div>
                    <p className="mt-2 text-sm text-white/60">
                        Flag high-risk users and escalate to trusted support (admin).
                    </p>
                </button>
            </div>
        </div>
    );
}
