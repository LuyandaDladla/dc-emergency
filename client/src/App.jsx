import React from "react";
import { Routes, Route } from "react-router-dom";
import AppShell from "./components/AppShell";
import RequireAuth from "./components/RequireAuth";

import Home from "./pages/Home";
import SOS from "./pages/SOS";
import Community from "./pages/Community";
import Risk from "./pages/Risk";
import Therapist from "./pages/Therapist";
import Profile from "./pages/Profile";

import Login from "./pages/Login";
import Register from "./pages/Register";

export default function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/" element={<RequireAuth><Home /></RequireAuth>} />
        <Route path="/sos" element={<RequireAuth><SOS /></RequireAuth>} />
        <Route path="/community" element={<RequireAuth><Community /></RequireAuth>} />
        <Route path="/risk" element={<RequireAuth><Risk /></RequireAuth>} />
        <Route path="/therapist" element={<RequireAuth><Therapist /></RequireAuth>} />
        <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
      </Routes>
    </AppShell>
  );
}
