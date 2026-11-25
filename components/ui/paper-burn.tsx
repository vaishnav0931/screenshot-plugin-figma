"use client";

import * as React from "react";

export type PaperBurnSize = "sm" | "md" | "lg";
export type PaperBurnSourceMode = "text" | "image";
export type PaperBurnImageFit = "cover" | "contain";
export type PaperBurnMode = "hold" | "scrub" | "loop";
export type PaperBurnReleaseBehavior = "recover" | "stay";
export type PaperBurnOrigin =
  | "pointer"
  | "right"
  | "left"
  | "edges"
  | "center";

export interface PaperBurnConfig {
  /** Primary button label printed onto the paper surface */
  label: string;
  /** Label shown on the Restore button after 100% burn */
  restoreLabel: string;
  /** Show built-in Restore button once the button has completely burned */
  showRestoreButton: boolean;
  /** Visual size preset matching studio pill dimensions */
  size: PaperBurnSize;
  /** Corner radius in px (values >= half button height produce a full pill) */
  borderRadius: number;
  /** Show trailing flame icon printed on the button */
  showIcon: boolean;
  /** Render button surface or overlay an uploaded image texture */
  mode: PaperBurnSourceMode;
  /** How an uploaded image fits inside the button */
  imageFit: PaperBurnImageFit;
  /** Scale multiplier for uploaded image (0.2 - 2) */
  imageScale: number;
  /** Font family stack used for the printed button label */
  fontFamily: string;
  /** Font weight ("400" | "500" | "600" | "700" | "800") */
  fontWeight: string;
  /** Printed label and icon ink hex color */
  inkColor: string;
  /** Unburned paper stock hex color */
  paperColor: string;
  /** Glyph tracking adjustment (-3 - 15) */
  letterSpacing: number;
  /** Tactile paper fiber grain intensity (0 - 100) */
  paperGrain: number;
  /** Interaction mode: press-and-hold, static scrub, or auto loop */
  burnMode: PaperBurnMode;
  /** Hold duration in milliseconds required to reach 100% burn (400 - 4000) */
  holdDuration: number;
  /** Whether releasing early cools back down or keeps the partial burn */
  releaseBehavior: PaperBurnReleaseBehavior;
  /** Optional delay in ms before auto-restoring (0 = stay burned with Restore button) */
  autoResetDelay: number;
  /** Where combustion ignites across the button */
  burnOrigin: PaperBurnOrigin;
  /** Static burn percentage when `burnMode === "scrub"` (0 - 100) */
  progress: number;
  /** Playback speed multiplier when `burnMode === "loop"` (0.1 - 2.5) */
  speed: number;
  /** Organic FBM tearing depth along the burning edge (0 - 100) */
  raggedness: number;
  /** Spatial frequency of flame pockets (1 - 10) */
  noiseScale: number;
  /** Glowing incandescent ember rim hex color */
  emberColor: string;
  /** Carbonized blackened char hex color */
  charColor: string;
  /** Width of the glowing ember filament (5 - 100) */
  emberWidth: number;
  /** Width of the blackened char and sepia scorch band (5 - 100) */
  charWidth: number;
  /** Intensity of incandescent bloom and rising ember sparks (0 - 100) */
  glowStrength: number;
  /** Density of random tumbling ash flakes during and after burn (0 - 100) */
  ashIntensity: number;
  /** Output transparent alpha in burned regions */
  transparentBurn: boolean;
  /** Solid backdrop hex shown in burned regions when `transparentBurn === false` */
  revealColor: string;
  /** Show subtle warm singe beneath the cursor on hover before holding */
  hoverEmber: boolean;
}

export interface PaperBurnProps
  extends Partial<PaperBurnConfig>,
    Omit<
      React.ButtonHTMLAttributes<HTMLButtonElement>,
      "children" | "onProgress"
    > {
  /** Optional image URL or object URL drawn onto the button when `mode === "image"` */
  imageSrc?: string | null;
  /** Pause loop/hold/ash animation advancement */
  paused?: boolean;
  /** Fired when a press-and-hold reaches 100% combustion */
  onBurnComplete?: () => void;
  /** Fired when the Restore button resets the burned state */
  onRestore?: () => void;
  /** Fired as burn progress changes (0 - 1) */
  onBurnProgress?: (progress: number) => void;
}

export interface PaperBurnHandle {
  button: HTMLButtonElement | null;
  canvas: HTMLCanvasElement | null;
  /** Restore the button immediately to 0% unburned state */
  reset: () => void;
  exportPngBlob: () => Promise<Blob | null>;
  downloadPng: (filename?: string) => Promise<void>;
}

export const PAPER_BURN_FONTS: ReadonlyArray<{
  label: string;
  value: string;
}> = [
  {
    label: "Inter / Sans",
    value:
      '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  { label: "Georgia", value: "Georgia, serif" },
  { label: "Courier", value: "Courier New, monospace" },
  { label: "Impact", value: "Impact, Haettenschweiler, sans-serif" },
  { label: "System", value: "system-ui, sans-serif" }
];

export const DEFAULT_PAPER_BURN_CONFIG: PaperBurnConfig = {
  label: "Hold to burn",
  restoreLabel: "Restore",
  showRestoreButton: true,
  size: "lg",
  borderRadius: 36,
  showIcon: true,
  mode: "text",
  imageFit: "cover",
  imageScale: 1,
  fontFamily:
    '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  fontWeight: "600",
  inkColor: "#1c1714",
  paperColor: "#f4ede2",
  letterSpacing: -0.4,
  paperGrain: 32,
  burnMode: "hold",
  holdDuration: 1400,
  releaseBehavior: "recover",
  autoResetDelay: 0,
  burnOrigin: "pointer",
  progress: 45,
  speed: 0.65,
  raggedness: 64,
  noiseScale: 3.8,
  emberColor: "#ff6a1a",
  charColor: "#16110e",
  emberWidth: 30,
  charWidth: 46,
  glowStrength: 78,
  ashIntensity: 78,
  transparentBurn: true,
  revealColor: "#0b0b0f",
  hoverEmber: true
};

const BUTTON_SPECS: Record<
  PaperBurnSize,
  {
    w: number;
    h: number;
    padL: number;
    padR: number;
    fontSize: number;
    iconSize: number;
    restoreH: number;
    restoreFs: number;
  }
> = {
  lg: {
    w: 380,
    h: 68,
    padL: 28,
    padR: 26,
    fontSize: 19,
    iconSize: 21,
    restoreH: 36,
    restoreFs: 13
  },
  md: {
    w: 284,
    h: 52,
    padL: 20,
    padR: 19,
    fontSize: 14.5,
    iconSize: 17,
    restoreH: 32,
    restoreFs: 12
  },
  sm: {
    w: 216,
    h: 40,
    padL: 15,
    padR: 14,
    fontSize: 12.5,
    iconSize: 14,
    restoreH: 28,
    restoreFs: 11.5
  }
};

const ASH_BLEED_X = 72;
const ASH_BLEED_Y = 84;

const ASH_SHARD_SHAPES: ReadonlyArray<ReadonlyArray<[number, number]>> = [
  [
    [-1.0, -0.4],
    [-0.2, -0.95],
    [0.95, -0.35],
    [0.65, 0.85],
    [-0.55, 0.7]
  ],
  [
    [-0.85, -0.75],
    [0.45, -0.9],
    [1.0, 0.1],
    [0.15, 0.95],
    [-0.95, 0.35]
  ],
  [
    [-1.1, -0.15],
    [-0.15, -0.8],
    [0.9, -0.55],
    [0.85, 0.5],
    [-0.3, 0.85]
  ],
  [
    [-0.7, -0.9],
    [0.65, -0.65],
    [0.95, 0.45],
    [-0.1, 0.9],
    [-0.95, 0.2]
  ]
];

interface AshFlake {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rot: number;
  vRot: number;
  tumble: number;
  vTumble: number;
  turbPhase: number;
  turbFreq: number;
  age: number;
  maxLife: number;
  emberHeat: number;
  tone: number;
  shapeIdx: number;
}

const SCOPED_BUTTON_CSS = `
.pbb-wrap {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  max-width: 100%;
  user-select: none;
  -webkit-user-select: none;
}

.pbb-btn {
  position: relative;
  width: 100%;
  height: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: 0;
  background: transparent;
  cursor: pointer;
  user-select: none;
  -webkit-user-select: none;
  -webkit-tap-highlight-color: transparent;
  touch-action: none;
  outline: none;
  transition: transform 140ms cubic-bezier(0.22, 1, 0.36, 1), filter 180ms ease;
}

.pbb-btn:active:not(:disabled) {
  transform: scale(0.986);
}

.pbb-btn:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.pbb-btn:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 4px;
}

.pbb-restore {
  position: absolute;
  z-index: 4;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  padding: 0 15px;
  border-radius: 9999px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  background-color: rgba(22, 22, 26, 0.86);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  color: #f4f4f5;
  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  font-weight: 500;
  letter-spacing: -0.01em;
  cursor: pointer;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.45);
  animation: pbbRestoreIn 240ms cubic-bezier(0.22, 1, 0.36, 1) both;
  transition: background-color 140ms ease, border-color 140ms ease, transform 140ms ease;
}

.pbb-restore:hover {
  background-color: rgba(36, 36, 44, 0.94);
  border-color: rgba(59, 130, 246, 0.65);
  transform: translateY(-1px);
}

.pbb-restore:active {
  transform: translateY(0) scale(0.97);
}

.pbb-restore:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 3px;
}

@keyframes pbbRestoreIn {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(4px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.pbb-sr {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

@media (prefers-reduced-motion: reduce) {
  .pbb-btn,
  .pbb-restore {
    transition: none;
    animation: none;
  }
}
`;

const VERTEX_SHADER_SOURCE = `
attribute vec2 a_pos;
varying vec2 vUv;
void main() {
  vUv = a_pos * 0.5 + 0.5;
  gl_Position = vec4(a_pos, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER_SOURCE = `
precision highp float;
varying vec2 vUv;

uniform sampler2D u_tex;
uniform float u_t;
uniform float u_aspect;
uniform float u_progress;
uniform float u_origin;
uniform float u_raggedness;
uniform float u_noiseScale;
uniform float u_paperGrain;
uniform float u_emberWidth;
uniform float u_charWidth;
uniform float u_glowStrength;
uniform float u_transparent;
uniform float u_hoverAmt;
uniform vec2 u_mouse;
uniform vec2 u_ignite;
uniform vec3 u_emberColor;
uniform vec3 u_charColor;
uniform vec3 u_revealColor;

float hash21(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float vnoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash21(i), hash21(i + vec2(1.0, 0.0)), f.x),
    mix(hash21(i + vec2(0.0, 1.0)), hash21(i + vec2(1.0, 1.0)), f.x),
    f.y
  );
}

float fbm(vec2 p) {
  float sum = 0.0;
  float amp = 0.5;
  mat2 rot = mat2(0.8, -0.6, 0.6, 0.8);
  for (int i = 0; i < 5; i++) {
    sum += amp * vnoise(p);
    p = rot * p * 2.03 + vec2(17.1, 31.7);
    amp *= 0.5;
  }
  return sum;
}

void main() {
  vec2 uv = vUv;
  vec2 isoUv = vec2(uv.x * u_aspect, uv.y);

  float g = 0.0;
  if (u_origin < 0.5) {
    float d00 = length(vec2((0.0 - u_ignite.x) * u_aspect, 0.0 - u_ignite.y));
    float d10 = length(vec2((1.0 - u_ignite.x) * u_aspect, 0.0 - u_ignite.y));
    float d01 = length(vec2((0.0 - u_ignite.x) * u_aspect, 1.0 - u_ignite.y));
    float d11 = length(vec2((1.0 - u_ignite.x) * u_aspect, 1.0 - u_ignite.y));
    float maxCorner = max(max(d00, d10), max(d01, d11));
    float dist = length(vec2((uv.x - u_ignite.x) * u_aspect, uv.y - u_ignite.y));
    g = dist / max(0.001, maxCorner);
  } else if (u_origin < 1.5) {
    g = 1.0 - uv.x;
  } else if (u_origin < 2.5) {
    g = uv.x;
  } else if (u_origin < 3.5) {
    float ex = min(uv.x, 1.0 - uv.x) * u_aspect;
    float ey = min(uv.y, 1.0 - uv.y);
    g = clamp(min(ex, ey) * 2.0, 0.0, 1.0);
  } else {
    float maxR = length(vec2(0.5 * u_aspect, 0.5));
    g = length(vec2((uv.x - 0.5) * u_aspect, uv.y - 0.5)) / max(0.001, maxR);
  }

  float ew = 0.008 + u_emberWidth * 0.036;
  float cw = 0.014 + u_charWidth * 0.072;
  float sw = cw * 1.35;
  float totalBand = ew + cw + sw;

  float nCoarse = fbm(isoUv * (u_noiseScale * 0.72) + vec2(0.0, -u_t * 0.05));
  float nFine = fbm(isoUv * (u_noiseScale * 3.1) + vec2(u_t * 0.16, -u_t * 0.25));
  float rag = u_raggedness * 0.42;

  float field = g + (nCoarse - 0.5) * rag + (nFine - 0.5) * (rag * 0.28);

  float minF = -0.64 * rag - totalBand - 0.025;
  float maxF = 1.0 + 0.64 * rag + 0.04;
  float p = clamp(u_progress, 0.0, 1.0);
  float thresh = mix(minF, maxF, p);
  float d = field - thresh;

  float burnMask = smoothstep(-0.004, 0.005, d);

  float activeBurn = step(0.001, p);
  float curl = (1.0 - smoothstep(0.0, totalBand, max(d, 0.0))) * 0.008 * (nFine - 0.5) * activeBurn;
  vec2 sampleUv = clamp(uv + vec2(curl / max(1.0, u_aspect * 0.5), curl * 1.3), 0.0, 1.0);
  vec4 texSample = texture2D(u_tex, sampleUv);
  float pillAlpha = texSample.a;
  float sheetMask = burnMask * pillAlpha;

  float fiber = (fbm(isoUv * 26.0) - 0.5) * 0.07 + (hash21(floor(isoUv * 220.0)) - 0.5) * 0.032;
  vec3 basePaper = clamp(texSample.rgb + fiber * u_paperGrain, 0.0, 1.0);

  float flicker = 0.72 + 0.28 * sin(u_t * 9.5 + nFine * 15.0);

  vec2 hDiff = vec2((uv.x - u_mouse.x) * u_aspect, uv.y - u_mouse.y);
  float hoverSpot = u_hoverAmt * exp(-dot(hDiff, hDiff) * 5.2);
  vec3 hoverToast = basePaper * vec3(0.84, 0.64, 0.44) + u_emberColor * (0.20 * flicker);
  vec3 col = mix(basePaper, clamp(hoverToast, 0.0, 1.0), clamp(hoverSpot * 0.62, 0.0, 1.0));

  float scorchT = (1.0 - smoothstep(ew * 0.6, totalBand, d)) * activeBurn;
  vec3 scorchTint = col * vec3(0.74, 0.50, 0.28) * (0.84 + 0.16 * nFine);
  col = mix(col, scorchTint, clamp(scorchT * 0.94, 0.0, 1.0));

  float charT = (1.0 - smoothstep(ew * 0.35, ew + cw * (0.72 + 0.42 * nFine), d)) * activeBurn;
  vec3 charTex = u_charColor + vec3(0.065) * smoothstep(0.60, 0.88, nFine);
  col = mix(col, charTex, clamp(charT, 0.0, 1.0));

  float emberBand = (1.0 - smoothstep(0.0, ew * (0.74 + 0.58 * nFine), max(d, 0.0))) * sheetMask * activeBurn;
  float hotCore = (1.0 - smoothstep(0.0, ew * 0.38, max(d, 0.0))) * flicker * activeBurn;
  vec3 hotColor = mix(u_emberColor, vec3(1.0, 0.96, 0.78), clamp(hotCore * 0.88, 0.0, 1.0));
  float emberMix = clamp(emberBand * (0.68 + 0.52 * flicker) * (0.35 + 0.85 * u_glowStrength), 0.0, 1.0);
  col = mix(col, hotColor * (1.1 + 0.32 * u_glowStrength), emberMix);

  float outerBloom = exp(-abs(d) / max(0.004, ew * 0.95)) * u_glowStrength * 0.55 * flicker * activeBurn * pillAlpha;

  vec2 sparkUv = isoUv * 15.0 - vec2(sin(u_t * 0.8 + uv.y * 4.0) * 0.45, u_t * 2.2);
  vec2 sparkCell = floor(sparkUv);
  vec2 sparkLocal = fract(sparkUv) - 0.5;
  float sparkRnd = hash21(sparkCell);
  vec2 sparkJitter = vec2(fract(sparkRnd * 13.7) - 0.5, fract(sparkRnd * 29.3) - 0.5) * 0.55;
  float sparkDist = length(sparkLocal - sparkJitter);
  float sparkNearFront = smoothstep(-0.14, -0.004, d) * (1.0 - smoothstep(-0.004, 0.02, d)) * activeBurn;
  float sparkMask = step(0.90, sparkRnd) * smoothstep(0.12, 0.016, sparkDist) * sparkNearFront * u_glowStrength * pillAlpha;

  float glowContrib = clamp(outerBloom + sparkMask * 1.25, 0.0, 1.0);
  vec3 glowRgb = mix(u_emberColor, vec3(1.0, 0.92, 0.68), clamp(sparkMask, 0.0, 1.0));

  if (u_transparent > 0.5) {
    float finalAlpha = clamp(max(sheetMask, glowContrib * 0.88), 0.0, 1.0);
    vec3 premulRgb = col * sheetMask + glowRgb * glowContrib * (1.0 - sheetMask * 0.65);
    premulRgb = clamp(min(premulRgb, vec3(finalAlpha)), 0.0, 1.0);
    gl_FragColor = vec4(premulRgb, finalAlpha);
  } else {
    vec3 bg = u_revealColor + glowRgb * glowContrib;
    vec3 finalRgb = mix(bg, col + glowRgb * glowContrib * 0.32, sheetMask);
    float solidAlpha = pillAlpha;
    gl_FragColor = vec4(clamp(finalRgb, 0.0, 1.0) * solidAlpha, solidAlpha);
  }
}
`;

function compileShader(
  gl: WebGLRenderingContext,
  type: number,
  source: string
): WebGLShader {
  const shader = gl.createShader(type);
  if (!shader) throw new Error("Could not allocate WebGL shader.");
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const info = gl.getShaderInfoLog(shader) || "Shader compilation failed.";
    gl.deleteShader(shader);
    throw new Error(info);
  }
  return shader;
}

function parseHexRgb(
  hex: string | undefined,
  fallback: [number, number, number]
): [number, number, number] {
  if (!hex) return fallback;
  const clean = hex.trim().replace(/^#/, "");
  let full = clean;
  if (/^[0-9a-fA-F]{3}$/.test(clean)) {
    full = `${clean[0]}${clean[0]}${clean[1]}${clean[1]}${clean[2]}${clean[2]}`;
  }
  if (!/^[0-9a-fA-F]{6}$/.test(full)) return fallback;
  return [
    parseInt(full.slice(0, 2), 16),
    parseInt(full.slice(2, 4), 16),
    parseInt(full.slice(4, 6), 16)
  ];
}

function parseHexToRgb01(
  hex: string | undefined,
  fallback: [number, number, number]
): [number, number, number] {
  const [r, g, b] = parseHexRgb(hex, [
    Math.round(fallback[0] * 255),
    Math.round(fallback[1] * 255),
    Math.round(fallback[2] * 255)
  ]);
  return [r / 255, g / 255, b / 255];
}

function mixRgbCss(
  rgbA: [number, number, number],
  rgbB: [number, number, number],
  t: number
): string {
  const k = Math.min(1, Math.max(0, t));
  const r = Math.round(rgbA[0] + (rgbB[0] - rgbA[0]) * k);
  const g = Math.round(rgbA[1] + (rgbB[1] - rgbA[1]) * k);
  const b = Math.round(rgbA[2] + (rgbB[2] - rgbA[2]) * k);
  return `rgb(${r}, ${g}, ${b})`;
}

function traceRoundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  const rx = Math.max(0, Math.min(r, w / 2, h / 2));
  ctx.beginPath();
  ctx.moveTo(x + rx, y);
  ctx.arcTo(x + w, y, x + w, y + h, rx);
  ctx.arcTo(x + w, y + h, x, y + h, rx);
  ctx.arcTo(x, y + h, x, y, rx);
  ctx.arcTo(x, y, x + w, y, rx);
  ctx.closePath();
}

function drawFlameIcon(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  size: number,
  inkColor: string,
  emberColor: string
) {
  const s = size / 24;
  ctx.save();
  ctx.translate(cx - size / 2, cy - size / 2);
  ctx.scale(s, s);

  const outer = new Path2D(
    "M12.4 2.6C12.8 5.9 10.2 7.8 10.2 10.4C10.2 11.8 11.2 12.7 12.4 12.7C13.9 12.7 14.8 11.4 14.9 9.6C17.4 11.3 18.8 13.7 18.8 16.3C18.8 19.9 15.8 22 12 22C8.2 22 5.2 19.7 5.2 15.8C5.2 11.5 8.5 8.4 12.4 2.6Z"
  );
  ctx.fillStyle = emberColor;
  ctx.globalAlpha = 0.22;
  ctx.fill(outer);

  ctx.globalAlpha = 1;
  ctx.strokeStyle = inkColor;
  ctx.lineWidth = 1.9;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  ctx.stroke(outer);

  const inner = new Path2D(
    "M12 14.2C10.6 15.3 10.1 16.5 10.1 17.6C10.1 18.9 11 19.8 12.1 19.8C13.3 19.8 14.1 18.9 14.1 17.7C14.1 16.4 13.3 15.3 12 14.2Z"
  );
  ctx.fillStyle = emberColor;
  ctx.fill(inner);

  ctx.restore();
}

function originToCode(origin: PaperBurnOrigin): number {
  switch (origin) {
    case "right":
      return 1;
    case "left":
      return 2;
    case "edges":
      return 3;
    case "center":
      return 4;
    case "pointer":
    default:
      return 0;
  }
}

function formatStringProp(name: string, value: string): string {
  if (value.includes("\n") || value.includes('"')) {
    return `  ${name}={${JSON.stringify(value)}}`;
  }
  return `  ${name}=${JSON.stringify(value)}`;
}

export function buildPaperBurnUsageSnippet(
  config: Partial<PaperBurnConfig>
): string {
  const merged = { ...DEFAULT_PAPER_BURN_CONFIG, ...config };
  const props: string[] = [];

  if (merged.label !== DEFAULT_PAPER_BURN_CONFIG.label)
    props.push(formatStringProp("label", merged.label));
  if (merged.restoreLabel !== DEFAULT_PAPER_BURN_CONFIG.restoreLabel)
    props.push(formatStringProp("restoreLabel", merged.restoreLabel));
  if (merged.showRestoreButton !== DEFAULT_PAPER_BURN_CONFIG.showRestoreButton)
    props.push(`  showRestoreButton={${merged.showRestoreButton}}`);
  if (merged.size !== DEFAULT_PAPER_BURN_CONFIG.size)
    props.push(formatStringProp("size", merged.size));
  if (merged.borderRadius !== DEFAULT_PAPER_BURN_CONFIG.borderRadius)
    props.push(`  borderRadius={${merged.borderRadius}}`);
  if (merged.showIcon !== DEFAULT_PAPER_BURN_CONFIG.showIcon)
    props.push(`  showIcon={${merged.showIcon}}`);
  if (merged.mode !== DEFAULT_PAPER_BURN_CONFIG.mode)
    props.push(formatStringProp("mode", merged.mode));
  if (merged.imageFit !== DEFAULT_PAPER_BURN_CONFIG.imageFit)
    props.push(formatStringProp("imageFit", merged.imageFit));
  if (merged.imageScale !== DEFAULT_PAPER_BURN_CONFIG.imageScale)
    props.push(`  imageScale={${merged.imageScale}}`);
  if (merged.fontFamily !== DEFAULT_PAPER_BURN_CONFIG.fontFamily)
    props.push(formatStringProp("fontFamily", merged.fontFamily));
  if (merged.fontWeight !== DEFAULT_PAPER_BURN_CONFIG.fontWeight)
    props.push(formatStringProp("fontWeight", merged.fontWeight));
  if (merged.inkColor !== DEFAULT_PAPER_BURN_CONFIG.inkColor)
    props.push(formatStringProp("inkColor", merged.inkColor));
  if (merged.paperColor !== DEFAULT_PAPER_BURN_CONFIG.paperColor)
    props.push(formatStringProp("paperColor", merged.paperColor));
  if (merged.letterSpacing !== DEFAULT_PAPER_BURN_CONFIG.letterSpacing)
    props.push(`  letterSpacing={${merged.letterSpacing}}`);
  if (merged.paperGrain !== DEFAULT_PAPER_BURN_CONFIG.paperGrain)
    props.push(`  paperGrain={${merged.paperGrain}}`);
  if (merged.burnMode !== DEFAULT_PAPER_BURN_CONFIG.burnMode)
    props.push(formatStringProp("burnMode", merged.burnMode));
  if (merged.holdDuration !== DEFAULT_PAPER_BURN_CONFIG.holdDuration)
    props.push(`  holdDuration={${merged.holdDuration}}`);
  if (merged.releaseBehavior !== DEFAULT_PAPER_BURN_CONFIG.releaseBehavior)
    props.push(formatStringProp("releaseBehavior", merged.releaseBehavior));
  if (merged.autoResetDelay !== DEFAULT_PAPER_BURN_CONFIG.autoResetDelay)
    props.push(`  autoResetDelay={${merged.autoResetDelay}}`);
  if (merged.burnOrigin !== DEFAULT_PAPER_BURN_CONFIG.burnOrigin)
    props.push(formatStringProp("burnOrigin", merged.burnOrigin));
  if (
    merged.burnMode === "scrub" &&
    merged.progress !== DEFAULT_PAPER_BURN_CONFIG.progress
  )
    props.push(`  progress={${merged.progress}}`);
  if (
    merged.burnMode === "loop" &&
    merged.speed !== DEFAULT_PAPER_BURN_CONFIG.speed
  )
    props.push(`  speed={${merged.speed}}`);
  if (merged.raggedness !== DEFAULT_PAPER_BURN_CONFIG.raggedness)
    props.push(`  raggedness={${merged.raggedness}}`);
  if (merged.noiseScale !== DEFAULT_PAPER_BURN_CONFIG.noiseScale)
    props.push(`  noiseScale={${merged.noiseScale}}`);
  if (merged.emberColor !== DEFAULT_PAPER_BURN_CONFIG.emberColor)
    props.push(formatStringProp("emberColor", merged.emberColor));
  if (merged.charColor !== DEFAULT_PAPER_BURN_CONFIG.charColor)
    props.push(formatStringProp("charColor", merged.charColor));
  if (merged.emberWidth !== DEFAULT_PAPER_BURN_CONFIG.emberWidth)
    props.push(`  emberWidth={${merged.emberWidth}}`);
  if (merged.charWidth !== DEFAULT_PAPER_BURN_CONFIG.charWidth)
    props.push(`  charWidth={${merged.charWidth}}`);
  if (merged.glowStrength !== DEFAULT_PAPER_BURN_CONFIG.glowStrength)
    props.push(`  glowStrength={${merged.glowStrength}}`);
  if (merged.ashIntensity !== DEFAULT_PAPER_BURN_CONFIG.ashIntensity)
    props.push(`  ashIntensity={${merged.ashIntensity}}`);
  if (merged.transparentBurn !== DEFAULT_PAPER_BURN_CONFIG.transparentBurn)
    props.push(`  transparentBurn={${merged.transparentBurn}}`);
  if (merged.revealColor !== DEFAULT_PAPER_BURN_CONFIG.revealColor)
    props.push(formatStringProp("revealColor", merged.revealColor));
  if (merged.hoverEmber !== DEFAULT_PAPER_BURN_CONFIG.hoverEmber)
    props.push(`  hoverEmber={${merged.hoverEmber}}`);

  props.push(`  onBurnComplete={() => console.log("Burn complete")}`);

  return `import { PaperBurn } from "@/components/ui/paper-burn";\n\nexport function Example() {\n  return (\n    <PaperBurn\n    ${props.join("\n    ")}\n    />\n  );\n}`;
}

export const PaperBurn = React.forwardRef<PaperBurnHandle, PaperBurnProps>(
  function PaperBurn(
    {
      label = DEFAULT_PAPER_BURN_CONFIG.label,
      restoreLabel = DEFAULT_PAPER_BURN_CONFIG.restoreLabel,
      showRestoreButton = DEFAULT_PAPER_BURN_CONFIG.showRestoreButton,
      size = DEFAULT_PAPER_BURN_CONFIG.size,
      borderRadius = DEFAULT_PAPER_BURN_CONFIG.borderRadius,
      showIcon = DEFAULT_PAPER_BURN_CONFIG.showIcon,
      mode = DEFAULT_PAPER_BURN_CONFIG.mode,
      imageFit = DEFAULT_PAPER_BURN_CONFIG.imageFit,
      imageScale = DEFAULT_PAPER_BURN_CONFIG.imageScale,
      fontFamily = DEFAULT_PAPER_BURN_CONFIG.fontFamily,
      fontWeight = DEFAULT_PAPER_BURN_CONFIG.fontWeight,
      inkColor = DEFAULT_PAPER_BURN_CONFIG.inkColor,
      paperColor = DEFAULT_PAPER_BURN_CONFIG.paperColor,
      letterSpacing = DEFAULT_PAPER_BURN_CONFIG.letterSpacing,
      paperGrain = DEFAULT_PAPER_BURN_CONFIG.paperGrain,
      burnMode = DEFAULT_PAPER_BURN_CONFIG.burnMode,
      holdDuration = DEFAULT_PAPER_BURN_CONFIG.holdDuration,
      releaseBehavior = DEFAULT_PAPER_BURN_CONFIG.releaseBehavior,
      autoResetDelay = DEFAULT_PAPER_BURN_CONFIG.autoResetDelay,
      burnOrigin = DEFAULT_PAPER_BURN_CONFIG.burnOrigin,
      progress = DEFAULT_PAPER_BURN_CONFIG.progress,
      speed = DEFAULT_PAPER_BURN_CONFIG.speed,
      raggedness = DEFAULT_PAPER_BURN_CONFIG.raggedness,
      noiseScale = DEFAULT_PAPER_BURN_CONFIG.noiseScale,
      emberColor = DEFAULT_PAPER_BURN_CONFIG.emberColor,
      charColor = DEFAULT_PAPER_BURN_CONFIG.charColor,
      emberWidth = DEFAULT_PAPER_BURN_CONFIG.emberWidth,
      charWidth = DEFAULT_PAPER_BURN_CONFIG.charWidth,
      glowStrength = DEFAULT_PAPER_BURN_CONFIG.glowStrength,
      ashIntensity = DEFAULT_PAPER_BURN_CONFIG.ashIntensity,
      transparentBurn = DEFAULT_PAPER_BURN_CONFIG.transparentBurn,
      revealColor = DEFAULT_PAPER_BURN_CONFIG.revealColor,
      hoverEmber = DEFAULT_PAPER_BURN_CONFIG.hoverEmber,
      imageSrc = null,
      paused = false,
      onBurnComplete,
      onRestore,
      onBurnProgress,
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerLeave,
      onPointerCancel,
      onKeyDown,
      onKeyUp,
      onBlur,
      className,
      style,
      disabled,
      type = "button",
      ...rest
    },
    ref
  ) {
    const [webglError, setWebglError] = React.useState<string | null>(null);
    const [isBurnedOut, setIsBurnedOut] = React.useState(false);

    const btnRef = React.useRef<HTMLButtonElement | null>(null);
    const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
    const ashCanvasRef = React.useRef<HTMLCanvasElement | null>(null);
    const srcCanvasRef = React.useRef<HTMLCanvasElement | null>(null);
    const loadedImgRef = React.useRef<HTMLImageElement | null>(null);
    const autoResetTimerRef = React.useRef<number | null>(null);
    const ashesRef = React.useRef<AshFlake[]>([]);

    const onBurnCompleteRef = React.useRef(onBurnComplete);
    onBurnCompleteRef.current = onBurnComplete;
    const onRestoreRef = React.useRef(onRestore);
    onRestoreRef.current = onRestore;
    const onBurnProgressRef = React.useRef(onBurnProgress);
    onBurnProgressRef.current = onBurnProgress;

    const spec = BUTTON_SPECS[size];

    const cfgRef = React.useRef({
      label,
      restoreLabel,
      showRestoreButton,
      size,
      borderRadius,
      showIcon,
      mode,
      imageFit,
      imageScale,
      fontFamily,
      fontWeight,
      inkColor,
      paperColor,
      letterSpacing,
      paperGrain,
      burnMode,
      holdDuration,
      releaseBehavior,
      autoResetDelay,
      burnOrigin,
      progress,
      speed,
      raggedness,
      noiseScale,
      emberColor,
      charColor,
      emberWidth,
      charWidth,
      glowStrength,
      ashIntensity,
      transparentBurn,
      revealColor,
      hoverEmber,
      paused,
      disabled: Boolean(disabled)
    });

    cfgRef.current = {
      label,
      restoreLabel,
      showRestoreButton,
      size,
      borderRadius,
      showIcon,
      mode,
      imageFit,
      imageScale,
      fontFamily,
      fontWeight,
      inkColor,
      paperColor,
      letterSpacing,
      paperGrain,
      burnMode,
      holdDuration,
      releaseBehavior,
      autoResetDelay,
      burnOrigin,
      progress,
      speed,
      raggedness,
      noiseScale,
      emberColor,
      charColor,
      emberWidth,
      charWidth,
      glowStrength,
      ashIntensity,
      transparentBurn,
      revealColor,
      hoverEmber,
      paused,
      disabled: Boolean(disabled)
    };

    const simRef = React.useRef({
      time: 0,
      holdProgress: 0,
      loopPhase: 0,
      holding: false,
      completed: false,
      recoveringReset: false,
      ashSpawnCarry: 0,
      mouseX: 0.5,
      mouseY: 0.5,
      igniteX: 0.5,
      igniteY: 0.5,
      hoverTarget: 0,
      hoverAmount: 0,
      lastReportedProgress: -1
    });

    const glStateRef = React.useRef<{
      gl: WebGLRenderingContext;
      texture: WebGLTexture;
      renderFrame: () => void;
      uploadSourceTexture: () => void;
    } | null>(null);

    React.useEffect(() => {
      if (burnMode !== "hold" && isBurnedOut) {
        simRef.current.completed = false;
        setIsBurnedOut(false);
      }
    }, [burnMode, isBurnedOut]);

    const spawnAshFlake = React.useCallback(
      (kind: "burning" | "burst" | "aftermath", effP: number) => {
        const list = ashesRef.current;
        if (list.length >= 160) return;

        const c = cfgRef.current;
        const sp = BUTTON_SPECS[c.size];
        const sim = simRef.current;
        const stageW = sp.w + ASH_BLEED_X * 2;
        const stageH = sp.h + ASH_BLEED_Y * 2;

        let x: number;
        let y: number;
        let vx: number;
        let vy: number;
        let emberHeat: number;
        let maxLife: number;
        let flakeSize: number;

        if (kind === "burst") {
          x = ASH_BLEED_X + Math.random() * sp.w;
          y = ASH_BLEED_Y + Math.random() * sp.h;
          const ang = Math.random() * Math.PI * 2;
          const spd = 22 + Math.random() * 88;
          vx = Math.cos(ang) * spd + (Math.random() - 0.5) * 30;
          vy = Math.sin(ang) * spd * 0.65 - (24 + Math.random() * 54);
          emberHeat = Math.random() < 0.55 ? 0.55 + Math.random() * 0.45 : 0.12;
          maxLife = 1.1 + Math.random() * 1.1;
          flakeSize = 2.4 + Math.random() * 4.6;
        } else if (kind === "aftermath") {
          x = ASH_BLEED_X * 0.35 + Math.random() * (stageW - ASH_BLEED_X * 0.7);
          y = ASH_BLEED_Y + sp.h * (0.1 + Math.random() * 1.05);
          vx = (Math.random() - 0.5) * 68;
          vy = -(16 + Math.random() * 42) + (Math.random() - 0.5) * 18;
          emberHeat = Math.random() < 0.22 ? 0.35 + Math.random() * 0.45 : 0;
          maxLife = 1.35 + Math.random() * 1.35;
          flakeSize = 2.0 + Math.random() * 4.2;
        } else {
          const ignPxX = ASH_BLEED_X + sim.igniteX * sp.w;
          const ignPxY = ASH_BLEED_Y + (1 - sim.igniteY) * sp.h;
          const randX = ASH_BLEED_X + Math.random() * sp.w;
          const randY = ASH_BLEED_Y + Math.random() * sp.h;
          const spread = Math.min(1, 0.2 + effP * 0.95);
          x = ignPxX + (randX - ignPxX) * spread;
          y = ignPxY + (randY - ignPxY) * spread;
          vx = (Math.random() - 0.5) * 64;
          vy = -(28 + Math.random() * 62);
          emberHeat = 0.45 + Math.random() * 0.55;
          maxLife = 0.85 + Math.random() * 0.95;
          flakeSize = 2.0 + Math.random() * 3.8;
        }

        list.push({
          x,
          y,
          vx,
          vy,
          size: flakeSize,
          rot: Math.random() * Math.PI * 2,
          vRot: (Math.random() - 0.5) * 6.5,
          tumble: Math.random() * Math.PI * 2,
          vTumble: 3.2 + Math.random() * 6.5,
          turbPhase: Math.random() * Math.PI * 2,
          turbFreq: 1.6 + Math.random() * 2.8,
          age: 0,
          maxLife,
          emberHeat,
          tone: Math.random(),
          shapeIdx: Math.floor(Math.random() * ASH_SHARD_SHAPES.length)
        });
      },
      []
    );

    const drawSourceCanvas = React.useCallback(() => {
      if (typeof document === "undefined") return null;
      const c = cfgRef.current;
      const sp = BUTTON_SPECS[c.size];
      const scale = 2.5;
      const cw = Math.round(sp.w * scale);
      const ch = Math.round(sp.h * scale);

      if (!srcCanvasRef.current) {
        srcCanvasRef.current = document.createElement("canvas");
      }
      const src = srcCanvasRef.current;
      if (src.width !== cw || src.height !== ch) {
        src.width = cw;
        src.height = ch;
      }

      const ctx = src.getContext("2d");
      if (!ctx) return null;

      ctx.clearRect(0, 0, cw, ch);

      const inset = 1 * scale;
      const boxW = cw - inset * 2;
      const boxH = ch - inset * 2;
      const rad = Math.min(boxH / 2, Math.max(0, c.borderRadius) * scale);

      const baseRgb = parseHexRgb(c.paperColor, [244, 237, 226]);
      const topFill = mixRgbCss(baseRgb, [255, 255, 255], 0.16);
      const botFill = mixRgbCss(baseRgb, [12, 10, 8], 0.12);
      const rimStroke = mixRgbCss(baseRgb, [120, 110, 100], 0.35);

      ctx.save();
      traceRoundRect(ctx, inset, inset, boxW, boxH, rad);
      ctx.clip();

      const grad = ctx.createLinearGradient(0, inset, 0, inset + boxH);
      grad.addColorStop(0, topFill);
      grad.addColorStop(0.52, c.paperColor);
      grad.addColorStop(1, botFill);
      ctx.fillStyle = grad;
      ctx.fillRect(inset, inset, boxW, boxH);

      const img = loadedImgRef.current;
      if (
        c.mode === "image" &&
        img &&
        (img.naturalWidth || img.width) > 0 &&
        (img.naturalHeight || img.height) > 0
      ) {
        const iw = img.naturalWidth || img.width;
        const ih = img.naturalHeight || img.height;
        const k =
          (c.imageFit === "cover" ? Math.max : Math.min)(
            boxW / iw,
            boxH / ih
          ) * c.imageScale;
        const dw = iw * k;
        const dh = ih * k;
        ctx.drawImage(
          img,
          inset + (boxW - dw) / 2,
          inset + (boxH - dh) / 2,
          dw,
          dh
        );
      }

      const sheen = ctx.createLinearGradient(0, inset, 0, inset + 4 * scale);
      sheen.addColorStop(0, "rgba(255, 255, 255, 0.38)");
      sheen.addColorStop(1, "rgba(255, 255, 255, 0)");
      ctx.fillStyle = sheen;
      ctx.fillRect(inset, inset, boxW, 4 * scale);

      const fsPx = sp.fontSize * scale;
      ctx.font = `${c.fontWeight} ${fsPx}px ${c.fontFamily}`;
      if ("letterSpacing" in ctx) {
        (
          ctx as CanvasRenderingContext2D & { letterSpacing?: string }
        ).letterSpacing = `${c.letterSpacing * scale}px`;
      }
      ctx.fillStyle = c.inkColor;
      ctx.textBaseline = "middle";

      const iconW = c.showIcon ? sp.iconSize * scale : 0;
      const textX = inset + sp.padL * scale;
      const maxTextW =
        boxW -
        sp.padL * scale -
        sp.padR * scale -
        (c.showIcon ? iconW + 12 * scale : 0);

      ctx.textAlign = "left";
      ctx.fillText(c.label, textX, ch / 2, Math.max(24, maxTextW));

      if (c.showIcon) {
        const iconCx = inset + boxW - sp.padR * scale - iconW / 2;
        drawFlameIcon(ctx, iconCx, ch / 2, iconW, c.inkColor, c.emberColor);
      }

      ctx.restore();

      ctx.save();
      traceRoundRect(
        ctx,
        inset + 0.6 * scale,
        inset + 0.6 * scale,
        boxW - 1.2 * scale,
        boxH - 1.2 * scale,
        Math.max(0, rad - 0.6 * scale)
      );
      ctx.strokeStyle = rimStroke;
      ctx.lineWidth = 1.1 * scale;
      ctx.stroke();
      ctx.restore();

      return src;
    }, []);

    React.useEffect(() => {
      if (!imageSrc) {
        loadedImgRef.current = null;
        glStateRef.current?.uploadSourceTexture();
        return;
      }

      let cancelled = false;
      const im = new Image();
      if (/^https?:/i.test(imageSrc)) {
        im.crossOrigin = "anonymous";
      }
      im.onload = () => {
        if (cancelled) return;
        loadedImgRef.current = im;
        glStateRef.current?.uploadSourceTexture();
      };
      im.onerror = () => {
        if (cancelled) return;
        loadedImgRef.current = null;
        glStateRef.current?.uploadSourceTexture();
      };
      im.src = imageSrc;

      return () => {
        cancelled = true;
      };
    }, [imageSrc]);

    React.useEffect(() => {
      if (!hoverEmber) {
        simRef.current.hoverTarget = 0;
      }
    }, [hoverEmber]);

    React.useEffect(() => {
      glStateRef.current?.uploadSourceTexture();
    }, [
      label,
      size,
      borderRadius,
      showIcon,
      mode,
      imageFit,
      imageScale,
      fontFamily,
      fontWeight,
      inkColor,
      paperColor,
      letterSpacing,
      emberColor
    ]);

    React.useEffect(() => {
      return () => {
        if (autoResetTimerRef.current) {
          window.clearTimeout(autoResetTimerRef.current);
        }
      };
    }, []);

    React.useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const gl = canvas.getContext("webgl", {
        preserveDrawingBuffer: true,
        alpha: true,
        premultipliedAlpha: true,
        antialias: false
      });
      if (!gl) {
        setWebglError("WebGL unavailable");
        return;
      }
      setWebglError(null);

      let program: WebGLProgram | null = null;
      let vs: WebGLShader | null = null;
      let fs: WebGLShader | null = null;
      let quadBuf: WebGLBuffer | null = null;
      let texture: WebGLTexture | null = null;

      try {
        vs = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER_SOURCE);
        fs = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER_SOURCE);
        program = gl.createProgram();
        if (!program) throw new Error("Could not create WebGL program.");
        gl.attachShader(program, vs);
        gl.attachShader(program, fs);
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
          throw new Error(gl.getProgramInfoLog(program) || "Shader link failed.");
        }

        gl.useProgram(program);

        quadBuf = gl.createBuffer();
        if (!quadBuf) throw new Error("Could not allocate WebGL buffer.");
        gl.bindBuffer(gl.ARRAY_BUFFER, quadBuf);
        gl.bufferData(
          gl.ARRAY_BUFFER,
          new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
          gl.STATIC_DRAW
        );

        const posLoc = gl.getAttribLocation(program, "a_pos");
        gl.enableVertexAttribArray(posLoc);
        gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

        texture = gl.createTexture();
        if (!texture) throw new Error("Could not create WebGL texture.");
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

        const locs = {
          u_tex: gl.getUniformLocation(program, "u_tex"),
          u_t: gl.getUniformLocation(program, "u_t"),
          u_aspect: gl.getUniformLocation(program, "u_aspect"),
          u_progress: gl.getUniformLocation(program, "u_progress"),
          u_origin: gl.getUniformLocation(program, "u_origin"),
          u_raggedness: gl.getUniformLocation(program, "u_raggedness"),
          u_noiseScale: gl.getUniformLocation(program, "u_noiseScale"),
          u_paperGrain: gl.getUniformLocation(program, "u_paperGrain"),
          u_emberWidth: gl.getUniformLocation(program, "u_emberWidth"),
          u_charWidth: gl.getUniformLocation(program, "u_charWidth"),
          u_glowStrength: gl.getUniformLocation(program, "u_glowStrength"),
          u_transparent: gl.getUniformLocation(program, "u_transparent"),
          u_hoverAmt: gl.getUniformLocation(program, "u_hoverAmt"),
          u_mouse: gl.getUniformLocation(program, "u_mouse"),
          u_ignite: gl.getUniformLocation(program, "u_ignite"),
          u_emberColor: gl.getUniformLocation(program, "u_emberColor"),
          u_charColor: gl.getUniformLocation(program, "u_charColor"),
          u_revealColor: gl.getUniformLocation(program, "u_revealColor")
        };

        const syncCanvasSize = () => {
          const sp = BUTTON_SPECS[cfgRef.current.size];
          const cw = Math.max(1, canvas.clientWidth || sp.w);
          const ch = Math.max(1, canvas.clientHeight || sp.h);
          const dpr = Math.min(window.devicePixelRatio || 1, 2);
          const pw = Math.round(cw * dpr);
          const ph = Math.round(ch * dpr);
          if (canvas.width !== pw || canvas.height !== ph) {
            canvas.width = pw;
            canvas.height = ph;
          }
          gl.viewport(0, 0, canvas.width, canvas.height);

          const ashCanvas = ashCanvasRef.current;
          if (ashCanvas) {
            const stageW = sp.w + ASH_BLEED_X * 2;
            const stageH = sp.h + ASH_BLEED_Y * 2;
            const apw = Math.round(stageW * dpr);
            const aph = Math.round(stageH * dpr);
            if (ashCanvas.width !== apw || ashCanvas.height !== aph) {
              ashCanvas.width = apw;
              ashCanvas.height = aph;
            }
          }
        };

        const computeEffectiveProgress = () => {
          const c = cfgRef.current;
          const sim = simRef.current;
          if (c.burnMode === "scrub") {
            return Math.min(1, Math.max(0, c.progress / 100));
          }
          if (c.burnMode === "loop") {
            const cycle = sim.loopPhase % 1.28;
            if (cycle <= 1.0) return cycle;
            const r = (cycle - 1.0) / 0.28;
            return 1.0 - r * r * (3.0 - 2.0 * r);
          }
          return sim.holdProgress;
        };

        const renderAshes = (dt: number, effP: number) => {
          const ashCanvas = ashCanvasRef.current;
          if (!ashCanvas) return;
          const ctx = ashCanvas.getContext("2d");
          if (!ctx) return;

          const c = cfgRef.current;
          const sim = simRef.current;
          const sp = BUTTON_SPECS[c.size];
          const dpr = Math.min(window.devicePixelRatio || 1, 2);
          const stageW = sp.w + ASH_BLEED_X * 2;
          const stageH = sp.h + ASH_BLEED_Y * 2;
          const apw = Math.round(stageW * dpr);
          const aph = Math.round(stageH * dpr);
          if (ashCanvas.width !== apw || ashCanvas.height !== aph) {
            ashCanvas.width = apw;
            ashCanvas.height = aph;
          }

          const ashAmt = Math.min(1, Math.max(0, c.ashIntensity / 100));
          if (!c.paused && ashAmt > 0) {
            let rate = 0;
            let modeKind: "burning" | "aftermath" = "burning";
            if (sim.completed || effP >= 0.99) {
              rate = 24 * ashAmt;
              modeKind = "aftermath";
            } else if (effP > 0.02) {
              rate = (18 + 44 * Math.sin(effP * Math.PI)) * ashAmt;
              modeKind = "burning";
            }
            sim.ashSpawnCarry += rate * dt;
            while (sim.ashSpawnCarry >= 1) {
              sim.ashSpawnCarry -= 1;
              spawnAshFlake(modeKind, effP);
            }
          }

          ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
          ctx.clearRect(0, 0, stageW, stageH);

          const list = ashesRef.current;
          if (list.length === 0) return;

          const emberRgb = parseHexRgb(c.emberColor, [255, 106, 26]);
          const charRgb = parseHexRgb(c.charColor, [22, 17, 14]);

          for (let i = list.length - 1; i >= 0; i--) {
            const p = list[i];
            if (!c.paused) {
              p.age += dt;
              if (p.age >= p.maxLife) {
                list.splice(i, 1);
                continue;
              }
              const gustX =
                Math.sin(sim.time * p.turbFreq + p.turbPhase) * 52 +
                Math.cos(sim.time * 0.9 + p.turbPhase * 1.7) * 24;
              const gustY =
                Math.cos(sim.time * (p.turbFreq * 0.75) + p.turbPhase) * 22;

              p.vx += gustX * dt;
              p.vy += (gustY - 8) * dt;
              p.vx *= 0.985;
              p.x += p.vx * dt;
              p.y += p.vy * dt;
              p.rot += p.vRot * dt;
              p.tumble += p.vTumble * dt;
              p.emberHeat = Math.max(0, p.emberHeat - dt * 1.35);
            }

            const lifeNorm = p.age / p.maxLife;
            const fadeIn = Math.min(1, p.age / 0.12);
            const fadeOut = 1 - Math.pow(lifeNorm, 1.65);
            const alpha = Math.max(0, Math.min(1, fadeIn * fadeOut * 0.92));
            if (alpha <= 0.01) continue;

            const flipY = 0.22 + 0.78 * Math.abs(Math.cos(p.tumble));
            const ashGrey = Math.round(52 + p.tone * 76);
            const baseR = Math.round(charRgb[0] * 0.45 + ashGrey * 0.55);
            const baseG = Math.round(charRgb[1] * 0.45 + (ashGrey - 3) * 0.55);
            const baseB = Math.round(charRgb[2] * 0.45 + (ashGrey - 6) * 0.55);

            const heat = p.emberHeat;
            const r = Math.round(baseR + (emberRgb[0] - baseR) * heat);
            const g = Math.round(baseG + (emberRgb[1] - baseG) * heat);
            const b = Math.round(baseB + (emberRgb[2] - baseB) * heat);

            const verts = ASH_SHARD_SHAPES[p.shapeIdx];
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rot);
            ctx.scale(1, flipY);
            ctx.globalAlpha = alpha;

            if (heat > 0.25) {
              ctx.shadowColor = c.emberColor;
              ctx.shadowBlur = 6 * heat;
            }

            ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
            ctx.beginPath();
            for (let v = 0; v < verts.length; v++) {
              const vxPt = verts[v][0] * p.size;
              const vyPt = verts[v][1] * p.size;
              if (v === 0) ctx.moveTo(vxPt, vyPt);
              else ctx.lineTo(vxPt, vyPt);
            }
            ctx.closePath();
            ctx.fill();
            ctx.restore();
          }
        };

        const renderFrame = () => {
          const c = cfgRef.current;
          const sim = simRef.current;
          const sp = BUTTON_SPECS[c.size];
          const cw = canvas.clientWidth || sp.w;
          const ch = canvas.clientHeight || sp.h;
          const aspect = cw / Math.max(1, ch);
          const effP = computeEffectiveProgress();

          const btn = btnRef.current;
          if (btn) {
            const heatAura =
              effP > 0.01 && effP < 0.99
                ? Math.sin(effP * Math.PI) * (c.glowStrength / 100)
                : 0;
            btn.style.filter =
              effP >= 0.995
                ? "none"
                : heatAura > 0.02
                ? `drop-shadow(0 6px ${Math.round(10 + heatAura * 18)}px rgba(255, 106, 26, ${(heatAura * 0.42).toFixed(2)}))`
                : "drop-shadow(0 6px 16px rgba(0, 0, 0, 0.32))";
          }

          const emberRgb = parseHexToRgb01(c.emberColor, [1.0, 0.416, 0.102]);
          const charRgb = parseHexToRgb01(c.charColor, [0.086, 0.067, 0.055]);
          const revealRgb = parseHexToRgb01(
            c.revealColor,
            [0.043, 0.043, 0.059]
          );

          gl.clearColor(0, 0, 0, 0);
          gl.clear(gl.COLOR_BUFFER_BIT);

          gl.useProgram(program);
          gl.activeTexture(gl.TEXTURE0);
          gl.bindTexture(gl.TEXTURE_2D, texture);
          gl.uniform1i(locs.u_tex, 0);
          gl.uniform1f(locs.u_t, sim.time);
          gl.uniform1f(locs.u_aspect, aspect);
          gl.uniform1f(locs.u_progress, effP);
          gl.uniform1f(locs.u_origin, originToCode(c.burnOrigin));
          gl.uniform1f(
            locs.u_raggedness,
            Math.min(1, Math.max(0, c.raggedness / 100))
          );
          gl.uniform1f(locs.u_noiseScale, Math.max(0.5, c.noiseScale));
          gl.uniform1f(
            locs.u_paperGrain,
            Math.min(1, Math.max(0, c.paperGrain / 100))
          );
          gl.uniform1f(
            locs.u_emberWidth,
            Math.min(1, Math.max(0.02, c.emberWidth / 100))
          );
          gl.uniform1f(
            locs.u_charWidth,
            Math.min(1, Math.max(0.02, c.charWidth / 100))
          );
          gl.uniform1f(
            locs.u_glowStrength,
            Math.min(1, Math.max(0, c.glowStrength / 100))
          );
          gl.uniform1f(locs.u_transparent, c.transparentBurn ? 1 : 0);
          gl.uniform1f(locs.u_hoverAmt, sim.hoverAmount);
          gl.uniform2f(locs.u_mouse, sim.mouseX, sim.mouseY);
          gl.uniform2f(locs.u_ignite, sim.igniteX, sim.igniteY);
          gl.uniform3f(locs.u_emberColor, emberRgb[0], emberRgb[1], emberRgb[2]);
          gl.uniform3f(locs.u_charColor, charRgb[0], charRgb[1], charRgb[2]);
          gl.uniform3f(
            locs.u_revealColor,
            revealRgb[0],
            revealRgb[1],
            revealRgb[2]
          );

          gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        };

        const uploadSourceTexture = () => {
          const src = drawSourceCanvas();
          if (!src || !texture) return;
          gl.activeTexture(gl.TEXTURE0);
          gl.bindTexture(gl.TEXTURE_2D, texture);
          gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
          gl.texImage2D(
            gl.TEXTURE_2D,
            0,
            gl.RGBA,
            gl.RGBA,
            gl.UNSIGNED_BYTE,
            src
          );
          renderFrame();
        };

        glStateRef.current = {
          gl,
          texture,
          renderFrame,
          uploadSourceTexture
        };

        syncCanvasSize();
        uploadSourceTexture();

        const ro = new ResizeObserver(() => {
          syncCanvasSize();
          renderFrame();
        });
        ro.observe(canvas);

        let rafId = 0;
        let lastMs = performance.now();

        const tick = (now: number) => {
          const dt = Math.min((now - lastMs) / 1000, 0.1);
          lastMs = now;
          const c = cfgRef.current;
          const sim = simRef.current;

          if (!c.paused) {
            sim.time += dt;

            if (c.burnMode === "loop") {
              const prevCycle = sim.loopPhase % 1.28;
              sim.loopPhase = (sim.loopPhase + dt * c.speed * 0.28) % 1.28;
              const nextCycle = sim.loopPhase % 1.28;
              if (prevCycle < 0.98 && nextCycle >= 0.98) {
                const burstCount = Math.round(
                  32 * Math.min(1, Math.max(0, c.ashIntensity / 100))
                );
                for (let b = 0; b < burstCount; b++) {
                  spawnAshFlake("burst", 1);
                }
              }
            } else if (c.burnMode === "hold") {
              if (sim.holding && !sim.completed && !c.disabled) {
                const holdSec = Math.max(0.25, c.holdDuration / 1000);
                sim.holdProgress = Math.min(1, sim.holdProgress + dt / holdSec);

                if (sim.holdProgress >= 1) {
                  sim.holdProgress = 1;
                  sim.completed = true;
                  sim.holding = false;
                  setIsBurnedOut(true);

                  const burstCount = Math.round(
                    46 * Math.min(1, Math.max(0, c.ashIntensity / 100))
                  );
                  for (let b = 0; b < burstCount; b++) {
                    spawnAshFlake("burst", 1);
                  }

                  onBurnCompleteRef.current?.();

                  if (autoResetTimerRef.current) {
                    window.clearTimeout(autoResetTimerRef.current);
                  }
                  if (c.autoResetDelay > 0) {
                    autoResetTimerRef.current = window.setTimeout(() => {
                      sim.completed = false;
                      sim.recoveringReset = true;
                      setIsBurnedOut(false);
                    }, c.autoResetDelay);
                  }
                }
              } else if (!sim.holding && !sim.completed) {
                if (sim.recoveringReset || c.releaseBehavior === "recover") {
                  sim.holdProgress = Math.max(0, sim.holdProgress - dt * 1.75);
                  if (sim.holdProgress === 0) {
                    sim.recoveringReset = false;
                  }
                }
              }
            }
          }

          const effectiveHoverTarget =
            c.hoverEmber && !sim.completed ? sim.hoverTarget : 0;
          sim.hoverAmount += (effectiveHoverTarget - sim.hoverAmount) * 0.12;

          const effP = computeEffectiveProgress();
          const reported = Math.round(effP * 100) / 100;
          if (reported !== sim.lastReportedProgress) {
            sim.lastReportedProgress = reported;
            onBurnProgressRef.current?.(reported);
          }

          renderFrame();
          renderAshes(dt, effP);
          rafId = requestAnimationFrame(tick);
        };

        rafId = requestAnimationFrame(tick);

        return () => {
          cancelAnimationFrame(rafId);
          ro.disconnect();
          glStateRef.current = null;
          if (texture) gl.deleteTexture(texture);
          if (quadBuf) gl.deleteBuffer(quadBuf);
          if (program) gl.deleteProgram(program);
          if (vs) gl.deleteShader(vs);
          if (fs) gl.deleteShader(fs);
        };
      } catch (err) {
        setWebglError(
          err instanceof Error ? err.message : "Failed to initialize WebGL."
        );
        if (texture) gl.deleteTexture(texture);
        if (quadBuf) gl.deleteBuffer(quadBuf);
        if (program) gl.deleteProgram(program);
        if (vs) gl.deleteShader(vs);
        if (fs) gl.deleteShader(fs);
        return undefined;
      }
    }, [drawSourceCanvas, spawnAshFlake]);

    const reset = React.useCallback(() => {
      if (autoResetTimerRef.current) {
        window.clearTimeout(autoResetTimerRef.current);
        autoResetTimerRef.current = null;
      }
      const sim = simRef.current;
      sim.holding = false;
      sim.completed = false;
      sim.recoveringReset = false;
      sim.holdProgress = 0;
      sim.loopPhase = 0;
      sim.ashSpawnCarry = 0;
      ashesRef.current = [];
      const ashCanvas = ashCanvasRef.current;
      if (ashCanvas) {
        const ctx = ashCanvas.getContext("2d");
        ctx?.clearRect(0, 0, ashCanvas.width, ashCanvas.height);
      }
      setIsBurnedOut(false);
      onRestoreRef.current?.();
      glStateRef.current?.renderFrame();
      window.requestAnimationFrame(() => {
        btnRef.current?.focus({ preventScroll: true });
      });
    }, []);

    const exportPngBlob = React.useCallback((): Promise<Blob | null> => {
      const canvas = canvasRef.current;
      if (!canvas) return Promise.resolve(null);
      glStateRef.current?.renderFrame();

      const ashCanvas = ashCanvasRef.current;
      if (ashCanvas && ashesRef.current.length > 0) {
        const out = document.createElement("canvas");
        out.width = ashCanvas.width;
        out.height = ashCanvas.height;
        const ctx = out.getContext("2d");
        if (ctx) {
          const dpr = Math.min(window.devicePixelRatio || 1, 2);
          ctx.drawImage(
            canvas,
            Math.round(ASH_BLEED_X * dpr),
            Math.round(ASH_BLEED_Y * dpr),
            canvas.width,
            canvas.height
          );
          ctx.drawImage(ashCanvas, 0, 0);
          return new Promise((resolve) => {
            out.toBlob((blob) => resolve(blob), "image/png");
          });
        }
      }

      return new Promise((resolve) => {
        canvas.toBlob((blob) => resolve(blob), "image/png");
      });
    }, []);

    const downloadPng = React.useCallback(
      async (filename = "paper-burn-button.png") => {
        const blob = await exportPngBlob();
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        a.click();
        window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      },
      [exportPngBlob]
    );

    React.useImperativeHandle(
      ref,
      () => ({
        button: btnRef.current,
        canvas: canvasRef.current,
        reset,
        exportPngBlob,
        downloadPng
      }),
      [reset, exportPngBlob, downloadPng]
    );

    const updateNormalizedCoords = (
      el: HTMLElement,
      clientX: number,
      clientY: number
    ) => {
      const rect = el.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return { x: 0.5, y: 0.5 };
      return {
        x: Math.min(1, Math.max(0, (clientX - rect.left) / rect.width)),
        y: Math.min(1, Math.max(0, 1 - (clientY - rect.top) / rect.height))
      };
    };

    const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
      onPointerDown?.(e);
      if (e.defaultPrevented || disabled) return;
      if (e.pointerType === "mouse" && e.button !== 0) return;

      const sim = simRef.current;
      if (sim.completed) {
        if (!showRestoreButton) reset();
        return;
      }

      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {
        // Ignore capture unsupported
      }

      const pt = updateNormalizedCoords(
        e.currentTarget,
        e.clientX,
        e.clientY
      );
      sim.mouseX = pt.x;
      sim.mouseY = pt.y;
      sim.igniteX = pt.x;
      sim.igniteY = pt.y;
      sim.recoveringReset = false;
      sim.holding = true;
    };

    const handlePointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
      onPointerMove?.(e);
      const pt = updateNormalizedCoords(
        e.currentTarget,
        e.clientX,
        e.clientY
      );
      simRef.current.mouseX = pt.x;
      simRef.current.mouseY = pt.y;
      simRef.current.hoverTarget = cfgRef.current.hoverEmber ? 1 : 0;
    };

    const handlePointerUp = (e: React.PointerEvent<HTMLButtonElement>) => {
      onPointerUp?.(e);
      simRef.current.holding = false;
    };

    const handlePointerCancel = (e: React.PointerEvent<HTMLButtonElement>) => {
      onPointerCancel?.(e);
      simRef.current.holding = false;
      simRef.current.hoverTarget = 0;
    };

    const handlePointerLeave = (e: React.PointerEvent<HTMLButtonElement>) => {
      onPointerLeave?.(e);
      simRef.current.hoverTarget = 0;
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
      onKeyDown?.(e);
      if (e.defaultPrevented || disabled) return;
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        if (e.repeat) return;
        const sim = simRef.current;
        if (sim.completed) {
          reset();
          return;
        }
        sim.igniteX = 0.5;
        sim.igniteY = 0.5;
        sim.recoveringReset = false;
        sim.holding = true;
      }
    };

    const handleKeyUp = (e: React.KeyboardEvent<HTMLButtonElement>) => {
      onKeyUp?.(e);
      if (e.key === " " || e.key === "Enter") {
        simRef.current.holding = false;
      }
    };

    const handleBlur = (e: React.FocusEvent<HTMLButtonElement>) => {
      onBlur?.(e);
      simRef.current.holding = false;
      simRef.current.hoverTarget = 0;
    };

    const clampedRadius = Math.min(spec.h / 2, Math.max(0, borderRadius));
    const showRestoreOverlay =
      isBurnedOut && burnMode === "hold" && showRestoreButton;

    return (
      <>
        <style>{SCOPED_BUTTON_CSS}</style>
        <div
          className={className ? `pbb-wrap ${className}` : "pbb-wrap"}
          style={{
            width: spec.w,
            height: spec.h,
            ...style
          }}
        >
          <button
            ref={btnRef}
            type={type}
            disabled={disabled}
            aria-label={label}
            aria-hidden={showRestoreOverlay ? "true" : undefined}
            tabIndex={showRestoreOverlay ? -1 : rest.tabIndex}
            className="pbb-btn"
            style={{
              borderRadius: clampedRadius,
              pointerEvents: showRestoreOverlay ? "none" : "auto"
            }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerCancel}
            onPointerLeave={handlePointerLeave}
            onKeyDown={handleKeyDown}
            onKeyUp={handleKeyUp}
            onBlur={handleBlur}
            {...rest}
          >
            <span className="pbb-sr">{label}</span>
            {webglError ? (
              <span
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: clampedRadius,
                  backgroundColor: paperColor,
                  color: inkColor,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: spec.fontSize,
                  fontWeight: 600
                }}
              >
                {label}
              </span>
            ) : (
              <canvas
                ref={canvasRef}
                aria-hidden="true"
                style={{
                  width: "100%",
                  height: "100%",
                  display: "block",
                  pointerEvents: "none"
                }}
              />
            )}
          </button>

          <canvas
            ref={ashCanvasRef}
            aria-hidden="true"
            style={{
              position: "absolute",
              left: -ASH_BLEED_X,
              top: -ASH_BLEED_Y,
              width: spec.w + ASH_BLEED_X * 2,
              height: spec.h + ASH_BLEED_Y * 2,
              pointerEvents: "none",
              zIndex: 3
            }}
          />

          {showRestoreOverlay && (
            <button
              type="button"
              className="pbb-restore"
              onClick={reset}
              style={{
                height: spec.restoreH,
                fontSize: spec.restoreFs
              }}
            >
              <svg
                width="13"
                height="13"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M3.2 6.5A5.2 5.2 0 1 1 4.1 11.4M3.2 3.2v3.3h3.3"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>{restoreLabel}</span>
            </button>
          )}
        </div>
      </>
    );
  }
);

export const PaperBurnButton = PaperBurn;
export default PaperBurn;
