"use client";

import * as React from "react";

export type PixelPromptButtonSize = "sm" | "md" | "lg";

export interface PixelPromptButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  /** Primary button text. Defaults to "Generate & copy prompt". */
  label?: string;
  /** Temporary confirmation text shown after copying. Defaults to "Copied prompt!". */
  copiedLabel?: string;
  /** Prompt string copied to clipboard on click. */
  prompt?: string;
  /** Preset pill scale ("lg" matches the 472×77 reference spec). */
  size?: PixelPromptButtonSize;
  /** Optional callback fired after the prompt text is copied. */
  onCopyPrompt?: (text: string) => void;
}

const COLS = 54;
const ROWS = 9;
const CELL = 8;
const GAP = 1;
const PITCH = CELL + GAP;

const MOSAIC_PALETTE = [
  "#2753e6",
  "#2c5cf5",
  "#3362f7",
  "#3d6bf9",
  "#4974fb",
  "#567ffd",
  "#648aff",
  "#7497ff"
] as const;

const DEFAULT_PROMPT =
  "Create a cobalt-blue pill button (#2C5CF5) with an 8px pixel-mosaic tile pattern, a soft top-edge inner highlight, subtle blue outer glow, white label on the left, and an outline lightning bolt icon on the right.";

/** Deterministic integer hash so SSR and client SVG cells match identically. */
function cellHash(row: number, col: number): number {
  let h = (row * 374761393 + col * 668265263) ^ 0x5bd1e995;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

function buildMosaicCells() {
  const cells: Array<{ x: number; y: number; fill: string }> = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const n1 = cellHash(r, c);
      const n2 = cellHash(r + 31, c + 17);

      const dc1 = (c - 10.5) / 6.2;
      const dr1 = (r - 2.6) / 3.1;
      const cluster1 = Math.exp(-(dc1 * dc1 + dr1 * dr1));

      const dc2 = (c - 39.5) / 7.5;
      const dr2 = (r - 5.8) / 3.4;
      const cluster2 = 0.34 * Math.exp(-(dc2 * dc2 + dr2 * dr2));

      const score =
        cluster1 * 0.78 +
        cluster2 * 0.55 +
        (n1 - 0.32) * 0.48 +
        (n2 > 0.84 ? 0.22 : 0);

      const idx = Math.max(
        0,
        Math.min(MOSAIC_PALETTE.length - 1, Math.floor(score * MOSAIC_PALETTE.length))
      );

      cells.push({
        x: c * PITCH,
        y: r * PITCH,
        fill: MOSAIC_PALETTE[idx]
      });
    }
  }
  return cells;
}

const MOSAIC_CELLS = buildMosaicCells();

async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Fallback for non-HTTPS origins where navigator.clipboard is unavailable
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

const SCOPED_CSS = `
.ppb-btn {
  display: inline-flex;
  border: 0;
  margin: 0;
  border-radius: 9999px;
  padding: 1.5px;
  cursor: pointer;
  font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  background: linear-gradient(
    180deg,
    rgba(175, 202, 255, 0.85) 0%,
    rgba(95, 136, 255, 0.35) 55%,
    rgba(44, 92, 245, 0.4) 100%
  );
  box-shadow:
    0 4px 20px rgba(44, 92, 245, 0.55),
    0 0 10px rgba(44, 92, 245, 0.35);
  transition: transform 0.14s ease, filter 0.14s ease, box-shadow 0.14s ease;
  user-select: none;
  flex-shrink: 0;
  box-sizing: border-box;
}
.ppb-btn:hover:not(:disabled) {
  filter: brightness(1.06);
  box-shadow:
    0 6px 26px rgba(44, 92, 245, 0.68),
    0 0 14px rgba(95, 136, 255, 0.45);
}
.ppb-btn:active:not(:disabled) {
  transform: translateY(1px) scale(0.992);
}
.ppb-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}
.ppb-btn:focus-visible {
  outline: 2px solid #9db7ff;
  outline-offset: 3px;
}
.ppb-inner {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
  border-radius: 9999px;
  overflow: hidden;
  background: #2c5cf5;
  box-shadow: inset 0 1.5px 1px rgba(255, 255, 255, 0.42);
}
.ppb-mosaic {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  display: block;
  pointer-events: none;
}
.ppb-content {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
  color: #ffffff;
  font-weight: 600;
  letter-spacing: -0.018em;
}
.ppb-label {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.ppb-bolt {
  flex-shrink: 0;
  display: block;
}
.ppb-lg {
  width: 472px;
  max-width: 100%;
  height: 77px;
}
.ppb-lg .ppb-content {
  padding: 0 34px 0 32px;
  font-size: 22px;
  line-height: 1;
}
.ppb-lg .ppb-bolt {
  width: 24px;
  height: 24px;
}
.ppb-md {
  width: 310px;
  max-width: 100%;
  height: 50px;
}
.ppb-md .ppb-content {
  padding: 0 22px 0 20px;
  font-size: 14.5px;
  line-height: 1;
}
.ppb-md .ppb-bolt {
  width: 17px;
  height: 17px;
}
.ppb-sm {
  width: 236px;
  max-width: 100%;
  height: 38px;
}
.ppb-sm .ppb-content {
  padding: 0 16px 0 15px;
  font-size: 12px;
  line-height: 1;
}
.ppb-sm .ppb-bolt {
  width: 14px;
  height: 14px;
}
@media (prefers-reduced-motion: reduce) {
  .ppb-btn { transition: none; }
}
`;

export const PixelPromptButton = React.forwardRef<HTMLButtonElement, PixelPromptButtonProps>(
  (
    {
      label = "Generate & copy prompt",
      copiedLabel = "Copied prompt!",
      prompt = DEFAULT_PROMPT,
      size = "lg",
      onCopyPrompt,
      onClick,
      disabled = false,
      type = "button",
      className = "",
      ...props
    },
    ref
  ) => {
    const [copied, setCopied] = React.useState(false);
    const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

    React.useEffect(() => {
      return () => {
        if (timerRef.current) clearTimeout(timerRef.current);
      };
    }, []);

    const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled) return;
      onClick?.(e);
      if (e.defaultPrevented) return;
      const ok = await copyToClipboard(prompt);
      if (ok) {
        onCopyPrompt?.(prompt);
      }
      setCopied(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setCopied(false), 1800);
    };

    return (
      <>
        <style>{SCOPED_CSS}</style>
        <button
          ref={ref}
          type={type}
          disabled={disabled}
          onClick={handleClick}
          className={`ppb-btn ppb-${size} ${copied ? "ppb-copied" : ""} ${className}`.trim()}
          aria-label={copied ? copiedLabel : label}
          {...props}
        >
          <span className="ppb-inner">
            <svg
              className="ppb-mosaic"
              viewBox={`0 0 ${COLS * PITCH} ${ROWS * PITCH}`}
              preserveAspectRatio="xMidYMid slice"
              aria-hidden="true"
            >
              <rect width={COLS * PITCH} height={ROWS * PITCH} fill="#2048d5" />
              {MOSAIC_CELLS.map((cell, i) => (
                <rect
                  key={i}
                  x={cell.x}
                  y={cell.y}
                  width={CELL}
                  height={CELL}
                  fill={cell.fill}
                />
              ))}
            </svg>

            <span className="ppb-content">
              <span className="ppb-label">{copied ? copiedLabel : label}</span>
              <svg
                className="ppb-bolt"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.9"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M13.2 2.5L5.4 13.1h6.1l-1.1 8.4 8.2-10.9h-6.1l.7-8.1z" />
              </svg>
            </span>
          </span>
        </button>
      </>
    );
  }
);

PixelPromptButton.displayName = "PixelPromptButton";

export default PixelPromptButton;
