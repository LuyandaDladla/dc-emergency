import {
    Home as HomeIcon,
    Users as UsersIcon,
    Siren as SirenIcon,
    MessageCircle as ChatIcon,
    ShieldAlert as RiskIcon,
    User as UserIcon,
} from "lucide-react";

import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import SOSFab from "./SOSFab";


const nav = [
  { to: "/", label: "Home" },
  { to: "/community", label: "Community" },
  { to: "/sos", label: "SOS", primary: true },
  { to: "/therapist", label: "Therapist" },
  { to: "/risk", label: "Risk" },
  { to: "/profile", label: "Profile" },
];

function classNames(...xs) {
  return xs.filter(Boolean).join(" ");
}

export default function AppShell() {
  const { pathname } = useLocation();
  const { user, loading } = useAuth();

  return (
    <div className="app-bg">
      {/* Top Bar */}
      <header className="sticky top-0 z-20 border-b border-zinc-900/80 bg-zinc-950/70 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-emerald-500/30 bg-emerald-500/15">
              <span className="font-bold text-emerald-300">DC</span>
            </div>
            <div className="leading-tight">
              <div className="font-semibold">DC Emergency</div>
              <div className="text-xs text-zinc-400">
                {loading ? "Loading…" : user ? `Signed in as ${user?.email}` : "Not signed in"}
              </div>
            </div>
          </div>

          {/* Later: language/province controls */}
          <div className="flex items-center gap-2">
            <span className="pill">ZA • 11 Languages</span>
            <span className="pill">9 Provinces</span>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-5xl px-4 pb-24 pt-4">
        <Outlet />
          </main>

          export default function AppShell({children}) {
  return (
          <div className="min-h-screen bg-[#0B0B0F] text-white">
              {children}

              {/* Global floating SOS access */}
              <SOSFab />

              {/* Bottom nav (your existing component) */}
              {/* <BottomNav /> */}
          </div>
          );
}


      {/* Bottom Nav */}
          {/* Bottom Nav (icons + labels) */}
          <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-zinc-900/80 bg-zinc-950/85 backdrop-blur">
              <div className="mx-auto max-w-5xl px-3 py-2">
                  <BottomNav currentPath={pathname} />
              </div>
          </nav>


          {/* Primary SOS */}
          <Link
            to="/sos"
            className={classNames(
              "btn py-2 text-sm font-semibold",
              "bg-rose-500 text-zinc-950 hover:bg-rose-400"
            )}
          >
            SOS
          </Link>

          {nav.slice(3).map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className={classNames(
                "btn-ghost py-2 text-sm",
                pathname === n.to && "border-emerald-500/30 bg-emerald-500/10"
              )}
            >
              {n.label}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
function BottomNav({ currentPath }) {
    const items = [
        { to: "/", label: "Home", Icon: HomeIcon },
        { to: "/community", label: "Community", Icon: UsersIcon },
        { to: "/sos", label: "SOS", Icon: SirenIcon, primary: true },
        { to: "/therapist", label: "Therapist", Icon: ChatIcon },
        { to: "/risk", label: "Risk", Icon: RiskIcon },
        { to: "/profile", label: "Profile", Icon: UserIcon },
    ];

    return (
        <div className="grid grid-cols-6 gap-2">
            {items.map(({ to, label, Icon, primary }) => {
                const active = currentPath === to;

                return (
                    <Link
                        key={to}
                        to={to}
                        className={[
                            "flex flex-col items-center justify-center rounded-2xl border px-2 py-2",
                            "transition active:scale-[0.99]",
                            primary
                                ? "bg-rose-500 text-zinc-950 border-rose-400 hover:bg-rose-400"
                                : "bg-zinc-900/40 border-zinc-800 hover:bg-zinc-900/70",
                            active && !primary ? "border-emerald-500/40 bg-emerald-500/10" : "",
                        ].join(" ")}
                        aria-label={label}
                    >
                        <Icon
                            size={22}
                            className={primary ? "opacity-95" : active ? "text-emerald-300" : "text-zinc-200"}
                        />
                        <span
                            className={[
                                "mt-1 text-[11px] leading-none",
                                primary ? "font-semibold" : "text-zinc-200",
                            ].join(" ")}
                        >
                            {label}
                        </span>
                    </Link>
                );
            })}
        </div>
    );
}
