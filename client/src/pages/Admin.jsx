import React, { useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useProvince } from "../context/ProvinceContext";

export default function Admin() {
    const { token, user } = useAuth();
    const { province } = useProvince();

    const [events, setEvents] = useState(() => [
        { id: "E-001", type: "SOS", province: "Gauteng", status: "Open", time: "Today 14:10" },
        { id: "E-002", type: "Chat escalation", province: "KwaZulu-Natal", status: "Review", time: "Today 13:05" },
        { id: "E-003", type: "SOS", province: "Western Cape", status: "Closed", time: "Yesterday 21:41" }
    ]);

    const stats = useMemo(() => {
        const open = events.filter((e) => e.status === "Open").length;
        const review = events.filter((e) => e.status === "Review").length;
        const closed = events.filter((e) => e.status === "Closed").length;
        return { open, review, closed };
    }, [events]);

    if (!token) {
        return (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur-2xl">
                <div className="font-semibold">Admin (demo)</div>
                <div className="mt-1 text-sm text-white/70">
                    Sign in to view the admin demo panel.
                </div>
            </div>
        );
    }

    // Demo: allow any signed-in user to view admin for investor demo
    // Next phase: enforce isAdmin on server + token claim.
    return (
        <div>
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-semibold">Admin</h1>
                <div className="text-xs text-white/70">{province?.name}</div>
            </div>

            <div className="mt-4 rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur-2xl">
                <div className="font-semibold">Triage overview</div>
                <div className="mt-1 text-sm text-white/70">
                    Signed in as: <span className="text-white">{user?.email}</span>
                </div>

                <div className="mt-3 grid grid-cols-3 gap-2">
                    <div className="rounded-2xl border border-white/10 bg-black/30 p-3">
                        <div className="text-xs text-white/60">Open</div>
                        <div className="text-xl font-semibold">{stats.open}</div>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-black/30 p-3">
                        <div className="text-xs text-white/60">Review</div>
                        <div className="text-xl font-semibold">{stats.review}</div>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-black/30 p-3">
                        <div className="text-xs text-white/60">Closed</div>
                        <div className="text-xl font-semibold">{stats.closed}</div>
                    </div>
                </div>
            </div>

            <div className="mt-4 rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur-2xl">
                <div className="font-semibold">Incidents (demo)</div>
                <div className="mt-3 space-y-2">
                    {events.map((e) => (
                        <div key={e.id} className="rounded-2xl border border-white/10 bg-black/30 p-3">
                            <div className="flex items-center justify-between">
                                <div className="font-semibold">{e.id} • {e.type}</div>
                                <span className="text-xs text-white/70">{e.time}</span>
                            </div>
                            <div className="mt-1 text-sm text-white/80">
                                Province: {e.province} • Status: <span className="text-white">{e.status}</span>
                            </div>
                            <div className="mt-2 flex gap-2">
                                <button
                                    className="rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-xs"
                                    onClick={() =>
                                        setEvents((all) =>
                                            all.map((x) => (x.id === e.id ? { ...x, status: "Review" } : x))
                                        )
                                    }
                                >
                                    Mark Review
                                </button>
                                <button
                                    className="rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-xs"
                                    onClick={() =>
                                        setEvents((all) =>
                                            all.map((x) => (x.id === e.id ? { ...x, status: "Closed" } : x))
                                        )
                                    }
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-3 text-xs text-white/60">
                    Next phase: real incidents from DB + role-based admin access.
                </div>
            </div>
        </div>
    );
}
