"use client";
import { useState } from "react";

const NICHES = [
  "bird facts / nature",
  "ASMR / satisfying",
  "history / mystery",
  "finance / motivation",
  "kids / storybook",
  "true crime / dark storytelling",
  "general faceless narration",
];
const STYLES = [
  "watercolor storybook",
  "cinematic realistic",
  "3D render (Pixar-style)",
  "flat 2D animation",
  "live-action stock-style",
  "ASMR macro/close-up",
];
const LENGTHS = ["short (30-60s)", "medium (2-4min)", "long (6-10min)"];

export default function GeneratePage() {
  const [topicOrScript, setTopic] = useState("");
  const [niche, setNiche] = useState(NICHES[0]);
  const [style, setStyle] = useState(STYLES[0]);
  const [length, setLength] = useState(LENGTHS[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [plan, setPlan] = useState<any>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  async function handleGenerate() {
    setError("");
    setPlan(null);
    setLoading(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topicOrScript, niche, style, length }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Generation failed.");
        return;
      }
      setPlan(data.plan);
    } catch (e) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function copy(text: string, id: string) {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  }

  return (
    <main className="min-h-screen max-w-3xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold mb-6">New video plan</h1>

      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 space-y-4 mb-8">
        <div>
          <label className="text-sm text-neutral-400 block mb-1">Topic or script</label>
          <textarea
            value={topicOrScript}
            onChange={(e) => setTopic(e.target.value)}
            rows={5}
            maxLength={6000}
            placeholder="e.g. 'Why crows can recognize human faces and hold grudges for years' — or paste a full script"
            className="w-full px-3 py-2 rounded-lg bg-neutral-800 border border-neutral-700 focus:outline-none focus:border-amber-400"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <select value={niche} onChange={(e) => setNiche(e.target.value)} className="px-3 py-2 rounded-lg bg-neutral-800 border border-neutral-700">
            {NICHES.map((n) => <option key={n}>{n}</option>)}
          </select>
          <select value={style} onChange={(e) => setStyle(e.target.value)} className="px-3 py-2 rounded-lg bg-neutral-800 border border-neutral-700">
            {STYLES.map((s) => <option key={s}>{s}</option>)}
          </select>
          <select value={length} onChange={(e) => setLength(e.target.value)} className="px-3 py-2 rounded-lg bg-neutral-800 border border-neutral-700">
            {LENGTHS.map((l) => <option key={l}>{l}</option>)}
          </select>
        </div>
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <button
          onClick={handleGenerate}
          disabled={loading || topicOrScript.trim().length < 5}
          className="w-full bg-amber-400 text-neutral-950 font-semibold py-3 rounded-lg hover:bg-amber-300 disabled:opacity-50"
        >
          {loading ? "Generating plan..." : "Generate production plan"}
        </button>
      </div>

      {plan && (
        <div className="space-y-6">
          <section>
            <h2 className="font-semibold mb-2">Title suggestions</h2>
            {plan.title_suggestions?.map((t: string, i: number) => (
              <div key={i} className="flex justify-between items-center bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-2 mb-2">
                <span className="text-sm">{t}</span>
                <button onClick={() => copy(t, `title-${i}`)} className="text-xs text-amber-400">
                  {copiedId === `title-${i}` ? "Copied" : "Copy"}
                </button>
              </div>
            ))}
          </section>

          <section>
            <h2 className="font-semibold mb-2">Hook options</h2>
            {plan.hook_options?.map((h: string, i: number) => (
              <div key={i} className="flex justify-between items-center bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-2 mb-2">
                <span className="text-sm">{h}</span>
                <button onClick={() => copy(h, `hook-${i}`)} className="text-xs text-amber-400">
                  {copiedId === `hook-${i}` ? "Copied" : "Copy"}
                </button>
              </div>
            ))}
          </section>

          <section>
            <h2 className="font-semibold mb-3">Scenes</h2>
            <div className="space-y-4">
              {plan.scenes?.map((s: any) => (
                <div key={s.scene_number} className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
                  <div className="flex justify-between text-sm text-neutral-500 mb-2">
                    <span>Scene {s.scene_number}</span>
                    <span>{s.duration_seconds}s</span>
                  </div>
                  <p className="text-sm mb-2"><span className="text-neutral-500">Voiceover:</span> {s.voiceover_segment}</p>
                  <p className="text-sm mb-2"><span className="text-neutral-500">On-screen text:</span> {s.on_screen_text}</p>
                  <p className="text-sm mb-2"><span className="text-neutral-500">Shot:</span> {s.shot_description}</p>
                  <p className="text-sm mb-2"><span className="text-neutral-500">Camera:</span> {s.camera_notes}</p>
                  <div className="bg-neutral-800 rounded-lg p-3 mt-2">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-amber-400 font-medium">AI video prompt</span>
                      <button
                        onClick={() => copy(s.ai_video_prompt, `scene-${s.scene_number}`)}
                        className="text-xs text-amber-400"
                      >
                        {copiedId === `scene-${s.scene_number}` ? "Copied" : "Copy"}
                      </button>
                    </div>
                    <p className="text-sm text-neutral-300">{s.ai_video_prompt}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {plan.production_notes && (
            <section className="bg-neutral-900 border border-amber-400/30 rounded-xl p-4">
              <h2 className="font-semibold mb-1 text-amber-400">Production notes</h2>
              <p className="text-sm text-neutral-300">{plan.production_notes}</p>
            </section>
          )}
        </div>
      )}
    </main>
  );
}
