import { Routes, Route, Navigate, NavLink } from "react-router-dom";
import Feed from "./pages/Feed.jsx";
import Community from "./pages/Community.jsx";
import Therapist from "./pages/Therapist.jsx";
import SOS from "./pages/SOS.jsx";
import Risk from "./pages/Risk.jsx";
import Profile from "./pages/Profile.jsx";
import Admin from "./pages/Admin.jsx";

export default function App(){
  return (
    <div className="container">
      <Routes>
        <Route path="/" element={<Feed />} />
        <Route path="/community" element={<Community />} />
        <Route path="/therapist" element={<Therapist />} />
        <Route path="/sos" element={<SOS />} />
        <Route path="/risk" element={<Risk />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <NavLink to="/sos" className="sosFab">SOS</NavLink>

      <nav className="nav">
        <NavLink to="/" end className={({isActive}) => isActive ? "active" : ""}>Home</NavLink>
        <NavLink to="/community" className={({isActive}) => isActive ? "active" : ""}>Community</NavLink>
        <NavLink to="/therapist" className={({isActive}) => isActive ? "active" : ""}>Therapist</NavLink>
        <NavLink to="/risk" className={({isActive}) => isActive ? "active" : ""}>Risk</NavLink>
        <NavLink to="/profile" className={({isActive}) => isActive ? "active" : ""}>Profile</NavLink>
      </nav>
    </div>
  );
}