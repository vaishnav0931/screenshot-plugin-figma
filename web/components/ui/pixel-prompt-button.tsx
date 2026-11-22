"use client";

import * as React from "react";

export type PixelPromptButtonSize = "sm" | "md" | "lg";

export type PixelAnimationMode =
  | "dance"
  | "sparkle"
  | "wave"
  | "rain"
  | "pulse"
  | "none";

export type PixelHoverEffect =
  | "gradient-1-0"
  | "spotlight"
  | "ripple"
  | "scatter"
  | "reveal"
  | "none";

export type PixelMouseOverMode =
  | "follow"
  | "full"
  | "edge-sweep"
  | "always-on";

export type PixelGradientCurve =
  | "linear"
  | "smooth"
  | "sharp"
  | "soft"
  | "arch";

export type PixelTransitionEasing =
  | "ease-out"
  | "ease-in-out"
  | "linear"
  | "spring";

export interface PixelPromptButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  /** Primary button text */
  label?: string;
  /** Temporary confirmation text shown after copying */
  copiedLabel?: string;
  /** Prompt string copied to clipboard on click (defaults to `label`) */
  prompt?: string;
  /** Visual size preset matching desktop & compact pill tokens */
  size?: PixelPromptButtonSize;
  /** Toggle trailing lightning bolt icon */
  showIcon?: boolean;
  /** Callback fired after copying prompt text */
  onCopyPrompt?: (text: string) => void;

  /** Primary base hex color for the pixel mosaic and button glow */
  baseColor?: string;
  /** Highlight hex color used for bright pixel accents and hover states */
  highlightColor?: string;
  /** Foreground text and trailing icon hex color */
  textColor?: string;
  /** Outer glow shadow intensity (0 - 100) */
  glowIntensity?: number;

  /** Pixel block size in logical SVG units (4 - 16) */
  pixelSize?: number;
  /** Gap between adjacent pixel blocks in logical SVG units (0 - 4) */
  pixelGap?: number;
  /** Corner radius of individual pixel blocks in logical SVG units (0 - 4) */
  pixelRadius?: number;
  /** Contrast spread across pixel luminance tiers (0 - 100) */
  pixelContrast?: number;

  /** Always-on ambient animation style across the pixel grid */
  animationMode?: PixelAnimationMode;
  /** Ambient animation speed multiplier in percent (0 - 200) */
  animationSpeed?: number;
  /** Ambient pixel shimmer intensity (0 - 100) */
  danceAmount?: number;

  /** Interactive mouse-over targeting behavior */
  mouseOverMode?: PixelMouseOverMode;
  /** Interactive hover/mouse reaction mode */
  hoverEffect?: PixelHoverEffect;
  /** Hover influence width/radius in percent of button width (10 - 60) */
  hoverRadius?: number;
  /** Hover reaction strength in percent (0 - 100) */
  hoverIntensity?: number;
  /** Opacity falloff curve shape across the hover gradient */
  gradientCurve?: PixelGradientCurve;
  /** Starting intensity percentage at the leading gradient edge (0 - 100) */
  gradientStart?: number;
  /** Ending intensity percentage at the trailing gradient edge (0 - 100) */
  gradientEnd?: number;
  /** Background radial bloom opacity percentage on hover (0 - 100) */
  hoverBloom?: number;
  /** Optional override hex color for the hover gradient highlight palette */
  hoverGradientColor?: string;

  /** Enter/leave transition duration in milliseconds (60 - 1500) */
  transitionDuration?: number;
  /** Transition timing curve for hover enter/leave and lift */
  transitionEasing?: PixelTransitionEasing;
  /** Cursor follow damping in percent (0 = instant snap, 100 = silky trail) */
  cursorSmoothness?: number;
  /** Subtle upward pill lift in pixels on hover (0 - 8) */
  hoverLift?: number;
}

export interface MosaicCell {
  x: number;
  y: number;
  r: number;
  c: number;
  baseIdx: number;
  fill: string;
}

export interface DerivedPixelPalette {
  base: string;
  highlight: string;
  bright: string;
  gap: string;
  gapBright: string;
  rim: string;
  rimTop: string;
  rimBottom: string;
  innerTop: string;
  innerBottom: string;
  basePalette: readonly string[];
  hoverPalette: readonly string[];
}

export const MOSAIC_GRID = {
  cols: 54,
  rows: 9,
  cell: 8,
  gap: 1,
  pitch: 9
} as const;

const REFERENCE_VIEWPORT = {
  width: MOSAIC_GRID.cols * MOSAIC_GRID.pitch, // 486
  height: MOSAIC_GRID.rows * MOSAIC_GRID.pitch // 81
} as const;

function clamp(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, value));
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function parseHexColor(
  hex: string | undefined,
  fallback: string
): { r: number; g: number; b: number } {
  const raw = (hex || fallback).trim().replace(/^#/, "");
  let normalized = raw;
  if (/^[0-9a-fA-F]{3}$/.test(raw)) {
    normalized = `${raw[0]}${raw[0]}${raw[1]}${raw[1]}${raw[2]}${raw[2]}`;
  } else if (!/^[0-9a-fA-F]{6}$/.test(raw)) {
    const fb = fallback.replace(/^#/, "");
    return {
      r: parseInt(fb.slice(0, 2), 16),
      g: parseInt(fb.slice(2, 4), 16),
      b: parseInt(fb.slice(4, 6), 16)
    };
  }
  return {
    r: parseInt(normalized.slice(0, 2), 16),
    g: parseInt(normalized.slice(2, 4), 16),
    b: parseInt(normalized.slice(4, 6), 16)
  };
}

export function mixHex(hexA: string, hexB: string, t: number): string {
  const k = clamp(t, 0, 1);
  const a = parseHexColor(hexA, "#2c5cf5");
  const b = parseHexColor(hexB, "#ffffff");
  const r = Math.round(lerp(a.r, b.r, k));
  const g = Math.round(lerp(a.g, b.g, k));
  const bl = Math.round(lerp(a.b, b.b, k));
  return `#${((1 << 24) + (r << 16) + (g << 8) + bl).toString(16).slice(1)}`;
}

export function hexToRgba(hex: string, alpha: number): string {
  const { r, g, b } = parseHexColor(hex, "#2c5cf5");
  return `rgba(${r}, ${g}, ${b}, ${clamp(alpha, 0, 1).toFixed(3)})`;
}

export function derivePixelPalette(
  baseColor = "#2c5cf5",
  highlightColor = "#bfd6ff",
  pixelContrast = 65,
  hoverGradientColor?: string
): DerivedPixelPalette {
  const contrast = clamp(pixelContrast, 0, 100) / 100;

  const base = mixHex(baseColor, baseColor, 0);
  const highlight = mixHex(highlightColor, highlightColor, 0);
  const hoverHl =
    hoverGradientColor &&
    /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(hoverGradientColor.trim())
      ? mixHex(hoverGradientColor, hoverGradientColor, 0)
      : highlight;

  const basePalette = [
    mixHex(base, "#0a0e1f", 0.2 * contrast),
    mixHex(base, "#0f1733", 0.1 * contrast),
    base,
    mixHex(base, highlight, 0.16 * (0.25 + contrast * 0.75)),
    mixHex(base, highlight, 0.3 * (0.25 + contrast * 0.75)),
    mixHex(base, highlight, 0.44 * (0.25 + contrast * 0.75)),
    mixHex(base, highlight, 0.58 * (0.25 + contrast * 0.75)),
    mixHex(base, highlight, 0.72 * (0.25 + contrast * 0.75))
  ] as const;

  const hoverPalette = [
    mixHex(base, hoverHl, 0.32),
    mixHex(base, hoverHl, 0.5),
    mixHex(base, hoverHl, 0.68),
    mixHex(base, hoverHl, 0.85),
    mixHex(hoverHl, "#ffffff", 0.42)
  ] as const;

  return {
    base,
    highlight,
    bright: mixHex(base, hoverHl, 0.48),
    gap: base,
    gapBright: mixHex(base, hoverHl, 0.34),
    rim: mixHex(base, "#080c1c", 0.38),
    rimTop: mixHex(base, "#ffffff", 0.52),
    rimBottom: mixHex(base, "#080c1c", 0.42),
    innerTop: mixHex(base, highlight, 0.24),
    innerBottom: mixHex(base, "#090d1a", 0.24),
    basePalette,
    hoverPalette
  };
}

export function buildDynamicMosaicGrid(
  pixelSize = 8,
  pixelGap = 1,
  palette: DerivedPixelPalette = derivePixelPalette()
): {
  cols: number;
  rows: number;
  cell: number;
  gap: number;
  pitch: number;
  viewBoxW: number;
  viewBoxH: number;
  cells: MosaicCell[];
} {
  const cell = clamp(Math.round(pixelSize * 10) / 10, 4, 16);
  const gap = clamp(Math.round(pixelGap * 10) / 10, 0, 4);
  const pitch = cell + gap;
  const cols = Math.max(4, Math.round(REFERENCE_VIEWPORT.width / pitch));
  const rows = Math.max(2, Math.round(REFERENCE_VIEWPORT.height / pitch));
  const viewBoxW = +(cols * pitch).toFixed(2);
  const viewBoxH = +(rows * pitch).toFixed(2);

  const cells: MosaicCell[] = [];
  for (let r = 0; r < rows; r++) {
    const ny = rows > 1 ? r / (rows - 1) : 0.5;
    for (let c = 0; c < cols; c++) {
      const nx = cols > 1 ? c / (cols - 1) : 0.5;
      const hash = Math.abs(Math.sin(r * 12.9898 + c * 78.233) * 43758.5453) % 1;
      const wave1 = Math.sin(nx * 5.2 + ny * 2.1);
      const wave2 = Math.cos(nx * 9.8 - ny * 4.7);
      const ripple = (wave1 + wave2) * 0.25;
      const centerLift = Math.exp(-Math.pow((nx - 0.5) * 1.45, 2)) * 0.14;
      const score = hash * 0.6 + (ripple + 0.5) * 0.28 + centerLift;

      let idx: number;
      if (score < 0.16) idx = 0;
      else if (score < 0.3) idx = 1;
      else if (score < 0.45) idx = 2;
      else if (score < 0.6) idx = 3;
      else if (score < 0.74) idx = 4;
      else if (score < 0.87) idx = 5;
      else if (score < 0.95) idx = 6;
      else idx = 7;

      cells.push({
        x: +(c * pitch).toFixed(2),
        y: +(r * pitch).toFixed(2),
        r,
        c,
        baseIdx: idx,
        fill: palette.basePalette[idx]
      });
    }
  }

  return { cols, rows, cell, gap, pitch, viewBoxW, viewBoxH, cells };
}

const DEFAULT_GRID = buildDynamicMosaicGrid(
  MOSAIC_GRID.cell,
  MOSAIC_GRID.gap,
  derivePixelPalette()
);

/** Default cobalt 54x9 mosaic cells preserved for external SVG exporters. */
export const MOSAIC_CELLS: MosaicCell[] = DEFAULT_GRID.cells;

const SPARK_PATTERN = new Set([0, 3, 7, 11, 16, 20, 25, 29, 34, 38, 42, 47, 51]);

function hashCell(r: number, c: number, salt: number): number {
  return Math.abs(Math.sin(r * 19.37 + c * 47.91 + salt * 11.13) * 43758.5453) % 1;
}

function applyGradientCurve(
  dirProgress: number,
  curve: PixelGradientCurve
): number {
  const p = clamp(dirProgress, 0, 1);
  switch (curve) {
    case "smooth": {
      const u = 1 - p;
      return u * u * (3 - 2 * u);
    }
    case "sharp":
      return Math.pow(1 - p, 2.25);
    case "soft":
      return Math.pow(1 - p, 0.55);
    case "arch":
      return Math.sin(p * Math.PI);
    case "linear":
    default:
      return Math.pow(1 - p, 1.05);
  }
}

function applyTransitionEasing(
  progress: number,
  easing: PixelTransitionEasing
): number {
  const u = clamp(progress, 0, 1);
  switch (easing) {
    case "linear":
      return u;
    case "ease-in-out":
      return u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2;
    case "spring":
      return clamp(1 - Math.exp(-6.5 * u) * Math.cos(u * Math.PI * 1.65), 0, 1.06);
    case "ease-out":
    default:
      return 1 - Math.pow(1 - u, 3);
  }
}

function getCssEasing(easing: PixelTransitionEasing): string {
  switch (easing) {
    case "linear":
      return "linear";
    case "ease-in-out":
      return "cubic-bezier(0.65, 0, 0.35, 1)";
    case "spring":
      return "cubic-bezier(0.34, 1.56, 0.64, 1)";
    case "ease-out":
    default:
      return "cubic-bezier(0.22, 1, 0.36, 1)";
  }
}

async function copyToClipboard(text: string): Promise<boolean> {
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fallback below
    }
  }
  if (typeof document !== "undefined") {
    try {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "fixed";
      textarea.style.top = "-9999px";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(textarea);
      return ok;
    } catch {
      return false;
    }
  }
  return false;
}

const SCOPED_CSS = `
.ppb-btn {
  --ppb-w: 472px;
  --ppb-h: 77px;
  --ppb-pad-l: 32px;
  --ppb-pad-r: 34px;
  --ppb-fs: 22px;
  --ppb-bolt: 24px;
  --ppb-dur: 280ms;
  --ppb-ease: cubic-bezier(0.22, 1, 0.36, 1);
  --ppb-lift: 1px;
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  width: var(--ppb-w);
  max-width: 100%;
  height: var(--ppb-h);
  padding: 1.5px;
  border: 0;
  border-radius: 9999px;
  cursor: pointer;
  user-select: none;
  outline: none;
  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  transition: transform var(--ppb-dur) var(--ppb-ease),
              box-shadow var(--ppb-dur) var(--ppb-ease),
              opacity 160ms ease;
  -webkit-tap-highlight-color: transparent;
}

.ppb-btn[data-size="md"] {
  --ppb-w: 310px;
  --ppb-h: 50px;
  --ppb-pad-l: 20px;
  --ppb-pad-r: 22px;
  --ppb-fs: 14.5px;
  --ppb-bolt: 17px;
}

.ppb-btn[data-size="sm"] {
  --ppb-w: 236px;
  --ppb-h: 38px;
  --ppb-pad-l: 15px;
  --ppb-pad-r: 16px;
  --ppb-fs: 12px;
  --ppb-bolt: 14px;
}

.ppb-btn:hover {
  transform: translateY(calc(-1 * var(--ppb-lift)));
}

.ppb-btn:active {
  transform: translateY(0px) scale(0.992);
}

.ppb-btn:focus-visible {
  box-shadow:
    0 0 0 2px #050a1a,
    0 0 0 4px #6b93ff;
}

.ppb-btn:disabled {
  opacity: 0.55;
  cursor: not-allowed;
  transform: none;
}

.ppb-inner {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 9999px;
  overflow: hidden;
  display: flex;
  align-items: center;
}

.ppb-mosaic {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  display: block;
  pointer-events: none;
}

.ppb-edge-vignette {
  position: absolute;
  inset: 0;
  border-radius: 9999px;
  pointer-events: none;
  box-shadow:
    inset 0 1.5px 1.5px rgba(220, 236, 255, 0.72),
    inset 0 -2px 4px rgba(10, 26, 92, 0.45),
    inset 0 0 10px rgba(130, 175, 255, 0.18);
}

.ppb-content {
  position: relative;
  z-index: 2;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-left: var(--ppb-pad-l);
  padding-right: var(--ppb-pad-r);
  pointer-events: none;
}

.ppb-label {
  font-size: var(--ppb-fs);
  font-weight: 600;
  letter-spacing: -0.018em;
  line-height: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ppb-bolt {
  width: var(--ppb-bolt);
  height: var(--ppb-bolt);
  flex-shrink: 0;
  transition: transform var(--ppb-dur) var(--ppb-ease);
}

.ppb-btn:hover .ppb-bolt {
  transform: scale(1.06) rotate(-4deg);
}

.ppb-btn[data-copied="true"] .ppb-bolt {
  transform: scale(1.12);
}

@media (prefers-reduced-motion: reduce) {
  .ppb-btn,
  .ppb-bolt {
    transition: none;
  }
}
`;

export const PixelPromptButton = React.forwardRef<
  HTMLButtonElement,
  PixelPromptButtonProps
>(function PixelPromptButton(
  {
    label = "Generate & copy prompt",
    copiedLabel = "Copied to clipboard",
    prompt,
    size = "lg",
    showIcon = true,
    onCopyPrompt,
    baseColor = "#2c5cf5",
    highlightColor = "#bfd6ff",
    textColor = "#ffffff",
    glowIntensity = 55,
    pixelSize = 8,
    pixelGap = 1,
    pixelRadius = 0,
    pixelContrast = 65,
    animationMode = "dance",
    animationSpeed = 100,
    danceAmount = 50,
    mouseOverMode = "follow",
    hoverEffect = "gradient-1-0",
    hoverRadius = 38,
    hoverIntensity = 100,
    gradientCurve = "linear",
    gradientStart = 100,
    gradientEnd = 0,
    hoverBloom = 36,
    hoverGradientColor,
    transitionDuration = 280,
    transitionEasing = "ease-out",
    cursorSmoothness = 35,
    hoverLift = 1,
    onClick,
    onPointerEnter,
    onPointerMove,
    onPointerLeave,
    className,
    style,
    disabled,
    type = "button",
    ...rest
  },
  ref
) {
  const [copied, setCopied] = React.useState(false);
  const bgBloomId = React.useId().replace(/:/g, "");
  const btnRef = React.useRef<HTMLButtonElement | null>(null);
  const rectRefs = React.useRef<(SVGRectElement | null)[]>([]);
  const bgBloomGradRef = React.useRef<SVGRadialGradientElement | null>(null);
  const bgBloomRectRef = React.useRef<SVGRectElement | null>(null);
  const timerRef = React.useRef<number | null>(null);
  const startLoopRef = React.useRef<() => void>(() => {});

  const palette = React.useMemo(
    () =>
      derivePixelPalette(
        baseColor,
        highlightColor,
        pixelContrast,
        hoverGradientColor
      ),
    [baseColor, highlightColor, pixelContrast, hoverGradientColor]
  );

  const grid = React.useMemo(
    () => buildDynamicMosaicGrid(pixelSize, pixelGap, palette),
    [pixelSize, pixelGap, palette]
  );

  const clampedPixelRadius = clamp(pixelRadius, 0, 4);

  const configRef = React.useRef({
    palette,
    grid,
    animationMode,
    animationSpeed,
    danceAmount,
    mouseOverMode,
    hoverEffect,
    hoverRadius,
    hoverIntensity,
    gradientCurve,
    gradientStart,
    gradientEnd,
    hoverBloom,
    transitionDuration,
    transitionEasing,
    cursorSmoothness
  });

  configRef.current = {
    palette,
    grid,
    animationMode,
    animationSpeed,
    danceAmount,
    mouseOverMode,
    hoverEffect,
    hoverRadius,
    hoverIntensity,
    gradientCurve,
    gradientStart,
    gradientEnd,
    hoverBloom,
    transitionDuration,
    transitionEasing,
    cursorSmoothness
  };

  const animState = React.useRef({
    targetHover: 0,
    hoverProgress: 0,
    curHover: 0,
    targetX: 0.5,
    curX: 0.5,
    targetY: 0.5,
    curY: 0.5,
    time: 0,
    lastFrameMs: 0,
    rafId: 0,
    running: false,
    cellCount: 0,
    seedPhase: new Float32Array(0),
    seedFreq: new Float32Array(0),
    seedDriftX: new Float32Array(0),
    seedDriftY: new Float32Array(0),
    lastFill: [] as string[],
    lastOpacity: new Float32Array(0),
    lastX: new Float32Array(0),
    lastY: new Float32Array(0),
    lastBloomOpacity: -1,
    lastBloomCx: -1,
    lastBloomCy: -1,
    lastBloomR: -1
  });

  React.useImperativeHandle(ref, () => btnRef.current as HTMLButtonElement);

  React.useEffect(() => {
    const st = animState.current;
    const count = grid.cells.length;
    rectRefs.current.length = count;

    if (st.cellCount !== count) {
      st.cellCount = count;
      st.seedPhase = new Float32Array(count);
      st.seedFreq = new Float32Array(count);
      st.seedDriftX = new Float32Array(count);
      st.seedDriftY = new Float32Array(count);
      st.lastFill = new Array(count).fill("");
      st.lastOpacity = new Float32Array(count).fill(-1);
      st.lastX = new Float32Array(count).fill(-9999);
      st.lastY = new Float32Array(count).fill(-9999);
    } else {
      st.lastFill.fill("");
      st.lastOpacity.fill(-1);
    }

    for (let i = 0; i < count; i++) {
      const cell = grid.cells[i];
      st.seedPhase[i] = hashCell(cell.r, cell.c, 1) * Math.PI * 2;
      st.seedFreq[i] = 0.8 + hashCell(cell.r, cell.c, 2) * 1.1;
      st.seedDriftX[i] = (hashCell(cell.r, cell.c, 3) - 0.5) * 2;
      st.seedDriftY[i] = (hashCell(cell.r, cell.c, 4) - 0.5) * 2;
    }

    startLoopRef.current();
  }, [
    grid,
    palette,
    animationMode,
    animationSpeed,
    danceAmount,
    mouseOverMode,
    hoverEffect,
    hoverRadius,
    hoverIntensity,
    gradientCurve,
    gradientStart,
    gradientEnd,
    hoverBloom,
    transitionDuration,
    transitionEasing,
    cursorSmoothness
  ]);

  React.useEffect(() => {
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    const st = animState.current;
    st.lastFrameMs = 0;

    const tick = (now: number) => {
      const cfg = configRef.current;
      const g = cfg.grid;
      const p = cfg.palette;
      const cells = g.cells;
      const count = cells.length;

      const dt = st.lastFrameMs ? Math.min(0.05, (now - st.lastFrameMs) / 1000) : 0.016;
      st.lastFrameMs = now;

      const speedMul = clamp(cfg.animationSpeed, 0, 200) / 100;
      const danceMul = clamp(cfg.danceAmount, 0, 100) / 100;
      const hoverIntMul = clamp(cfg.hoverIntensity, 0, 100) / 100;
      const radiusNorm = clamp(cfg.hoverRadius, 10, 60) / 100;
      const durSec = clamp(cfg.transitionDuration, 60, 1500) / 1000;

      if (!prefersReduced && cfg.animationMode !== "none") {
        st.time += dt * speedMul;
      }

      const effectiveTarget =
        cfg.mouseOverMode === "always-on" ? 1 : st.targetHover;

      if (prefersReduced) {
        st.hoverProgress = effectiveTarget;
      } else {
        const step = dt / durSec;
        if (st.hoverProgress < effectiveTarget) {
          st.hoverProgress = Math.min(effectiveTarget, st.hoverProgress + step);
        } else if (st.hoverProgress > effectiveTarget) {
          st.hoverProgress = Math.max(effectiveTarget, st.hoverProgress - step);
        }
      }

      st.curHover = applyTransitionEasing(st.hoverProgress, cfg.transitionEasing);

      let goalX = st.targetX;
      let goalY = st.targetY;
      if (cfg.mouseOverMode === "edge-sweep") {
        goalX =
          0.5 +
          0.5 * Math.sin(now * 0.0022 * Math.max(0.45, speedMul) - Math.PI / 2);
        goalY = 0.5;
      } else if (cfg.mouseOverMode === "always-on" && st.targetHover === 0) {
        goalX = 0.74;
        goalY = 0.24;
      } else if (cfg.mouseOverMode === "full" && st.targetHover === 0) {
        goalX = 0.5;
        goalY = 0.5;
      }

      const smooth = clamp(cfg.cursorSmoothness, 0, 100) / 100;
      if (prefersReduced || smooth <= 0.02) {
        st.curX = goalX;
        st.curY = goalY;
      } else {
        const rate = lerp(26, 2.2, smooth);
        const followFactor = 1 - Math.exp(-rate * dt);
        st.curX += (goalX - st.curX) * followFactor;
        st.curY += (goalY - st.curY) * followFactor;
      }

      const t = st.time;
      const activeHover =
        cfg.hoverEffect === "none" ? 0 : Math.max(0, st.curHover * hoverIntMul);

      if (bgBloomGradRef.current && bgBloomRectRef.current) {
        const bloomMax = clamp(cfg.hoverBloom, 0, 100) / 100;
        const bloomOpacity =
          activeHover > 0.004 ? +clamp(bloomMax * activeHover, 0, 1).toFixed(2) : 0;
        const bloomCx = +st.curX.toFixed(3);
        const bloomCy = +st.curY.toFixed(3);
        const bloomR =
          cfg.mouseOverMode === "full"
            ? 0.88
            : +Math.max(0.28, radiusNorm * 1.15).toFixed(2);

        if (bloomCx !== st.lastBloomCx) {
          bgBloomGradRef.current.setAttribute("cx", String(bloomCx));
          st.lastBloomCx = bloomCx;
        }
        if (bloomCy !== st.lastBloomCy) {
          bgBloomGradRef.current.setAttribute("cy", String(bloomCy));
          st.lastBloomCy = bloomCy;
        }
        if (bloomR !== st.lastBloomR) {
          bgBloomGradRef.current.setAttribute("r", String(bloomR));
          st.lastBloomR = bloomR;
        }
        if (bloomOpacity !== st.lastBloomOpacity) {
          bgBloomRectRef.current.setAttribute("opacity", String(bloomOpacity));
          st.lastBloomOpacity = bloomOpacity;
        }
      }

      const maxIdx = p.basePalette.length - 1;
      const hoverMaxIdx = p.hoverPalette.length - 1;
      const colsDenom = Math.max(1, g.cols - 1);
      const rowsDenom = Math.max(1, g.rows - 1);
      const dispScale = g.cell * 0.16;
      const startLvl = clamp(cfg.gradientStart, 0, 100) / 100;
      const endLvl = clamp(cfg.gradientEnd, 0, 100) / 100;
      const isFullMode = cfg.mouseOverMode === "full";

      for (let i = 0; i < count; i++) {
        const el = rectRefs.current[i];
        if (!el) continue;

        const cell = cells[i];
        const cellNormX = cell.c / colsDenom;
        const cellNormY = cell.r / rowsDenom;
        const rowTaper = lerp(1, 0.45, cellNormY);

        let idx = cell.baseIdx;
        let dx = 0;
        let dy = 0;
        let alpha = clamp(
          (0.14 + (cell.baseIdx / maxIdx) * 0.28) * rowTaper,
          0.12,
          0.48
        );

        if (!prefersReduced && cfg.animationMode !== "none" && danceMul > 0) {
          const phase = st.seedPhase[i];
          const freq = st.seedFreq[i];

          switch (cfg.animationMode) {
            case "dance": {
              const osc = Math.sin(t * (2.5 + freq) + phase);
              const osc2 = Math.cos(t * (1.8 + freq * 0.7) + phase * 1.3);
              const waveMix = (osc * 0.65 + osc2 * 0.35) * danceMul;
              idx = clamp(cell.baseIdx + Math.round(waveMix * 1.9), 0, maxIdx);
              alpha = clamp(
                (0.16 + (idx / maxIdx) * 0.32 + waveMix * 0.08) * rowTaper,
                0.1,
                0.54
              );
              break;
            }
            case "sparkle": {
              const tw = Math.sin(t * (3.8 + freq * 2.4) + phase * 3.1);
              const thresh = 0.76 - 0.34 * danceMul;
              const pop = tw > thresh ? (tw - thresh) / (1 - thresh) : 0;
              idx = clamp(cell.baseIdx + Math.round(pop * 4), 0, maxIdx);
              alpha = clamp(
                0.16 + (cell.baseIdx / maxIdx) * 0.24 + pop * 0.52,
                0.14,
                0.9
              );
              break;
            }
            case "wave": {
              const w =
                Math.sin(cellNormX * 8.5 - t * 3.6 + cellNormY * 2.2) * danceMul;
              idx = clamp(cell.baseIdx + Math.round(w * 2.4), 0, maxIdx);
              alpha = clamp(
                (0.18 + (idx / maxIdx) * 0.32 + (w + 1) * 0.12) * rowTaper,
                0.14,
                0.62
              );
              break;
            }
            case "rain": {
              const colSpeed = 1.4 + hashCell(0, cell.c, 9) * 1.6;
              const colOffset = hashCell(0, cell.c, 12) * 12;
              const dropPos = (t * colSpeed + colOffset) % 1.45;
              const trailDist = (dropPos - cellNormY + 1.45) % 1.45;
              if (trailDist < 0.24) {
                const head = 1 - trailDist / 0.24;
                idx = clamp(
                  Math.round(lerp(cell.baseIdx, maxIdx, head * danceMul)),
                  0,
                  maxIdx
                );
                alpha = clamp(0.32 + 0.55 * head * danceMul, 0.16, 0.88);
              } else {
                const fade = clamp(1 - trailDist * 0.65, 0.2, 0.8);
                idx = clamp(Math.round(cell.baseIdx * fade), 0, maxIdx);
                alpha = clamp(lerp(0.24, 0.12, 1 - fade), 0.12, 0.38);
              }
              break;
            }
            case "pulse": {
              const d = Math.hypot((cellNormX - 0.5) * 2.4, cellNormY - 0.5);
              const pOsc = Math.sin(d * 7.5 - t * 3.4) * danceMul;
              idx = clamp(cell.baseIdx + Math.round(pOsc * 2.3), 0, maxIdx);
              alpha = clamp(
                0.18 + (idx / maxIdx) * 0.28 + (pOsc + 1) * 0.12,
                0.14,
                0.64
              );
              break;
            }
          }
        }

        let fill = p.basePalette[idx];

        if (activeHover > 0.004) {
          const rx = isFullMode ? 0.95 : Math.max(0.1, radiusNorm);
          const ry = isFullMode ? 1.2 : Math.max(0.55, radiusNorm * 2.4);
          const cursorDist = Math.hypot(
            (cellNormX - st.curX) / rx,
            (cellNormY - st.curY) / ry
          );
          const dirProgress = clamp(cursorDist, 0, 1);

          const distRadial = Math.hypot(
            cellNormX - st.curX,
            (cellNormY - st.curY) / 3.4
          );

          const curveVal = applyGradientCurve(dirProgress, cfg.gradientCurve);
          const gradT = clamp(lerp(endLvl, startLvl, curveVal), 0, 1);

          switch (cfg.hoverEffect) {
            case "gradient-1-0": {
              if (isFullMode || cursorDist < 1) {
                const falloff = isFullMode ? 1 : 1 - cursorDist;
                const band = clamp(Math.pow(falloff, 1.1) * activeHover, 0, 1);

                const liveOsc =
                  0.5 +
                  0.5 * Math.sin(t * (2.6 + st.seedFreq[i]) + st.seedPhase[i]);
                const cellVar = hashCell(cell.r, cell.c, 7) * 0.55 + liveOsc * 0.45;
                const targetHoverAlpha = clamp(
                  gradT * (0.35 + 0.65 * cellVar),
                  0,
                  0.98
                );
                alpha = lerp(alpha, targetHoverAlpha, band);

                const sparkShift = SPARK_PATTERN.has(cell.c % 54) ? 0.15 : 0;
                const litScore = clamp(
                  cellVar * 0.7 + gradT * 0.3 + sparkShift,
                  0,
                  1
                );
                const hoverIdx = clamp(
                  Math.round(litScore * hoverMaxIdx),
                  0,
                  hoverMaxIdx
                );
                if (band * gradT > 0.06) {
                  fill = p.hoverPalette[hoverIdx];
                }
              }
              break;
            }
            case "spotlight": {
              const spotDist = isFullMode ? 0 : distRadial / Math.max(0.12, radiusNorm);
              if (spotDist < 1) {
                const beam = clamp((1 - spotDist * spotDist) * activeHover, 0, 1);
                const hIdx = clamp(
                  Math.round(lerp(0, hoverMaxIdx, beam * gradT)),
                  0,
                  hoverMaxIdx
                );
                fill = p.hoverPalette[hIdx];
                alpha = lerp(alpha, clamp(0.92 * gradT, 0.12, 0.96), beam);
              } else {
                alpha = alpha * lerp(1, 0.58, clamp(activeHover * 0.75, 0, 1));
              }
              break;
            }
            case "ripple": {
              const ringRange = isFullMode ? 1 : Math.max(0.18, radiusNorm * 1.45);
              if (isFullMode || distRadial < ringRange) {
                const envelope = clamp(
                  (1 - distRadial / ringRange) * activeHover,
                  0,
                  1
                );
                const wave = Math.sin(distRadial * 26 - now * 0.008);
                const push = wave * envelope * dispScale * 1.75;
                const angle = Math.atan2(
                  (cellNormY - st.curY) * 0.35,
                  cellNormX - st.curX
                );
                dx += Math.cos(angle) * push;
                dy += Math.sin(angle) * push;
                if (wave > 0.15 && envelope > 0.15) {
                  const hIdx = clamp(
                    Math.round(wave * hoverMaxIdx),
                    0,
                    hoverMaxIdx
                  );
                  fill = p.hoverPalette[hIdx];
                  alpha = lerp(alpha, clamp(0.88 * gradT, 0.14, 0.94), envelope);
                }
              }
              break;
            }
            case "scatter": {
              if (isFullMode || distRadial < radiusNorm) {
                const fall = isFullMode ? 0.65 : 1 - distRadial / radiusNorm;
                const repulse = clamp(Math.pow(fall, 1.4) * activeHover, 0, 1);
                const angle = Math.atan2(
                  (cellNormY - st.curY) * 0.35,
                  cellNormX - st.curX
                );
                dx += Math.cos(angle) * repulse * g.cell * 0.75;
                dy += Math.sin(angle) * repulse * g.cell * 0.75;
                fill =
                  repulse > 0.45
                    ? p.hoverPalette[hoverMaxIdx]
                    : p.hoverPalette[Math.max(1, hoverMaxIdx - 1)];
                alpha = lerp(alpha, clamp(0.92 * gradT, 0.14, 0.95), repulse);
              }
              break;
            }
            case "reveal": {
              if (isFullMode || cursorDist < 1) {
                const strength = clamp(
                  (isFullMode ? 1 : 1 - cursorDist) * activeHover,
                  0,
                  1
                );
                const invIdx = clamp(
                  Math.round(lerp(0, hoverMaxIdx, strength * gradT)),
                  0,
                  hoverMaxIdx
                );
                fill = p.hoverPalette[invIdx];
                alpha = lerp(alpha, clamp(0.94 * gradT, 0.12, 0.96), strength);
              } else {
                alpha = alpha * lerp(1, 0.45, clamp(activeHover, 0, 1));
              }
              break;
            }
          }
        }

        const nextX = +(cell.x + dx).toFixed(1);
        const nextY = +(cell.y + dy).toFixed(1);
        const nextOp = +clamp(alpha, 0, 1).toFixed(2);

        if (st.lastFill[i] !== fill) {
          el.setAttribute("fill", fill);
          st.lastFill[i] = fill;
        }
        if (st.lastOpacity[i] !== nextOp) {
          el.setAttribute("opacity", String(nextOp));
          st.lastOpacity[i] = nextOp;
        }
        if (st.lastX[i] !== nextX) {
          el.setAttribute("x", String(nextX));
          st.lastX[i] = nextX;
        }
        if (st.lastY[i] !== nextY) {
          el.setAttribute("y", String(nextY));
          st.lastY[i] = nextY;
        }
      }

      const stillMoving =
        (!prefersReduced &&
          cfg.animationMode !== "none" &&
          speedMul > 0 &&
          danceMul > 0) ||
        Math.abs(st.hoverProgress - effectiveTarget) > 0.002 ||
        (st.hoverProgress > 0.002 &&
          (cfg.mouseOverMode === "edge-sweep" ||
            Math.abs(st.curX - goalX) > 0.002 ||
            Math.abs(st.curY - goalY) > 0.002));

      if (stillMoving) {
        st.rafId = requestAnimationFrame(tick);
      } else {
        st.running = false;
        st.rafId = 0;
        st.lastFrameMs = 0;
      }
    };

    const startLoop = () => {
      if (!st.running) {
        st.running = true;
        st.rafId = requestAnimationFrame(tick);
      }
    };

    startLoopRef.current = startLoop;
    startLoop();

    return () => {
      if (st.rafId) cancelAnimationFrame(st.rafId);
      st.running = false;
      st.rafId = 0;
    };
  }, []);

  React.useEffect(() => {
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, []);

  const updatePointerPos = (clientX: number, clientY: number) => {
    const el = btnRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.width > 0) {
      animState.current.targetX = clamp(
        (clientX - rect.left) / rect.width,
        0,
        1
      );
    }
    if (rect.height > 0) {
      animState.current.targetY = clamp(
        (clientY - rect.top) / rect.height,
        0,
        1
      );
    }
  };

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(e);
    if (e.defaultPrevented || disabled) return;

    const textToCopy = prompt ?? label;
    await copyToClipboard(textToCopy);
    onCopyPrompt?.(textToCopy);

    setCopied(true);
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setCopied(false), 1800);
  };

  const glowStrength = clamp(glowIntensity, 0, 100) / 100;
  const clampedDur = Math.round(clamp(transitionDuration, 60, 1500));
  const clampedLift = +clamp(hoverLift, 0, 8).toFixed(1);
  const buttonInlineStyle: React.CSSProperties & {
    "--ppb-dur": string;
    "--ppb-ease": string;
    "--ppb-lift": string;
  } = {
    "--ppb-dur": `${clampedDur}ms`,
    "--ppb-ease": getCssEasing(transitionEasing),
    "--ppb-lift": `${clampedLift}px`,
    backgroundImage: `linear-gradient(180deg, ${palette.rimTop} 0%, ${palette.base} 52%, ${palette.rimBottom} 100%)`,
    boxShadow:
      glowStrength > 0
        ? `0 0 0 1px ${hexToRgba(palette.rim, 0.35)}, 0 10px 26px ${hexToRgba(
            palette.base,
            0.42 * glowStrength
          )}, 0 0 ${Math.round(28 * glowStrength)}px ${hexToRgba(
            palette.bright,
            0.3 * glowStrength
          )}`
        : `0 0 0 1px ${hexToRgba(palette.rim, 0.35)}`,
    color: textColor,
    ...style
  };

  const innerStyle: React.CSSProperties = {
    backgroundImage: `linear-gradient(180deg, ${palette.innerTop} 0%, ${palette.base} 48%, ${palette.innerBottom} 100%)`
  };

  const contentStyle: React.CSSProperties = {
    color: textColor,
    textShadow: `0 1px 6px ${hexToRgba(palette.rimBottom, 0.45)}`
  };

  return (
    <>
      <style>{SCOPED_CSS}</style>
      <button
        ref={btnRef}
        type={type}
        disabled={disabled}
        data-size={size}
        data-copied={copied ? "true" : "false"}
        aria-label={copied ? copiedLabel : label}
        className={className ? `ppb-btn ${className}` : "ppb-btn"}
        style={buttonInlineStyle}
        onClick={handleClick}
        onPointerEnter={(e) => {
          updatePointerPos(e.clientX, e.clientY);
          animState.current.targetHover = 1;
          startLoopRef.current();
          onPointerEnter?.(e);
        }}
        onPointerMove={(e) => {
          updatePointerPos(e.clientX, e.clientY);
          startLoopRef.current();
          onPointerMove?.(e);
        }}
        onPointerLeave={(e) => {
          animState.current.targetHover = 0;
          onPointerLeave?.(e);
        }}
        {...rest}
      >
        <span className="ppb-inner" style={innerStyle}>
          <svg
            className="ppb-mosaic"
            viewBox={`0 0 ${grid.viewBoxW} ${grid.viewBoxH}`}
            preserveAspectRatio="xMidYMid slice"
            aria-hidden="true"
          >
            <defs>
              <radialGradient
                ref={bgBloomGradRef}
                id={bgBloomId}
                cx="0.5"
                cy="0.5"
                r="0.42"
              >
                <stop offset="0%" stopColor={palette.gapBright} stopOpacity={0.9} />
                <stop offset="55%" stopColor={palette.bright} stopOpacity={0.45} />
                <stop offset="100%" stopColor={palette.base} stopOpacity={0} />
              </radialGradient>
            </defs>
            <rect
              ref={bgBloomRectRef}
              width={grid.viewBoxW}
              height={grid.viewBoxH}
              fill={`url(#${bgBloomId})`}
              opacity={0}
            />
            {grid.cells.map((cell, i) => (
              <rect
                key={`${grid.cols}x${grid.rows}-${i}`}
                ref={(el) => {
                  rectRefs.current[i] = el;
                }}
                x={cell.x}
                y={cell.y}
                width={grid.cell}
                height={grid.cell}
                rx={clampedPixelRadius}
                ry={clampedPixelRadius}
                fill={cell.fill}
                opacity={+(
                  0.14 +
                  (cell.baseIdx / Math.max(1, palette.basePalette.length - 1)) * 0.28
                ).toFixed(2)}
              />
            ))}
          </svg>
          <span className="ppb-edge-vignette" aria-hidden="true" />
          <span className="ppb-content" style={contentStyle}>
            <span className="ppb-label">{copied ? copiedLabel : label}</span>
            {showIcon && (
              <svg
                className="ppb-bolt"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                {copied ? (
                  <path
                    d="M5 12.5l4.2 4.3L19 7.5"
                    stroke="currentColor"
                    strokeWidth="2.1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                ) : (
                  <path
                    d="M13.5 3.2L6.2 12.6h5.5l-1 8.2 7.5-9.8h-5.6l.9-7.8z"
                    stroke="currentColor"
                    strokeWidth="2.1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}
              </svg>
            )}
          </span>
        </span>
      </button>
    </>
  );
});

export default PixelPromptButton;
