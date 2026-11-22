"use client";

import * as React from "react";
import Link from "next/link";
import { PixelPromptButton } from "@/components/ui/pixel-prompt-button";
import {
  buildPixelUsageSnippet,
  DEFAULT_PIXEL_STUDIO_CONFIG,
  PixelControlPanel,
  STUDIO_PRESETS,
  type PixelStudioConfig
} from "@/components/PixelControlPanel";
import {
  buildPixelPromptButtonSvg,
  copyTextToClipboard
} from "@/lib/figma-export";

type BackdropTheme = "dots" | "obsidian" | "slate" | "light";

const BACKDROP_STYLES: Record<
  BackdropTheme,
  {
    label: string;
    bgColor: string;
    bgImage: string;
    bgSize: string;
    mutedText: string;
    pillBorder: string;
  }
> = {
  dots: {
    label: "Dot Grid",
    bgColor: "#09090d",
    bgImage: "radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px)",
    bgSize: "20px 20px",
    mutedText: "#8f8f99",
    pillBorder: "#27272e"
  },
  obsidian: {
    label: "Obsidian",
    bgColor: "#040508",
    bgImage: "none",
    bgSize: "auto",
    mutedText: "#7a7a85",
    pillBorder: "#1f1f26"
  },
  slate: {
    label: "Slate",
    bgColor: "#14161e",
    bgImage:
      "radial-gradient(circle at 50% 45%, rgba(44, 92, 245, 0.12), transparent 62%)",
    bgSize: "100% 100%",
    mutedText: "#9ea2b0",
    pillBorder: "#292c38"
  },
  light: {
    label: "Light",
    bgColor: "#f3f4f8",
    bgImage: "radial-gradient(rgba(15, 23, 42, 0.08) 1px, transparent 1px)",
    bgSize: "20px 20px",
    mutedText: "#4b5563",
    pillBorder: "#d4d8e2"
  }
};

export default function PlaygroundClient({ sourceCode }: { sourceCode: string }) {
  const [config, setConfig] = React.useState<PixelStudioConfig>(
    DEFAULT_PIXEL_STUDIO_CONFIG
  );
  const [activePresetId, setActivePresetId] = React.useState<string>("cobalt-classic");
  const [panelOpen, setPanelOpen] = React.useState(true);
  const [backdrop, setBackdrop] = React.useState<BackdropTheme>("dots");
  const [jsxOpen, setJsxOpen] = React.useState(false);
  const [statusMsg, setStatusMsg] = React.useState<string | null>(null);
  const [lastCopiedPrompt, setLastCopiedPrompt] = React.useState<string | null>(null);
  const statusTimer = React.useRef<number | null>(null);

  const patch = React.useCallback((partial: Partial<PixelStudioConfig>) => {
    setActivePresetId("");
    setConfig((prev) => ({ ...prev, ...partial }));
  }, []);

  const flashStatus = (msg: string) => {
    setStatusMsg(msg);
    if (statusTimer.current) window.clearTimeout(statusTimer.current);
    statusTimer.current = window.setTimeout(() => setStatusMsg(null), 2200);
  };

  React.useEffect(() => {
    return () => {
      if (statusTimer.current) window.clearTimeout(statusTimer.current);
    };
  }, []);

  const usageSnippet = React.useMemo(() => buildPixelUsageSnippet(config), [config]);

  const handleCopyJsx = async () => {
    const ok = await copyTextToClipboard(usageSnippet);
    flashStatus(ok ? "Copied live JSX snippet" : "Clipboard blocked");
  };

  const handleCopyFigmaSvg = async () => {
    const svg = buildPixelPromptButtonSvg({
      baseColor: config.baseColor,
      highlightColor: config.highlightColor,
      hoverGradientColor: config.hoverGradientColor || undefined,
      textColor: config.textColor,
      pixelSize: config.pixelSize,
      pixelGap: config.pixelGap,
      pixelRadius: config.pixelRadius,
      pixelContrast: config.pixelContrast,
      gradientStart: config.gradientStart,
      gradientEnd: config.gradientEnd
    });
    const ok = await copyTextToClipboard(svg);
    flashStatus(ok ? "Copied Figma vector SVG — Ctrl+V in Figma" : "Clipboard blocked");
  };

  const handleCopySource = async () => {
    const ok = await copyTextToClipboard(sourceCode);
    flashStatus(ok ? "Copied component TSX" : "Clipboard blocked");
  };

  const applyPreset = (presetId: string) => {
    const found = STUDIO_PRESETS.find((p) => p.id === presetId);
    if (!found) return;
    setActivePresetId(found.id);
    setConfig({ ...DEFAULT_PIXEL_STUDIO_CONFIG, ...found.values });
  };

  const isHoverLocked = config.mouseOverMode === "always-on";
  const stageBackdrop = BACKDROP_STYLES[backdrop];

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#09090b",
        color: "#f4f4f5",
        fontFamily:
          '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        display: "flex",
        flexDirection: "column"
      }}
    >
      {/* Top Studio Bar */}
      <header
        style={{
          height: 54,
          padding: "0 18px",
          borderBottomWidth: 1,
          borderBottomStyle: "solid",
          borderBottomColor: "#222226",
          backgroundColor: "#0c0c0f",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          position: "sticky",
          top: 0,
          zIndex: 30
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <Link
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 9,
              textDecoration: "none",
              color: "#f4f4f5"
            }}
          >
            <span
              style={{
                width: 24,
                height: 24,
                borderRadius: 6,
                backgroundImage: "linear-gradient(135deg, #2c5cf5, #60a5fa)",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 12,
                fontWeight: 700,
                color: "#ffffff"
              }}
            >
              P
            </span>
            <span style={{ fontSize: 13.5, fontWeight: 600, letterSpacing: "-0.01em" }}>
              PixelPromptButton
            </span>
          </Link>

          <nav
            aria-label="Workspace routes"
            style={{ display: "flex", alignItems: "center", gap: 4 }}
          >
            <Link
              href="/"
              style={{
                height: 28,
                padding: "0 10px",
                borderRadius: 6,
                color: "#a1a1aa",
                fontSize: 12.5,
                fontWeight: 500,
                display: "inline-flex",
                alignItems: "center",
                textDecoration: "none"
              }}
            >
              Docs
            </Link>
            <Link
              href="/playground"
              style={{
                height: 28,
                padding: "0 10px",
                borderRadius: 6,
                backgroundColor: "#1d1d24",
                borderWidth: 1,
                borderStyle: "solid",
                borderColor: "#32323c",
                color: "#ffffff",
                fontSize: 12.5,
                fontWeight: 500,
                display: "inline-flex",
                alignItems: "center",
                textDecoration: "none"
              }}
            >
              Playground
            </Link>
            <Link
              href="/plugin"
              style={{
                height: 28,
                padding: "0 10px",
                borderRadius: 6,
                color: "#a1a1aa",
                fontSize: 12.5,
                fontWeight: 500,
                display: "inline-flex",
                alignItems: "center",
                textDecoration: "none"
              }}
            >
              Screenshot Studio
            </Link>
          </nav>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {statusMsg && (
            <span
              style={{
                fontSize: 12,
                color: "#93c5fd",
                backgroundColor: "rgba(44, 92, 245, 0.14)",
                borderWidth: 1,
                borderStyle: "solid",
                borderColor: "rgba(96, 165, 250, 0.3)",
                borderRadius: 6,
                padding: "4px 9px"
              }}
            >
              {statusMsg}
            </span>
          )}

          <button
            type="button"
            onClick={handleCopyJsx}
            style={{
              height: 30,
              padding: "0 11px",
              borderRadius: 7,
              backgroundColor: "#18181b",
              borderWidth: 1,
              borderStyle: "solid",
              borderColor: "#2e2e34",
              color: "#e4e4e7",
              fontSize: 12,
              fontWeight: 500,
              cursor: "pointer"
            }}
          >
            Copy JSX
          </button>

          <button
            type="button"
            onClick={handleCopyFigmaSvg}
            style={{
              height: 30,
              padding: "0 11px",
              borderRadius: 7,
              backgroundColor: "#18181b",
              borderWidth: 1,
              borderStyle: "solid",
              borderColor: "#2e2e34",
              color: "#e4e4e7",
              fontSize: 12,
              fontWeight: 500,
              cursor: "pointer"
            }}
          >
            Copy SVG for Figma
          </button>

          <button
            type="button"
            onClick={handleCopySource}
            style={{
              height: 30,
              padding: "0 11px",
              borderRadius: 7,
              backgroundColor: "#18181b",
              borderWidth: 1,
              borderStyle: "solid",
              borderColor: "#2e2e34",
              color: "#a1a1aa",
              fontSize: 12,
              fontWeight: 500,
              cursor: "pointer"
            }}
          >
            Copy TSX
          </button>

          <button
            type="button"
            onClick={() => setPanelOpen((v) => !v)}
            style={{
              height: 30,
              padding: "0 11px",
              borderRadius: 7,
              backgroundColor: panelOpen ? "#2c5cf5" : "#1e1e23",
              borderWidth: 1,
              borderStyle: "solid",
              borderColor: panelOpen ? "#4f79ff" : "#323238",
              color: "#ffffff",
              fontSize: 12,
              fontWeight: 500,
              cursor: "pointer"
            }}
          >
            {panelOpen ? "Hide Panel" : "Show Panel"}
          </button>
        </div>
      </header>

      {/* Split Workspace */}
      <div style={{ flex: 1, display: "flex", alignItems: "stretch" }}>
        {/* Left Interactive Canvas Area */}
        <div
          style={{
            flex: 1,
            minWidth: 0,
            display: "flex",
            flexDirection: "column"
          }}
        >
          {/* Presets & Surface Strip */}
          <div
            style={{
              padding: "10px 18px",
              borderBottomWidth: 1,
              borderBottomStyle: "solid",
              borderBottomColor: "#1e1e24",
              backgroundColor: "#0d0d11",
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 10
            }}
          >
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 6 }}>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: "#7e7e88",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  marginRight: 4
                }}
              >
                Presets
              </span>
              {STUDIO_PRESETS.map((preset) => {
                const active = activePresetId === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => applyPreset(preset.id)}
                    style={{
                      height: 26,
                      padding: "0 10px",
                      borderRadius: 9999,
                      borderWidth: 1,
                      borderStyle: "solid",
                      borderColor: active ? "#4f79ff" : "#27272e",
                      backgroundColor: active
                        ? "rgba(44, 92, 245, 0.18)"
                        : "#16161b",
                      color: active ? "#ffffff" : "#b8b8c2",
                      fontSize: 11.5,
                      fontWeight: 500,
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      cursor: "pointer"
                    }}
                  >
                    <span
                      style={{
                        width: 7,
                        height: 7,
                        borderRadius: "9999px",
                        backgroundColor: preset.accent
                      }}
                    />
                    {preset.name}
                  </button>
                );
              })}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <span
                style={{
                  fontSize: 11,
                  color: "#7e7e88",
                  marginRight: 4
                }}
              >
                Backdrop
              </span>
              {(Object.keys(BACKDROP_STYLES) as BackdropTheme[]).map((key) => {
                const active = backdrop === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setBackdrop(key)}
                    style={{
                      height: 25,
                      padding: "0 9px",
                      borderRadius: 6,
                      borderWidth: 1,
                      borderStyle: "solid",
                      borderColor: active ? "#3f3f4a" : "transparent",
                      backgroundColor: active ? "#1e1e26" : "transparent",
                      color: active ? "#ffffff" : "#8a8a94",
                      fontSize: 11.5,
                      fontWeight: 500,
                      cursor: "pointer"
                    }}
                  >
                    {BACKDROP_STYLES[key].label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Center Preview Canvas */}
          <main
            style={{
              flex: 1,
              backgroundColor: stageBackdrop.bgColor,
              backgroundImage: stageBackdrop.bgImage,
              backgroundSize: stageBackdrop.bgSize,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "48px 24px",
              gap: 28
            }}
          >
            <PixelPromptButton
              baseColor={config.baseColor}
              highlightColor={config.highlightColor}
              textColor={config.textColor}
              glowIntensity={config.glowIntensity}
              pixelSize={config.pixelSize}
              pixelGap={config.pixelGap}
              pixelRadius={config.pixelRadius}
              pixelContrast={config.pixelContrast}
              animationMode={config.animationMode}
              animationSpeed={config.animationSpeed}
              danceAmount={config.danceAmount}
              mouseOverMode={config.mouseOverMode}
              hoverEffect={config.hoverEffect}
              hoverRadius={config.hoverRadius}
              hoverIntensity={config.hoverIntensity}
              gradientCurve={config.gradientCurve}
              gradientStart={config.gradientStart}
              gradientEnd={config.gradientEnd}
              hoverBloom={config.hoverBloom}
              hoverGradientColor={config.hoverGradientColor || undefined}
              transitionDuration={config.transitionDuration}
              transitionEasing={config.transitionEasing}
              cursorSmoothness={config.cursorSmoothness}
              hoverLift={config.hoverLift}
              onCopyPrompt={(text) => setLastCopiedPrompt(text)}
            />

            {/* Bottom Stage Quick Controls */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "center",
                gap: 10
              }}
            >
              <button
                type="button"
                onClick={() =>
                  patch({
                    mouseOverMode: isHoverLocked ? "follow" : "always-on"
                  })
                }
                style={{
                  height: 30,
                  padding: "0 12px",
                  borderRadius: 8,
                  borderWidth: 1,
                  borderStyle: "solid",
                  borderColor: isHoverLocked
                    ? "#3b82f6"
                    : stageBackdrop.pillBorder,
                  backgroundColor: isHoverLocked
                    ? "rgba(44, 92, 245, 0.18)"
                    : backdrop === "light"
                    ? "#ffffff"
                    : "#141418",
                  color: isHoverLocked
                    ? backdrop === "light"
                      ? "#1d4ed8"
                      : "#93c5fd"
                    : stageBackdrop.mutedText,
                  fontSize: 12,
                  fontWeight: 500,
                  cursor: "pointer"
                }}
              >
                {isHoverLocked ? "Hover preview locked" : "Lock hover preview"}
              </button>

              <button
                type="button"
                onClick={() => setJsxOpen((v) => !v)}
                style={{
                  height: 30,
                  padding: "0 12px",
                  borderRadius: 8,
                  borderWidth: 1,
                  borderStyle: "solid",
                  borderColor: jsxOpen ? "#3b82f6" : stageBackdrop.pillBorder,
                  backgroundColor: jsxOpen
                    ? "rgba(44, 92, 245, 0.14)"
                    : backdrop === "light"
                    ? "#ffffff"
                    : "#141418",
                  color: jsxOpen
                    ? backdrop === "light"
                      ? "#1d4ed8"
                      : "#93c5fd"
                    : stageBackdrop.mutedText,
                  fontSize: 12,
                  fontWeight: 500,
                  cursor: "pointer"
                }}
              >
                {jsxOpen ? "Hide Live JSX" : "View Live JSX"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setActivePresetId("cobalt-classic");
                  setConfig(DEFAULT_PIXEL_STUDIO_CONFIG);
                }}
                style={{
                  height: 30,
                  padding: "0 12px",
                  borderRadius: 8,
                  borderWidth: 1,
                  borderStyle: "solid",
                  borderColor: stageBackdrop.pillBorder,
                  backgroundColor:
                    backdrop === "light" ? "#ffffff" : "#141418",
                  color: stageBackdrop.mutedText,
                  fontSize: 12,
                  fontWeight: 500,
                  cursor: "pointer"
                }}
              >
                Reset defaults
              </button>
            </div>

            {lastCopiedPrompt && (
              <div
                style={{
                  fontSize: 12,
                  color: backdrop === "light" ? "#1d4ed8" : "#93c5fd"
                }}
              >
                Copied prompt: &ldquo;{lastCopiedPrompt}&rdquo;
              </div>
            )}
          </main>

          {/* Collapsible Live JSX Output Drawer */}
          {jsxOpen && (
            <section
              aria-label="Generated JSX Output"
              style={{
                borderTopWidth: 1,
                borderTopStyle: "solid",
                borderTopColor: "#24242b",
                backgroundColor: "#0e0e12",
                padding: "14px 18px",
                display: "flex",
                flexDirection: "column",
                gap: 10
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between"
                }}
              >
                <span style={{ fontSize: 12, fontWeight: 600, color: "#d4d4d8" }}>
                  Generated JSX Snippet
                </span>
                <button
                  type="button"
                  onClick={handleCopyJsx}
                  style={{
                    height: 26,
                    padding: "0 10px",
                    borderRadius: 6,
                    backgroundColor: "#1b1b21",
                    borderWidth: 1,
                    borderStyle: "solid",
                    borderColor: "#2e2e36",
                    color: "#e4e4e7",
                    fontSize: 11.5,
                    cursor: "pointer"
                  }}
                >
                  Copy snippet
                </button>
              </div>
              <pre
                style={{
                  margin: 0,
                  padding: 12,
                  maxHeight: 200,
                  overflow: "auto",
                  borderRadius: 8,
                  borderWidth: 1,
                  borderStyle: "solid",
                  borderColor: "#222229",
                  backgroundColor: "#09090c",
                  fontSize: 12,
                  lineHeight: 1.55,
                  color: "#c4c9d4",
                  fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace"
                }}
              >
                <code>{usageSnippet}</code>
              </pre>
            </section>
          )}
        </div>

        {/* Right Docked Control Panel */}
        {panelOpen && (
          <PixelControlPanel
            config={config}
            onPatch={patch}
            onResetAll={() => {
              setActivePresetId("cobalt-classic");
              setConfig(DEFAULT_PIXEL_STUDIO_CONFIG);
            }}
            width={320}
          />
        )}
      </div>
    </div>
  );
}
