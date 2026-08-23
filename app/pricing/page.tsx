"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase";

const PLANS = [
  {
    id: "free",
    name: "Free",
    price: "€0",
    period: "",
    features: ["3 video plans / month", "All niches & styles", "Copy & export plans"],
    cta: "Start free",
    highlight: false,
  },
  {
    id: "creator",
    name: "Creator",
    price: "€19",
    period: "/month",
    features: [
      "30 video plans / month",
      "All niches & styles",
      "Save unlimited projects",
      "Priority generation speed",
    ],
    cta: "Start Creator plan",
    highlight: true,
  },
  {
    id: "pro",
    name: "Pro",
    price: "€39",
    period: "/month",
    features: [
      "Generous monthly plan volume for daily creators",
      "Everything in Creator",
      "Early access to new features",
      "Priority support",
    ],
    cta: "Start Pro plan",
    highlight: false,
  },
];

export default function PricingPage() {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const router = useRouter();

  async function handleSelect(planId: string) {
    if (planId === "free") {
      router.push("/signup");
      return;
    }
    setLoadingPlan(planId);
    const supabase = supabaseBrowser();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push(`/signup?plan=${planId}`);
      return;
    }

    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan: planId }),
    });
    const data = await res.json();
    setLoadingPlan(null);
    if (data.url) {
      window.location.href = data.url;
    }
  }

  return (
    <main className="min-h-screen max-w-5xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold text-center mb-2">Simple pricing</h1>
      <p className="text-neutral-400 text-center mb-12">
        Cancel anytime. Prices in EUR, billed monthly.
      </p>
      <div className="grid md:grid-cols-3 gap-6">
        {PLANS.map((p) => (
          <div
            key={p.name}
            className={`rounded-xl p-6 border ${
              p.highlight
                ? "border-amber-400 bg-neutral-900"
                : "border-neutral-800 bg-neutral-900/50"
            }`}
          >
            {p.highlight && (
              <span className="text-xs font-medium text-amber-400 uppercase tracking-wide">
                Most popular
              </span>
            )}
            <h2 className="text-xl font-semibold mt-2">{p.name}</h2>
            <div className="mt-2 mb-4">
              <span className="text-3xl font-bold">{p.price}</span>
              <span className="text-neutral-400">{p.period}</span>
            </div>
            <ul className="space-y-2 mb-6 text-sm text-neutral-300">
              {p.features.map((f) => (
                <li key={f}>✓ {f}</li>
              ))}
            </ul>
            <button
              onClick={() => handleSelect(p.id)}
              disabled={loadingPlan === p.id}
              className={`w-full text-center rounded-lg py-2.5 font-medium disabled:opacity-50 ${
                p.highlight
                  ? "bg-amber-400 text-neutral-950 hover:bg-amber-300"
                  : "bg-neutral-800 hover:bg-neutral-700"
              }`}
            >
              {loadingPlan === p.id ? "Redirecting..." : p.cta}
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
