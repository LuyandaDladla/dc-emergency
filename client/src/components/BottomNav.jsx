import React from "react";
import { NavLink } from "react-router-dom";

function Icon({ name }) {
    const common = "w-5 h-5";
    // tiny inline SVG set (no lucide-react dependency)
    switch (name) {
        case "home":
            return (
                <svg className={common} viewBox="0 0 24 24" fill="none">
                    <path d="M3 10.5 12 3l9 7.5V21a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1V10.5Z" stroke="currentColor" strokeWidth="1.6" />
                </svg>
            );
        case "sos":
            return (
                <svg className={common} viewBox="0 0 24 24" fill="none">
                    <path d="M12 2v4M12 18v4M4 12H2M22 12h-2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                    <path d="M12 7a5 5 0 1 0 0 10a5 5 0 0 0 0-10Z" stroke="currentColor" strokeWidth="1.6" />
                </svg>
            );
        case "community":
            return (
                <svg className={common} viewBox="0 0 24 24" fill="none">
                    <path d="M16 11a4 4 0 1 0-8 0" stroke="currentColor" strokeWidth="1.6" />
                    <path d="M4 21c0-4 4-6 8-6s8 2 8 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
            );
        case "risk":
            return (
                <svg className={common} viewBox="0 0 24 24" fill="none">
                    <path d="M12 2 3 6v7c0 5 4 8.5 9 9 5-0.5 9-4 9-9V6l-9-4Z" stroke="currentColor" strokeWidth="1.6" />
                    <path d="M12 8v5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                    <path d="M12 16h.01" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                </svg>
            );
        case "profile":
            return (
                <svg className={common} viewBox="0 0 24 24" fill="none">
                    <path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z" stroke="currentColor" strokeWidth="1.6" />
                    <path d="M4 21c1.5-4 5-6 8-6s6.5 2 8 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
            );
        default:
            return null;
    }
}

function Item({ to, icon, label }) {
    return (
        <NavLink
            to={to}
            className={({ isActive }) =>
                [
                    "flex flex-col items-center justify-center gap-1 px-2 py-2 rounded-xl",
                    isActive ? "text-white" : "text-white/70 hover:text-white"
                ].join(" ")
            }
        >
            <Icon name={icon} />
            <span className="leading-none text-[11px]">{label}</span>
        </NavLink>
    );
}

export default function BottomNav() {
    return (
        <div
            className="-translate-x-1/2 w-[min(420px,calc(100%-1.5rem))] fixed bottom-4 left-1/2 z-40"
            style={{ paddingBottom: "max(0px, env(safe-area-inset-bottom))" }}
        >
            <div className="flex items-stretch justify-between rounded-2xl border border-white/10 bg-black/55 px-3 py-2 shadow-lg backdrop-blur-xl">
                <Item to="/" icon="home" label="Home" />
                <Item to="/sos" icon="sos" label="SOS" />
                <Item to="/community" icon="community" label="Community" />
                <Item to="/risk" icon="risk" label="Risk" />
                <Item to="/profile" icon="profile" label="Profile" />
            </div>
        </div>
    );
}
