import fs from "fs";
import path from "path";
import ShowcaseClient from "./component/ShowcaseClient";

function loadComponentSource(): string {
  const candidates = [
    path.join(process.cwd(), "components", "ui", "pixel-prompt-button.tsx"),
    path.join(process.cwd(), "web", "components", "ui", "pixel-prompt-button.tsx")
  ];
  for (const file of candidates) {
    try {
      if (fs.existsSync(file)) {
        return fs.readFileSync(file, "utf8");
      }
    } catch {
      // try next candidate
    }
  }
  return "// Could not locate components/ui/pixel-prompt-button.tsx";
}

export default function HomePage() {
  const sourceCode = loadComponentSource();
  return <ShowcaseClient sourceCode={sourceCode} />;
}
