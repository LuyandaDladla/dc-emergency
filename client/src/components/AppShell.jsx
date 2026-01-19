import React from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import BottomNav from "./BottomNav.jsx";

export default function AppShell() {
    const nav = useNavigate();
    const loc = useLocation();

    const showNav = !["/login", "/register"].includes(loc.pathname);

    return (
        <div className="min-h-screen text-white">
            {/* Background */}
            <div className="fixed inset-0 -z-10 bg-black" />
            <div className="fixed inset-0 -z-10 opacity-70"
                style={{
                    background:
                        "radial-gradient(60% 40% at 60% 25%, rgba(120,0,255,0.35), transparent 60%)," +
                        "radial-gradient(55% 35% at 20% 90%, rgba(0,200,255,0.18), transparent 60%)," +
                        "linear-gradient(180deg, rgba(0,0,0,0.9), rgba(0,0,0,0.98))",
                }}
            />

            {/* Page container */}
            <div className="mx-auto w-full max-w-[430px] px-4 pb-28 pt-4">
                <Outlet />
            </div>

            {/* Floating SOS (always available) */}
            {showNav && (
                <button
                    onClick={() => nav("/sos")}
                    className={[
                        "fixed z-50",
                        "right-6 bottom-24",
                        "h-16 w-16 rounded-full",
                        "bg-red-600/80 hover:bg-red-600",
                        "backdrop-blur-xl border border-white/20",
                        "shadow-[0_16px_40px_rgba(0,0,0,0.55)]",
                        "active:scale-95 transition",
                        "flex items-center justify-center",
                    ].join(" ")}
                    aria-label="SOS"
                >
                    <span className="text-sm font-extrabold tracking-wide">SOS</span>
                </button>
            )}

            {showNav && <BottomNav />}
        </div>
    );
}
