import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import SOS from "./pages/SOS.jsx";
import Community from "./pages/Community.jsx";
import Risk from "./pages/Risk.jsx";
import Therapist from "./pages/Therapist.jsx";
import Profile from "./pages/Profile.jsx";
import AppShell from "./components/AppShell.jsx";
import { useAuth } from "./context/AuthContext.jsx";

function Protected({ children }) {
  const ctx = useAuth();
  const user = ctx?.user;
  const loading = ctx?.loading;
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

        <Route path="/" element={<Protected><SOS /></Protected>} />
        <Route path="/community" element={<Protected><Community /></Protected>} />
        <Route path="/risk" element={<Protected><Risk /></Protected>} />
        <Route path="/therapist" element={<Protected><Therapist /></Protected>} />
        <Route path="/profile" element={<Protected><Profile /></Protected>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppShell>
  );
}