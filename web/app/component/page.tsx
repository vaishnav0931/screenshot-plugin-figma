import ShowcaseClient from "./ShowcaseClient";
import { loadPixelButtonSource } from "@/lib/load-source";

export default function ComponentPage() {
  const sourceCode = loadPixelButtonSource();
  return <ShowcaseClient sourceCode={sourceCode} />;
}
