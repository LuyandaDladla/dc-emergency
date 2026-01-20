import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Profile() {
    const { user, token, logout } = useAuth();
    const nav = useNavigate();
    const [anon, setAnon] = useState(() => localStorage.getItem("dc_anon") === "1");

    function toggleAnon() {
        const next = !anon;
        setAnon(next);
        localStorage.setItem("dc_anon", next ? "1" : "0");
    }

    return (
        <div>
            <h1 className="text-xl font-semibold">Profile</h1>

            <div className="mt-4 rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur-2xl">
                <div className="text-sm text-white/80">
                    Status:{" "}
                    {token ? (
                        <span className="font-semibold text-white">Signed in</span>
                    ) : (
                        <span className="text-white/70">Guest</span>
                    )}
                </div>

                <div className="mt-2 text-sm text-white/80">
                    User: <span className="text-white">{user?.email || "—"}</span>
                </div>

                <div className="mt-3 flex items-center justify-between rounded-2xl border border-white/10 bg-black/30 px-4 py-3">
                    <div>
                        <div className="font-semibold">Anonymous mode</div>
                        <div className="text-xs text-white/60">Hide identity in community (demo)</div>
                    </div>
                    <button
                        onClick={toggleAnon}
                        className="rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-xs"
                    >
                        {anon ? "ON" : "OFF"}
                    </button>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2">
                    {!token ? (
                        <>
                            <button className="rounded-2xl bg-white py-3 font-semibold text-black" onClick={() => nav("/login")}>
                                Sign in
                            </button>
                            <button className="rounded-2xl border border-white/10 bg-white/10 py-3" onClick={() => nav("/register")}>
                                Sign up
                            </button>
                        </>
                    ) : (
                        <button className="col-span-2 rounded-2xl border border-white/10 bg-white/10 py-3" onClick={logout}>
                            Log out
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
