import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import AppShell from "./components/AppShell";
import Home from "./pages/Home";
import Community from "./pages/Community";
import Risk from "./pages/Risk";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import SOS from "./pages/SOS";
import { useAuth } from "./context/AuthContext";

function Protected({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="p-6 text-white/70">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/" element={<Protected><Home /></Protected>} />
        <Route path="/community" element={<Protected><Community /></Protected>} />
        <Route path="/sos" element={<Protected><SOS /></Protected>} />
        <Route path="/risk" element={<Protected><Risk /></Protected>} />
        <Route path="/profile" element={<Protected><Profile /></Protected>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppShell>
  );
}