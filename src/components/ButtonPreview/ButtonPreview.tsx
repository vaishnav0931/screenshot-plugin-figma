"use client";

import React, { useState } from "react";
import { useButtonStore } from "@/src/store/useButtonStore";
import { ButtonRenderer } from "@/src/components/ButtonRenderer/ButtonRenderer";
import { INTERACTION_STATES_LIST } from "@/src/features/button-states/stateConfig";
import {
  MATRIX_APPEARANCES,
  MATRIX_SIZES,
  MATRIX_STATES,
  deriveMatrixVariantButton,
} from "@/src/features/button-variants/variantMatrix";
import {
  ButtonAppearance,
  ButtonInteractionState,
  ButtonSizePreset,
} from "@/src/types/button";

export function ButtonPreview() {
  const {
    activeButton,
    previewState,
    interactivePreview,
    canvasBg,
    zoom,
    viewMode,
    variants,
    setPreviewState,
    setInteractivePreview,
    loadVariantIntoEditor,
  } = useButtonStore();

  const [matrixStateFilter, setMatrixStateFilter] =
    useState<ButtonInteractionState>("default");
  const [matrixAppearances, setMatrixAppearances] = useState<
    Array<Exclude<ButtonAppearance, "custom">>
  >([...MATRIX_APPEARANCES]);
  const [matrixSizes, setMatrixSizes] = useState<
    Array<Exclude<ButtonSizePreset, "custom">>
  >([...MATRIX_SIZES]);

  const canvasClass =
    canvasBg === "dark"
      ? "bs-canvas-dark"
      : canvasBg === "checkerboard"
      ? "bs-canvas-checkerboard"
      : canvasBg === "neutral"
      ? "bs-canvas-neutral"
      : "bs-canvas-light";

  const isDarkCanvas = canvasBg === "dark";
  const scale = zoom > 5 ? zoom / 100 : zoom;

  const toggleMatrixAppearance = (app: Exclude<ButtonAppearance, "custom">) => {
    setMatrixAppearances((prev) =>
      prev.includes(app)
        ? prev.length > 1
          ? prev.filter((item) => item !== app)
          : prev
        : [...prev, app]
    );
  };

  const toggleMatrixSize = (sz: Exclude<ButtonSizePreset, "custom">) => {
    setMatrixSizes((prev) =>
      prev.includes(sz)
        ? prev.length > 1
          ? prev.filter((item) => item !== sz)
          : prev
        : [...prev, sz]
    );
  };

  const comparedVariants = variants.filter((v) => v.showInComparison);

  return (
    <div
      className={canvasClass}
      style={{
        flex: 1,
        position: "relative",
        overflow: "auto",
        display: "flex",
        flexDirection: "column",
        transition: "background-color 180ms ease",
      }}
    >
      {/* Top Floating Telemetry Pill */}
      <div
        style={{
          padding: "12px 18px 0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          flexWrap: "wrap",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "5px 10px",
            borderRadius: 999,
            background: isDarkCanvas
              ? "rgba(30, 41, 59, 0.85)"
              : "rgba(255, 255, 255, 0.9)",
            border: isDarkCanvas
              ? "1px solid rgba(148, 163, 184, 0.2)"
              : "1px solid var(--bs-border)",
            boxShadow: "var(--bs-shadow-sm)",
            fontSize: 11,
            color: isDarkCanvas ? "#E2E8F0" : "var(--bs-text-muted)",
            pointerEvents: "auto",
          }}
        >
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: 99,
              background: interactivePreview ? "#16A34A" : "#2563EB",
            }}
          />
          <strong style={{ color: isDarkCanvas ? "#FFFFFF" : "var(--bs-text)" }}>
            {activeButton.name}
          </strong>
          <span>•</span>
          <span className="bs-mono">
            {activeButton.dimensions.widthMode === "fixed"
              ? `${activeButton.dimensions.width}px`
              : activeButton.dimensions.widthMode === "full"
              ? "100%"
              : "Hug"}{" "}
            × {activeButton.dimensions.height}px
          </span>
          <span>•</span>
          <span className="bs-mono">
            Pad {activeButton.dimensions.paddingX}×
            {activeButton.dimensions.paddingY}
          </span>
          <span>•</span>
          <span className="bs-mono">
            Radius{" "}
            {activeButton.shape.useIndividualRadius
              ? `${activeButton.shape.corners.topLeft}/${activeButton.shape.corners.topRight}/${activeButton.shape.corners.bottomRight}/${activeButton.shape.corners.bottomLeft}`
              : `${activeButton.shape.borderRadius}px`}
          </span>
        </div>

        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "4px 10px",
            borderRadius: 999,
            background: isDarkCanvas
              ? "rgba(30, 41, 59, 0.85)"
              : "rgba(255, 255, 255, 0.9)",
            border: isDarkCanvas
              ? "1px solid rgba(148, 163, 184, 0.2)"
              : "1px solid var(--bs-border)",
            fontSize: 11,
            color: isDarkCanvas ? "#CBD5E1" : "var(--bs-text-muted)",
            pointerEvents: "auto",
          }}
        >
          <span>
            Mode:{" "}
            <strong style={{ color: isDarkCanvas ? "#FFFFFF" : "var(--bs-text)" }}>
              {interactivePreview
                ? "Live Pointer Interaction"
                : `Locked State (${previewState.toUpperCase()})`}
            </strong>
          </span>
        </div>
      </div>

      {/* Main Canvas Stage */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 32,
          minHeight: 360,
        }}
      >
        {/* 1. SINGLE BUTTON LIVE PREVIEW */}
        {viewMode === "single" && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 28,
              width:
                activeButton.dimensions.widthMode === "full"
                  ? "min(560px, 90%)"
                  : "auto",
            }}
          >
            <div
              style={{
                transform: `scale(${scale})`,
                transformOrigin: "center center",
                transition: "transform 140ms ease",
                width:
                  activeButton.dimensions.widthMode === "full"
                    ? "100%"
                    : "auto",
                display: "flex",
                justifyContent: "center",
                padding: 24,
              }}
            >
              <ButtonRenderer
                button={activeButton}
                forcedState={previewState}
                interactive={interactivePreview}
              />
            </div>

            {/* Quick State Strip under Single Preview */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "6px 10px",
                borderRadius: 10,
                background: isDarkCanvas
                  ? "rgba(15, 23, 42, 0.78)"
                  : "rgba(255, 255, 255, 0.92)",
                border: isDarkCanvas
                  ? "1px solid rgba(148, 163, 184, 0.2)"
                  : "1px solid var(--bs-border)",
                boxShadow: "var(--bs-shadow-sm)",
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              <span
                style={{
                  fontSize: 10.5,
                  fontWeight: 600,
                  color: isDarkCanvas ? "#94A3B8" : "var(--bs-text-subtle)",
                  padding: "0 4px",
                }}
              >
                Quick State:
              </span>
              {INTERACTION_STATES_LIST.map((st) => {
                const active = !interactivePreview && previewState === st.id;
                return (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => {
                      setInteractivePreview(false);
                      setPreviewState(st.id);
                    }}
                    style={{
                      height: 24,
                      padding: "0 9px",
                      borderRadius: 6,
                      fontSize: 11,
                      fontWeight: active ? 600 : 500,
                      border: active
                        ? "1px solid var(--bs-accent)"
                        : "1px solid transparent",
                      background: active ? "var(--bs-accent)" : "transparent",
                      color: active
                        ? "#FFFFFF"
                        : isDarkCanvas
                        ? "#CBD5E1"
                        : "var(--bs-text-muted)",
                      cursor: "pointer",
                    }}
                  >
                    {st.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 2. ALL STATES GRID PREVIEW */}
        {viewMode === "all-states" && (
          <div
            style={{
              width: "100%",
              maxWidth: 920,
              transform: `scale(${Math.min(scale, 1.35)})`,
              transformOrigin: "top center",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: 16,
              }}
            >
              {INTERACTION_STATES_LIST.map((st) => {
                const isSelected = previewState === st.id;
                return (
                  <div
                    key={st.id}
                    onClick={() => {
                      setInteractivePreview(false);
                      setPreviewState(st.id);
                    }}
                    style={{
                      padding: "16px 18px",
                      borderRadius: 10,
                      background: isDarkCanvas
                        ? "rgba(30, 41, 59, 0.75)"
                        : "rgba(255, 255, 255, 0.92)",
                      border: isSelected
                        ? "1.5px solid var(--bs-accent)"
                        : isDarkCanvas
                        ? "1px solid rgba(148, 163, 184, 0.2)"
                        : "1px solid var(--bs-border)",
                      boxShadow: "var(--bs-shadow-sm)",
                      display: "flex",
                      flexDirection: "column",
                      gap: 16,
                      cursor: "pointer",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <div>
                        <div
                          style={{
                            fontSize: 12,
                            fontWeight: 600,
                            color: isDarkCanvas ? "#F8FAFC" : "var(--bs-text)",
                          }}
                        >
                          {st.label}
                        </div>
                        <div
                          style={{
                            fontSize: 10.5,
                            color: isDarkCanvas
                              ? "#94A3B8"
                              : "var(--bs-text-subtle)",
                          }}
                        >
                          {st.description}
                        </div>
                      </div>
                      <span className="bs-badge">{st.id}</span>
                    </div>

                    <div
                      style={{
                        minHeight: 74,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: 12,
                        borderRadius: 8,
                        background: isDarkCanvas
                          ? "rgba(15, 23, 42, 0.55)"
                          : "var(--bs-surface-muted)",
                      }}
                    >
                      <ButtonRenderer
                        button={activeButton}
                        forcedState={st.id}
                        interactive={false}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 3. ALL VARIANTS PREVIEW */}
        {viewMode === "all-variants" && (
          <div
            style={{
              width: "100%",
              maxWidth: 980,
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                gap: 14,
              }}
            >
              {(comparedVariants.length > 0 ? comparedVariants : variants).map(
                (v) => (
                  <div
                    key={v.id}
                    style={{
                      padding: 16,
                      borderRadius: 10,
                      background: isDarkCanvas
                        ? "rgba(30, 41, 59, 0.78)"
                        : "rgba(255, 255, 255, 0.94)",
                      border: isDarkCanvas
                        ? "1px solid rgba(148, 163, 184, 0.2)"
                        : "1px solid var(--bs-border)",
                      boxShadow: "var(--bs-shadow-sm)",
                      display: "flex",
                      flexDirection: "column",
                      gap: 14,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 8,
                      }}
                    >
                      <div>
                        <div
                          style={{
                            fontSize: 12,
                            fontWeight: 600,
                            color: isDarkCanvas ? "#F8FAFC" : "var(--bs-text)",
                          }}
                        >
                          {v.name}
                        </div>
                        <div
                          style={{
                            display: "flex",
                            gap: 4,
                            marginTop: 3,
                          }}
                        >
                          <span className="bs-badge">{v.appearance}</span>
                          <span className="bs-badge">
                            {v.size.toUpperCase()}
                          </span>
                          <span className="bs-badge">{v.previewState}</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        className="bs-btn"
                        style={{ height: 24, fontSize: 11, padding: "0 8px" }}
                        onClick={() => loadVariantIntoEditor(v.id)}
                      >
                        Edit
                      </button>
                    </div>

                    <div
                      style={{
                        minHeight: 76,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: 12,
                        borderRadius: 8,
                        background: isDarkCanvas
                          ? "rgba(15, 23, 42, 0.55)"
                          : "var(--bs-surface-muted)",
                      }}
                    >
                      <ButtonRenderer
                        button={v.definition}
                        forcedState={
                          interactivePreview ? undefined : v.previewState
                        }
                        interactive={interactivePreview}
                      />
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        )}

        {/* 4. VARIANT COMPARISON MATRIX (Appearance × Size × State) */}
        {viewMode === "comparison" && (
          <div
            style={{
              width: "100%",
              maxWidth: 1040,
              display: "flex",
              flexDirection: "column",
              gap: 14,
            }}
          >
            {/* Matrix Dimension Filter Bar */}
            <div
              style={{
                padding: "10px 14px",
                borderRadius: 10,
                background: isDarkCanvas
                  ? "rgba(30, 41, 59, 0.85)"
                  : "rgba(255, 255, 255, 0.95)",
                border: isDarkCanvas
                  ? "1px solid rgba(148, 163, 184, 0.2)"
                  : "1px solid var(--bs-border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 12,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  flexWrap: "wrap",
                }}
              >
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: isDarkCanvas ? "#CBD5E1" : "var(--bs-text-muted)",
                  }}
                >
                  Appearances:
                </span>
                {(
                  [
                    "primary",
                    "secondary",
                    "tertiary",
                    "outline",
                    "ghost",
                    "destructive",
                  ] as Array<Exclude<ButtonAppearance, "custom">>
                ).map((app) => {
                  const active = matrixAppearances.includes(app);
                  return (
                    <button
                      key={app}
                      type="button"
                      className={`bs-btn ${active ? "bs-btn-primary" : ""}`}
                      style={{ height: 23, fontSize: 11, padding: "0 8px" }}
                      onClick={() => toggleMatrixAppearance(app)}
                    >
                      {app}
                    </button>
                  );
                })}
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: isDarkCanvas ? "#CBD5E1" : "var(--bs-text-muted)",
                  }}
                >
                  Sizes:
                </span>
                {(
                  ["xs", "sm", "md", "lg", "xl"] as Array<
                    Exclude<ButtonSizePreset, "custom">
                  >
                ).map((sz) => {
                  const active = matrixSizes.includes(sz);
                  return (
                    <button
                      key={sz}
                      type="button"
                      className={`bs-btn ${active ? "bs-btn-primary" : ""}`}
                      style={{ height: 23, fontSize: 11, padding: "0 7px" }}
                      onClick={() => toggleMatrixSize(sz)}
                    >
                      {sz.toUpperCase()}
                    </button>
                  );
                })}
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: isDarkCanvas ? "#CBD5E1" : "var(--bs-text-muted)",
                  }}
                >
                  State:
                </span>
                {MATRIX_STATES.map((st) => (
                  <button
                    key={st}
                    type="button"
                    className={`bs-btn ${
                      matrixStateFilter === st ? "bs-btn-primary" : ""
                    }`}
                    style={{ height: 23, fontSize: 11, padding: "0 8px" }}
                    onClick={() => setMatrixStateFilter(st)}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Matrix Table */}
            <div
              style={{
                borderRadius: 10,
                background: isDarkCanvas
                  ? "rgba(30, 41, 59, 0.78)"
                  : "rgba(255, 255, 255, 0.94)",
                border: isDarkCanvas
                  ? "1px solid rgba(148, 163, 184, 0.2)"
                  : "1px solid var(--bs-border)",
                overflow: "auto",
                boxShadow: "var(--bs-shadow-sm)",
              }}
            >
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  textAlign: "left",
                }}
              >
                <thead>
                  <tr
                    style={{
                      borderBottom: isDarkCanvas
                        ? "1px solid rgba(148, 163, 184, 0.2)"
                        : "1px solid var(--bs-border)",
                    }}
                  >
                    <th
                      style={{
                        padding: "10px 14px",
                        fontSize: 11,
                        fontWeight: 600,
                        color: isDarkCanvas
                          ? "#94A3B8"
                          : "var(--bs-text-subtle)",
                        textTransform: "uppercase",
                      }}
                    >
                      Appearance \ Size ({matrixStateFilter})
                    </th>
                    {matrixSizes.map((sz) => (
                      <th
                        key={sz}
                        style={{
                          padding: "10px 14px",
                          fontSize: 11,
                          fontWeight: 600,
                          color: isDarkCanvas
                            ? "#94A3B8"
                            : "var(--bs-text-subtle)",
                          textTransform: "uppercase",
                          textAlign: "center",
                        }}
                      >
                        {sz.toUpperCase()}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {matrixAppearances.map((app) => (
                    <tr
                      key={app}
                      style={{
                        borderBottom: isDarkCanvas
                          ? "1px solid rgba(148, 163, 184, 0.12)"
                          : "1px solid var(--bs-border)",
                      }}
                    >
                      <td
                        style={{
                          padding: "14px",
                          fontSize: 12,
                          fontWeight: 600,
                          color: isDarkCanvas ? "#F8FAFC" : "var(--bs-text)",
                          textTransform: "capitalize",
                        }}
                      >
                        {app}
                      </td>
                      {matrixSizes.map((sz) => {
                        const cellButton = deriveMatrixVariantButton(
                          activeButton,
                          app,
                          sz
                        );
                        return (
                          <td
                            key={`${app}-${sz}`}
                            style={{
                              padding: "14px",
                              textAlign: "center",
                              verticalAlign: "middle",
                            }}
                          >
                            <div
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <ButtonRenderer
                                button={cellButton}
                                forcedState={matrixStateFilter}
                                interactive={false}
                              />
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
