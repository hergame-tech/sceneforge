import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SceneForge — AI Video Production Plans for Faceless Creators",
  description:
    "Turn any script or topic into a complete, ready-to-shoot AI video production plan — scenes, prompts, pacing, and hooks in seconds.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-neutral-950 text-neutral-100 antialiased">{children}</body>
    </html>
  );
}
