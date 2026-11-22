import PlaygroundClient from "./PlaygroundClient";
import { loadPixelButtonSource } from "@/lib/load-source";

export default function PlaygroundPage() {
  const sourceCode = loadPixelButtonSource();
  return <PlaygroundClient sourceCode={sourceCode} />;
}
