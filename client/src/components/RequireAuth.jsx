import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RequireAuth({ children }) {
  const { token, loading } = useAuth();
  const loc = useLocation();

  if (loading) return <div className="text-sm text-zinc-600">Loading...</div>;
  if (!token) return <Navigate to="/login" replace state={{ from: loc.pathname }} />;

  return children;
}
