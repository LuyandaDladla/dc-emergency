import React, { useEffect, useMemo, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "../context/AuthContext";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "https://dc-emergency.onrender.com";

export default function LiveChat() {
  const { user } = useAuth();
  const userId = user?._id || user?.id || "demo-user";
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const listRef = useRef(null);

  const socket = useMemo(() => {
    return io(SOCKET_URL, { transports: ["websocket", "polling"] });
  }, []);

  useEffect(() => {
    socket.on("connect", () => {
      socket.emit("hello", { userId, role: "user" });
    });
    socket.on("chat:message", (msg) => {
      setMessages((m) => [...m, msg]);
      setTimeout(() => listRef.current?.scrollTo?.(0, listRef.current.scrollHeight), 0);
    });
    return () => {
      socket.disconnect();
    };
  }, [socket, userId]);

  function send() {
    const clean = text.trim();
    if (!clean) return;
    socket.emit("chat:send", { userId, text: clean });
    setText("");
  }

  return (
    <div className="px-4 pt-4 pb-24">
      <div className="rounded-3xl bg-black/70 border border-white/10 backdrop-blur-xl p-4">
        <div className="text-white text-lg font-semibold">Live Support Chat</div>
        <div className="text-white/60 text-sm">Demo real-time chat (Phase 4 adds agent dashboard).</div>
      </div>

      <div
        ref={listRef}
        className="mt-4 rounded-3xl bg-black/50 border border-white/10 backdrop-blur-xl p-3 h-[55vh] overflow-auto"
      >
        {messages.length === 0 && (
          <div className="text-white/50 text-sm p-3">No messages yet. Say hello 👋</div>
        )}
        <div className="space-y-2">
          {messages.map((m) => (
            <div key={m.id} className="rounded-2xl bg-white/5 border border-white/10 p-3">
              <div className="text-white/80 text-xs">{new Date(m.at).toLocaleString()}</div>
              <div className="text-white">{m.text}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-3 flex gap-2">
        <input
          className="flex-1 rounded-2xl bg-black/60 border border-white/10 px-3 py-3 text-white outline-none"
          value={text}
          placeholder="Type a message…"
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
        />
        <button
          className="px-4 py-3 rounded-2xl bg-white text-black font-semibold"
          onClick={send}
        >
          Send
        </button>
      </div>
    </div>
  );
}
