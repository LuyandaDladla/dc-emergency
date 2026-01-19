import React from "react";
import { NavLink, useLocation } from "react-router-dom";

function TopBar() {
  return (
    <div className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-zinc-200">
      <div className="mx-auto w-[92%] max-w-2xl py-3 flex items-center justify-between">
        <div className="font-black tracking-tight text-zinc-900">DC Emergency</div>
        <div className="text-xs font-semibold text-zinc-600">South Africa</div>
      </div>
    </div>
  );
}

function BottomNav() {
  const linkBase = "flex-1 py-2 text-xs font-semibold flex flex-col items-center gap-1 rounded-xl";
  const active = "bg-zinc-100 text-zinc-900";
  const idle = "text-zinc-600 hover:bg-zinc-50";

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur border-t border-zinc-200">
      <div className="mx-auto w-[92%] max-w-2xl py-2 grid grid-cols-5 gap-2">
        <NavLink to="/" className={({isActive}) => linkBase + " " + (isActive ? active : idle)}>Home</NavLink>
        <NavLink to="/sos" className={({isActive}) => linkBase + " " + (isActive ? active : idle)}>SOS</NavLink>
        <NavLink to="/community" className={({isActive}) => linkBase + " " + (isActive ? active : idle)}>Community</NavLink>
        <NavLink to="/risk" className={({isActive}) => linkBase + " " + (isActive ? active : idle)}>Risk</NavLink>
        <NavLink to="/profile" className={({isActive}) => linkBase + " " + (isActive ? active : idle)}>Profile</NavLink>
      </div>
    </div>
  );
}

export default function AppShell({ children }) {
  const { pathname } = useLocation();
  const hideNav = pathname.startsWith("/login") || pathname.startsWith("/register");

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <TopBar />
      <main className={"mx-auto w-[92%] max-w-2xl py-5 " + (hideNav ? "" : "pb-24")}>
        {children}
      </main>
      {hideNav ? null : <BottomNav />}
    </div>
  );
}
