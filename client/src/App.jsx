import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AppShell from "./components/AppShell";
import Home from "./pages/Home";
import SOS from "./pages/SOS";
import Community from "./pages/Community";
import Therapist from "./pages/Therapist";
import Risk from "./pages/Risk";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { useAuth } from "./context/AuthContext";
import Chat from "./pages/Chat";
import Admin from "./pages/Admin";



function Protected({ children }) {
    const { token, loading } = useAuth();
    if (loading) return <div className="card card-pad">Loading…</div>;
    if (!token) return <Navigate to="/login" replace />;
    return children;
}

export default function App() {
    return (
        <Routes>
            <Route element={<AppShell />}>
                <Route
                    path="/"
                    element={
                        <Protected>
                            <Home />
                        </Protected>
                    }
                />
                <Route path="/admin" element={<Admin />} />

                <Route
                    path="/sos"
                    element={
                        <Protected>
                            <SOS />
                        </Protected>
                    }
                />
                <Route
                    path="/community"
                    element={
                        <Protected>
                            <Community />
                        </Protected>
                    }
                />
                <Route
                    path="/therapist"
                    element={
                        <Protected>
                            <Therapist />
                        </Protected>
                    }
                />
                <Route
                    path="/risk"
                    element={
                        <Protected>
                            <Risk />
                        </Protected>
                    }
                />
                <Route
                    path="/profile"
                    element={
                        <Protected>
                            <Profile />
                        </Protected>
                    }
                />
            </Route>
            <Route path="/chat" element={<Chat />} />

            
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}
