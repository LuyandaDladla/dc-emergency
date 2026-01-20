import React, { useMemo, useState } from "react";
import { useProvince } from "../context/ProvinceContext";
import { useAuth } from "../context/AuthContext";

export default function Community() {
    const { province } = useProvince();
    const { user } = useAuth();
    const [tab, setTab] = useState("feed"); // feed | chat
    const [text, setText] = useState("");

    const seed = useMemo(() => {
        const p = province?.name || "your area";
        return [
            { by: "DC Academy", text: `Welcome to the ${p} community space. Stay safe.` },
            { by: "Moderator", text: "This is a demo: messages are not stored permanently yet." }
        ];
    }, [province]);

    const [msgs, setMsgs] = useState(seed);

    function send() {
        const t = text.trim();
        if (!t) return;
        const by = user?.name || user?.email || "Anonymous";
        setMsgs((m) => [...m, { by, text: t }]);
        setText("");

        // Demo bot reply
        setTimeout(() => {
            setMsgs((m) => [
                ...m,
                { by: "Support Bot", text: "Thanks for sharing. If you’re in danger, use SOS immediately." }
            ]);
        }, 500);
    }

    return (
        <div>
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-semibold">Community</h1>
                <div className="text-xs text-white/70">{province?.name}</div>
            </div>

            <div className="mt-3 flex gap-2 rounded-2xl border border-white/10 bg-white/5 p-2 backdrop-blur-xl">
                <button
                    className={[
                        "flex-1 rounded-xl py-2 text-sm",
                        tab === "feed" ? "bg-white/10" : "hover:bg-white/5"
                    ].join(" ")}
                    onClick={() => setTab("feed")}
                >
                    Feed
                </button>
                <button
                    className={[
                        "flex-1 rounded-xl py-2 text-sm",
                        tab === "chat" ? "bg-white/10" : "hover:bg-white/5"
                    ].join(" ")}
                    onClick={() => setTab("chat")}
                >
                    Live chat (demo)
                </button>
            </div>

            {tab === "feed" ? (
                <div className="mt-4 rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur-2xl">
                    <div className="font-semibold">Local updates</div>
                    <div className="mt-2 text-sm text-white/80">
                        No verified posts yet for this province (demo).
                    </div>
                    <div className="mt-3 text-xs text-white/60">
                        Next phase: NGO verified posts + moderated reporting.
                    </div>
                </div>
            ) : (
                <div className="mt-4">
                    <div className="rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur-2xl">
                        <div className="flex items-center justify-between">
                            <div className="font-semibold">Support room</div>
                            <a
                                href="mailto:dcacademy@example.com?subject=DC%20Emergency%20Support%20Request"
                                className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-xs"
                            >
                                Contact live agent (email)
                            </a>
                        </div>

                        <div className="mt-3 max-h-[50vh] space-y-2 overflow-auto pr-1">
                            {msgs.map((m, i) => (
                                <div
                                    key={i}
                                    className="rounded-2xl border border-white/10 bg-black/30 px-3 py-2"
                                >
                                    <div className="text-xs text-white/60">{m.by}</div>
                                    <div className="text-sm text-white/90">{m.text}</div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-3 flex gap-2">
                            <input
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                className="flex-1 rounded-2xl bg-black/30 border border-white/10 px-3 py-3 outline-none"
                                placeholder="Type a message…"
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") send();
                                }}
                            />
                            <button
                                onClick={send}
                                className="rounded-2xl bg-white px-4 font-semibold text-black"
                            >
                                Send
                            </button>
                        </div>

                        <div className="mt-2 text-xs text-white/60">
                            Demo only. Next phase: real-time websocket chat + moderation.
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
