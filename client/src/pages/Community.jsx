import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLiveLocation } from "../hooks/useLiveLocation";

function Card({ children, className = "" }) {
    return (
        <div className={`rounded-3xl border border-white/10 bg-black/60 backdrop-blur-xl ${className}`}>
            {children}
        </div>
    );
}

export default function Community() {
    const nav = useNavigate();
    const { province } = useLiveLocation();

    const [scope, setScope] = useState("nearby"); // nearby | national
    const [anonymous, setAnonymous] = useState(true);
    const [text, setText] = useState("");

    const scopeLabel = useMemo(() => {
        if (scope === "national") return "National feed";
        return province ? `Nearby · ${province}` : "Nearby · your area";
    }, [scope, province]);

    const [posts, setPosts] = useState([
        {
            id: "p1",
            author: "Anonymous",
            scope: "national",
            time: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
            text: "If you feel unsafe, use SOS immediately. You are not alone.",
        },
        {
            id: "p2",
            author: "Community Volunteer",
            scope: "nearby",
            time: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
            text: "Reminder: keep your emergency contacts updated and share your safety plan.",
        },
    ]);

    const filtered = useMemo(() => {
        return posts.filter((p) => (scope === "national" ? p.scope === "national" : true));
    }, [posts, scope]);

    function submit() {
        const clean = text.trim();
        if (!clean) return;

        setPosts((p) => [
            {
                id: cryptoId(),
                author: anonymous ? "Anonymous" : "User",
                scope: scope === "national" ? "national" : "nearby",
                time: new Date().toISOString(),
                text: clean.slice(0, 800),
            },
            ...p,
        ]);
        setText("");
    }

    return (
        <div className="px-4 pb-24 pt-4">
            <Card className="p-4">
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <div className="text-lg font-semibold text-white">Community</div>
                        <div className="mt-1 text-sm text-white/60">{scopeLabel}</div>
                    </div>

                    <div className="flex gap-2">
                        <button
                            className="rounded-2xl border border-white/10 bg-white/10 px-3 py-2 text-sm text-white"
                            onClick={() => nav("/chat")}
                        >
                            Live Chat
                        </button>
                        <button
                            className="rounded-2xl border border-white/10 bg-white/10 px-3 py-2 text-sm text-white"
                            onClick={() => nav("/hotspots")}
                        >
                            Hotspots
                        </button>
                    </div>
                </div>

                <div className="mt-4 flex gap-2">
                    <button
                        onClick={() => setScope("nearby")}
                        className={`flex-1 py-2 rounded-2xl border text-sm ${scope === "nearby"
                                ? "bg-white text-black border-white"
                                : "bg-white/5 text-white border-white/10"
                            }`}
                    >
                        Nearby
                    </button>
                    <button
                        onClick={() => setScope("national")}
                        className={`flex-1 py-2 rounded-2xl border text-sm ${scope === "national"
                                ? "bg-white text-black border-white"
                                : "bg-white/5 text-white border-white/10"
                            }`}
                    >
                        National
                    </button>
                </div>

                <div className="mt-3 flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-3">
                    <div>
                        <div className="text-sm font-semibold text-white">Post anonymously</div>
                        <div className="text-xs text-white/50">Recommended for safety</div>
                    </div>
                    <button
                        onClick={() => setAnonymous((v) => !v)}
                        className={`w-12 h-7 rounded-full border transition relative ${anonymous ? "bg-emerald-500/80 border-emerald-300/40" : "bg-white/10 border-white/20"
                            }`}
                        aria-label="Toggle anonymous"
                    >
                        <span
                            className={`absolute top-0.5 w-6 h-6 rounded-full bg-white transition ${anonymous ? "left-5" : "left-0.5"
                                }`}
                        />
                    </button>
                </div>

                <div className="mt-3">
                    <textarea
                        className="w-full rounded-2xl border border-white/10 bg-black/60 p-3 text-white outline-none"
                        rows={3}
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Share info, ask for help, or post a safety tip…"
                    />
                    <button
                        onClick={submit}
                        className="mt-2 w-full rounded-2xl bg-white py-3 font-semibold text-black active:scale-[0.99]"
                    >
                        Post
                    </button>
                </div>
            </Card>

            <div className="mt-4 space-y-3">
                {filtered.map((p) => (
                    <Card key={p.id} className="p-4">
                        <div className="flex items-center justify-between">
                            <div className="font-semibold text-white">{p.author}</div>
                            <div className="text-xs text-white/50">
                                {new Date(p.time).toLocaleString()}
                            </div>
                        </div>
                        <div className="mt-1 text-xs text-white/60">
                            {p.scope === "national" ? "National" : "Nearby"}
                        </div>
                        <div className="mt-2 text-white">{p.text}</div>
                    </Card>
                ))}
            </div>
        </div>
    );
}

function cryptoId() {
    return Math.random().toString(16).slice(2) + Math.random().toString(16).slice(2);
}
