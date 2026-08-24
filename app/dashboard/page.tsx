import { redirect } from "next/navigation";
import Link from "next/link";
import { supabaseServer } from "@/lib/supabase-server";

const PLAN_LIMITS: Record<string, number> = { free: 3, creator: 30, pro: 200 };

export default async function DashboardPage() {
  const supabase = await supabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  const { data: projects } = await supabase
    .from("projects")
    .select("id, input_topic, niche, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(20);

  const limit = PLAN_LIMITS[profile?.plan ?? "free"];
  const used = profile?.generations_this_month ?? 0;

  return (
    <main className="min-h-screen max-w-5xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Your projects</h1>
        <Link
          href="/generate"
          className="bg-amber-400 text-neutral-950 font-semibold px-4 py-2 rounded-lg hover:bg-amber-300"
        >
          + New video plan
        </Link>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 mb-8 flex items-center justify-between">
        <span className="text-sm text-neutral-400">
          Plan: <span className="text-white font-medium capitalize">{profile?.plan ?? "free"}</span>
        </span>
        <span className="text-sm text-neutral-400">
          {used} / {limit} generations used this month
        </span>
        {profile?.plan === "free" && (
          <Link href="/pricing" className="text-sm text-amber-400 hover:underline">
            Upgrade
          </Link>
        )}
      </div>

      {(!projects || projects.length === 0) && (
        <p className="text-neutral-500 text-center py-16">
          No projects yet. Create your first video production plan.
        </p>
      )}

      <div className="grid gap-3">
        {projects?.map((p) => (
          <div key={p.id} className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
            <p className="font-medium truncate">{p.input_topic}</p>
            <p className="text-sm text-neutral-500">
              {p.niche} · {new Date(p.created_at).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}
