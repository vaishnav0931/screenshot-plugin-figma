import type { Metadata } from "next";
import { ButtonStudioApp } from "@/src/features/button-editor/ButtonStudioApp";

export const metadata: Metadata = {
  title: "Button Studio (Test) — Interactive Button Component Playground",
  description:
    "Design, customize, preview interaction states, manage button variants and design tokens, and export UI button definitions for CSS, SVG, JSON, and Figma.",
};

export default function TestPage() {
  return <ButtonStudioApp />;
}
