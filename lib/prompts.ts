// lib/prompts.ts
// This is the core IP of the product: turning a script/topic into a
// structured, tool-ready video production plan.

export type Niche =
  | "bird facts / nature"
  | "ASMR / satisfying"
  | "history / mystery"
  | "finance / motivation"
  | "kids / storybook"
  | "true crime / dark storytelling"
  | "general faceless narration";

export type VideoStyle =
  | "watercolor storybook"
  | "cinematic realistic"
  | "3D render (Pixar-style)"
  | "flat 2D animation"
  | "live-action stock-style"
  | "ASMR macro/close-up";

export type VideoLength = "short (30-60s)" | "medium (2-4min)" | "long (6-10min)";

interface GenerateInput {
  topicOrScript: string;
  niche: Niche;
  style: VideoStyle;
  length: VideoLength;
}

function sceneTargetFor(length: VideoLength): string {
  switch (length) {
    case "short (30-60s)":
      return "6-9 scenes, each 4-8 seconds";
    case "medium (2-4min)":
      return "12-20 scenes, each 8-15 seconds";
    case "long (6-10min)":
      return "25-40 scenes, each 10-20 seconds";
  }
}

export function buildSystemPrompt(): string {
  return `You are a professional video production planner specializing in AI-generated faceless video content (using tools like Kling, Hailuo, Runway, and Pika). You have deep practical experience with what actually produces good, consistent AI video output — you know how to write prompts that avoid common AI video failure modes (morphing, inconsistent characters, unclear camera direction) and you write prompts the way an experienced faceless-channel creator would, not like a generic scriptwriter.

You ALWAYS respond with valid JSON only — no markdown fences, no preamble, no commentary. The JSON must match this exact shape:

{
  "title_suggestions": string[3],
  "hook_options": string[3],
  "scenes": [
    {
      "scene_number": number,
      "voiceover_segment": string,
      "on_screen_text": string,
      "shot_description": string,
      "ai_video_prompt": string,
      "duration_seconds": number,
      "camera_notes": string
    }
  ],
  "production_notes": string
}

Rules for ai_video_prompt: Write it exactly as the creator would paste it into Kling or Hailuo. Include subject, setting, lighting, camera movement, art style, and mood. Keep consistent style descriptors across all scenes so the video looks cohesive. Do not include dialogue in the video prompt — voiceover is separate and added in post.

Rules for production_notes: 2-4 sentences of practical advice specific to this content (e.g. pacing tips, where to add music swells, common pitfalls for this niche).`;
}

export function buildUserPrompt(input: GenerateInput): string {
  return `Create a complete video production plan.

TOPIC OR SCRIPT PROVIDED BY CREATOR:
"""
${input.topicOrScript}
"""

NICHE: ${input.niche}
VISUAL STYLE: ${input.style}
TARGET LENGTH: ${input.length}
SCENE GUIDANCE: ${sceneTargetFor(input.length)}

Break this into a scene-by-scene production plan following the JSON schema exactly. Make sure the ai_video_prompt fields share consistent style language so a viewer would perceive one cohesive video, not disconnected clips.`;
}

export interface Scene {
  scene_number: number;
  voiceover_segment: string;
  on_screen_text: string;
  shot_description: string;
  ai_video_prompt: string;
  duration_seconds: number;
  camera_notes: string;
}

export interface ProductionPlan {
  title_suggestions: string[];
  hook_options: string[];
  scenes: Scene[];
  production_notes: string;
}
