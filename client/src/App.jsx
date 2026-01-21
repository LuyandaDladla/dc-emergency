// client/src/App.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import AppShell from "./components/AppShell";

import Home from "./pages/Home";
import SOS from "./pages/SOS";
import Community from "./pages/Community";
import Hotspots from "./pages/Hotspots";

import Login from "./pages/Login";
import Register from "./pages/Register";

// Optional placeholders if you have them later:
// import Profile from "./pages/Profile";
// import Risk from "./pages/Risk";

function Placeholder({ title }) {
    return (
        <div className="glass rounded-3xl p-4">
            <div className="text-lg font-semibold">{title}</div>
            <div className="mt-1 text-sm text-white/70">Coming in Phase 3.</div>
        </div>
    );
}

export default function App() {
    return (
        <Routes>
            <Route element={<AppShell />}>
                <Route path="/" element={<Home />} />
                <Route path="/sos" element={<SOS />} />
                <Route path="/community" element={<Community />} />
                <Route path="/hotspots" element={<Hotspots />} />
                <Route path="/chat" element={<Placeholder title="Live Chat (demo)" />} />
                <Route path="/profile" element={<Placeholder title="Profile" />} />
            </Route>

            {/* Auth screens (still use AppShell background, but BottomNav auto hides) */}
            <Route element={<AppShell />}>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}
