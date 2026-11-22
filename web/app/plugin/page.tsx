"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Canvas from "@/components/Canvas";
import LeftPanel from "@/components/LeftPanel";
import RightPanel from "@/components/RightPanel";
import TopBar from "@/components/TopBar";
import { captureUrl, checkServer } from "@/lib/capture";
import { copyImageBlobToClipboard } from "@/lib/figma-export";
import type { Frame, Settings, Tool, View } from "@/lib/types";
import { HEADER_H, SAMPLE_URLS, clamp, hostOf, layoutFrames, parseUrls, uid } from "@/lib/utils";

const DEFAULTS: Settings = {
  width: 1440,
  height: 900,
  fullPage: true,
  header: true,
  columns: 5,
  concurrency: 3
};

export default function PluginPage() {
  const [frames, setFrames] = useState<Frame[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [view, setView] = useState<View>({ x: 80, y: 80, k: 0.5 });
  const [settings, setSettings] = useState<Settings>(DEFAULTS);
  const [urlText, setUrlText] = useState("");
  const [tab, setTab] = useState<"layers" | "capture">("capture");
  const [tool, setTool] = useState<Tool>("move");
  const [server, setServer] = useState<"checking" | "up" | "down">("checking");
  const [running, setRunning] = useState(false);
  const [copiedFrameId, setCopiedFrameId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; error?: boolean } | null>(null);

  const canvasRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const framesRef = useRef(frames);
  framesRef.current = frames;
  const settingsRef = useRef(settings);
  settingsRef.current = settings;
  const stopRef = useRef(false);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const copiedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const urls = parseUrls(urlText);
  const selected = frames.find((f) => f.id === selectedId) ?? null;

  // Capture server health
  useEffect(() => {
    let alive = true;
    const tick = async () => {
      const ok = await checkServer();
      if (alive) setServer(ok ? "up" : "down");
    };
    tick();
    const t = setInterval(tick, 4000);
    return () => {
      alive = false;
      clearInterval(t);
    };
  }, []);

  const fitTo = useCallback((list: Frame[], pad = 96) => {
    const el = canvasRef.current;
    if (!el || list.length === 0) return;
    const r = el.getBoundingClientRect();
    const minX = Math.min(...list.map((f) => f.x));
    const minY = Math.min(...list.map((f) => f.y));
    const maxX = Math.max(...list.map((f) => f.x + f.w));
    const maxY = Math.max(...list.map((f) => f.y + f.h));
    const bw = maxX - minX;
    const bh = maxY - minY;
    const k = clamp(Math.min((r.width - pad * 2) / bw, (r.height - pad * 2) / bh), 0.02, 2);
    setView({
      k,
      x: (r.width - bw * k) / 2 - minX * k,
      y: (r.height - bh * k) / 2 - minY * k
    });
  }, []);

  const fitAll = useCallback(() => fitTo(framesRef.current), [fitTo]);
  const fitSelection = useCallback(() => {
    const f = framesRef.current.find((x) => x.id === selectedIdRef.current);
    if (f) fitTo([f], 64);
  }, [fitTo]);
  const selectedIdRef = useRef<string | null>(null);
  selectedIdRef.current = selectedId;

  const zoomTo = useCallback((k: number) => {
    const el = canvasRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setView((v) => {
      const cx = r.width / 2;
      const cy = r.height / 2;
      return { k, x: cx - ((cx - v.x) * k) / v.k, y: cy - ((cy - v.y) * k) / v.k };
    });
  }, []);

  const patch = useCallback((id: string, p: Partial<Frame>, relayout = false) => {
    setFrames((prev) => {
      const next = prev.map((f) => (f.id === id ? { ...f, ...p } : f));
      return relayout ? layoutFrames(next, settingsRef.current.columns) : next;
    });
  }, []);

  const captureOne = useCallback(
    async (id: string) => {
      const f = framesRef.current.find((x) => x.id === id);
      if (!f) return;
      const s = settingsRef.current;
      patch(id, { status: "capturing", error: undefined });
      try {
        const r = await captureUrl(f.url, s.width, s.height, s.fullPage);
        if (f.img) URL.revokeObjectURL(f.img);
        patch(
          id,
          {
            status: "done",
            img: r.objectUrl,
            blob: r.blob,
            naturalW: r.naturalW,
            naturalH: r.naturalH,
            truncated: r.truncated,
            w: r.naturalW,
            h: (f.header ? HEADER_H : 0) + r.naturalH
          },
          true
        );
      } catch (err) {
        patch(id, { status: "error", error: err instanceof Error ? err.message : "Capture failed" });
      }
    },
    [patch]
  );

  const runPool = useCallback(
    async (ids: string[]) => {
      setRunning(true);
      stopRef.current = false;
      let cursor = 0;
      const worker = async () => {
        while (cursor < ids.length && !stopRef.current) {
          await captureOne(ids[cursor++]);
        }
      };
      const n = Math.max(1, Math.min(settingsRef.current.concurrency, ids.length));
      await Promise.all(Array.from({ length: n }, worker));
      setRunning(false);
      requestAnimationFrame(() => fitTo(framesRef.current));
    },
    [captureOne, fitTo]
  );

  const startCapture = useCallback(() => {
    if (running) return;
    const list = parseUrls(urlText);
    if (list.length === 0) return;
    const s = settingsRef.current;
    const created: Frame[] = list.map((url) => ({
      id: uid(),
      url,
      host: hostOf(url),
      x: 0,
      y: 0,
      w: s.width,
      h: (s.header ? HEADER_H : 0) + s.height,
      header: s.header,
      status: "queued"
    }));
    setFrames((prev) => layoutFrames([...prev, ...created], s.columns));
    setTab("layers");
    requestAnimationFrame(() => fitTo(framesRef.current));
    runPool(created.map((f) => f.id));
  }, [running, urlText, runPool, fitTo]);

  const moveFrame = useCallback((id: string, x: number, y: number) => {
    setFrames((prev) => prev.map((f) => (f.id === id ? { ...f, x, y, moved: true } : f)));
  }, []);

  const deleteFrame = useCallback((id: string) => {
    setFrames((prev) => {
      const f = prev.find((x) => x.id === id);
      if (f?.img) URL.revokeObjectURL(f.img);
      return layoutFrames(
        prev.filter((x) => x.id !== id),
        settingsRef.current.columns
      );
    });
    setSelectedId((cur) => (cur === id ? null : cur));
  }, []);

  const relayout = useCallback(() => {
    setFrames((prev) =>
      layoutFrames(
        prev.map((f) => ({ ...f, moved: false })),
        settingsRef.current.columns
      )
    );
    requestAnimationFrame(() => fitTo(framesRef.current));
  }, [fitTo]);

  const focusCapture = useCallback(() => {
    setTab("capture");
    setTimeout(() => textareaRef.current?.focus(), 0);
  }, []);

  const showToast = useCallback((message: string, error = false) => {
    setToast({ message, error });
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setToast(null), 2600);
  }, []);

  const copyFrameToFigma = useCallback(
    async (frame: Frame) => {
      if (!frame.blob) return;
      const res = await copyImageBlobToClipboard(frame.blob);
      if (res.ok) {
        setCopiedFrameId(frame.id);
        if (copiedTimerRef.current) clearTimeout(copiedTimerRef.current);
        copiedTimerRef.current = setTimeout(() => setCopiedFrameId(null), 2200);
        showToast(`Copied ${frame.host} — press Ctrl+V in Figma`);
      } else {
        showToast(res.error || "Could not copy image to clipboard.", true);
      }
    },
    [showToast]
  );

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
      if (copiedTimerRef.current) clearTimeout(copiedTimerRef.current);
    };
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target;
      if (t instanceof HTMLElement && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) return;
      if ((e.metaKey || e.ctrlKey) && !e.shiftKey && !e.altKey && e.key.toLowerCase() === "c") {
        if (window.getSelection()?.toString()) return;
        const selectedFrame = framesRef.current.find((x) => x.id === selectedIdRef.current);
        if (selectedFrame?.blob) {
          e.preventDefault();
          void copyFrameToFigma(selectedFrame);
        }
        return;
      }
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.shiftKey && e.code === "Digit1") {
        e.preventDefault();
        fitAll();
      } else if (e.shiftKey && e.code === "Digit2") {
        e.preventDefault();
        fitSelection();
      } else if (e.key === "v" || e.key === "V") setTool("move");
      else if (e.key === "h" || e.key === "H") setTool("hand");
      else if (e.key === "f" || e.key === "F") focusCapture();
      else if (e.key === "Escape") setSelectedId(null);
      else if ((e.key === "Delete" || e.key === "Backspace") && selectedIdRef.current) {
        deleteFrame(selectedIdRef.current);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [fitAll, fitSelection, focusCapture, deleteFrame, copyFrameToFigma]);

  const selectFromLayers = (id: string) => {
    setSelectedId(id);
    const f = framesRef.current.find((x) => x.id === id);
    if (f) fitTo([f], 120);
  };

  return (
    <div className="app">
      <TopBar
        tool={tool}
        setTool={setTool}
        zoom={view.k}
        server={server}
        running={running}
        count={urls.length}
        onFitAll={fitAll}
        onFitSelection={fitSelection}
        onZoom={zoomTo}
        onFocusCapture={focusCapture}
        onCapture={startCapture}
        onStop={() => {
          stopRef.current = true;
        }}
        canCapture={urls.length > 0 && server === "up"}
      />
      <div className="workspace">
        <LeftPanel
          tab={tab}
          setTab={setTab}
          frames={frames}
          selectedId={selectedId}
          onSelect={selectFromLayers}
          onHover={setHoverId}
          urlText={urlText}
          setUrlText={setUrlText}
          urlCount={urls.length}
          onSample={() => setUrlText(SAMPLE_URLS.join("\n"))}
          onClear={() => setUrlText("")}
          onImport={(text) => setUrlText((cur) => (cur.trim() ? `${cur.trim()}\n${text}` : text))}
          settings={settings}
          setSettings={setSettings}
          onCapture={startCapture}
          running={running}
          server={server}
          textareaRef={textareaRef}
        />

        <Canvas
          frames={frames}
          selectedId={selectedId}
          hoverId={hoverId}
          view={view}
          setView={setView}
          tool={tool}
          containerRef={canvasRef}
          onSelect={setSelectedId}
          onMoveFrame={moveFrame}
          onRetry={captureOne}
          empty={
            <div className="empty-card">
              <strong>Your canvas is empty</strong>
              <span>Paste some URLs in the Capture tab. Each site becomes a frame here.</span>
              <button className="primary" onClick={focusCapture}>
                Add websites
              </button>
            </div>
          }
        />

        <RightPanel
          frame={selected}
          frames={frames}
          settings={settings}
          setSettings={setSettings}
          onMove={moveFrame}
          onRetry={captureOne}
          onDelete={deleteFrame}
          onRelayout={relayout}
          onCopyToFigma={copyFrameToFigma}
          copiedFrameId={copiedFrameId}
        />
      </div>
      {toast && (
        <div className={`canvas-toast ${toast.error ? "err" : ""}`} role="status">
          {toast.message}
        </div>
      )}
    </div>
  );
}
