export function getServerUrl(): string {
  if (process.env.NEXT_PUBLIC_SHOT_SERVER) {
    return process.env.NEXT_PUBLIC_SHOT_SERVER;
  }
  if (typeof window !== "undefined" && window.location.hostname) {
    return `http://${window.location.hostname}:3456`;
  }
  return "http://localhost:3456";
}

export async function checkServer(): Promise<boolean> {
  try {
    const c = new AbortController();
    const t = setTimeout(() => c.abort(), 2000);
    const res = await fetch(`${getServerUrl()}/health`, { signal: c.signal });
    clearTimeout(t);
    return res.ok;
  } catch {
    return false;
  }
}

export type CaptureResult = {
  blob: Blob;
  objectUrl: string;
  naturalW: number;
  naturalH: number;
  truncated: boolean;
};

export async function captureUrl(
  url: string,
  width: number,
  height: number,
  fullPage: boolean
): Promise<CaptureResult> {
  const params = new URLSearchParams({
    url,
    width: String(width),
    height: String(height),
    fullPage: String(fullPage)
  });
  const c = new AbortController();
  const t = setTimeout(() => c.abort(), 70000);
  let res: Response;
  try {
    res = await fetch(`${getServerUrl()}/screenshot?${params}`, { signal: c.signal });
  } catch {
    throw new Error("Can't reach the capture server. Start it with start-server.bat.");
  } finally {
    clearTimeout(t);
  }
  if (!res.ok) {
    const j = await res.json().catch(() => null);
    throw new Error((j && j.error) || `Capture failed (HTTP ${res.status})`);
  }
  const truncated = res.headers.get("X-Page-Truncated") === "true";
  const blob = await res.blob();
  const objectUrl = URL.createObjectURL(blob);
  const dims = await new Promise<{ w: number; h: number }>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve({ w: img.naturalWidth, h: img.naturalHeight });
    img.onerror = () => reject(new Error("The screenshot couldn't be read."));
    img.src = objectUrl;
  });
  return { blob, objectUrl, naturalW: dims.w, naturalH: dims.h, truncated };
}
