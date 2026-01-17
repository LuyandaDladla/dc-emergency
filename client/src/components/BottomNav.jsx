import { NavLink, useLocation } from "react-router-dom";

function Tab({ to, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        "flex-1 text-center py-3 text-xs " +
        (isActive ? "text-white" : "text-white/60 hover:text-white")
      }
    >
      {label}
    </NavLink>
  );
}

export default function BottomNav() {
  const { pathname } = useLocation();
  const hide = pathname === "/login" || pathname === "/register";
  if (hide) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black/90 border-t border-white/10 backdrop-blur">
      <div className="mx-auto max-w-md flex">
        <Tab to="/" label="SOS" />
        <Tab to="/community" label="Community" />
        <Tab to="/risk" label="Risk" />
        <Tab to="/profile" label="Profile" />
      </div>
    </div>
  );
}