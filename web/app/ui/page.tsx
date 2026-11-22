import ShowcaseClient from "../component/ShowcaseClient";
import { loadPixelButtonSource } from "@/lib/load-source";

export default function UiPage() {
  const sourceCode = loadPixelButtonSource();
  return <ShowcaseClient sourceCode={sourceCode} />;
}
