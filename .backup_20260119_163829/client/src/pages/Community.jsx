import React, { useMemo, useState } from "react";

const DEMO_HOTSPOTS = [
    { area: "Johannesburg CBD", risk: "High", note: "Recent reports spike (demo)" },
    { area: "Durban Central", risk: "Medium", note: "Evening caution (demo)" },
    { area: "Cape Town CBD", risk: "Medium", note: "Tourist alerts (demo)" },
];

export default function Community() {
    const [tab, setTab] = useState("feed"); // feed | chat | hotspots

    const title = useMemo(() => {
        if (tab === "feed") return "Community Feed";
        if (tab === "chat") return "Live Support Chat (Demo)";
        return "Hotspots (Demo)";
    }, [tab]);

    return (
        <div className="space-y-5">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
                <h1 className="font-black text-xl">{title}</h1>
                <p className="mt-1 text-sm text-white/70">
                    For investors: this screen shows how we combine community, live support, and safety hotspots.
                </p>

                <div className="mt-4 flex gap-2">
                    <button
                        onClick={() => setTab("feed")}
                        className={
                            "px-4 py-2 rounded-2xl border transition " +
                            (tab === "feed"
                                ? "bg-white text-black border-white"
                                : "bg-white/5 text-white/80 border-white/10 hover:bg-white/10")
                        }
                    >
                        Feed
                    </button>
                    <button
                        onClick={() => setTab("chat")}
                        className={
                            "px-4 py-2 rounded-2xl border transition " +
                            (tab === "chat"
                                ? "bg-white text-black border-white"
                                : "bg-white/5 text-white/80 border-white/10 hover:bg-white/10")
                        }
                    >
                        Live Chat
                    </button>
                    <button
                        onClick={() => setTab("hotspots")}
                        className={
                            "px-4 py-2 rounded-2xl border transition " +
                            (tab === "hotspots"
                                ? "bg-white text-black border-white"
                                : "bg-white/5 text-white/80 border-white/10 hover:bg-white/10")
                        }
                    >
                        Hotspots
                    </button>
                </div>
            </div>

            {tab === "feed" && (
                <div className="space-y-3 rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
                    <div className="text-sm text-white/70">
                        Demo posts (next: real DB posts + moderation + NGO verified badges)
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                        <div className="font-bold">Safety tip</div>
                        <div className="mt-1 text-sm text-white/70">
                            Share your location with a trusted person before using public transport at night.
                        </div>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                        <div className="font-bold">NGO update (demo)</div>
                        <div className="mt-1 text-sm text-white/70">
                            Free counselling slots available this week.
                        </div>
                    </div>
                </div>
            )}

            {tab === "chat" && (
                <div className="space-y-3 rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
                    <div className="text-sm text-white/70">
                        This is a demo UI. Next step: WebSocket chat + admin console for agents.
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-black/30 p-4 text-left">
                        <div className="text-xs text-white/60">Agent</div>
                        <div className="mt-1">Hi, I�m here with you. Are you safe right now?</div>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-black/30 p-4 text-left">
                        <div className="text-xs text-white/60">You</div>
                        <div className="mt-1">I need help and guidance.</div>
                    </div>

                    <div className="flex gap-2">
                        <input
                            className="flex-1 rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-white/30"
                            placeholder="Type a message (demo)"
                        />
                        <button className="rounded-2xl bg-white px-4 py-3 font-bold text-black">
                            Send
                        </button>
                    </div>
                </div>
            )}

            {tab === "hotspots" && (
                <div className="space-y-4">
                    <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
                        <div className="text-sm text-white/70">
                            Hotspots are areas with higher reported risk. Next: location-based alerts + push notifications.
                        </div>
                        <div className="mt-4 space-y-3">
                            {DEMO_HOTSPOTS.map((h) => (
                                <div key={h.area} className="rounded-2xl border border-white/10 bg-black/30 p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="font-bold">{h.area}</div>
                                        <div className="rounded-full border border-white/10 bg-white/10 px-2 py-1 text-xs">
                                            {h.risk}
                                        </div>
                                    </div>
                                    <div className="mt-1 text-sm text-white/70">{h.note}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <a
                            className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl transition hover:bg-white/10"
                            href="tel:112"
                        >
                            <div className="font-bold">Emergency</div>
                            <div className="mt-1 text-xs text-white/60">Dial 112</div>
                        </a>
                        <a
                            className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl transition hover:bg-white/10"
                            href="tel:10111"
                        >
                            <div className="font-bold">Police</div>
                            <div className="mt-1 text-xs text-white/60">Dial 10111</div>
                        </a>
                    </div>
                </div>
            )}
        </div>
    );
}
