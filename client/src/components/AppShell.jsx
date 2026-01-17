import React from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Tab({ to, label, icon, primary }) {
  const base =
    "flex flex-col items-center justify-center gap-1 text-xs px-3 py-2 rounded-2xl transition";
  const active = "text-white";
  const inactive = "text-white/55 hover:text-white/80";

  if (primary) {
    return (
      <NavLink
        to={to}
        className={({ isActive }) =>
          base +
          " " +
          (isActive ? active : inactive) +
          " w-20"
        }
      >
        <div className="w-14 h-14 rounded-full bg-red-600 hover:bg-red-500 active:scale-95 transition shadow-xl shadow-red-600/40 flex items-center justify-center">
          <span className="text-xl font-black">{icon}</span>
        </div>
        <div className="text-[10px] font-semibold">{label}</div>
      </NavLink>
    );
  }

  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        base + " " + (isActive ? active : inactive) + " w-20"
      }
    >
      <div className="text-xl">{icon}</div>
      <div className="text-[10px]">{label}</div>
    </NavLink>
  );
}

export default function AppShell({ children }) {
  const { user, logout } = useAuth();
  const loc = useLocation();
  const nav = useNavigate();

  const isAuthPage = loc.pathname === "/login" || loc.pathname === "/register";

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 to-zinc-900 text-white">
      {!isAuthPage && (
        <header className="sticky top-0 z-10 backdrop-blur bg-black/30 border-b border-white/10">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/10 overflow-hidden flex items-center justify-center">
                {user?.avatarUrl ? (
                  <img src={user.avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-sm font-bold">DC</span>
                )}
              </div>
              <div>
                <div className="font-semibold leading-tight">DC Emergency</div>
                <div className="text-xs text-white/55">
                  {user ? `Signed in as ${user.name || user.email || "User"}` : "Not signed in"}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {!user ? (
                <button
                  onClick={() => nav("/login")}
                  className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-sm"
                >
                  Login
                </button>
              ) : (
                <button
                  onClick={logout}
                  className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-sm"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        </header>
      )}

      <main className="max-w-6xl mx-auto px-4 pt-4 pb-28">{children}</main>

      {!isAuthPage && (
        <nav className="fixed bottom-0 left-0 right-0 z-10 backdrop-blur bg-black/35 border-t border-white/10">
          <div className="max-w-6xl mx-auto px-4 py-2 flex items-end justify-center gap-2">
            <Tab to="/" label="Home" icon="âŒ‚" />
            <Tab to="/community" label="Community" icon="âŒ" />
            <Tab to="/sos" label="SOS" icon="SOS" primary />
            <Tab to="/risk" label="Risk" icon="âš " />
            <Tab to="/profile" label="Profile" icon="â˜º" />
          </div>
        </nav>
      )}
    </div>
  );
}