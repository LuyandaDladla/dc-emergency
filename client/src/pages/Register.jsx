import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import Spinner from "../components/ui/Spinner";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function Register() {
  const { register } = useAuth();
  const toast = useToast();
  const nav = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    try {
      await register(email.trim(), password, name.trim());
      toast.success("Account created. You are signed in.");
      nav("/", { replace: true });
    } catch (err) {
      toast.error((err && err.message) ? err.message : "Register failed. Try a different email.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-md pt-6">
      <Card className="p-5">
        <div className="mb-4">
          <div className="text-xl font-black tracking-tight">Create your account</div>
          <div className="text-sm text-zinc-600">Takes less than a minute.</div>
        </div>

        <form onSubmit={submit} className="space-y-3">
          <Input
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Luyanda"
          />

          <Input
            label="Email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />

          <div className="space-y-1">
            <Input
              label="Password"
              type={show ? "text" : "password"}
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              required
            />
            <button
              type="button"
              className="text-xs font-semibold text-zinc-700 hover:text-zinc-900"
              onClick={() => setShow((s) => !s)}
            >
              {show ? "Hide password" : "Show password"}
            </button>
          </div>

          <Button type="submit" className="w-full" disabled={busy}>
            {busy ? (<><Spinner /> Creating...</>) : "Create account"}
          </Button>

          <div className="text-sm text-zinc-600 text-center">
            Already have an account?{" "}
            <Link className="font-bold text-zinc-900 hover:underline" to="/login">
              Sign in
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
}
