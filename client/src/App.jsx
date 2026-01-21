import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import AppShell from "./components/AppShell";
import Home from "./pages/Home";
import SOS from "./pages/SOS";
import Community from "./pages/Community";
import Hotspots from "./pages/Hotspots";
import LiveChat from "./pages/LiveChat";
import Risk from "./pages/Risk";
import Profile from "./pages/Profile";
import Therapist from "./pages/Therapist";
import Login from "./pages/Login";
import Register from "./pages/Register";

import { useAuth } from "./context/AuthContext";

function Protected({ children }) {
    const { token, loading } = useAuth();
    if (loading) return <div className="p-6 text-white/70">Loading…</div>;
    if (!token) return <Navigate to="/login" replace />;
    return children;
}

export default function App() {
    return (
        <Routes>
            <Route element={<AppShell />}>
                <Route path="/" element={<Home />} />
                <Route path="/sos" element={<SOS />} />
                <Route path="/community" element={<Community />} />
                <Route path="/hotspots" element={<Hotspots />} />
                <Route path="/chat" element={<LiveChat />} />
                <Route path="/risk" element={<Risk />} />
                <Route path="/therapist" element={<Therapist />} />
                <Route
                    path="/profile"
                    element={
                        <Protected>
                            <Profile />
                        </Protected>
                    }
                />
            </Route>

            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
        </Routes>
    );
}
