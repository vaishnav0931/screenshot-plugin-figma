import fs from "fs";
import path from "path";

function loadComponentSource(relPath: string): string {
  const file = path.join(process.cwd(), "components", "ui", relPath);
  try {
    if (fs.existsSync(file)) {
      return fs.readFileSync(file, "utf8");
    }
  } catch {
    // Fallback below
  }

  return `// Could not locate components/ui/${relPath}`;
}

/**
 * Load the self-contained PixelPromptButton TSX source for showcase/playground code tabs.
 */
export function loadPixelButtonSource(): string {
  return loadComponentSource("pixel-prompt-button.tsx");
}

/**
 * Load the self-contained HeatDistortion TSX source for studio code export.
 */
export function loadHeatDistortionSource(): string {
  return loadComponentSource("heat-distortion.tsx");
}

/**
 * Load the self-contained PaperBurn TSX source for studio code export.
 */
export function loadPaperBurnSource(): string {
  return loadComponentSource("paper-burn.tsx");
}
