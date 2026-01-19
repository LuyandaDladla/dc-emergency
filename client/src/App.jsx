import { Routes, Route, Navigate } from "react-router-dom";
import AppShell from "./components/AppShell";
import Home from "./pages/Home";
import SOS from "./pages/SOS";
import Login from "./pages/Login";
import Register from "./pages/Register";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<AppShell />}>
        <Route path="/" element={<Home />} />
        <Route path="/sos" element={<SOS />} />
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
