import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";
import { buildSystemPrompt, buildUserPrompt } from "@/lib/prompts";

const PLAN_LIMITS: Record<string, number> = {
  free: 3,
  creator: 30,
  pro: 200,
};

export async function POST(req: NextRequest) {
  const supabase = await supabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = await req.json();
  const { topicOrScript, niche, style, length } = body;

  if (!topicOrScript || typeof topicOrScript !== "string" || topicOrScript.trim().length < 5) {
    return NextResponse.json(
      { error: "Please provide a topic or script (at least a few words)." },
      { status: 400 }
    );
  }
  if (topicOrScript.length > 6000) {
    return NextResponse.json(
      { error: "That input is too long. Please keep it under 6000 characters." },
      { status: 400 }
    );
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) {
    return NextResponse.json({ error: "Profile not found." }, { status: 404 });
  }

  const resetAt = new Date(profile.generations_reset_at);
  const now = new Date();
  let generationsUsed = profile.generations_this_month;
  if (
    now.getMonth() !== resetAt.getMonth() ||
    now.getFullYear() !== resetAt.getFullYear()
  ) {
    generationsUsed = 0;
    await supabase
      .from("profiles")
      .update({ generations_this_month: 0, generations_reset_at: now.toISOString() })
      .eq("id", user.id);
  }

  const limit = PLAN_LIMITS[profile.plan] ?? PLAN_LIMITS.free;
  if (generationsUsed >= limit) {
    return NextResponse.json(
      {
        error: `You've reached your ${profile.plan} plan limit (${limit}/month). Upgrade to generate more.`,
        limitReached: true,
      },
      { status: 403 }
    );
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY!,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 4000,
        system: buildSystemPrompt(),
        messages: [
          { role: "user", content: buildUserPrompt({ topicOrScript, niche, style, length }) },
        ],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Anthropic API error:", errText);
      return NextResponse.json(
        { error: "Generation failed. Please try again in a moment." },
        { status: 502 }
      );
    }

    const data = await response.json();
    const textBlock = data.content.find((b: any) => b.type === "text");
    if (!textBlock) {
      return NextResponse.json({ error: "No content generated." }, { status: 502 });
    }

    let plan;
    try {
      const cleaned = textBlock.text.replace(/```json|```/g, "").trim();
      plan = JSON.parse(cleaned);
    } catch (e) {
      console.error("JSON parse failure:", textBlock.text);
      return NextResponse.json(
        { error: "Generation produced an invalid response. Please try again." },
        { status: 502 }
      );
    }

    await supabase.from("projects").insert({
      user_id: user.id,
      input_topic: topicOrScript,
      niche,
      style,
      length,
      plan_json: plan,
    });

    await supabase
      .from("profiles")
      .update({ generations_this_month: generationsUsed + 1 })
      .eq("id", user.id);

    return NextResponse.json({ plan });
  } catch (err) {
    console.error("Generation error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
