// client/src/pages/Community.jsx
import React, { useEffect, useMemo, useState } from "react";
import { tryGet, tryPost } from "../services/api";
import { useProvince } from "../context/ProvinceContext";

function timeAgo(iso) {
    const t = new Date(iso).getTime();
    const s = Math.max(1, Math.floor((Date.now() - t) / 1000));
    if (s < 60) return `${s}s`;
    const m = Math.floor(s / 60);
    if (m < 60) return `${m}m`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h`;
    const d = Math.floor(h / 24);
    return `${d}d`;
}

export default function Community() {
    const { province, coords } = useProvince();
    const [scope, setScope] = useState("forYou"); // forYou | province
    const [text, setText] = useState("");
    const [items, setItems] = useState([]);
    const [busy, setBusy] = useState(false);
    const [err, setErr] = useState("");

    const feedQuery = useMemo(() => {
        if (scope === "province" && province) return `/community/feed?scope=province&province=${encodeURIComponent(province)}`;
        return `/community/feed?scope=forYou`;
    }, [scope, province]);

    async function load() {
        setErr("");
        try {
            const r = await tryGet(feedQuery);
            setItems(r.items || []);
        } catch (e) {
            setErr(e.message || "Failed to load feed");
        }
    }

    useEffect(() => {
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [feedQuery]);

    async function createPost() {
        const t = text.trim();
        if (!t) return;
        setBusy(true);
        setErr("");
        try {
            await tryPost("/community/posts", {
                text: t,
                lat: coords?.lat,
                lng: coords?.lng,
                displayName: "Anonymous",
            });
            setText("");
            await load();
        } catch (e) {
            setErr(e.message || "Failed to post");
        } finally {
            setBusy(false);
        }
    }

    async function like(id) {
        try {
            await tryPost(`/community/posts/${id}/like`, {});
            await load();
        } catch { }
    }

    async function repost(id) {
        try {
            await tryPost(`/community/posts/${id}/repost`, {});
            await load();
        } catch { }
    }

    async function report(id) {
        const reason = prompt("Report reason (e.g. harassment, violence, spam):", "harassment");
        if (!reason) return;
        try {
            await tryPost(`/community/posts/${id}/report`, { reason });
            alert("Reported. Thank you.");
        } catch (e) {
            alert(e.message || "Failed to report");
        }
    }

    return (
        <div className="p-4 pb-28">
            <div className="glass rounded-3xl p-4">
                <div className="flex items-center justify-between gap-2">
                    <div>
                        <div className="text-lg font-semibold">Community</div>
                        <div className="text-xs text-white/60">
                            {scope === "province" ? `Province: ${province || "Unknown"}` : "For You"}
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <button
                            className={`px-3 py-2 rounded-xl text-sm ${scope === "forYou" ? "bg-white/15" : "bg-white/5"}`}
                            onClick={() => setScope("forYou")}
                        >
                            For You
                        </button>
                        <button
                            className={`px-3 py-2 rounded-xl text-sm ${scope === "province" ? "bg-white/15" : "bg-white/5"}`}
                            onClick={() => setScope("province")}
                        >
                            Province
                        </button>
                    </div>
                </div>

                <div className="mt-3 flex gap-2">
                    <input
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Share safely… (no personal details)"
                        className="flex-1 bg-black/30 rounded-2xl px-4 py-3 outline-none"
                    />
                    <button
                        onClick={createPost}
                        disabled={busy}
                        className="rounded-2xl bg-white/15 px-4 py-3 active:bg-white/25"
                    >
                        Post
                    </button>
                </div>

                {err ? <div className="mt-2 text-sm text-red-300">{err}</div> : null}
            </div>

            <div className="mt-4 space-y-3">
                {items.map((p) => (
                    <div key={p._id} className="glass rounded-3xl p-4">
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <div className="text-sm font-semibold">{p.displayName || "Anonymous"}</div>
                                <div className="text-xs text-white/60">
                                    {p.province || "Unknown"} • {timeAgo(p.createdAt)}
                                </div>
                            </div>
                            <button className="text-xs text-white/60" onClick={() => report(p._id)}>
                                Report
                            </button>
                        </div>

                        <div className="mt-2 text-sm leading-relaxed">{p.text}</div>

                        <div className="mt-3 flex items-center gap-2">
                            <button onClick={() => like(p._id)} className="px-3 py-2 rounded-xl bg-white/5">
                                ❤️ {p.likesCount || 0}
                            </button>
                            <button onClick={() => repost(p._id)} className="px-3 py-2 rounded-xl bg-white/5">
                                🔁 {p.repostCount || 0}
                            </button>
                            <div className="ml-auto text-xs text-white/60">Replies: {p.repliesCount || 0}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
