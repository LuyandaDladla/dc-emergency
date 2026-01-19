import React from "react";
import { NavLink } from "react-router-dom";
import { Home, Users, MessageCircle, BarChart3, User } from "lucide-react";

function cx(...classes) {
    return classes.filter(Boolean).join(" ");
}

const items = [
    { to: "/", label: "Home", Icon: Home },
    { to: "/community", label: "Community", Icon: Users },
    { to: "/chat", label: "Live Chat", Icon: MessageCircle },
    { to: "/risk", label: "Risk", Icon: BarChart3 },
    { to: "/profile", label: "Profile", Icon: User },
];

export default function BottomNav() {
    return (
        <nav
            className={cx(
                "fixed bottom-0 left-0 right-0 z-40",
                "pb-[max(0.75rem,env(safe-area-inset-bottom))]"
            )}
            aria-label="Bottom Navigation"
        >
            <div className="mx-auto max-w-md px-3">
                <div
                    className={cx(
                        "rounded-2xl",
                        "border border-white/10 bg-white/6",
                        "backdrop-blur-2xl shadow-2xl shadow-black/50"
                    )}
                >
                    <div className="grid grid-cols-5">
                        {items.map(({ to, label, Icon }) => (
                            <NavLink
                                key={to}
                                to={to}
                                className={({ isActive }) =>
                                    cx(
                                        "py-3",
                                        "flex flex-col items-center justify-center gap-1",
                                        "transition active:scale-[0.98]",
                                        isActive ? "text-white" : "text-white/65 hover:text-white/90"
                                    )
                                }
                            >
                                {({ isActive }) => (
                                    <>
                                        <div
                                            className={cx(
                                                "h-9 w-9 rounded-xl flex items-center justify-center",
                                                isActive ? "bg-white/10 border border-white/10" : "bg-transparent"
                                            )}
                                        >
                                            <Icon size={18} />
                                        </div>
                                        <div className="leading-none text-[11px]">{label}</div>
                                    </>
                                )}
                            </NavLink>
                        ))}
                    </div>
                </div>
            </div>
        </nav>
    );
}
