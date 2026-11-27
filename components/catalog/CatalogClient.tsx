"use client";

import * as React from "react";
import Link from "next/link";
import { StudioHeader } from "@/components/studio/StudioHeader";
import { PixelPromptButton } from "@/components/ui/pixel-prompt-button";
import { HeatDistortion } from "@/components/ui/heat-distortion";
import {
  DEFAULT_PAPER_BURN_CONFIG,
  PaperBurn,
  buildPaperBurnUsageSnippet,
} from "@/components/ui/paper-burn";
import {
  DEFAULT_SILK_DESIGNS_CONFIG,
  SILK_SHUFFLE_PALETTES,
  SilkDesignsCard,
  buildSilkDesignsUsageSnippet,
  type SilkDesignsCardConfig,
  type SilkDesignsCardHandle,
} from "@/components/ui/silk-designs-card";
import { SILK_DESIGNS_PRESETS } from "@/components/studio/SilkDesignsControlPanel";
import { copyTextToClipboard } from "@/lib/figma-export";

const HEAT_SNIPPET = `<HeatDistortion
  text="SHIMMER"
  strength={0.045}
  speed={1.2}
  chromaticAberration={0.012}
/>`;

const PIXEL_SNIPPET = `<PixelPromptButton
  label="Generate prompt"
  size="md"
/>`;

const PAPER_BURN_SNIPPET = buildPaperBurnUsageSnippet(
  DEFAULT_PAPER_BURN_CONFIG
);

export function CatalogClient() {
  const [heroConfig, setHeroConfig] = React.useState<SilkDesignsCardConfig>(
    DEFAULT_SILK_DESIGNS_CONFIG
  );
  const [activePresetId, setActivePresetId] =
    React.useState<string>("Editorial-silk");
  const [copiedId, setCopiedId] = React.useState<string | null>(null);
  const [statusMsg, setStatusMsg] = React.useState<string | null>(null);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [categoryFilter, setCategoryFilter] = React.useState<
    "all" | "shader" | "button"
  >("all");

  const heroCardRef = React.useRef<SilkDesignsCardHandle | null>(null);
  const toastTimer = React.useRef<number | null>(null);

  const flashStatus = React.useCallback((msg: string, id?: string) => {
    setStatusMsg(msg);
    if (id) setCopiedId(id);
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => {
      setStatusMsg(null);
      setCopiedId(null);
    }, 2200);
  }, []);

  React.useEffect(() => {
    return () => {
      if (toastTimer.current) window.clearTimeout(toastTimer.current);
    };
  }, []);

  const heroSnippet = React.useMemo(
    () => buildSilkDesignsUsageSnippet(heroConfig),
    [heroConfig]
  );

  const handleSelectHeroPreset = (presetId: string) => {
    const preset = SILK_DESIGNS_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    setActivePresetId(preset.id);
    setHeroConfig({
      ...DEFAULT_SILK_DESIGNS_CONFIG,
      ...preset.values,
    });
  };

  const handleHeroShuffle = () => {
    const pick =
      SILK_SHUFFLE_PALETTES[
        Math.floor(Math.random() * SILK_SHUFFLE_PALETTES.length)
      ];
    setActivePresetId("");
    setHeroConfig((prev) => ({
      ...prev,
      ...pick,
    }));
    flashStatus("Updated shader palette");
  };

  const handleCopySnippet = async (
    snippet: string,
    id: string,
    label: string
  ) => {
    const ok = await copyTextToClipboard(snippet);
    flashStatus(ok ? `Copied ${label} JSX` : "Clipboard unavailable", id);
  };

  const matchesFilter = (
    title: string,
    description: string,
    category: "shader" | "button"
  ) => {
    if (categoryFilter !== "all" && categoryFilter !== category) return false;
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    return (
      title.toLowerCase().includes(q) || description.toLowerCase().includes(q)
    );
  };

  const showSilkCard = matchesFilter(
    "Silk Designs Card",
    "300x300 square Designs card with a domain-warped fbm 3D silk WebGL fragment shader, curved SVG cream tab, and 3D pointer tilt.",
    "shader"
  );
  const showPaperBurn = matchesFilter(
    "Paper Burn",
    "Press-and-hold button that burns away with WebGL embers, random drifting ashes, and a built-in Restore action.",
    "button"
  );
  const showPixelPrompt = matchesFilter(
    "Pixel Prompt Button",
    "Animated SVG pixel mosaic pill with cursor-reactive gradients and Figma vector export.",
    "button"
  );
  const showHeatDistortion = matchesFilter(
    "Heat Distortion",
    "Real-time WebGL shimmer shader for typography or uploaded images with PNG export for Figma.",
    "shader"
  );

  const visibleCount = [
    showSilkCard,
    showPaperBurn,
    showPixelPrompt,
    showHeatDistortion,
  ].filter(Boolean).length;

  return (
    <div className="lp-root">
      <style>{`
        .lp-root {
          min-height: 100vh;
          background-color: #0b0c10;
          color: #f4f4f6;
          display: flex;
          flex-direction: column;
          font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }

        .lp-container {
          width: 100%;
          max-width: 1160px;
          margin: 0 auto;
          padding: 40px 24px 96px;
          display: flex;
          flex-direction: column;
          gap: 64px;
        }

        /* Hero Workbench */
        .lp-hero {
          display: grid;
          grid-template-columns: 1.08fr 0.92fr;
          gap: 36px;
          align-items: center;
          padding: 28px 0 12px;
        }

        @media (max-width: 940px) {
          .lp-hero {
            grid-template-columns: 1fr;
            gap: 28px;
          }
        }

        .lp-hero-copy {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 20px;
        }

        .lp-kicker {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 5px 11px;
          border-radius: 9999px;
          background-color: #13151c;
          border: 1px solid #232632;
          font-size: 12px;
          font-weight: 500;
          color: #b4b8c5;
        }

        .lp-kicker-dot {
          width: 7px;
          height: 7px;
          border-radius: 9999px;
          background-color: #ff2e93;
        }

        .lp-headline {
          margin: 0;
          font-size: clamp(28px, 4vw, 42px);
          font-weight: 600;
          line-height: 1.12;
          letter-spacing: -0.03em;
          color: #f4f4f6;
          max-width: 19ch;
        }

        .lp-lead {
          margin: 0;
          font-size: 15.5px;
          line-height: 1.6;
          color: #969aa7;
          max-width: 54ch;
        }

        /* Live Hero Tuner Bar */
        .lp-tuner {
          width: 100%;
          max-width: 510px;
          padding: 14px 16px;
          border-radius: 12px;
          background-color: #13151c;
          border: 1px solid #232632;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .lp-tuner-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          flex-wrap: wrap;
        }

        .lp-tuner-title {
          font-size: 12.5px;
          font-weight: 600;
          color: #d8dae2;
        }

        .lp-preset-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .lp-preset-btn {
          height: 27px;
          padding: 0 10px;
          border-radius: 7px;
          border: 1px solid #262936;
          background-color: #191c26;
          color: #c2c6d3;
          font-size: 12px;
          font-weight: 500;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
          transition: border-color 140ms ease, background-color 140ms ease, color 140ms ease;
        }

        .lp-preset-btn:hover {
          border-color: #3a3f52;
          color: #ffffff;
        }

        .lp-preset-btn[data-active="true"] {
          border-color: #3b82f6;
          background-color: rgba(59, 130, 246, 0.16);
          color: #ffffff;
        }

        .lp-sliders-mini {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          padding-top: 2px;
        }

        @media (max-width: 520px) {
          .lp-sliders-mini {
            grid-template-columns: 1fr;
          }
        }

        .lp-mini-control {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .lp-mini-label-row {
          display: flex;
          justify-content: space-between;
          font-size: 11.5px;
          color: #969aa7;
        }

        .lp-mini-val {
          font-family: var(--font-mono);
          color: #d4d7e0;
        }

        .lp-mini-range {
          width: 100%;
          accent-color: #3b82f6;
          cursor: pointer;
          margin: 0;
        }

        /* Hero CTA Row */
        .lp-cta-row {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 10px;
          padding-top: 4px;
        }

        .lp-btn-primary {
          height: 38px;
          padding: 0 16px;
          border-radius: 8px;
          background-color: #3b82f6;
          border: 1px solid #3b82f6;
          color: #ffffff;
          font-size: 13.5px;
          font-weight: 500;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          cursor: pointer;
          transition: background-color 140ms ease;
        }

        .lp-btn-primary:hover {
          background-color: #2563eb;
        }

        .lp-btn-secondary {
          height: 38px;
          padding: 0 14px;
          border-radius: 8px;
          background-color: #151821;
          border: 1px solid #282c3a;
          color: #e4e6ed;
          font-size: 13px;
          font-weight: 500;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          cursor: pointer;
          transition: border-color 140ms ease, background-color 140ms ease;
        }

        .lp-btn-secondary:hover {
          border-color: #3c4257;
          background-color: #1b1f2b;
        }

        /* Hero Right Interactive Stage */
        .lp-hero-stage {
          border-radius: 16px;
          background-color: #11131a;
          background-image: radial-gradient(rgba(255, 255, 255, 0.07) 1px, transparent 1px);
          background-size: 20px 20px;
          border: 1px solid #232632;
          padding: 32px 24px 22px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          gap: 22px;
          min-height: 430px;
        }

        .lp-stage-hint {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          gap: 10px;
          flex-wrap: wrap;
          padding-top: 8px;
          border-top: 1px solid #1e212c;
          font-size: 12px;
          color: #8f94a3;
        }

        .lp-stage-quick-actions {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .lp-mini-btn {
          height: 26px;
          padding: 0 10px;
          border-radius: 6px;
          background-color: #181b24;
          border: 1px solid #2a2e3d;
          color: #d0d3de;
          font-size: 11.5px;
          font-weight: 500;
          cursor: pointer;
        }

        .lp-mini-btn:hover {
          border-color: #3b82f6;
          color: #ffffff;
        }

        /* Catalog Filter Bar */
        .lp-section-header {
          display: flex;
          flex-wrap: wrap;
          align-items: flex-end;
          justify-content: space-between;
          gap: 16px;
          padding-bottom: 18px;
          border-bottom: 1px solid #1e212c;
        }

        .lp-section-title {
          margin: 0;
          font-size: 22px;
          font-weight: 600;
          letter-spacing: -0.02em;
          color: #f4f4f6;
        }

        .lp-section-subtitle {
          margin: 6px 0 0;
          font-size: 13.5px;
          color: #969aa7;
        }

        .lp-filter-controls {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 10px;
        }

        .lp-tabs {
          display: inline-flex;
          padding: 3px;
          border-radius: 8px;
          background-color: #13151c;
          border: 1px solid #232632;
          gap: 2px;
        }

        .lp-tab-btn {
          height: 28px;
          padding: 0 11px;
          border-radius: 6px;
          border: none;
          background: transparent;
          color: #969aa7;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
        }

        .lp-tab-btn[data-active="true"] {
          background-color: #232735;
          color: #ffffff;
        }

        .lp-search-input {
          height: 34px;
          width: 210px;
          padding: 0 12px;
          border-radius: 8px;
          background-color: #13151c;
          border: 1px solid #232632;
          color: #f4f4f6;
          font-size: 12.5px;
          outline: none;
        }

        .lp-search-input:focus {
          border-color: #3b82f6;
        }

        /* Catalog Card Footer */
        .lp-card-body {
          flex: 1;
          background-color: #13151c;
          border-top: 1px solid #232632;
          padding: 18px 20px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 16px;
        }

        .lp-card-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
        }

        .lp-card-title {
          font-size: 16px;
          font-weight: 600;
          letter-spacing: -0.01em;
          color: #f4f4f6;
          text-decoration: none;
        }

        .lp-card-title:hover {
          color: #60a5fa;
        }

        .lp-card-tag {
          font-size: 11px;
          font-weight: 500;
          padding: 2px 8px;
          border-radius: 6px;
          background-color: #1c202c;
          border: 1px solid #2b3040;
          color: #b4b8c5;
          white-space: nowrap;
        }

        .lp-card-desc {
          margin: 6px 0 0;
          font-size: 13.5px;
          line-height: 1.55;
          color: #969aa7;
          max-width: 56ch;
        }

        .lp-card-hint {
          font-size: 12px;
          color: #7d8292;
          margin: 0;
        }

        .lp-card-actions {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 8px;
        }

        .lp-stage-preview {
          background-color: #0d0e13;
          background-image: radial-gradient(rgba(255, 255, 255, 0.07) 1px, transparent 1px);
          background-size: 20px 20px;
          min-height: 320px;
          padding: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Workflow Info Strip */
        .lp-workflow {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 18px;
        }

        @media (max-width: 820px) {
          .lp-workflow {
            grid-template-columns: 1fr;
          }
        }

        .lp-workflow-item {
          padding: 20px;
          border-radius: 12px;
          background-color: #13151c;
          border: 1px solid #232632;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .lp-workflow-title {
          margin: 0;
          font-size: 15px;
          font-weight: 600;
          color: #f4f4f6;
        }

        .lp-workflow-desc {
          margin: 0;
          font-size: 13.5px;
          line-height: 1.55;
          color: #969aa7;
        }
      `}</style>

      <StudioHeader activeHref="/" statusMsg={statusMsg} />

      <main className="lp-container">
        {/* HERO WORKBENCH: Featured Interactive Silk Designs Card */}
        <section className="lp-hero" aria-label="Featured component workbench">
          <div className="lp-hero-copy">
            <div className="lp-kicker">
              <span className="lp-kicker-dot" />
              <span>Interactive WebGL &amp; SVG Component Workbench</span>
            </div>

            <h1 className="lp-headline">
              Tactile shaders and surfaces you can tune in the browser.
            </h1>

            <p className="lp-lead">
              Test every component live before copying a single line. Adjust 3D
              silk folds, ember combustion, and shimmer shaders in real time,
              then copy self-contained React TSX or paste snapshots directly
              into Figma.
            </p>

            {/* Quick Live Tuner for the Hero Card */}
            <div className="lp-tuner" aria-label="Quick shader tuner">
              <div className="lp-tuner-top">
                <span className="lp-tuner-title">
                  Try presets on the live Designs card
                </span>
                <button
                  type="button"
                  className="lp-mini-btn"
                  onClick={handleHeroShuffle}
                >
                  Shuffle palette
                </button>
              </div>

              <div className="lp-preset-pills">
                {SILK_DESIGNS_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    className="lp-preset-btn"
                    data-active={activePresetId === preset.id}
                    onClick={() => handleSelectHeroPreset(preset.id)}
                  >
                    <span
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: 999,
                        backgroundColor: preset.accent,
                      }}
                    />
                    {preset.name}
                  </button>
                ))}
              </div>

              <div className="lp-sliders-mini">
                <label className="lp-mini-control">
                  <div className="lp-mini-label-row">
                    <span>Silk fold scale</span>
                    <span className="lp-mini-val">
                      {heroConfig.foldScale.toFixed(2)}
                    </span>
                  </div>
                  <input
                    type="range"
                    className="lp-mini-range"
                    min={0.8}
                    max={5}
                    step={0.05}
                    value={heroConfig.foldScale}
                    onChange={(e) => {
                      setActivePresetId("");
                      setHeroConfig((prev) => ({
                        ...prev,
                        foldScale: parseFloat(e.target.value),
                      }));
                    }}
                  />
                </label>

                <label className="lp-mini-control">
                  <div className="lp-mini-label-row">
                    <span>3D surface relief</span>
                    <span className="lp-mini-val">
                      {heroConfig.relief.toFixed(2)}
                    </span>
                  </div>
                  <input
                    type="range"
                    className="lp-mini-range"
                    min={0}
                    max={3}
                    step={0.05}
                    value={heroConfig.relief}
                    onChange={(e) => {
                      setActivePresetId("");
                      setHeroConfig((prev) => ({
                        ...prev,
                        relief: parseFloat(e.target.value),
                      }));
                    }}
                  />
                </label>
              </div>
            </div>

            {/* Hero Primary & Secondary Actions */}
            <div className="lp-cta-row">
              <Link
                href="/playground/silk-designs-card"
                className="lp-btn-primary"
              >
                Open Silk Card Playground
              </Link>
              <button
                type="button"
                className="lp-btn-secondary"
                onClick={() =>
                  handleCopySnippet(heroSnippet, "hero-jsx", "Silk Designs Card")
                }
              >
                {copiedId === "hero-jsx" ? "Copied JSX!" : "Copy live JSX"}
              </button>
              <a href="#catalog" className="lp-btn-secondary">
                Browse all components (4)
              </a>
            </div>
          </div>

          {/* Live 300x300 Silk Designs Card Stage */}
          <div className="lp-hero-stage">
            <div
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <SilkDesignsCard
                ref={heroCardRef}
                {...heroConfig}
                showControls={false}
                cardOnly
              />
            </div>

            <div className="lp-stage-hint">
              <span>
                Move pointer over the card to steer the 3D light and perspective
                tilt
              </span>
              <div className="lp-stage-quick-actions">
                <button
                  type="button"
                  className="lp-mini-btn"
                  onClick={() => heroCardRef.current?.replayCountUp()}
                >
                  Replay count-up
                </button>
                <button
                  type="button"
                  className="lp-mini-btn"
                  onClick={() =>
                    setHeroConfig((prev) => ({ ...prev, paused: !prev.paused }))
                  }
                >
                  {heroConfig.paused ? "Resume" : "Pause"}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* INTERACTIVE COMPONENT CATALOG */}
        <section id="catalog" aria-label="Interactive component catalog">
          <div className="lp-section-header">
            <div>
              <h2 className="lp-section-title">Interactive Component Catalog</h2>
              <p className="lp-section-subtitle">
                Every preview below is a live canvas. Interact directly on the
                card or open its dedicated studio inspector.
              </p>
            </div>

            <div className="lp-filter-controls">
              <div className="lp-tabs" role="tablist" aria-label="Filter by type">
                {(
                  [
                    { id: "all", label: "All (4)" },
                    { id: "shader", label: "WebGL Shaders" },
                    { id: "button", label: "Interactive Buttons" },
                  ] as const
                ).map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={categoryFilter === tab.id}
                    className="lp-tab-btn"
                    data-active={categoryFilter === tab.id}
                    onClick={() => setCategoryFilter(tab.id)}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <input
                type="search"
                className="lp-search-input"
                placeholder="Filter components..."
                aria-label="Filter components by name or description"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {visibleCount === 0 ? (
            <div
              style={{
                marginTop: 24,
                padding: "40px 24px",
                borderRadius: 12,
                backgroundColor: "#13151c",
                border: "1px solid #232632",
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 12,
              }}
            >
              <p style={{ margin: 0, fontSize: 14.5, color: "#d0d3de" }}>
                No components match &ldquo;{searchQuery}&rdquo; in this category.
              </p>
              <button
                type="button"
                className="lp-btn-secondary"
                onClick={() => {
                  setSearchQuery("");
                  setCategoryFilter("all");
                }}
              >
                Show all components
              </button>
            </div>
          ) : (
            <div className="catalog-grid" style={{ marginTop: 24 }}>
              {/* 1. SILK DESIGNS CARD */}
              {showSilkCard && (
                <article className="catalog-card">
                  <div className="lp-stage-preview">
                    <SilkDesignsCard showControls={false} cardOnly />
                  </div>

                  <div className="lp-card-body">
                    <div>
                      <div className="lp-card-top">
                        <Link
                          href="/playground/silk-designs-card"
                          className="lp-card-title"
                        >
                          Silk Designs Card
                        </Link>
                        <span className="lp-card-tag">WebGL Fragment + SVG</span>
                      </div>
                      <p className="lp-card-desc">
                        300×300 square card with domain-warped fBm 3D silk folds,
                        pointer-tracked specular &amp; rim lighting, curved SVG
                        cream tab, and 3D perspective tilt.
                      </p>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 12,
                      }}
                    >
                      <p className="lp-card-hint">
                        Try it: Hover and glide across the card to tilt and move
                        the light source.
                      </p>
                      <div className="lp-card-actions">
                        <Link
                          href="/playground/silk-designs-card"
                          className="lp-btn-primary"
                          style={{ height: 32, fontSize: 12.5 }}
                        >
                          Open playground
                        </Link>
                        <button
                          type="button"
                          className="lp-btn-secondary"
                          style={{ height: 32, fontSize: 12.5 }}
                          onClick={() =>
                            handleCopySnippet(
                              buildSilkDesignsUsageSnippet(
                                DEFAULT_SILK_DESIGNS_CONFIG
                              ),
                              "card-silk",
                              "Silk Designs Card"
                            )
                          }
                        >
                          {copiedId === "card-silk" ? "Copied JSX!" : "Copy JSX"}
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              )}

              {/* 2. PAPER BURN BUTTON */}
              {showPaperBurn && (
                <article className="catalog-card">
                  <div className="lp-stage-preview">
                    <PaperBurn size="md" />
                  </div>

                  <div className="lp-card-body">
                    <div>
                      <div className="lp-card-top">
                        <Link
                          href="/playground/paper-burn"
                          className="lp-card-title"
                        >
                          Paper Burn Button
                        </Link>
                        <span className="lp-card-tag">
                          WebGL Combustion + Ashes
                        </span>
                      </div>
                      <p className="lp-card-desc">
                        Press-and-hold button that ignites from your pointer
                        with glowing embers, charred carbon edges, random flying
                        ashes, and a built-in Restore action.
                      </p>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 12,
                      }}
                    >
                      <p className="lp-card-hint">
                        Try it: Press and hold the button above until it burns
                        to drifting ash.
                      </p>
                      <div className="lp-card-actions">
                        <Link
                          href="/playground/paper-burn"
                          className="lp-btn-primary"
                          style={{ height: 32, fontSize: 12.5 }}
                        >
                          Open playground
                        </Link>
                        <button
                          type="button"
                          className="lp-btn-secondary"
                          style={{ height: 32, fontSize: 12.5 }}
                          onClick={() =>
                            handleCopySnippet(
                              PAPER_BURN_SNIPPET,
                              "card-burn",
                              "Paper Burn"
                            )
                          }
                        >
                          {copiedId === "card-burn" ? "Copied JSX!" : "Copy JSX"}
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              )}

              {/* 3. PIXEL PROMPT BUTTON */}
              {showPixelPrompt && (
                <article className="catalog-card">
                  <div className="lp-stage-preview">
                    <PixelPromptButton size="md" />
                  </div>

                  <div className="lp-card-body">
                    <div>
                      <div className="lp-card-top">
                        <Link
                          href="/playground/pixel-prompt-button"
                          className="lp-card-title"
                        >
                          Pixel Prompt Button
                        </Link>
                        <span className="lp-card-tag">
                          Interactive SVG Mosaic
                        </span>
                      </div>
                      <p className="lp-card-desc">
                        Animated SVG pixel mosaic pill with cursor-reactive
                        color ripples, customizable grid density, and one-click
                        Figma vector SVG copy.
                      </p>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 12,
                      }}
                    >
                      <p className="lp-card-hint">
                        Try it: Sweep your cursor across the pixel cap to ripple
                        the mosaic tiles.
                      </p>
                      <div className="lp-card-actions">
                        <Link
                          href="/playground/pixel-prompt-button"
                          className="lp-btn-primary"
                          style={{ height: 32, fontSize: 12.5 }}
                        >
                          Open playground
                        </Link>
                        <button
                          type="button"
                          className="lp-btn-secondary"
                          style={{ height: 32, fontSize: 12.5 }}
                          onClick={() =>
                            handleCopySnippet(
                              PIXEL_SNIPPET,
                              "card-pixel",
                              "Pixel Prompt Button"
                            )
                          }
                        >
                          {copiedId === "card-pixel"
                            ? "Copied JSX!"
                            : "Copy JSX"}
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              )}

              {/* 4. HEAT DISTORTION */}
              {showHeatDistortion && (
                <article className="catalog-card">
                  <div className="lp-stage-preview">
                    <div
                      style={{
                        width: 224,
                        height: 224,
                        borderRadius: 10,
                        overflow: "hidden",
                        border: "1px solid #24242b",
                      }}
                    >
                      <HeatDistortion resolution={512} />
                    </div>
                  </div>

                  <div className="lp-card-body">
                    <div>
                      <div className="lp-card-top">
                        <Link
                          href="/playground/heat-distortion"
                          className="lp-card-title"
                        >
                          Heat Distortion Studio
                        </Link>
                        <span className="lp-card-tag">
                          WebGL Refraction Shader
                        </span>
                      </div>
                      <p className="lp-card-desc">
                        Real-time WebGL thermal shimmer and chromatic aberration
                        shader for custom typography or uploaded images with PNG
                        export for Figma.
                      </p>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 12,
                      }}
                    >
                      <p className="lp-card-hint">
                        Try it: Drag across the square canvas to inject thermal
                        turbulence waves.
                      </p>
                      <div className="lp-card-actions">
                        <Link
                          href="/playground/heat-distortion"
                          className="lp-btn-primary"
                          style={{ height: 32, fontSize: 12.5 }}
                        >
                          Open playground
                        </Link>
                        <button
                          type="button"
                          className="lp-btn-secondary"
                          style={{ height: 32, fontSize: 12.5 }}
                          onClick={() =>
                            handleCopySnippet(
                              HEAT_SNIPPET,
                              "card-heat",
                              "Heat Distortion"
                            )
                          }
                        >
                          {copiedId === "card-heat" ? "Copied JSX!" : "Copy JSX"}
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              )}
            </div>
          )}
        </section>

        {/* WORKFLOW STRIP: How to go from Playground to Production & Figma */}
        <section aria-label="How the studio workflow works">
          <div className="lp-workflow">
            <div className="lp-workflow-item">
              <h3 className="lp-workflow-title">
                Tune parameters in real time
              </h3>
              <p className="lp-workflow-desc">
                Every playground shares a unified inspector with presets,
                backdrop switchers, range sliders, and section resets so you can
                dial in exact shader physics and colors.
              </p>
            </div>

            <div className="lp-workflow-item">
              <h3 className="lp-workflow-title">
                Copy self-contained React TSX
              </h3>
              <p className="lp-workflow-desc">
                Grab either the configured usage JSX snippet or the complete,
                zero-dependency component TSX source file ready to drop into any
                Next.js or React app.
              </p>
            </div>

            <div className="lp-workflow-item">
              <h3 className="lp-workflow-title">
                Export vectors &amp; frames to Figma
              </h3>
              <p className="lp-workflow-desc">
                Copy crisp SVG vectors or high-resolution WebGL PNG snapshots
                straight to your clipboard and press Ctrl+V on your Figma canvas.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
