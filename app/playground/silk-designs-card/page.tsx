import SilkDesignsPlaygroundClient from "./SilkDesignsPlaygroundClient";
import { loadSilkDesignsCardSource } from "@/lib/load-source";

export default function SilkDesignsCardPlaygroundPage() {
  const sourceCode = loadSilkDesignsCardSource();
  return <SilkDesignsPlaygroundClient sourceCode={sourceCode} />;
}
