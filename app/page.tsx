import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      <nav className="flex items-center justify-between px-6 py-5 max-w-6xl mx-auto">
        <span className="text-xl font-semibold tracking-tight">
          Scene<span className="text-amber-400">Forge</span>
        </span>
        <div className="flex gap-4 items-center">
          <Link href="/pricing" className="text-sm text-neutral-300 hover:text-white">
            Pricing
          </Link>
          <Link href="/login" className="text-sm text-neutral-300 hover:text-white">
            Log in
          </Link>
          <Link
            href="/signup"
            className="text-sm bg-amber-400 text-neutral-950 font-medium px-4 py-2 rounded-lg hover:bg-amber-300"
          >
            Start free
          </Link>
        </div>
      </nav>

      <section className="max-w-4xl mx-auto text-center px-6 pt-16 pb-20">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight">
          Turn one idea into a complete
          <br />
          <span className="text-amber-400">AI video production plan</span>
        </h1>
        <p className="mt-6 text-lg text-neutral-400 max-w-2xl mx-auto">
          Paste a script or topic. Get a scene-by-scene breakdown with ready-to-paste
          Kling/Hailuo prompts, pacing, on-screen text, and hooks — built for faceless
          creators who ship videos daily.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link
            href="/signup"
            className="bg-amber-400 text-neutral-950 font-semibold px-6 py-3 rounded-lg hover:bg-amber-300"
          >
            Generate your first plan free
          </Link>
        </div>
        <p className="mt-3 text-sm text-neutral-500">No credit card required · 3 free plans/month</p>
      </section>

      <section className="max-w-5xl mx-auto px-6 pb-24 grid md:grid-cols-3 gap-6">
        {[
          {
            title: "Scene-by-scene breakdown",
            desc: "Every video split into shots with duration, pacing, and camera direction already worked out.",
          },
          {
            title: "AI-video-ready prompts",
            desc: "Each scene comes with a prompt written the way an experienced creator would write it for Kling or Hailuo — consistent style, no morphing chaos.",
          },
          {
            title: "Hooks, titles & on-screen text",
            desc: "Get 3 title options and 3 hook openings per plan, plus on-screen text suggestions for every scene.",
          },
        ].map((f) => (
          <div key={f.title} className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
            <h3 className="font-semibold mb-2">{f.title}</h3>
            <p className="text-sm text-neutral-400">{f.desc}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
