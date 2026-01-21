// client/src/pages/Community.jsx
import React, { useMemo, useState } from "react";
import { SendHorizontal, Shield, Users } from "lucide-react";

export default function Community() {
    const [tab, setTab] = useState("feed"); // feed|chat
    const [msg, setMsg] = useState("");
    const [chat, setChat] = useState([{ from: "Agent", text: "Hi, I’m here to help. Are you safe right now?" }]);

    const feed = useMemo(
        () => [
            { title: "Safety tip", text: "Share location with a trusted contact before traveling alone." },
            { title: "Community update", text: "Support group meeting tonight 18:00 (demo)." },
            { title: "Hotspot alert", text: "Avoid the park footbridge after 20:00 (demo)." },
        ],
        []
    );

    return (
        <div className="space-y-4">
            <div className="glass rounded-3xl p-4">
                <div className="flex items-center gap-2 text-lg font-semibold">
                    <Users size={18} /> Community
                </div>
                <div className="mt-1 text-sm text-white/70">Local + national support (demo ready).</div>

                <div className="mt-3 flex gap-2">
                    <button
                        onClick={() => setTab("feed")}
                        className={["px-3 py-2 rounded-2xl text-sm", tab === "feed" ? "bg-white/12" : "bg-white/6 hover:bg-white/10"].join(" ")}
                    >
                        Feed
                    </button>
                    <button
                        onClick={() => setTab("chat")}
                        className={["px-3 py-2 rounded-2xl text-sm", tab === "chat" ? "bg-white/12" : "bg-white/6 hover:bg-white/10"].join(" ")}
                    >
                        Live Chat
                    </button>
                </div>
            </div>

            {tab === "feed" ? (
                <div className="space-y-3">
                    {feed.map((p) => (
                        <div key={p.title} className="glass rounded-3xl p-4">
                            <div className="flex items-center gap-2 font-semibold">
                                <Shield size={16} className="opacity-80" /> {p.title}
                            </div>
                            <div className="mt-1 text-sm text-white/75">{p.text}</div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="glass rounded-3xl p-4">
                    <div className="text-sm font-semibold">Support Agent (demo)</div>
                    <div className="mt-3 max-h-[52vh] space-y-2 overflow-auto pr-1">
                        {chat.map((c, i) => (
                            <div
                                key={i}
                                className={[
                                    "px-3 py-2 rounded-2xl text-sm",
                                    c.from === "Me" ? "bg-white/12 ml-10" : "bg-white/6 mr-10",
                                ].join(" ")}
                            >
                                <div className="text-[11px] opacity-70">{c.from}</div>
                                <div>{c.text}</div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-3 flex gap-2">
                        <input
                            value={msg}
                            onChange={(e) => setMsg(e.target.value)}
                            placeholder="Type a message…"
                            className="w-full bg-white/5 rounded-2xl px-3 py-2 outline-none"
                        />
                        <button
                            onClick={() => {
                                if (!msg.trim()) return;
                                setChat((prev) => [...prev, { from: "Me", text: msg.trim() }]);
                                setMsg("");
                                setTimeout(() => {
                                    setChat((prev) => [...prev, { from: "Agent", text: "Thanks. I’m with you. Do you need immediate help?" }]);
                                }, 700);
                            }}
                            className="bg-white/10 hover:bg-white/15 rounded-2xl px-3 py-2"
                            aria-label="Send"
                        >
                            <SendHorizontal size={18} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
