"use client";

import * as React from "react";
import { useButtonStore } from "@/src/store/useButtonStore";

export function ColorPicker({
  value,
  onChange,
  allowTransparent = true,
  ariaLabel
}: {
  value: string;
  onChange: (hex: string) => void;
  allowTransparent?: boolean;
  ariaLabel?: string;
}) {
  const tokens = useButtonStore((s) => s.tokens);
  const isTransparent = value.trim().toLowerCase() === "transparent";
  const safeHex = /^#[0-9a-fA-F]{6}$/.test(value.trim())
    ? value.trim()
    : "#2563eb";

  const quickSwatches = [
    { name: "Primary", color: tokens.colors.primary },
    { name: "Secondary", color: tokens.colors.secondary },
    { name: "Neutral", color: tokens.colors.neutral },
    { name: "Success", color: tokens.colors.success },
    { name: "Warning", color: tokens.colors.warning },
    { name: "Danger", color: tokens.colors.danger },
    { name: "White", color: "#ffffff" }
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label
          style={{
            position: "relative",
            width: 26,
            height: 26,
            borderRadius: 5,
            borderWidth: 1,
            borderStyle: "solid",
            borderColor: "#cbd5e1",
            overflow: "hidden",
            flexShrink: 0,
            cursor: "pointer",
            backgroundColor: isTransparent ? "#ffffff" : safeHex,
            backgroundImage: isTransparent
              ? "linear-gradient(45deg, #cbd5e1 25%, transparent 25%), linear-gradient(-45deg, #cbd5e1 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #cbd5e1 75%), linear-gradient(-45deg, transparent 75%, #cbd5e1 75%)"
              : "none",
            backgroundSize: "8px 8px"
          }}
          title="Pick color"
        >
          <input
            type="color"
            value={safeHex}
            aria-label={ariaLabel ? `${ariaLabel} color swatch` : "Color swatch"}
            onChange={(e) => onChange(e.target.value)}
            style={{
              position: "absolute",
              inset: 0,
              opacity: 0,
              width: "100%",
              height: "100%",
              cursor: "pointer"
            }}
          />
        </label>

        <input
          type="text"
          value={value}
          aria-label={ariaLabel ? `${ariaLabel} hex` : "Hex color"}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#2563eb"
          className="bs-input"
          style={{
            height: 26,
            fontFamily: "var(--bs-font-mono)",
            fontSize: 11.5
          }}
        />

        {allowTransparent && (
          <button
            type="button"
            onClick={() =>
              onChange(isTransparent ? tokens.colors.primary : "transparent")
            }
            title="Toggle transparent"
            style={{
              height: 26,
              padding: "0 7px",
              borderRadius: 5,
              borderWidth: 1,
              borderStyle: "solid",
              borderColor: isTransparent ? "#2563eb" : "#e2e8f0",
              backgroundColor: isTransparent ? "#eff6ff" : "#f8fafc",
              color: isTransparent ? "#2563eb" : "#64748b",
              fontSize: 10.5,
              fontWeight: 500,
              cursor: "pointer"
            }}
          >
            Clear
          </button>
        )}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        {quickSwatches.map((sw) => (
          <button
            key={sw.name}
            type="button"
            title={`${sw.name}: ${sw.color}`}
            onClick={() => onChange(sw.color)}
            style={{
              width: 15,
              height: 15,
              borderRadius: 3,
              padding: 0,
              borderWidth: 1,
              borderStyle: "solid",
              borderColor:
                value.toLowerCase() === sw.color.toLowerCase()
                  ? "#2563eb"
                  : "#cbd5e1",
              backgroundColor: sw.color,
              cursor: "pointer"
            }}
          />
        ))}
      </div>
    </div>
  );
}
