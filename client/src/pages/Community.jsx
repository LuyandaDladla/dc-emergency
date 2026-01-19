import React, { useMemo, useState } from "react";
import { MessageCircle, Users, MapPin, Flame } from "lucide-react";

function cx(...c) { return c.filter(Boolean).join(" "); }

const DEMO_POSTS = [
    { id: 1, scope: "National", author: "Anonymous", time: "Just now", text: "You�re not alone. Share resources and support here.", tag: "Support" },
    { id: 2, scope: "Gauteng", author: "Anonymous", time: "10m ago", text: "Any safe shelters near Johannesburg CBD? (Demo)", tag: "Help" },
    { id: 3, scope: "Western Cape", author: "Anonymous", time: "1h ago", text: "Reminder: Trust your instincts. Leave early if you feel unsafe.", tag: "Advice" },
];

export default function Community() {
    const province = useMemo(() => localStorage.getItem("dc_province") || "", []);
    const [tab, setTab] = useState("local"); // local | national
    const [text, setText] = useState("");

    const filtered = useMemo(() => {
        if (tab === "national") return DEMO_POSTS.filter(p => p.scope === "National");
        if (province) return DEMO_POSTS.filter(p => p.scope === province);
        return DEMO_POSTS.filter(p => p.scope !== "National");
    }, [tab, province]);

    function post() {
        const t = text.trim();
        if (!t) return;
        alert("Demo mode: posting saved later. For tomorrow�s demo this shows UI only.");
        setText("");
    }

    return (
        <div className="pt-6">
            <div className="rounded-2xl border border-white/10 bg-white/6 p-5 shadow-2xl shadow-black/40 backdrop-blur-2xl">
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <div className="text-2xl font-semibold">Community</div>
                        <div className="mt-1 text-sm text-white/70">
                            {tab === "local" ? "Location-based support and updates" : "National space for everyone"}
                        </div>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-xs text-white/80">
                        <span className="inline-flex items-center gap-1">
                            <MapPin size={14} />
                            {province || "No province"}
                        </span>
                    </div>
                </div>

                {/* Tabs */}
                <div className="mt-4 grid grid-cols-2 gap-2">
                    <button
                        type="button"
                        onClick={() => setTab("local")}
                        className={cx(
                            "rounded-xl border px-4 py-3 text-sm font-semibold transition",
                            tab === "local"
                                ? "border-white/15 bg-white/12"
                                : "border-white/10 bg-black/25 hover:bg-black/35"
                        )}
                    >
                        <span className="inline-flex items-center gap-2"><Users size={16} />Local</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setTab("national")}
                        className={cx(
                            "rounded-xl border px-4 py-3 text-sm font-semibold transition",
                            tab === "national"
                                ? "border-white/15 bg-white/12"
                                : "border-white/10 bg-black/25 hover:bg-black/35"
                        )}
                    >
                        <span className="inline-flex items-center gap-2"><MessageCircle size={16} />National</span>
                    </button>
                </div>

                {/* Composer */}
                <div className="mt-4 rounded-2xl border border-white/10 bg-black/25 p-4">
                    <div className="text-sm font-semibold">Post anonymously (demo)</div>
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Share advice, ask for help, report a hotspot�"
                        className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-white/10 min-h-[90px]"
                    />
                    <button
                        type="button"
                        onClick={post}
                        className="mt-3 w-full rounded-xl border border-white/10 bg-white/8 px-4 py-3 text-sm font-semibold transition hover:bg-white/12"
                    >
                        Post
                    </button>
                    <div className="mt-2 text-xs text-white/60">
                        Next: moderation + NGO accounts + emergency escalation.
                    </div>
                </div>

                {/* Feed */}
                <div className="mt-4 space-y-3">
                    {filtered.length === 0 ? (
                        <div className="rounded-2xl border border-white/10 bg-black/25 p-5 text-sm text-white/70">
                            No posts for this area yet (demo).
                        </div>
                    ) : (
                        filtered.map((p) => (
                            <div key={p.id} className="rounded-2xl border border-white/10 bg-black/25 p-4">
                                <div className="flex items-center justify-between">
                                    <div className="text-sm font-semibold">{p.author}</div>
                                    <div className="text-xs text-white/60">{p.time}</div>
                                </div>
                                <div className="mt-1 text-xs text-white/60">{p.scope}</div>
                                <div className="mt-3 text-sm text-white/85">{p.text}</div>
                                <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/8 px-3 py-1 text-xs text-white/70">
                                    <Flame size={14} className="text-white/70" /> {p.tag}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
