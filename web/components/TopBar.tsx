"use client";

import Link from "next/link";
import type { Tool } from "@/lib/types";
import { IconDown, IconFit, IconFrame, IconHand, IconLogo, IconMove } from "./Icons";

type Props = {
  tool: Tool;
  setTool: (t: Tool) => void;
  zoom: number;
  server: "checking" | "up" | "down";
  running: boolean;
  count: number;
  onFitAll: () => void;
  onFitSelection: () => void;
  onZoom: (k: number) => void;
  onFocusCapture: () => void;
  onCapture: () => void;
  onStop: () => void;
  canCapture: boolean;
};

export default function TopBar(p: Props) {
  return (
    <header className="topbar">
      <div className="top-left">
        <button className="icon-btn" title="Main menu">
          <IconLogo />
        </button>
        <div className="crumbs">
          <span className="muted">Drafts</span>
          <span className="muted">/</span>
          <span>Site screenshots</span>
        </div>
        <Link href="/" className="top-link" title="Back to Component Library">
          Components
        </Link>
      </div>

      <div className="top-center">
        <button
          className={`tool ${p.tool === "move" ? "on" : ""}`}
          title="Move (V)"
          onClick={() => p.setTool("move")}
        >
          <IconMove />
          <IconDown className="caret" />
        </button>
        <button
          className={`tool ${p.tool === "hand" ? "on" : ""}`}
          title="Hand tool (H)"
          onClick={() => p.setTool("hand")}
        >
          <IconHand />
        </button>
        <button className="tool" title="Add sites (F)" onClick={p.onFocusCapture}>
          <IconFrame />
          <IconDown className="caret" />
        </button>
      </div>

      <div className="top-right">
        <span className={`server ${p.server}`} title="Local Chrome capture server">
          <i />
          {p.server === "up" ? "Server on" : p.server === "down" ? "Server off" : "Checking"}
        </span>

        <div className="zoom">
          <button className="zoom-btn" onClick={p.onFitAll} title="Zoom to fit (Shift+1)">
            <IconFit />
          </button>
          <select
            value=""
            onChange={(e) => {
              const v = e.target.value;
              if (v === "fit") p.onFitAll();
              else if (v === "sel") p.onFitSelection();
              else if (v) p.onZoom(Number(v));
            }}
            aria-label="Zoom"
          >
            <option value="" disabled hidden>
              {Math.round(p.zoom * 100)}%
            </option>
            <option value="fit">Zoom to fit</option>
            <option value="sel">Zoom to selection</option>
            <option value="0.25">25%</option>
            <option value="0.5">50%</option>
            <option value="1">100%</option>
            <option value="2">200%</option>
          </select>
          <span className="zoom-label">{Math.round(p.zoom * 100)}%</span>
        </div>

        {p.running ? (
          <button className="share stop" onClick={p.onStop}>
            Stop
          </button>
        ) : (
          <button className="share" onClick={p.onCapture} disabled={!p.canCapture}>
            Capture
          </button>
        )}
      </div>
    </header>
  );
}
