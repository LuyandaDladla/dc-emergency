import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import AppShell from "./components/AppShell";

import Home from "./pages/Home";
import SOS from "./pages/SOS";
import Community from "./pages/Community";
import Hotspots from "./pages/Hotspots";
import Risk from "./pages/Risk";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";

import Login from "./pages/Login";
import Register from "./pages/Register";

export default function App() {
    return (
        <Routes>
            <Route element={<AppShell />}>
                <Route path="/" element={<Home />} />
                <Route path="/sos" element={<SOS />} />
                <Route path="/community" element={<Community />} />
                <Route path="/hotspots" element={<Hotspots />} />
                <Route path="/risk" element={<Risk />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/admin" element={<Admin />} />
            </Route>

            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}
