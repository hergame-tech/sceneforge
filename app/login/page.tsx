"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
  e.preventDefault();
  setError("");
  setLoading(true);
  const res = await fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  setLoading(false);
  if (!res.ok) {
    setError(data.error || "Login failed");
    return;
  }
  window.location.href = "/dashboard";
}

  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <form onSubmit={handleLogin} className="w-full max-w-sm bg-neutral-900 border border-neutral-800 rounded-xl p-8">
        <h1 className="text-2xl font-bold mb-6 text-center">Welcome back</h1>
        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
        <label className="block text-sm mb-1 text-neutral-400">Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 px-3 py-2 rounded-lg bg-neutral-800 border border-neutral-700 focus:outline-none focus:border-amber-400"
        />
        <label className="block text-sm mb-1 text-neutral-400">Password</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-6 px-3 py-2 rounded-lg bg-neutral-800 border border-neutral-700 focus:outline-none focus:border-amber-400"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-amber-400 text-neutral-950 font-semibold py-2.5 rounded-lg hover:bg-amber-300 disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Log in"}
        </button>
        <p className="text-sm text-neutral-500 text-center mt-4">
          No account?{" "}
          <Link href="/signup" className="text-amber-400">
            Sign up
          </Link>
        </p>
      </form>
    </main>
  );
}
