import React from "react";
import { NavLink } from "react-router-dom";

const Icon = ({ children }) => (
    <span className="inline-flex h-6 w-6 items-center justify-center">{children}</span>
);

function Item({ to, label, icon }) {
    return (
        <NavLink
            to={to}
            className={({ isActive }) =>
                [
                    "flex flex-col items-center justify-center gap-1 px-2 py-2 rounded-xl",
                    "text-[11px] leading-none",
                    isActive ? "text-white" : "text-white/70 hover:text-white",
                ].join(" ")
            }
        >
            <Icon>{icon}</Icon>
            <span>{label}</span>
        </NavLink>
    );
}

export default function BottomNav() {
    return (
        <nav
            className={[
                "fixed bottom-3 left-1/2 -translate-x-1/2 z-40",
                "w-[min(430px,calc(100vw-24px))]",
                "backdrop-blur-xl bg-white/10 border border-white/15",
                "shadow-[0_10px_30px_rgba(0,0,0,0.35)]",
                "rounded-2xl px-3 py-2",
            ].join(" ")}
            style={{ paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))" }}
        >
            <div className="grid grid-cols-5 items-center">
                <Item
                    to="/"
                    label="Home"
                    icon={
                        <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth="1.8">
                            <path d="M3 10.5 12 3l9 7.5" />
                            <path d="M5 10v10h14V10" />
                        </svg>
                    }
                />
                <Item
                    to="/sos"
                    label="SOS"
                    icon={
                        <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth="1.8">
                            <path d="M12 21s7-4.6 7-11a7 7 0 0 0-14 0c0 6.4 7 11 7 11Z" />
                            <path d="M12 11v4" />
                            <path d="M12 8h.01" />
                        </svg>
                    }
                />
                <Item
                    to="/community"
                    label="Community"
                    icon={
                        <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth="1.8">
                            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                            <path d="M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
                            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                    }
                />
                <Item
                    to="/risk"
                    label="Risk"
                    icon={
                        <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth="1.8">
                            <path d="M12 2 2 7l10 5 10-5-10-5Z" />
                            <path d="M2 17l10 5 10-5" />
                            <path d="M2 12l10 5 10-5" />
                        </svg>
                    }
                />
                <Item
                    to="/profile"
                    label="Profile"
                    icon={
                        <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth="1.8">
                            <path d="M20 21a8 8 0 1 0-16 0" />
                            <path d="M12 13a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
                        </svg>
                    }
                />
            </div>
        </nav>
    );
}
