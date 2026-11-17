"use client";

import type { Frame, Settings } from "@/lib/types";
import { IconChevron, IconFrame, IconGlobe, IconPlus } from "./Icons";

type Props = {
  tab: "layers" | "capture";
  setTab: (t: "layers" | "capture") => void;
  frames: Frame[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onHover: (id: string | null) => void;
  urlText: string;
  setUrlText: (s: string) => void;
  urlCount: number;
  onSample: () => void;
  onClear: () => void;
  onImport: (text: string) => void;
  settings: Settings;
  setSettings: (s: Settings) => void;
  onCapture: () => void;
  running: boolean;
  server: "checking" | "up" | "down";
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
};

const WIDTHS = [
  { v: 1440, label: "Desktop 1440" },
  { v: 1920, label: "Full HD 1920" },
  { v: 1280, label: "Laptop 1280" },
  { v: 768, label: "Tablet 768" },
  { v: 390, label: "Mobile 390" }
];

export default function LeftPanel(p: Props) {
  return (
    <aside className="panel left">
      <div className="tabs">
        <button className={p.tab === "layers" ? "on" : ""} onClick={() => p.setTab("layers")}>
          Layers
        </button>
        <button className={p.tab === "capture" ? "on" : ""} onClick={() => p.setTab("capture")}>
          Capture
        </button>
      </div>

      {p.tab === "layers" ? (
        <div className="scroll">
          <div className="page-row">
            <IconChevron className="rot" />
            <span>Page 1</span>
          </div>
          {p.frames.length === 0 && (
            <div className="hint">
              No frames yet. Add sites in the Capture tab and they show up here.
            </div>
          )}
          {p.frames.map((f, i) => (
            <button
              key={f.id}
              className={`layer ${f.id === p.selectedId ? "sel" : ""}`}
              onClick={() => p.onSelect(f.id)}
              onMouseEnter={() => p.onHover(f.id)}
              onMouseLeave={() => p.onHover(null)}
            >
              <IconFrame className="layer-ico" />
              <span className="layer-name">
                {String(i + 1).padStart(2, "0")} {f.host}
              </span>
              <span className={`dot ${f.status}`} title={f.status} />
            </button>
          ))}
        </div>
      ) : (
        <div className="scroll pad">
          <section className="sec">
            <div className="sec-head">
              <span>Websites</span>
              <span className="count">{p.urlCount}</span>
            </div>
            <textarea
              ref={p.textareaRef}
              value={p.urlText}
              onChange={(e) => p.setUrlText(e.target.value)}
              spellCheck={false}
              placeholder={"One URL per line\nstripe.com\nhttps://linear.app"}
            />
            <div className="row-btns">
              <button className="ghost" onClick={p.onSample}>
                <IconPlus /> Sample sites
              </button>
              <label className="ghost">
                Import
                <input
                  type="file"
                  accept=".txt,.csv,.md,.json"
                  hidden
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) p.onImport(await file.text());
                    e.target.value = "";
                  }}
                />
              </label>
              <button className="ghost" onClick={p.onClear}>
                Clear
              </button>
            </div>
          </section>

          <section className="sec">
            <div className="sec-head">
              <span>Frame size</span>
            </div>
            <div className="grid2">
              <label className="field wide">
                <span>Width</span>
                <select
                  value={p.settings.width}
                  onChange={(e) => p.setSettings({ ...p.settings, width: Number(e.target.value) })}
                >
                  {WIDTHS.map((w) => (
                    <option key={w.v} value={w.v}>
                      {w.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <label className="check">
              <input
                type="checkbox"
                checked={p.settings.fullPage}
                onChange={(e) => p.setSettings({ ...p.settings, fullPage: e.target.checked })}
              />
              Full page, top to bottom
            </label>
            <label className="check">
              <input
                type="checkbox"
                checked={p.settings.header}
                onChange={(e) => p.setSettings({ ...p.settings, header: e.target.checked })}
              />
              Browser header on each frame
            </label>
          </section>

          <section className="sec">
            <div className="sec-head">
              <span>Layout grid</span>
            </div>
            <div className="grid2">
              <label className="field">
                <span>Columns</span>
                <select
                  value={p.settings.columns}
                  onChange={(e) => p.setSettings({ ...p.settings, columns: Number(e.target.value) })}
                >
                  {[1, 2, 3, 4, 5, 6, 8, 10].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </label>
              <label className="field">
                <span>At once</span>
                <select
                  value={p.settings.concurrency}
                  onChange={(e) =>
                    p.setSettings({ ...p.settings, concurrency: Number(e.target.value) })
                  }
                >
                  {[1, 2, 3, 4, 6].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </section>

          <section className="sec">
            <div className={`server-note ${p.server}`}>
              <IconGlobe />
              {p.server === "up" ? (
                <span>Capture server is running on localhost:3456.</span>
              ) : (
                <span>
                  Capture server is off. Run <code>start-server.bat</code> in the plugin folder.
                </span>
              )}
            </div>
            <button
              className="primary"
              disabled={p.running || p.urlCount === 0 || p.server !== "up"}
              onClick={p.onCapture}
            >
              {p.running
                ? "Capturing…"
                : p.urlCount > 0
                ? `Capture ${p.urlCount} site${p.urlCount === 1 ? "" : "s"}`
                : "Capture sites"}
            </button>
          </section>
        </div>
      )}
    </aside>
  );
}
