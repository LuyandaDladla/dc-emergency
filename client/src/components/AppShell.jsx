import { Outlet, useLocation, useNavigate } from "react-router-dom";
import React from "react";
import BottomNav from "./BottomNav";
import { Siren } from "lucide-react";

function cx(...classes) {
    return classes.filter(Boolean).join(" ");

}


export default function AppShell() {
    const nav = useNavigate();
    const location = useLocation();

    // Hide nav on auth screens
    const isAuth =
        location.pathname.startsWith("/login") ||
        location.pathname.startsWith("/register");

    return (
        <div className="relative min-h-screen overflow-hidden text-white">
            {/* Background (darker black glass look) */}
            <div className="fixed inset-0 -z-10">
                <div className="absolute inset-0 bg-black" />
                <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-fuchsia-500/10 blur-3xl" />
                <div className="absolute -right-24 top-24 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />
                <div className="bottom-[-120px] -translate-x-1/2 absolute left-1/2 h-96 w-96 rounded-full bg-white/5 blur-3xl" />
                <div className="bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.06),transparent_50%)] absolute inset-0" />
                <div className="bg-[linear-gradient(to_bottom,rgba(0,0,0,0.25),rgba(0,0,0,0.85))] absolute inset-0" />
            </div>

            {/* Main content */}
            <div className={cx("mx-auto w-full max-w-md px-4", isAuth ? "pb-10" : "pb-28")}>
                <Outlet />
            </div>

            {/* Floating SOS button (always accessible, except auth pages) */}
            {!isAuth && (
                <button
                    type="button"
                    onClick={() => nav("/sos")}
                    className={cx(
                        "fixed right-4 bottom-[76px] z-50",
                        "h-16 w-16 rounded-full",
                        "border border-red-300/30 bg-red-500/25",
                        "backdrop-blur-2xl shadow-2xl shadow-black/50",
                        "flex items-center justify-center",
                        "active:scale-[0.98] transition"
                    )}
                    aria-label="Open SOS"
                    title="SOS"
                >
                    <Siren size={28} className="text-red-100" />
                </button>
            )}

            {/* Bottom nav */}
            {!isAuth && <BottomNav />}
        </div>
    );
}
