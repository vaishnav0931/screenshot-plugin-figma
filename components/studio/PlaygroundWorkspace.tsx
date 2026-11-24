"use client";

import * as React from "react";
import {
  StudioHeader,
  StudioHeaderButton,
  type StudioRouteHref
} from "@/components/studio/StudioHeader";

export interface StudioPresetItem {
  id: string;
  name: string;
  accent: string;
}

export type BackdropTheme = "dots" | "obsidian" | "slate" | "light";

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
    mutedText: "#9a9aa6",
    pillBorder: "#272730"
  },
  obsidian: {
    label: "Obsidian",
    bgColor: "#040508",
    bgImage: "none",
    bgSize: "auto",
    mutedText: "#8a8a96",
    pillBorder: "#1f1f26"
  },
  slate: {
    label: "Slate",
    bgColor: "#14161e",
    bgImage:
      "radial-gradient(circle at 50% 45%, rgba(59, 130, 246, 0.12), transparent 62%)",
    bgSize: "100% 100%",
    mutedText: "#a4a8b6",
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

export interface PlaygroundWorkspaceProps {
  activeHref: Exclude<StudioRouteHref, "/">;
  presets: ReadonlyArray<StudioPresetItem>;
  activePresetId: string;
  onSelectPreset: (presetId: string) => void;
  stageContent: React.ReactNode;
  stageActions?:
    | React.ReactNode
    | ((backdrop: BackdropTheme) => React.ReactNode);
  stageNote?: React.ReactNode;
  headerActions?: React.ReactNode;
  statusMsg?: string | null;
  usageSnippet: string;
  sourceCode: string;
  onCopyJsx: () => void;
  onCopyTsx: () => void;
  onResetAll: () => void;
  panel: React.ReactNode;
}

export function getStageButtonStyle(
  backdrop: BackdropTheme,
  active = false
): React.CSSProperties {
  const stageBackdrop = BACKDROP_STYLES[backdrop];
  return {
    height: 30,
    padding: "0 12px",
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: active ? "#3b82f6" : stageBackdrop.pillBorder,
    backgroundColor: active
      ? "rgba(59, 130, 246, 0.16)"
      : backdrop === "light"
      ? "#ffffff"
      : "#141418",
    color: active
      ? backdrop === "light"
        ? "#1d4ed8"
        : "#93c5fd"
      : stageBackdrop.mutedText,
    fontSize: 12,
    fontWeight: 500,
    cursor: "pointer"
  };
}

export function PlaygroundWorkspace({
  activeHref,
  presets,
  activePresetId,
  onSelectPreset,
  stageContent,
  stageActions,
  stageNote,
  headerActions,
  statusMsg,
  usageSnippet,
  sourceCode,
  onCopyJsx,
  onCopyTsx,
  onResetAll,
  panel
}: PlaygroundWorkspaceProps) {
  const [panelOpen, setPanelOpen] = React.useState(true);
  const [backdrop, setBackdrop] = React.useState<BackdropTheme>("dots");
  const [codeOpen, setCodeOpen] = React.useState(false);
  const [codeTab, setCodeTab] = React.useState<"jsx" | "tsx">("jsx");

  const stageBackdrop = BACKDROP_STYLES[backdrop];

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#09090b",
        color: "#f4f4f5",
        display: "flex",
        flexDirection: "column"
      }}
    >
      <StudioHeader
        activeHref={activeHref}
        statusMsg={statusMsg}
        actions={
          <>
            <StudioHeaderButton onClick={onCopyJsx}>Copy JSX</StudioHeaderButton>
            {headerActions}
            <StudioHeaderButton onClick={onCopyTsx} muted>
              Copy TSX
            </StudioHeaderButton>
            <StudioHeaderButton
              active={panelOpen}
              onClick={() => setPanelOpen((v) => !v)}
            >
              {panelOpen ? "Hide panel" : "Show panel"}
            </StudioHeaderButton>
          </>
        }
      />

      <div className="studio-split">
        <div
          style={{
            flex: 1,
            minWidth: 0,
            display: "flex",
            flexDirection: "column"
          }}
        >
          {/* Presets & Backdrop Strip */}
          <div
            style={{
              padding: "10px 18px",
              borderBottomWidth: 1,
              borderBottomStyle: "solid",
              borderBottomColor: "#24242b",
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
                  fontSize: 11.5,
                  fontWeight: 500,
                  color: "#8b8b97",
                  marginRight: 4
                }}
              >
                Presets
              </span>
              {presets.map((preset) => {
                const active = activePresetId === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => onSelectPreset(preset.id)}
                    style={{
                      height: 26,
                      padding: "0 10px",
                      borderRadius: 9999,
                      borderWidth: 1,
                      borderStyle: "solid",
                      borderColor: active ? "#3b82f6" : "#272730",
                      backgroundColor: active
                        ? "rgba(59, 130, 246, 0.16)"
                        : "#16161a",
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
              <span style={{ fontSize: 11.5, color: "#8b8b97", marginRight: 4 }}>
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
                      borderColor: active ? "#32323c" : "transparent",
                      backgroundColor: active ? "#24242a" : "transparent",
                      color: active ? "#ffffff" : "#9a9aa6",
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

          {/* Interactive Preview Stage */}
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
              padding: "40px 24px",
              gap: 24
            }}
          >
            {stageContent}

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "center",
                gap: 10
              }}
            >
              {typeof stageActions === "function"
                ? stageActions(backdrop)
                : stageActions}

              <button
                type="button"
                onClick={() => setCodeOpen((v) => !v)}
                style={getStageButtonStyle(backdrop, codeOpen)}
              >
                {codeOpen ? "Hide code" : "View code"}
              </button>

              <button
                type="button"
                onClick={onResetAll}
                style={getStageButtonStyle(backdrop, false)}
              >
                Reset defaults
              </button>
            </div>

            {stageNote && (
              <div
                style={{
                  fontSize: 12,
                  color: backdrop === "light" ? "#1d4ed8" : "#93c5fd"
                }}
              >
                {stageNote}
              </div>
            )}
          </main>

          {/* Collapsible Code Drawer */}
          {codeOpen && (
            <section
              aria-label="Component code output"
              style={{
                borderTopWidth: 1,
                borderTopStyle: "solid",
                borderTopColor: "#24242b",
                backgroundColor: "#0d0d11",
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
                  justifyContent: "space-between",
                  gap: 10
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  {(
                    [
                      { id: "jsx", label: "Usage JSX" },
                      { id: "tsx", label: "Component TSX" }
                    ] as const
                  ).map((tab) => {
                    const active = codeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setCodeTab(tab.id)}
                        style={{
                          height: 26,
                          padding: "0 10px",
                          borderRadius: 6,
                          borderWidth: 1,
                          borderStyle: "solid",
                          borderColor: active ? "#34343f" : "transparent",
                          backgroundColor: active ? "#24242a" : "transparent",
                          color: active ? "#ffffff" : "#9a9aa6",
                          fontSize: 12,
                          fontWeight: 500,
                          cursor: "pointer"
                        }}
                      >
                        {tab.label}
                      </button>
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={codeTab === "jsx" ? onCopyJsx : onCopyTsx}
                  style={{
                    height: 26,
                    padding: "0 10px",
                    borderRadius: 6,
                    backgroundColor: "#18181c",
                    borderWidth: 1,
                    borderStyle: "solid",
                    borderColor: "#2e2e36",
                    color: "#e4e4e7",
                    fontSize: 11.5,
                    cursor: "pointer"
                  }}
                >
                  {codeTab === "jsx" ? "Copy JSX" : "Copy TSX"}
                </button>
              </div>

              <pre
                style={{
                  margin: 0,
                  padding: 14,
                  maxHeight: 260,
                  overflow: "auto",
                  borderRadius: 8,
                  borderWidth: 1,
                  borderStyle: "solid",
                  borderColor: "#24242b",
                  backgroundColor: "#09090b",
                  fontSize: 12,
                  lineHeight: 1.55,
                  color: "#c4c9d4",
                  fontFamily: "var(--font-mono)"
                }}
              >
                <code>{codeTab === "jsx" ? usageSnippet : sourceCode}</code>
              </pre>
            </section>
          )}
        </div>

        {panelOpen && panel}
      </div>
    </div>
  );
}
