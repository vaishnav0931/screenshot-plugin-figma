import PixelPlaygroundClient from "./PixelPlaygroundClient";
import { loadPixelButtonSource } from "@/lib/load-source";

export default function PixelPromptButtonPlaygroundPage() {
  const sourceCode = loadPixelButtonSource();
  return <PixelPlaygroundClient sourceCode={sourceCode} />;
}
