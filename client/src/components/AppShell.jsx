import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

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

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-zinc-900/80 bg-zinc-950/80 backdrop-blur">
        <div className="mx-auto grid max-w-5xl grid-cols-5 gap-2 px-2 py-2">
          {nav.slice(0, 2).map((n) => (
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
