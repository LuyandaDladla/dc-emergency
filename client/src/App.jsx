import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import AppShell from "./components/AppShell.jsx";

import Home from "./pages/Home.jsx";
import SOS from "./pages/SOS.jsx";
import Community from "./pages/Community.jsx";
import Hotspots from "./pages/Hotspots.jsx";
import Risk from "./pages/Risk.jsx";
import Therapist from "./pages/Therapist.jsx";
import Profile from "./pages/Profile.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";

export default function App() {
    return (
        <Routes>
            {/* Auth */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* App */}
            <Route
                path="/"
                element={
                    <AppShell>
                        <Home />
                    </AppShell>
                }
            />
            <Route
                path="/sos"
                element={
                    <AppShell>
                        <SOS />
                    </AppShell>
                }
            />
            <Route
                path="/community"
                element={
                    <AppShell>
                        <Community />
                    </AppShell>
                }
            />
            <Route
                path="/hotspots"
                element={
                    <AppShell>
                        <Hotspots />
                    </AppShell>
                }
            />
            <Route
                path="/risk"
                element={
                    <AppShell>
                        <Risk />
                    </AppShell>
                }
            />
            <Route
                path="/therapist"
                element={
                    <AppShell>
                        <Therapist />
                    </AppShell>
                }
            />
            <Route
                path="/profile"
                element={
                    <AppShell>
                        <Profile />
                    </AppShell>
                }
            />

            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}
