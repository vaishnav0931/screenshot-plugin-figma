"use client";

import * as React from "react";
import Link from "next/link";
import { StudioHeader } from "@/components/studio/StudioHeader";
import { PixelPromptButton } from "@/components/ui/pixel-prompt-button";
import { HeatDistortion } from "@/components/ui/heat-distortion";
import { PaperBurn } from "@/components/ui/paper-burn";

const PREVIEW_STAGE_STYLE: React.CSSProperties = {
  backgroundColor: "#09090d",
  backgroundImage:
    "radial-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px)",
  backgroundSize: "20px 20px",
  minHeight: 280,
  padding: 28,
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
};

const ACTION_LINK_STYLE: React.CSSProperties = {
  height: 32,
  padding: "0 14px",
  borderRadius: 7,
  backgroundColor: "#3b82f6",
  borderWidth: 1,
  borderStyle: "solid",
  borderColor: "#3b82f6",
  color: "#ffffff",
  fontSize: 12.5,
  fontWeight: 500,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  textDecoration: "none",
  alignSelf: "flex-start"
};

export function CatalogClient() {
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
      <StudioHeader activeHref="/" />

      <main
        style={{
          width: "100%",
          maxWidth: 1120,
          margin: "0 auto",
          padding: "48px 24px 80px",
          display: "flex",
          flexDirection: "column",
          gap: 32
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <h1
            style={{
              margin: 0,
              fontSize: 30,
              fontWeight: 600,
              letterSpacing: "-0.025em",
              color: "#f4f4f5"
            }}
          >
            Components
          </h1>
          <p
            style={{
              margin: 0,
              fontSize: 14.5,
              lineHeight: 1.55,
              color: "#9a9aa6",
              maxWidth: 620
            }}
          >
            Copy-paste React components with live interactive playgrounds and
            Figma export.
          </p>
        </div>

        <div className="catalog-grid">
          <article className="catalog-card">
            <div style={PREVIEW_STAGE_STYLE}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 10
                }}
              >
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <span
                    style={{
                      height: 36,
                      padding: "0 16px",
                      borderRadius: 8,
                      background: "#2563EB",
                      color: "#FFFFFF",
                      fontSize: 13,
                      fontWeight: 600,
                      display: "inline-flex",
                      alignItems: "center",
                      boxShadow: "0 4px 12px rgba(37, 99, 235, 0.35)"
                    }}
                  >
                    Button Studio
                  </span>
                  <span
                    style={{
                      height: 36,
                      padding: "0 14px",
                      borderRadius: 8,
                      background: "#FFFFFF",
                      color: "#0F172A",
                      border: "1px solid #CBD5E1",
                      fontSize: 13,
                      fontWeight: 500,
                      display: "inline-flex",
                      alignItems: "center"
                    }}
                  >
                    Outline
                  </span>
                </div>
                <span
                  style={{
                    fontSize: 11,
                    color: "#94A3B8",
                    fontFamily: "var(--font-mono)"
                  }}
                >
                  7 Variants • 6 States • Design Tokens • Figma Schema
                </span>
              </div>
            </div>

            <div
              style={{
                flex: 1,
                backgroundColor: "#16161a",
                borderTopWidth: 1,
                borderTopStyle: "solid",
                borderTopColor: "#24242b",
                padding: "18px 20px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                gap: 16
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <Link
                  href="/button-studio"
                  style={{
                    fontSize: 16,
                    fontWeight: 600,
                    letterSpacing: "-0.01em",
                    color: "#f4f4f5",
                    textDecoration: "none"
                  }}
                >
                  Button Studio
                </Link>
                <p
                  style={{
                    margin: 0,
                    fontSize: 13.5,
                    lineHeight: 1.5,
                    color: "#9a9aa6"
                  }}
                >
                  Three-panel interactive UI button component editor with variant
                  matrix, state overrides, design tokens, and CSS/SVG/JSON/Figma export.
                </p>
              </div>

              <Link href="/button-studio" style={ACTION_LINK_STYLE}>
                Open Button Studio
              </Link>
            </div>
          </article>

          <article className="catalog-card">
            <div style={PREVIEW_STAGE_STYLE}>
              <PixelPromptButton size="md" />
            </div>

            <div
              style={{
                flex: 1,
                backgroundColor: "#16161a",
                borderTopWidth: 1,
                borderTopStyle: "solid",
                borderTopColor: "#24242b",
                padding: "18px 20px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                gap: 16
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <Link
                  href="/playground/pixel-prompt-button"
                  style={{
                    fontSize: 16,
                    fontWeight: 600,
                    letterSpacing: "-0.01em",
                    color: "#f4f4f5",
                    textDecoration: "none"
                  }}
                >
                  Pixel Prompt Button
                </Link>
                <p
                  style={{
                    margin: 0,
                    fontSize: 13.5,
                    lineHeight: 1.5,
                    color: "#9a9aa6"
                  }}
                >
                  Animated SVG pixel mosaic pill with cursor-reactive gradients
                  and Figma vector export.
                </p>
              </div>

              <Link
                href="/playground/pixel-prompt-button"
                style={ACTION_LINK_STYLE}
              >
                Open playground
              </Link>
            </div>
          </article>

          <article className="catalog-card">
            <div style={PREVIEW_STAGE_STYLE}>
              <div
                style={{
                  width: 224,
                  height: 224,
                  borderRadius: 10,
                  overflow: "hidden",
                  borderWidth: 1,
                  borderStyle: "solid",
                  borderColor: "#24242b"
                }}
              >
                <HeatDistortion resolution={512} />
              </div>
            </div>

            <div
              style={{
                flex: 1,
                backgroundColor: "#16161a",
                borderTopWidth: 1,
                borderTopStyle: "solid",
                borderTopColor: "#24242b",
                padding: "18px 20px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                gap: 16
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <Link
                  href="/playground/heat-distortion"
                  style={{
                    fontSize: 16,
                    fontWeight: 600,
                    letterSpacing: "-0.01em",
                    color: "#f4f4f5",
                    textDecoration: "none"
                  }}
                >
                  Heat Distortion
                </Link>
                <p
                  style={{
                    margin: 0,
                    fontSize: 13.5,
                    lineHeight: 1.5,
                    color: "#9a9aa6"
                  }}
                >
                  Real-time WebGL shimmer shader for typography or uploaded
                  images with PNG export for Figma.
                </p>
              </div>

              <Link
                href="/playground/heat-distortion"
                style={ACTION_LINK_STYLE}
              >
                Open playground
              </Link>
            </div>
          </article>

          <article className="catalog-card">
            <div style={PREVIEW_STAGE_STYLE}>
              <PaperBurn size="md" />
            </div>

            <div
              style={{
                flex: 1,
                backgroundColor: "#16161a",
                borderTopWidth: 1,
                borderTopStyle: "solid",
                borderTopColor: "#24242b",
                padding: "18px 20px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                gap: 16
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <Link
                  href="/playground/paper-burn"
                  style={{
                    fontSize: 16,
                    fontWeight: 600,
                    letterSpacing: "-0.01em",
                    color: "#f4f4f5",
                    textDecoration: "none"
                  }}
                >
                  Paper Burn
                </Link>
                <p
                  style={{
                    margin: 0,
                    fontSize: 13.5,
                    lineHeight: 1.5,
                    color: "#9a9aa6"
                  }}
                >
                  Press-and-hold button that burns away with WebGL embers,
                  random drifting ashes, and a built-in Restore action.
                </p>
              </div>

              <Link
                href="/playground/paper-burn"
                style={ACTION_LINK_STYLE}
              >
                Open playground
              </Link>
            </div>
          </article>
        </div>
      </main>
    </div>
  );
}
