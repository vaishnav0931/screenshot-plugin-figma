import HeatDistortionPlaygroundClient from "./HeatDistortionPlaygroundClient";
import { loadHeatDistortionSource } from "@/lib/load-source";

export default function HeatDistortionPlaygroundPage() {
  const sourceCode = loadHeatDistortionSource();
  return <HeatDistortionPlaygroundClient sourceCode={sourceCode} />;
}
