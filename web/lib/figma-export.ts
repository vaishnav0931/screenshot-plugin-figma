import {
  buildDynamicMosaicGrid,
  derivePixelPalette,
  type PixelPromptButtonSize
} from "@/components/ui/pixel-prompt-button";

const SIZE_SPECS: Record<
  PixelPromptButtonSize,
  { w: number; h: number; padL: number; padR: number; fontSize: number; bolt: number }
> = {
  lg: { w: 472, h: 77, padL: 32, padR: 34, fontSize: 22, bolt: 24 },
  md: { w: 310, h: 50, padL: 20, padR: 22, fontSize: 14.5, bolt: 17 },
  sm: { w: 236, h: 38, padL: 15, padR: 16, fontSize: 12, bolt: 14 }
};

function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/**
 * Build a self-contained SVG of PixelPromptButton using Figma-safe attributes
 * (hex stop-colors with explicit stop-opacity, clipPath, editable <text>, vector bolt).
 */
export function buildPixelPromptButtonSvg({
  label = "Generate & copy prompt",
  size = "lg",
  showIcon = true,
  baseColor = "#2c5cf5",
  highlightColor = "#bfd6ff",
  hoverGradientColor,
  textColor = "#ffffff",
  pixelSize = 8,
  pixelGap = 1,
  pixelRadius = 0,
  pixelContrast = 65,
  gradientStart = 100,
  gradientEnd = 0
}: {
  label?: string;
  size?: PixelPromptButtonSize;
  showIcon?: boolean;
  baseColor?: string;
  highlightColor?: string;
  hoverGradientColor?: string;
  textColor?: string;
  pixelSize?: number;
  pixelGap?: number;
  pixelRadius?: number;
  pixelContrast?: number;
  gradientStart?: number;
  gradientEnd?: number;
}): string {
  const { w, h, padL, padR, fontSize, bolt } = SIZE_SPECS[size];
  const outerRx = +(h / 2).toFixed(2);
  const innerW = w - 3;
  const innerH = h - 3;
  const innerRx = +(innerH / 2).toFixed(2);

  const palette = derivePixelPalette(
    baseColor,
    highlightColor,
    pixelContrast,
    hoverGradientColor
  );
  const grid = buildDynamicMosaicGrid(pixelSize, pixelGap, palette);

  const srcW = grid.viewBoxW;
  const srcH = grid.viewBoxH;
  const scale = Math.max(innerW / srcW, innerH / srcH);
  const offsetX = 1.5 + (innerW - srcW * scale) / 2;
  const offsetY = 1.5 + (innerH - srcH * scale) / 2;
  const cellW = +(grid.cell * scale).toFixed(2);
  const cellH = +(grid.cell * scale).toFixed(2);
  const clampedRx = Math.min(4, Math.max(0, pixelRadius));
  const scaledRx = +(clampedRx * scale).toFixed(2);
  const rxAttr = scaledRx > 0 ? ` rx="${scaledRx}" ry="${scaledRx}"` : "";
  const startLvl = Math.min(1, Math.max(0, gradientStart / 100));
  const endLvl = Math.min(1, Math.max(0, gradientEnd / 100));

  const rects = grid.cells
    .map((cell) => {
      const x = +(offsetX + cell.x * scale).toFixed(2);
      const y = +(offsetY + cell.y * scale).toFixed(2);
      const rowNorm = grid.rows > 1 ? cell.r / (grid.rows - 1) : 0;
      const colNorm = grid.cols > 1 ? cell.c / (grid.cols - 1) : 0.5;
      const gradT = 1 - rowNorm;
      const gradSpan = endLvl + (startLvl - endLvl) * gradT;
      const spotLift = Math.exp(-Math.pow((colNorm - 0.52) / 0.34, 2));
      const hash = Math.abs(Math.sin(cell.r * 19.37 + cell.c * 47.91 + 77.91) * 43758.5453) % 1;
      const cellOpacity = +Math.min(
        1,
        Math.max(0, 0.14 + gradSpan * (0.28 + 0.54 * spotLift * (0.35 + 0.65 * hash)))
      ).toFixed(2);
      const fillHex =
        spotLift * gradSpan > 0.42
          ? palette.hoverPalette[
              Math.min(
                palette.hoverPalette.length - 1,
                Math.round(hash * (palette.hoverPalette.length - 1))
              )
            ]
          : cell.fill;
      return `    <rect x="${x}" y="${y}" width="${cellW}" height="${cellH}"${rxAttr} fill="${fillHex}" fill-opacity="${cellOpacity}" />`;
    })
    .join("\n");

  const safeTextColor = escapeXml(textColor || "#ffffff");
  const textX = +(1.5 + padL).toFixed(2);
  const textY = +(h / 2 + fontSize * 0.35).toFixed(2);
  const boltX = +(w - 1.5 - padR - bolt).toFixed(2);
  const boltY = +((h - bolt) / 2).toFixed(2);
  const boltScale = +(bolt / 24).toFixed(4);

  const boltMarkup = showIcon
    ? `\n  <g transform="translate(${boltX}, ${boltY}) scale(${boltScale})">\n    <path d="M13.5 3.2L6.2 12.6h5.5l-1 8.2 7.5-9.8h-5.6l.9-7.8z" stroke="${safeTextColor}" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" fill="none" />\n  </g>`
    : "";

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" fill="none">
  <defs>
    <clipPath id="ppb-pill-clip">
      <rect x="1.5" y="1.5" width="${innerW}" height="${innerH}" rx="${innerRx}" />
    </clipPath>
    <linearGradient id="ppb-rim-grad" x1="0" y1="0" x2="0" y2="${h}" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="${palette.rimTop}" stop-opacity="0.95" />
      <stop offset="52%" stop-color="${palette.base}" stop-opacity="0.78" />
      <stop offset="100%" stop-color="${palette.rimBottom}" stop-opacity="0.88" />
    </linearGradient>
    <linearGradient id="ppb-inner-grad" x1="0" y1="1.5" x2="0" y2="${h - 1.5}" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="${palette.innerTop}" />
      <stop offset="48%" stop-color="${palette.base}" />
      <stop offset="100%" stop-color="${palette.innerBottom}" />
    </linearGradient>
    <linearGradient id="ppb-top-sheen" x1="0" y1="1.5" x2="0" y2="6.5" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#dcecff" stop-opacity="0.72" />
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0" />
    </linearGradient>
    <linearGradient id="ppb-bottom-sheen" x1="0" y1="${h - 6.5}" x2="0" y2="${h - 1.5}" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="${palette.rimBottom}" stop-opacity="0" />
      <stop offset="100%" stop-color="${palette.rimBottom}" stop-opacity="0.45" />
    </linearGradient>
  </defs>
  <rect x="0" y="0" width="${w}" height="${h}" rx="${outerRx}" fill="url(#ppb-rim-grad)" />
  <g clip-path="url(#ppb-pill-clip)">
    <rect x="1.5" y="1.5" width="${innerW}" height="${innerH}" fill="url(#ppb-inner-grad)" />
${rects}
    <rect x="1.5" y="1.5" width="${innerW}" height="5" fill="url(#ppb-top-sheen)" />
    <rect x="1.5" y="${h - 6.5}" width="${innerW}" height="5" fill="url(#ppb-bottom-sheen)" />
  </g>
  <text x="${textX}" y="${textY}" fill="${safeTextColor}" font-family="Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="${fontSize}" font-weight="600" letter-spacing="-0.018em">${escapeXml(label)}</text>${boltMarkup}
</svg>`;
}

export async function copyTextToClipboard(text: string): Promise<boolean> {
  try {
    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Fallback for HTTP LAN origins
  }
  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    ta.style.pointerEvents = "none";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}

async function ensurePngBlob(blob: Blob): Promise<Blob> {
  if (blob.type === "image/png") return blob;
  const url = URL.createObjectURL(blob);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error("Could not decode screenshot image."));
      el.src = url;
    });
    const canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas context unavailable.");
    ctx.drawImage(img, 0, 0);
    return await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (b) => (b ? resolve(b) : reject(new Error("PNG conversion failed."))),
        "image/png"
      );
    });
  } finally {
    URL.revokeObjectURL(url);
  }
}

export async function copyImageBlobToClipboard(
  blob: Blob
): Promise<{ ok: boolean; error?: string }> {
  if (
    typeof navigator === "undefined" ||
    !navigator.clipboard ||
    typeof navigator.clipboard.write !== "function" ||
    typeof ClipboardItem === "undefined"
  ) {
    return {
      ok: false,
      error: "Image clipboard requires localhost or HTTPS. Open on localhost:3000 or use Export."
    };
  }
  try {
    const pngBlob = await ensurePngBlob(blob);
    await navigator.clipboard.write([new ClipboardItem({ "image/png": pngBlob })]);
    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      error:
        err instanceof Error
          ? err.message
          : "Clipboard blocked by browser. Open on localhost:3000 or use Export."
    };
  }
}
