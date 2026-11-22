import fs from "fs";
import path from "path";

/**
 * Load the self-contained PixelPromptButton TSX source for showcase/playground code tabs.
 */
export function loadPixelButtonSource(): string {
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
      // Try next path candidate
    }
  }

  return "// Could not locate components/ui/pixel-prompt-button.tsx";
}

