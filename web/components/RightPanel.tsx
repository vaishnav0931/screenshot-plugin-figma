"use client";

import { useState } from "react";
import type { Frame, Settings } from "@/lib/types";
import { download } from "@/lib/utils";
import { IconDownload, IconRefresh, IconTrash } from "./Icons";

type Props = {
  frame: Frame | null;
  frames: Frame[];
  settings: Settings;
  setSettings: (s: Settings) => void;
  onMove: (id: string, x: number, y: number) => void;
  onRetry: (id: string) => void;
  onDelete: (id: string) => void;
  onRelayout: () => void;
};

function NumField({
  label,
  value,
  onChange,
  readOnly
}: {
  label: string;
  value: number;
  onChange?: (n: number) => void;
  readOnly?: boolean;
}) {
  return (
    <label className={`num ${readOnly ? "ro" : ""}`}>
      <span>{label}</span>
      <input
        type="number"
        value={Math.round(value)}
        readOnly={readOnly}
        onChange={(e) => {
          const n = Number(e.target.value);
          if (!Number.isNaN(n)) onChange?.(n);
        }}
      />
    </label>
  );
}

export default function RightPanel({
  frame,
  frames,
  settings,
  setSettings,
  onMove,
  onRetry,
  onDelete,
  onRelayout
}: Props) {
  const [tab, setTab] = useState<"design" | "export">("design");
  const done = frames.filter((f) => f.status === "done" && f.blob);

  const exportAll = () =>
    done.forEach((f, i) =>
      setTimeout(() => download(f.blob!, `${String(frames.indexOf(f) + 1).padStart(2, "0")}-${f.host}.png`), i * 250)
    );

  return (
    <aside className="panel right">
      <div className="tabs">
        <button className={tab === "design" ? "on" : ""} onClick={() => setTab("design")}>
          Design
        </button>
        <button className={tab === "export" ? "on" : ""} onClick={() => setTab("export")}>
          Export
        </button>
      </div>

      <div className="scroll">
        {tab === "design" && frame && (
          <>
            <section className="sec">
              <div className="sec-head">
                <span>Frame</span>
              </div>
              <div className="name-row">{frame.host}</div>
            </section>

            <section className="sec">
              <div className="sec-head">
                <span>Position</span>
              </div>
              <div className="grid2">
                <NumField label="X" value={frame.x} onChange={(n) => onMove(frame.id, n, frame.y)} />
                <NumField label="Y" value={frame.y} onChange={(n) => onMove(frame.id, frame.x, n)} />
              </div>
            </section>

            <section className="sec">
              <div className="sec-head">
                <span>Layout</span>
              </div>
              <div className="grid2">
                <NumField label="W" value={frame.w} readOnly />
                <NumField label="H" value={frame.h} readOnly />
              </div>
            </section>

            <section className="sec">
              <div className="sec-head">
                <span>Fill</span>
              </div>
              <div className="fill-row">
                <span className="swatch" style={{ background: "#fff" }} />
                <span>FFFFFF</span>
                <span className="muted r">100%</span>
              </div>
            </section>

            <section className="sec">
              <div className="sec-head">
                <span>Source</span>
              </div>
              <a className="link" href={frame.url} target="_blank" rel="noreferrer">
                {frame.url}
              </a>
              <div className={`status-line ${frame.status}`}>
                <i />
                {frame.status === "done"
                  ? frame.truncated
                    ? "Captured, page cut at 16,384 px"
                    : "Captured"
                  : frame.status === "error"
                  ? frame.error
                  : frame.status === "capturing"
                  ? "Capturing…"
                  : "Waiting"}
              </div>
              <div className="row-btns">
                <button className="ghost" onClick={() => onRetry(frame.id)}>
                  <IconRefresh /> Capture again
                </button>
                <button className="ghost danger" onClick={() => onDelete(frame.id)}>
                  <IconTrash /> Delete
                </button>
              </div>
            </section>
          </>
        )}

        {tab === "design" && !frame && (
          <>
            <section className="sec">
              <div className="sec-head">
                <span>Page</span>
              </div>
              <div className="fill-row">
                <span className="swatch" style={{ background: "#1e1e1e" }} />
                <span>1E1E1E</span>
                <span className="muted r">100%</span>
              </div>
            </section>
            <section className="sec">
              <div className="sec-head">
                <span>Layout grid</span>
              </div>
              <div className="grid2">
                <label className="field">
                  <span>Columns</span>
                  <select
                    value={settings.columns}
                    onChange={(e) => setSettings({ ...settings, columns: Number(e.target.value) })}
                  >
                    {[1, 2, 3, 4, 5, 6, 8, 10].map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <div className="row-btns">
                <button className="ghost" onClick={onRelayout} disabled={frames.length === 0}>
                  Tidy up frames
                </button>
              </div>
            </section>
            <section className="sec">
              <div className="hint flush">
                {frames.length === 0
                  ? "Select a frame to see its properties."
                  : `${frames.length} frame${frames.length === 1 ? "" : "s"} on this page. Click one to inspect it.`}
              </div>
            </section>
          </>
        )}

        {tab === "export" && (
          <section className="sec">
            <div className="sec-head">
              <span>Export</span>
            </div>
            <div className="export-row">
              <span className="chip">1x</span>
              <span className="chip wide">PNG</span>
            </div>
            <button
              className="primary"
              disabled={!frame || !frame.blob}
              onClick={() => frame?.blob && download(frame.blob, `${frame.host}.png`)}
            >
              <IconDownload /> {frame ? `Export ${frame.host}` : "Select a frame"}
            </button>
            <button className="ghost block" disabled={done.length === 0} onClick={exportAll}>
              <IconDownload /> Export all ({done.length})
            </button>
            <div className="hint flush">Exports the screenshot image without the browser header.</div>
          </section>
        )}
      </div>
    </aside>
  );
}
