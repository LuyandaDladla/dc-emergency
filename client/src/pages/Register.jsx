import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const nav = useNavigate();
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      await register(name, email, password);
      nav("/");
    } catch (e2) {
      setErr(e2?.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-[calc(100vh-40px)] flex items-center justify-center p-6">
      <form onSubmit={submit} className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-6 space-y-4">
        <div>
          <div className="text-2xl font-bold">Create account</div>
          <div className="text-sm text-white/60 mt-1">Start safer, faster.</div>
        </div>

        {err && <div className="text-sm text-red-200 bg-red-500/10 border border-red-500/20 rounded-2xl px-4 py-3">{err}</div>}

        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name"
          className="w-full bg-black/20 border border-white/10 rounded-2xl px-4 py-3" />
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email"
          className="w-full bg-black/20 border border-white/10 rounded-2xl px-4 py-3" />
        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password"
          className="w-full bg-black/20 border border-white/10 rounded-2xl px-4 py-3" />

        <button className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-white/10 hover:bg-white/15 font-semibold">
          Register
        </button>

        <div className="text-sm text-white/60">
          Already have an account? <Link className="text-white underline" to="/login">Login</Link>
        </div>
      </form>
    </div>
  );
}