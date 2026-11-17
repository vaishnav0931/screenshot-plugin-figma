"use client";

import { useEffect, useRef, useState } from "react";
import type { Frame, Tool, View } from "@/lib/types";
import { HEADER_H, clamp } from "@/lib/utils";

type Props = {
  frames: Frame[];
  selectedId: string | null;
  hoverId: string | null;
  view: View;
  setView: (v: View) => void;
  tool: Tool;
  containerRef: React.RefObject<HTMLDivElement | null>;
  onSelect: (id: string | null) => void;
  onMoveFrame: (id: string, x: number, y: number) => void;
  onRetry: (id: string) => void;
  empty: React.ReactNode;
};

type Drag =
  | { type: "pan"; sx: number; sy: number; ox: number; oy: number }
  | { type: "frame"; id: string; sx: number; sy: number; ox: number; oy: number };

export default function Canvas({
  frames,
  selectedId,
  hoverId,
  view,
  setView,
  tool,
  containerRef,
  onSelect,
  onMoveFrame,
  onRetry,
  empty
}: Props) {
  const viewRef = useRef(view);
  viewRef.current = view;
  const drag = useRef<Drag | null>(null);
  const [space, setSpace] = useState(false);
  const [grabbing, setGrabbing] = useState(false);

  // Wheel: scroll pans, pinch / ctrl+wheel zooms toward the cursor (same as Figma)
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const v = viewRef.current;
      if (e.ctrlKey || e.metaKey) {
        const r = el.getBoundingClientRect();
        const k = clamp(v.k * Math.exp(-e.deltaY * 0.01), 0.02, 4);
        const px = e.clientX - r.left;
        const py = e.clientY - r.top;
        setView({ k, x: px - ((px - v.x) * k) / v.k, y: py - ((py - v.y) * k) / v.k });
      } else {
        setView({ ...v, x: v.x - e.deltaX, y: v.y - e.deltaY });
      }
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [containerRef, setView]);

  // Hold space to pan
  useEffect(() => {
    const typing = (t: EventTarget | null) =>
      t instanceof HTMLElement && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName);
    const down = (e: KeyboardEvent) => {
      if (e.code === "Space" && !typing(e.target)) {
        e.preventDefault();
        setSpace(true);
      }
    };
    const up = (e: KeyboardEvent) => {
      if (e.code === "Space") setSpace(false);
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

  const panMode = tool === "hand" || space;

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button === 2) return;
    const el = e.currentTarget;
    if (e.button === 1 || panMode) {
      e.preventDefault();
      drag.current = { type: "pan", sx: e.clientX, sy: e.clientY, ox: view.x, oy: view.y };
      el.setPointerCapture(e.pointerId);
      setGrabbing(true);
      return;
    }
    const hit = (e.target as HTMLElement).closest("[data-frame-id]");
    if (hit) {
      const id = hit.getAttribute("data-frame-id")!;
      const f = frames.find((x) => x.id === id);
      onSelect(id);
      if (f) {
        drag.current = { type: "frame", id, sx: e.clientX, sy: e.clientY, ox: f.x, oy: f.y };
        el.setPointerCapture(e.pointerId);
      }
    } else {
      onSelect(null);
    }
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.sx;
    const dy = e.clientY - d.sy;
    if (d.type === "pan") {
      setView({ ...view, x: d.ox + dx, y: d.oy + dy });
    } else if (Math.abs(dx) + Math.abs(dy) > 3) {
      onMoveFrame(d.id, Math.round(d.ox + dx / view.k), Math.round(d.oy + dy / view.k));
    }
  };

  const onPointerUp = () => {
    drag.current = null;
    setGrabbing(false);
  };

  const { k } = view;
  const dots = k >= 0.3;

  return (
    <div
      ref={containerRef}
      className="canvas"
      style={{
        cursor: panMode ? (grabbing ? "grabbing" : "grab") : "default",
        backgroundImage: dots
          ? "radial-gradient(circle, rgba(255,255,255,0.13) 1px, transparent 1.2px)"
          : "none",
        backgroundSize: `${24 * k}px ${24 * k}px`,
        backgroundPosition: `${view.x}px ${view.y}px`
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <div
        className="world"
        style={{ transform: `translate(${view.x}px, ${view.y}px) scale(${k})` }}
      >
        {frames.map((f, i) => (
          <FrameView
            key={f.id}
            frame={f}
            index={i}
            k={k}
            selected={f.id === selectedId}
            hovered={f.id === hoverId}
            onRetry={onRetry}
          />
        ))}
      </div>
      {frames.length === 0 && <div className="canvas-empty">{empty}</div>}
    </div>
  );
}

function FrameView({
  frame: f,
  index,
  k,
  selected,
  hovered,
  onRetry
}: {
  frame: Frame;
  index: number;
  k: number;
  selected: boolean;
  hovered: boolean;
  onRetry: (id: string) => void;
}) {
  const px = 1 / k; // keeps UI chrome the same size at every zoom level
  const outline = selected ? 1.5 * px : hovered ? 1.5 * px : 0;
  const handle = 8 * px;
  const busy = f.status === "queued" || f.status === "capturing";

  return (
    <div
      data-frame-id={f.id}
      className="frame"
      style={{ left: f.x, top: f.y, width: f.w, height: f.h }}
    >
      <div
        className={`frame-label ${selected ? "is-selected" : ""}`}
        style={{ top: -22 * px, fontSize: 12 * px, maxWidth: f.w }}
      >
        <span className="frame-label-icon" style={{ width: 12 * px, height: 12 * px }} />
        {String(index + 1).padStart(2, "0")} {f.host}
      </div>

      <div className="artboard">
        {f.header && (
          <div className="art-header" style={{ height: HEADER_H }}>
            <span className="dots">
              <i style={{ background: "#ff5f57" }} />
              <i style={{ background: "#febc2e" }} />
              <i style={{ background: "#28c840" }} />
            </span>
            <span className="art-pill">{f.url}</span>
          </div>
        )}
        {f.img ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={f.img} alt={f.host} draggable={false} className="art-img" />
        ) : (
          <div
            className={`art-skeleton ${busy ? "shimmer" : ""}`}
            style={{ height: f.h - (f.header ? HEADER_H : 0) }}
          >
            {f.status === "error" ? (
              <div className="art-error">
                <strong>Capture failed</strong>
                <span>{f.error}</span>
                <button
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={() => onRetry(f.id)}
                >
                  Try again
                </button>
              </div>
            ) : (
              <span className="art-status">
                {f.status === "capturing" ? "Capturing…" : "Waiting"}
              </span>
            )}
          </div>
        )}
      </div>

      {outline > 0 && (
        <div className="frame-outline" style={{ borderWidth: outline }} />
      )}

      {selected && (
        <>
          {[
            { left: 0, top: 0 },
            { left: "100%", top: 0 },
            { left: 0, top: "100%" },
            { left: "100%", top: "100%" }
          ].map((pos, i) => (
            <span
              key={i}
              className="handle"
              style={{
                width: handle,
                height: handle,
                borderWidth: px,
                marginLeft: -handle / 2,
                marginTop: -handle / 2,
                ...pos
              }}
            />
          ))}
          <div
            className="size-pill"
            style={{ top: f.h + 8 * px, fontSize: 11 * px, padding: `${2 * px}px ${6 * px}px`, borderRadius: 3 * px }}
          >
            {Math.round(f.w)} × {Math.round(f.h)}
          </div>
        </>
      )}
    </div>
  );
}
