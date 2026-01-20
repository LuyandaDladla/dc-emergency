import React from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import BottomNav from "./BottomNav";

function cls(...a) {
    return a.filter(Boolean).join(" ");
}

export default function AppShell() {
    const nav = useNavigate();
    const location = useLocation();

    const isAuth =
        location.pathname.startsWith("/login") ||
        location.pathname.startsWith("/register");

    return (
        <div className={cls("relative min-h-screen text-white dc-noise")}>
            {/* Background */}
            <div className="fixed inset-0 -z-10 bg-black">
                <div className="dc-bg absolute inset-0" />
            </div>

            {/* Content container */}
            <div
                className={cls(
                    "mx-auto w-full max-w-md px-4",
                    isAuth ? "pt-10 pb-10" : "pt-5 pb-28"
                )}
                style={{
                    paddingBottom: isAuth
                        ? "max(2.5rem, env(safe-area-inset-bottom))"
                        : "calc(max(6.5rem, env(safe-area-inset-bottom)) + 22px)",
                }}
            >
                <Outlet />
            </div>

            {/* Floating SOS (always accessible) */}
            {!isAuth && (
                <button
                    type="button"
                    onClick={() => nav("/sos")}
                    className={cls(
                        "fixed right-5 z-50",
                        "dc-press",
                        "grid place-items-center",
                        "h-[76px] w-[76px] rounded-full",
                        "bg-red-500/20 border border-red-200/25",
                        "backdrop-blur-2xl",
                        "shadow-[0_24px_70px_rgba(0,0,0,0.65)]"
                    )}
                    style={{
                        bottom: "calc(max(88px, env(safe-area-inset-bottom)) + 14px)",
                    }}
                    aria-label="Open SOS"
                    title="SOS"
                >
                    <div className="select-none text-center">
                        <div className="text-lg font-extrabold tracking-tight">SOS</div>
                        <div className="-mt-0.5 text-[10px] text-white/80">Emergency</div>
                    </div>
                </button>
            )}

            {/* Bottom nav */}
            {!isAuth && <BottomNav />}
        </div>
    );
}
