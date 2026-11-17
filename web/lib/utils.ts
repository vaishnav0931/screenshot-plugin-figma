import type { Frame } from "./types";

export const HEADER_H = 48;

export const SAMPLE_URLS = [
  "https://stripe.com",
  "https://linear.app",
  "https://vercel.com",
  "https://www.figma.com",
  "https://github.com",
  "https://www.notion.so",
  "https://www.raycast.com",
  "https://supabase.com",
  "https://tailwindcss.com",
  "https://openai.com"
];

export const uid = () => Math.random().toString(36).slice(2, 10);

export const clamp = (n: number, a: number, b: number) => Math.min(b, Math.max(a, n));

export function hostOf(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

function normalize(raw: string): string | null {
  let s = raw.trim().replace(/^["'<({[]+|["'>)}\],;]+$/g, "");
  if (!s) return null;
  if (!/^https?:\/\//i.test(s)) {
    if (/^[a-z0-9-]+(\.[a-z0-9-]+)+(\/.*)?$/i.test(s) || /^localhost(:\d+)?(\/.*)?$/i.test(s)) {
      s = (s.startsWith("localhost") ? "http://" : "https://") + s;
    } else return null;
  }
  try {
    const u = new URL(s);
    if (!u.hostname.includes(".") && u.hostname !== "localhost") return null;
    return u.href;
  } catch {
    return null;
  }
}

export function parseUrls(text: string, dedupe = true): string[] {
  const out: string[] = [];
  const seen = new Set<string>();
  for (const token of text.split(/[\r\n,;\s]+/)) {
    const n = normalize(token);
    if (!n) continue;
    const key = n.replace(/\/$/, "").toLowerCase();
    if (dedupe && seen.has(key)) continue;
    seen.add(key);
    out.push(n);
  }
  return out;
}

/** Arrange frames in a grid by order. Frames the user moved by hand keep their spot. */
export function layoutFrames(frames: Frame[], columns: number, gap = 160): Frame[] {
  const cols = Math.max(1, columns);
  const rows = Math.ceil(frames.length / cols);
  const colW = new Array(cols).fill(0);
  const rowH = new Array(rows).fill(0);
  frames.forEach((f, i) => {
    const c = i % cols;
    const r = Math.floor(i / cols);
    colW[c] = Math.max(colW[c], f.w);
    rowH[r] = Math.max(rowH[r], f.h);
  });
  const xs = [0];
  for (let c = 1; c < cols; c++) xs[c] = xs[c - 1] + colW[c - 1] + gap;
  const ys = [0];
  for (let r = 1; r < rows; r++) ys[r] = ys[r - 1] + rowH[r - 1] + gap;
  return frames.map((f, i) =>
    f.moved ? f : { ...f, x: xs[i % cols], y: ys[Math.floor(i / cols)] }
  );
}

export function download(blob: Blob, name: string) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 4000);
}
