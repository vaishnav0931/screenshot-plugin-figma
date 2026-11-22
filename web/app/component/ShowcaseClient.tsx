"use client";

import * as React from "react";
import Link from "next/link";
import { PixelPromptButton } from "@/components/ui/pixel-prompt-button";
import {
  buildPixelUsageSnippet,
  DEFAULT_PIXEL_STUDIO_CONFIG,
  PROPS_DOC
} from "@/components/PixelControlPanel";
import {
  buildPixelPromptButtonSvg,
  copyTextToClipboard
} from "@/lib/figma-export";

export default function ShowcaseClient({ sourceCode }: { sourceCode: string }) {
  const [activeTab, setActiveTab] = React.useState<"preview" | "code">("preview");
  const [statusMsg, setStatusMsg] = React.useState<string | null>(null);
  const [lastCopiedPrompt, setLastCopiedPrompt] = React.useState<string | null>(null);
  const statusTimer = React.useRef<number | null>(null);

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

  const usageSnippet = React.useMemo(
    () => buildPixelUsageSnippet(DEFAULT_PIXEL_STUDIO_CONFIG),
    []
  );

  const handleCopyFigmaSvg = async () => {
    const svg = buildPixelPromptButtonSvg({});
    const ok = await copyTextToClipboard(svg);
    flashStatus(ok ? "Copied Figma vector SVG — Ctrl+V in Figma" : "Clipboard blocked");
  };

  const handleCopySource = async () => {
    const ok = await copyTextToClipboard(sourceCode);
    flashStatus(ok ? "Copied component TSX" : "Clipboard blocked");
  };

  const handleCopyUsage = async () => {
    const ok = await copyTextToClipboard(usageSnippet);
    flashStatus(ok ? "Copied JSX snippet" : "Clipboard blocked");
  };

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
      {/* Top Navbar */}
      <header
        style={{
          height: 54,
          padding: "0 20px",
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
            <span style={{ fontSize: 14, fontWeight: 600, letterSpacing: "-0.01em" }}>
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
              Docs
            </Link>
            <Link
              href="/playground"
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
            onClick={handleCopyFigmaSvg}
            style={{
              height: 32,
              padding: "0 12px",
              borderRadius: 7,
              backgroundColor: "#18181b",
              borderWidth: 1,
              borderStyle: "solid",
              borderColor: "#2e2e34",
              color: "#e4e4e7",
              fontSize: 12.5,
              fontWeight: 500,
              cursor: "pointer"
            }}
          >
            Copy SVG for Figma
          </button>

          <Link
            href="/playground"
            style={{
              height: 32,
              padding: "0 13px",
              borderRadius: 7,
              backgroundColor: "#2c5cf5",
              borderWidth: 1,
              borderStyle: "solid",
              borderColor: "#4f79ff",
              color: "#ffffff",
              fontSize: 12.5,
              fontWeight: 500,
              display: "inline-flex",
              alignItems: "center",
              textDecoration: "none"
            }}
          >
            Open Control Panel Playground →
          </Link>
        </div>
      </header>

      {/* Main Centered Documentation Showcase */}
      <main
        style={{
          width: "100%",
          maxWidth: 980,
          margin: "0 auto",
          padding: "36px 24px 72px",
          display: "flex",
          flexDirection: "column",
          gap: 30
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: 16
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <h1
              style={{
                margin: 0,
                fontSize: 30,
                fontWeight: 600,
                letterSpacing: "-0.025em"
              }}
            >
              Pixel Prompt Button
            </h1>
            <p
              style={{
                margin: 0,
                fontSize: 14.5,
                color: "#a1a1aa",
                lineHeight: 1.55,
                maxWidth: 660
              }}
            >
              Self-contained animated SVG pixel-mosaic action pill with continuous
              ambient motion, cursor-reactive{" "}
              <code style={{ color: "#e4e4e7" }}>1 → 0</code> hover gradients, and
              live Figma vector export.
            </p>
          </div>
        </div>

        {/* Preview / Code Switcher */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderBottomWidth: 1,
              borderBottomStyle: "solid",
              borderBottomColor: "#222226"
            }}
          >
            <div style={{ display: "flex", gap: 4 }}>
              {(["preview", "code"] as const).map((tab) => {
                const isActive = activeTab === tab;
                return (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    style={{
                      padding: "9px 14px",
                      backgroundColor: "transparent",
                      borderTopWidth: 0,
                      borderLeftWidth: 0,
                      borderRightWidth: 0,
                      borderBottomWidth: 2,
                      borderBottomStyle: "solid",
                      borderBottomColor: isActive ? "#3b82f6" : "transparent",
                      color: isActive ? "#ffffff" : "#8e8e97",
                      fontSize: 13.5,
                      fontWeight: 500,
                      textTransform: "capitalize",
                      cursor: "pointer"
                    }}
                  >
                    {tab}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={handleCopySource}
              style={{
                height: 28,
                padding: "0 10px",
                borderRadius: 6,
                backgroundColor: "#18181c",
                borderWidth: 1,
                borderStyle: "solid",
                borderColor: "#2a2a31",
                color: "#d4d4d8",
                fontSize: 12,
                cursor: "pointer"
              }}
            >
              Copy full TSX
            </button>
          </div>

          {activeTab === "preview" ? (
            <div
              style={{
                borderRadius: 14,
                borderWidth: 1,
                borderStyle: "solid",
                borderColor: "#232329",
                backgroundColor: "#0c0c10",
                backgroundImage:
                  "radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)",
                backgroundSize: "18px 18px",
                minHeight: 300,
                padding: "48px 24px 36px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 26
              }}
            >
              <PixelPromptButton
                onCopyPrompt={(text) => setLastCopiedPrompt(text)}
              />

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 10
                }}
              >
                <Link
                  href="/playground"
                  style={{
                    height: 30,
                    padding: "0 12px",
                    borderRadius: 8,
                    borderWidth: 1,
                    borderStyle: "solid",
                    borderColor: "#2e2e36",
                    backgroundColor: "#15151a",
                    color: "#e4e4e7",
                    fontSize: 12,
                    fontWeight: 500,
                    display: "inline-flex",
                    alignItems: "center",
                    textDecoration: "none"
                  }}
                >
                  Customize in Playground →
                </Link>

                {lastCopiedPrompt && (
                  <span style={{ fontSize: 12, color: "#93c5fd" }}>
                    Copied: &ldquo;{lastCopiedPrompt}&rdquo;
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div
              style={{
                borderRadius: 12,
                borderWidth: 1,
                borderStyle: "solid",
                borderColor: "#232329",
                backgroundColor: "#0e0e12",
                overflow: "hidden"
              }}
            >
              <pre
                style={{
                  margin: 0,
                  padding: 18,
                  maxHeight: 460,
                  overflow: "auto",
                  fontSize: 12,
                  lineHeight: 1.55,
                  color: "#d4d4d8",
                  fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace"
                }}
              >
                <code>{sourceCode}</code>
              </pre>
            </div>
          )}
        </div>

        {/* Usage Snippet */}
        <section style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between"
            }}
          >
            <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>Usage</h2>
            <button
              type="button"
              onClick={handleCopyUsage}
              style={{
                height: 28,
                padding: "0 10px",
                borderRadius: 6,
                backgroundColor: "#18181c",
                borderWidth: 1,
                borderStyle: "solid",
                borderColor: "#2a2a31",
                color: "#d4d4d8",
                fontSize: 12,
                cursor: "pointer"
              }}
            >
              Copy JSX
            </button>
          </div>
          <pre
            style={{
              margin: 0,
              padding: 16,
              borderRadius: 10,
              borderWidth: 1,
              borderStyle: "solid",
              borderColor: "#232329",
              backgroundColor: "#0e0e12",
              fontSize: 12.5,
              lineHeight: 1.6,
              color: "#c4c9d4",
              overflowX: "auto",
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace"
            }}
          >
            <code>{usageSnippet}</code>
          </pre>
        </section>

        {/* Props Reference Table */}
        <section style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>Props</h2>
          <div
            style={{
              borderRadius: 10,
              borderWidth: 1,
              borderStyle: "solid",
              borderColor: "#232329",
              overflowX: "auto",
              backgroundColor: "#0c0c10"
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: 12.5,
                textAlign: "left"
              }}
            >
              <thead>
                <tr
                  style={{
                    backgroundColor: "#131318",
                    borderBottomWidth: 1,
                    borderBottomStyle: "solid",
                    borderBottomColor: "#232329",
                    color: "#a1a1aa"
                  }}
                >
                  <th style={{ padding: "10px 14px", fontWeight: 500 }}>Prop</th>
                  <th style={{ padding: "10px 14px", fontWeight: 500 }}>Type</th>
                  <th style={{ padding: "10px 14px", fontWeight: 500 }}>Default</th>
                  <th style={{ padding: "10px 14px", fontWeight: 500 }}>Description</th>
                </tr>
              </thead>
              <tbody>
                {PROPS_DOC.map((row) => (
                  <tr
                    key={row.prop}
                    style={{
                      borderBottomWidth: 1,
                      borderBottomStyle: "solid",
                      borderBottomColor: "#1a1a20"
                    }}
                  >
                    <td
                      style={{
                        padding: "9px 14px",
                        fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                        color: "#93c5fd"
                      }}
                    >
                      {row.prop}
                    </td>
                    <td
                      style={{
                        padding: "9px 14px",
                        fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                        color: "#c4b5fd"
                      }}
                    >
                      {row.type}
                    </td>
                    <td
                      style={{
                        padding: "9px 14px",
                        fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                        color: "#a1a1aa"
                      }}
                    >
                      {row.def}
                    </td>
                    <td style={{ padding: "9px 14px", color: "#d4d4d8" }}>
                      {row.desc}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
