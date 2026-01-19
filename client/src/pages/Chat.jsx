import React, { useEffect, useMemo, useRef, useState } from "react";
import { Send, Headset, Shield, PhoneCall } from "lucide-react";

function cx(...c) { return c.filter(Boolean).join(" "); }

const STORAGE_KEY = "dc_live_chat_demo_v1";

export default function Chat() {
    const [messages, setMessages] = useState(() => {
        try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); }
        catch { return []; }
    });
    const [text, setText] = useState("");
    const endRef = useRef(null);

    const agentName = "DC Support (Demo)";

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
        endRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const hasStarted = useMemo(() => messages.length > 0, [messages]);

    function addAgentIntro() {
        setMessages((m) => [
            ...m,
            { id: crypto.randomUUID(), role: "agent", at: Date.now(), text: `Hi, I'm ${agentName}. You're safe here. How can I help you today?` }
        ]);
    }

    function send() {
        const t = text.trim();
        if (!t) return;

        setMessages((m) => [
            ...m,
            { id: crypto.randomUUID(), role: "user", at: Date.now(), text: t },
            // Auto agent reply (demo)
            { id: crypto.randomUUID(), role: "agent", at: Date.now() + 1, text: "Thanks for sharing. Are you in immediate danger right now? If yes, tap SOS or call 112/10111." }
        ]);
        setText("");
    }

    return (
        <div className="pt-6">
            <div className="rounded-2xl border border-white/10 bg-white/6 p-5 shadow-2xl shadow-black/40 backdrop-blur-2xl">
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <div className="text-2xl font-semibold">Live Support Chat</div>
                        <div className="mt-1 text-sm text-white/70">
                            Demo chat for investors — ready to connect to real agents later.
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <a
                            href="tel:112"
                            className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-xs transition hover:bg-black/40"
                        >
                            <span className="inline-flex items-center gap-1"><PhoneCall size={14} />112</span>
                        </a>
                        <a
                            href="tel:10111"
                            className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-xs transition hover:bg-black/40"
                        >
                            <span className="inline-flex items-center gap-1"><Shield size={14} />10111</span>
                        </a>
                    </div>
                </div>

                {!hasStarted ? (
                    <div className="mt-6 rounded-2xl border border-white/10 bg-black/25 p-5">
                        <div className="flex items-center gap-2 text-sm font-semibold">
                            <Headset size={18} className="text-white/80" /> Start a chat
                        </div>
                        <div className="mt-2 text-sm text-white/70">
                            This is a demo agent experience (local). Next: real-time via Socket.io / WhatsApp / Twilio.
                        </div>
                        <button
                            type="button"
                            onClick={addAgentIntro}
                            className="mt-4 w-full rounded-xl border border-white/10 bg-white/8 px-4 py-3 text-sm font-semibold transition hover:bg-white/12"
                        >
                            Start chat
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="mt-5 h-[52vh] overflow-auto rounded-2xl border border-white/10 bg-black/25 p-4">
                            {messages.map((m) => (
                                <div
                                    key={m.id}
                                    className={cx(
                                        "mb-3 flex",
                                        m.role === "user" ? "justify-end" : "justify-start"
                                    )}
                                >
                                    <div
                                        className={cx(
                                            "max-w-[82%] rounded-2xl px-4 py-3 text-sm",
                                            m.role === "user"
                                                ? "bg-white/12 border border-white/10"
                                                : "bg-emerald-500/12 border border-emerald-300/15"
                                        )}
                                    >
                                        <div className="text-white/90">{m.text}</div>
                                        <div className="mt-1 text-[11px] text-white/50">
                                            {new Date(m.at).toLocaleTimeString()}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div ref={endRef} />
                        </div>

                        <div className="mt-4 flex items-center gap-2">
                            <input
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                onKeyDown={(e) => { if (e.key === "Enter") send(); }}
                                placeholder="Type your message…"
                                className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-white/10"
                            />
                            <button
                                type="button"
                                onClick={send}
                                className="rounded-xl border border-white/10 bg-white/8 px-4 py-3 transition hover:bg-white/12"
                            >
                                <Send size={18} className="text-white/90" />
                            </button>
                        </div>

                        <button
                            type="button"
                            onClick={() => {
                                localStorage.removeItem(STORAGE_KEY);
                                setMessages([]);
                                setText("");
                            }}
                            className="mt-3 w-full rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white/70 hover:bg-black/35 transition"
                        >
                            Reset demo chat
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
