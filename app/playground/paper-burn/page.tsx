import PaperBurnPlaygroundClient from "./PaperBurnPlaygroundClient";
import { loadPaperBurnSource } from "@/lib/load-source";

export default function PaperBurnPlaygroundPage() {
  const sourceCode = loadPaperBurnSource();
  return <PaperBurnPlaygroundClient sourceCode={sourceCode} />;
}
