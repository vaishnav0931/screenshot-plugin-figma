"use client";

import React from "react";
import { Sparkles, RotateCcw } from "lucide-react";
import { useButtonStore } from "@/src/store/useButtonStore";
import {
  CollapsibleSection,
  PropertyRow,
  NumberSliderInput,
} from "@/src/components/PropertyControls/PropertyControls";
import { ColorPicker } from "@/src/components/ColorPicker/ColorPicker";
import { FONT_FAMILY_OPTIONS } from "@/src/utils/presets";

export function TokensPanel() {
  const {
    tokens,
    updateTokenColor,
    updateTokenSpacing,
    updateTokenTypography,
    updateTokenShape,
    applyTokensToActive,
    resetTokens,
  } = useButtonStore();

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {/* Top Action Bar */}
      <div
        style={{
          padding: "10px 12px",
          borderBottom: "1px solid var(--bs-border)",
          display: "flex",
          flexDirection: "column",
          gap: 8,
          background: "var(--bs-surface-muted)",
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
            <div style={{ fontSize: 12, fontWeight: 600, color: "var(--bs-text)" }}>
              Design System Tokens
            </div>
            <div style={{ fontSize: 10.5, color: "var(--bs-text-subtle)" }}>
              Global tokens reusable across button variants
            </div>
          </div>
          <button
            type="button"
            className="bs-btn"
            style={{ height: 24, fontSize: 11, padding: "0 7px" }}
            onClick={() => resetTokens()}
            title="Reset tokens to default"
          >
            <RotateCcw size={11} />
          </button>
        </div>

        <button
          type="button"
          className="bs-btn bs-btn-primary"
          style={{ width: "100%", height: 28, fontSize: 11.5 }}
          onClick={() => applyTokensToActive()}
        >
          <Sparkles size={12} />
          Apply Tokens to Active Button
        </button>
      </div>

      {/* Color Tokens */}
      <CollapsibleSection title="Color Tokens">
        <PropertyRow label="Primary">
          <ColorPicker
            value={tokens.colors.primary}
            onChange={(val) => updateTokenColor("primary", val)}
          />
        </PropertyRow>
        <PropertyRow label="Secondary">
          <ColorPicker
            value={tokens.colors.secondary}
            onChange={(val) => updateTokenColor("secondary", val)}
          />
        </PropertyRow>
        <PropertyRow label="Neutral">
          <ColorPicker
            value={tokens.colors.neutral}
            onChange={(val) => updateTokenColor("neutral", val)}
          />
        </PropertyRow>
        <PropertyRow label="Success">
          <ColorPicker
            value={tokens.colors.success}
            onChange={(val) => updateTokenColor("success", val)}
          />
        </PropertyRow>
        <PropertyRow label="Warning">
          <ColorPicker
            value={tokens.colors.warning}
            onChange={(val) => updateTokenColor("warning", val)}
          />
        </PropertyRow>
        <PropertyRow label="Danger">
          <ColorPicker
            value={tokens.colors.danger}
            onChange={(val) => updateTokenColor("danger", val)}
          />
        </PropertyRow>
      </CollapsibleSection>

      {/* Spacing Tokens */}
      <CollapsibleSection title="Spacing Tokens">
        <PropertyRow label="Padding X">
          <NumberSliderInput
            value={tokens.spacing.paddingX}
            onChange={(val) => updateTokenSpacing({ paddingX: val })}
            min={0}
            max={48}
          />
        </PropertyRow>
        <PropertyRow label="Padding Y">
          <NumberSliderInput
            value={tokens.spacing.paddingY}
            onChange={(val) => updateTokenSpacing({ paddingY: val })}
            min={0}
            max={32}
          />
        </PropertyRow>
        <PropertyRow label="Icon Gap">
          <NumberSliderInput
            value={tokens.spacing.iconGap}
            onChange={(val) => updateTokenSpacing({ iconGap: val })}
            min={0}
            max={24}
          />
        </PropertyRow>
      </CollapsibleSection>

      {/* Typography Tokens */}
      <CollapsibleSection title="Typography Tokens">
        <PropertyRow label="Font Family">
          <select
            className="bs-select"
            value={tokens.typography.fontFamily}
            onChange={(e) =>
              updateTokenTypography({ fontFamily: e.target.value })
            }
          >
            {FONT_FAMILY_OPTIONS.map((f) => (
              <option key={f.label} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>
        </PropertyRow>
        <PropertyRow label="Font Size">
          <NumberSliderInput
            value={tokens.typography.fontSize}
            onChange={(val) => updateTokenTypography({ fontSize: val })}
            min={10}
            max={28}
          />
        </PropertyRow>
        <PropertyRow label="Font Weight">
          <select
            className="bs-select"
            value={tokens.typography.fontWeight}
            onChange={(e) =>
              updateTokenTypography({
                fontWeight: Number(e.target.value) as 400 | 500 | 600 | 700,
              })
            }
          >
            <option value={400}>Regular (400)</option>
            <option value={500}>Medium (500)</option>
            <option value={600}>Semibold (600)</option>
            <option value={700}>Bold (700)</option>
          </select>
        </PropertyRow>
      </CollapsibleSection>

      {/* Shape Tokens */}
      <CollapsibleSection title="Shape Tokens">
        <PropertyRow label="Border Radius">
          <NumberSliderInput
            value={tokens.shape.borderRadius}
            onChange={(val) => updateTokenShape({ borderRadius: val })}
            min={0}
            max={999}
          />
        </PropertyRow>
        <PropertyRow label="Border Width">
          <NumberSliderInput
            value={tokens.shape.borderWidth}
            onChange={(val) => updateTokenShape({ borderWidth: val })}
            min={0}
            max={8}
          />
        </PropertyRow>
      </CollapsibleSection>
    </div>
  );
}
