"use client";

import React from "react";
import Link from "next/link";
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sun,
  Moon,
  Grid,
  Square,
  Download,
  Code2,
  Bookmark,
  Layers,
  Sparkles,
  ArrowLeft,
} from "lucide-react";
import { useButtonStore } from "@/src/store/useButtonStore";
import {
  PreviewCanvasBackground,
  ButtonInteractionState,
  PreviewViewMode,
} from "@/src/types/button";
import { INTERACTION_STATES_LIST } from "@/src/features/button-states/stateConfig";

interface ButtonToolbarProps {
  onOpenExportModal: (
    initialTab?: "json" | "import" | "css" | "svg" | "figma"
  ) => void;
}

export function ButtonToolbar({ onOpenExportModal }: ButtonToolbarProps) {
  const {
    activeButton,
    updateButtonName,
    previewState,
    setPreviewState,
    interactivePreview,
    setInteractivePreview,
    canvasBg,
    setCanvasBg,
    zoom,
    setZoom,
    resetPreviewCanvas,
    viewMode,
    setViewMode,
    saveCurrentButton,
  } = useButtonStore();

  const viewModes: { id: PreviewViewMode; label: string }[] = [
    { id: "single", label: "Preview" },
    { id: "all-variants", label: "All Variants" },
    { id: "all-states", label: "All States" },
    { id: "comparison", label: "Comparison Matrix" },
  ];

  const bgModes: {
    id: PreviewCanvasBackground;
    label: string;
    icon: React.ReactNode;
  }[] = [
    { id: "light", label: "Light", icon: <Sun size={12} /> },
    { id: "dark", label: "Dark", icon: <Moon size={12} /> },
    { id: "checkerboard", label: "Grid", icon: <Grid size={12} /> },
    { id: "neutral", label: "Neutral", icon: <Square size={12} /> },
  ];

  const zoomPercent = Math.round(zoom * 100);

  return (
    <header
      style={{
        background: "var(--bs-surface)",
        borderBottom: "1px solid var(--bs-border)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Top Bar: Navigation, Active Button Name, View Modes, Save/Export/Figma Actions */}
      <div
        style={{
          minHeight: 46,
          padding: "6px 14px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          flexWrap: "wrap",
          borderBottom: "1px solid var(--bs-border)",
        }}
      >
        {/* Left: Back to Catalog + Editable Button Name */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Link
            href="/"
            className="bs-btn bs-btn-ghost"
            style={{
              height: 28,
              padding: "0 8px",
              fontSize: 11.5,
              textDecoration: "none",
            }}
            title="Back to Studio Catalog"
          >
            <ArrowLeft size={13} />
            Catalog
          </Link>

          <div
            style={{
              width: 1,
              height: 18,
              background: "var(--bs-border)",
            }}
          />

          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <input
              type="text"
              className="bs-input"
              value={activeButton.name}
              onChange={(e) => updateButtonName(e.target.value)}
              aria-label="Active button name"
              style={{
                width: 180,
                height: 28,
                fontWeight: 600,
                fontSize: 12.5,
              }}
            />
            <span className="bs-badge" title="Active variant preset">
              {activeButton.appearance.variant}
            </span>
            <span className="bs-badge" title="Active size preset">
              {activeButton.dimensions.sizePreset.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Center: View Mode Tabs */}
        <div
          className="bs-segmented"
          style={{ width: "auto", minWidth: 340 }}
          role="tablist"
          aria-label="Preview view modes"
        >
          {viewModes.map((vm) => (
            <button
              key={vm.id}
              type="button"
              role="tab"
              aria-selected={viewMode === vm.id}
              className={`bs-segmented-btn ${viewMode === vm.id ? "active" : ""}`}
              onClick={() => setViewMode(vm.id)}
              style={{ padding: "0 10px" }}
            >
              {vm.label}
            </button>
          ))}
        </div>

        {/* Right: Save, Export JSON/CSS/SVG, Send to Figma (Future) */}
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <button
            type="button"
            className="bs-btn"
            onClick={() => saveCurrentButton()}
            title="Save button configuration to browser LocalStorage"
          >
            <Bookmark size={13} />
            Save
          </button>

          <button
            type="button"
            className="bs-btn"
            onClick={() => onOpenExportModal("css")}
            title="Copy CSS or SVG code"
          >
            <Code2 size={13} />
            CSS / SVG
          </button>

          <button
            type="button"
            className="bs-btn"
            onClick={() => onOpenExportModal("json")}
            title="Export or import JSON schema"
          >
            <Download size={13} />
            Export JSON
          </button>

          <button
            type="button"
            className="bs-btn bs-btn-primary"
            onClick={() => onOpenExportModal("figma")}
            title="Preview structured Figma component node payload (Future integration)"
            style={{
              background: "linear-gradient(135deg, #2563EB 0%, #4F46E5 100%)",
              borderColor: "#2563EB",
            }}
          >
            <Layers size={13} />
            Send to Figma
            <span
              style={{
                fontSize: 9,
                padding: "1px 4px",
                borderRadius: 4,
                background: "rgba(255,255,255,0.2)",
                fontWeight: 600,
                letterSpacing: "0.02em",
              }}
            >
              SOON
            </span>
          </button>
        </div>
      </div>

      {/* Sub-bar: State Selector, Interactive Toggle, Canvas Background, Zoom & Reset */}
      <div
        style={{
          minHeight: 40,
          padding: "5px 14px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          flexWrap: "wrap",
          background: "var(--bs-surface-muted)",
        }}
      >
        {/* State Preview Selector */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: "var(--bs-text-muted)",
            }}
          >
            State:
          </span>
          <div className="bs-segmented" style={{ width: "auto" }}>
            {INTERACTION_STATES_LIST.map((st) => (
              <button
                key={st.id}
                type="button"
                className={`bs-segmented-btn ${
                  !interactivePreview && previewState === st.id ? "active" : ""
                }`}
                onClick={() => {
                  setInteractivePreview(false);
                  setPreviewState(st.id as ButtonInteractionState);
                }}
                style={{ padding: "0 8px", fontSize: 11 }}
                title={st.description}
              >
                {st.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            className={`bs-btn ${interactivePreview ? "bs-btn-primary" : ""}`}
            style={{ height: 24, fontSize: 11, padding: "0 8px" }}
            onClick={() => setInteractivePreview(!interactivePreview)}
            title="Toggle real pointer hover/press/focus interaction on the preview canvas"
          >
            <Sparkles size={11} />
            Live Interact
          </button>
        </div>

        {/* Canvas Background + Zoom Controls */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* Canvas Background Mode */}
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: "var(--bs-text-muted)",
              }}
            >
              Canvas:
            </span>
            <div className="bs-segmented" style={{ width: "auto" }}>
              {bgModes.map((bg) => (
                <button
                  key={bg.id}
                  type="button"
                  className={`bs-segmented-btn ${
                    canvasBg === bg.id ? "active" : ""
                  }`}
                  onClick={() => setCanvasBg(bg.id)}
                  style={{
                    padding: "0 8px",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                  title={`${bg.label} background`}
                >
                  {bg.icon}
                  <span>{bg.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div
            style={{
              width: 1,
              height: 16,
              background: "var(--bs-border)",
            }}
          />

          {/* Zoom Controls */}
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <button
              type="button"
              className="bs-btn bs-btn-icon"
              style={{ width: 24, height: 24 }}
              onClick={() => setZoom(zoom - 0.25)}
              disabled={zoom <= 0.5}
              title="Zoom out"
            >
              <ZoomOut size={12} />
            </button>
            <button
              type="button"
              className="bs-btn bs-mono"
              style={{
                height: 24,
                padding: "0 7px",
                fontSize: 11,
                minWidth: 50,
              }}
              onClick={() => setZoom(1)}
              title="Reset zoom to 100%"
            >
              {zoomPercent}%
            </button>
            <button
              type="button"
              className="bs-btn bs-btn-icon"
              style={{ width: 24, height: 24 }}
              onClick={() => setZoom(zoom + 0.25)}
              disabled={zoom >= 3}
              title="Zoom in"
            >
              <ZoomIn size={12} />
            </button>
            <button
              type="button"
              className="bs-btn"
              style={{ height: 24, padding: "0 8px", fontSize: 11 }}
              onClick={() => resetPreviewCanvas()}
              title="Reset preview state, zoom, and background"
            >
              <RotateCcw size={11} />
              Reset View
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
