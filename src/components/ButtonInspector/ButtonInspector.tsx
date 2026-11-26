"use client";

import React from "react";
import {
  Sliders,
  Layers,
  Palette,
  AlignLeft,
  AlignCenter,
  AlignRight,
  CornerUpLeft,
} from "lucide-react";
import { useButtonStore } from "@/src/store/useButtonStore";
import {
  CollapsibleSection,
  PropertyRow,
  NumberSliderInput,
  SegmentedControl,
} from "@/src/components/PropertyControls/PropertyControls";
import { ColorPicker } from "@/src/components/ColorPicker/ColorPicker";
import { IconPicker } from "@/src/components/IconPicker/IconPicker";
import { VariantManager } from "@/src/components/VariantManager/VariantManager";
import { TokensPanel } from "@/src/features/button-tokens/TokensPanel";
import {
  ButtonAppearance,
  ButtonBorderStyle,
  ButtonTypeKind,
  ButtonFontWeight,
  ButtonIconPosition,
  ButtonRadiusPreset,
  ButtonShadowPreset,
  ButtonSizePreset,
  ButtonTextAlign,
  ButtonTextTransform,
  ButtonWidthMode,
} from "@/src/types/button";
import { FONT_FAMILY_OPTIONS } from "@/src/utils/presets";
import { INTERACTION_STATES_LIST } from "@/src/features/button-states/stateConfig";

export function ButtonInspector() {
  const {
    activeButton,
    rightTab,
    setRightTab,
    previewState,
    setPreviewState,
    inspectorStateTab,
    setInspectorStateTab,
    setInteractivePreview,
    selectAppearancePreset,
    selectButtonType,
    selectSizePreset,
    selectRadiusPreset,
    selectShadowPreset,
    updateContent,
    updateAppearance,
    updateDimensions,
    updateTypography,
    updateShape,
    updateEffects,
    updateStateOverride,
    setTransitionDuration,
  } = useButtonStore();

  const currentStateOverride = activeButton.states[inspectorStateTab];

  return (
    <aside className="bs-sidebar-right">
      {/* Top Inspector Switcher: Inspector | Variants | Tokens */}
      <div
        style={{
          padding: "10px 12px",
          borderBottom: "1px solid var(--bs-border)",
          background: "var(--bs-surface)",
        }}
      >
        <div className="bs-segmented">
          <button
            type="button"
            className={`bs-segmented-btn ${
              rightTab === "inspector" ? "active" : ""
            }`}
            onClick={() => setRightTab("inspector")}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 5,
            }}
          >
            <Sliders size={12} />
            Inspector
          </button>
          <button
            type="button"
            className={`bs-segmented-btn ${
              rightTab === "variants" ? "active" : ""
            }`}
            onClick={() => setRightTab("variants")}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 5,
            }}
          >
            <Layers size={12} />
            Variants
          </button>
          <button
            type="button"
            className={`bs-segmented-btn ${
              rightTab === "tokens" ? "active" : ""
            }`}
            onClick={() => setRightTab("tokens")}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 5,
            }}
          >
            <Palette size={12} />
            Tokens
          </button>
        </div>
      </div>

      {/* Scrollable Inspector Content */}
      <div className="bs-scroll" style={{ flex: 1 }}>
        {rightTab === "variants" && <VariantManager />}
        {rightTab === "tokens" && <TokensPanel />}

        {rightTab === "inspector" && (
          <div>
            {/* SECTION 4: BUTTON CONTENT PROPERTIES */}
            <CollapsibleSection
              title="Content"
              badge={activeButton.content.buttonType}
            >
              <PropertyRow label="Button Type">
                <select
                  className="bs-select"
                  value={activeButton.content.buttonType}
                  onChange={(e) =>
                    selectButtonType(e.target.value as ButtonTypeKind)
                  }
                >
                  <option value="text">Text Button</option>
                  <option value="icon">Icon Button</option>
                  <option value="icon-text">Icon + Text Button</option>
                  <option value="loading">Loading Button</option>
                </select>
              </PropertyRow>

              <PropertyRow label="Label">
                <input
                  type="text"
                  className="bs-input"
                  value={activeButton.content.label}
                  onChange={(e) => updateContent({ label: e.target.value })}
                  placeholder="Button label..."
                />
              </PropertyRow>

              <PropertyRow label="Show Icon">
                <SegmentedControl
                  value={activeButton.content.showIcon ? "show" : "hide"}
                  onChange={(v) => updateContent({ showIcon: v === "show" })}
                  options={[
                    { value: "show", label: "Visible" },
                    { value: "hide", label: "Hidden" },
                  ]}
                />
              </PropertyRow>

              {activeButton.content.showIcon && (
                <>
                  <PropertyRow label="Icon Position">
                    <SegmentedControl<ButtonIconPosition>
                      value={activeButton.content.iconPosition}
                      onChange={(pos) => updateContent({ iconPosition: pos })}
                      options={[
                        { value: "leading", label: "Left" },
                        { value: "trailing", label: "Right" },
                        { value: "both", label: "Both" },
                        { value: "only", label: "Only" },
                      ]}
                    />
                  </PropertyRow>

                  {(activeButton.content.iconPosition === "leading" ||
                    activeButton.content.iconPosition === "both" ||
                    activeButton.content.iconPosition === "only") && (
                    <PropertyRow label="Leading Icon">
                      <IconPicker
                        value={activeButton.content.leadingIcon}
                        onChange={(icon) =>
                          updateContent({ leadingIcon: icon })
                        }
                      />
                    </PropertyRow>
                  )}

                  {(activeButton.content.iconPosition === "trailing" ||
                    activeButton.content.iconPosition === "both") && (
                    <PropertyRow label="Trailing Icon">
                      <IconPicker
                        value={activeButton.content.trailingIcon}
                        onChange={(icon) =>
                          updateContent({ trailingIcon: icon })
                        }
                      />
                    </PropertyRow>
                  )}

                  <PropertyRow label="Icon Size">
                    <NumberSliderInput
                      value={activeButton.content.iconSize}
                      onChange={(val) => updateContent({ iconSize: val })}
                      min={10}
                      max={32}
                    />
                  </PropertyRow>

                  <PropertyRow label="Icon Spacing">
                    <NumberSliderInput
                      value={activeButton.content.gap}
                      onChange={(val) => updateContent({ gap: val })}
                      min={0}
                      max={28}
                    />
                  </PropertyRow>
                </>
              )}

              <PropertyRow label="Alignment">
                <SegmentedControl<ButtonTextAlign>
                  value={activeButton.content.textAlign}
                  onChange={(align) => updateContent({ textAlign: align })}
                  options={[
                    { value: "left", label: <AlignLeft size={12} /> },
                    { value: "center", label: <AlignCenter size={12} /> },
                    { value: "right", label: <AlignRight size={12} /> },
                  ]}
                />
              </PropertyRow>
            </CollapsibleSection>

            {/* SECTION 5: APPEARANCE PROPERTIES */}
            <CollapsibleSection
              title="Appearance"
              badge={activeButton.appearance.variant}
            >
              <PropertyRow label="Variant">
                <select
                  className="bs-select"
                  value={activeButton.appearance.variant}
                  onChange={(e) => {
                    const val = e.target.value as ButtonAppearance;
                    if (val === "custom") {
                      updateAppearance({ variant: "custom" });
                    } else {
                      selectAppearancePreset(val);
                    }
                  }}
                >
                  <option value="primary">Primary</option>
                  <option value="secondary">Secondary</option>
                  <option value="tertiary">Tertiary</option>
                  <option value="outline">Outline</option>
                  <option value="ghost">Ghost</option>
                  <option value="destructive">Destructive</option>
                  <option value="link">Link</option>
                  <option value="custom">Custom</option>
                </select>
              </PropertyRow>

              <PropertyRow label="Background">
                <ColorPicker
                  value={activeButton.appearance.backgroundColor}
                  onChange={(color) =>
                    updateAppearance({
                      backgroundColor: color,
                      variant: "custom",
                    })
                  }
                  allowTransparent
                />
              </PropertyRow>

              <PropertyRow label="Text Color">
                <ColorPicker
                  value={activeButton.appearance.textColor}
                  onChange={(color) =>
                    updateAppearance({ textColor: color, variant: "custom" })
                  }
                  allowTransparent={false}
                />
              </PropertyRow>

              <PropertyRow label="Hover BG">
                <ColorPicker
                  value={activeButton.appearance.hoverBackgroundColor}
                  onChange={(color) =>
                    updateAppearance({ hoverBackgroundColor: color })
                  }
                  allowTransparent
                />
              </PropertyRow>

              <PropertyRow label="Hover Text">
                <ColorPicker
                  value={activeButton.appearance.hoverTextColor}
                  onChange={(color) =>
                    updateAppearance({ hoverTextColor: color })
                  }
                  allowTransparent={false}
                />
              </PropertyRow>

              <PropertyRow label="Opacity">
                <NumberSliderInput
                  value={activeButton.appearance.opacity}
                  onChange={(val) => updateAppearance({ opacity: val })}
                  min={0}
                  max={100}
                  unit="%"
                />
              </PropertyRow>
            </CollapsibleSection>

            {/* SECTION 6: SIZE AND DIMENSIONS */}
            <CollapsibleSection
              title="Size & Dimensions"
              badge={activeButton.dimensions.sizePreset.toUpperCase()}
            >
              <PropertyRow label="Size Preset">
                <SegmentedControl<ButtonSizePreset>
                  value={activeButton.dimensions.sizePreset}
                  onChange={(preset) => {
                    if (preset === "custom") {
                      updateDimensions({ sizePreset: "custom" });
                    } else {
                      selectSizePreset(preset);
                    }
                  }}
                  options={[
                    { value: "xs", label: "XS" },
                    { value: "sm", label: "SM" },
                    { value: "md", label: "MD" },
                    { value: "lg", label: "LG" },
                    { value: "xl", label: "XL" },
                  ]}
                />
              </PropertyRow>

              <PropertyRow label="Width Mode">
                <SegmentedControl<ButtonWidthMode>
                  value={activeButton.dimensions.widthMode}
                  onChange={(mode) => updateDimensions({ widthMode: mode })}
                  options={[
                    { value: "hug", label: "Hug" },
                    { value: "fixed", label: "Fixed" },
                    { value: "full", label: "Full" },
                  ]}
                />
              </PropertyRow>

              {activeButton.dimensions.widthMode === "fixed" && (
                <PropertyRow label="Width">
                  <NumberSliderInput
                    value={activeButton.dimensions.width}
                    onChange={(val) =>
                      updateDimensions({ width: val, sizePreset: "custom" })
                    }
                    min={32}
                    max={520}
                  />
                </PropertyRow>
              )}

              <PropertyRow label="Height">
                <NumberSliderInput
                  value={activeButton.dimensions.height}
                  onChange={(val) =>
                    updateDimensions({ height: val, sizePreset: "custom" })
                  }
                  min={22}
                  max={96}
                />
              </PropertyRow>

              <PropertyRow label="Padding X">
                <NumberSliderInput
                  value={activeButton.dimensions.paddingX}
                  onChange={(val) =>
                    updateDimensions({ paddingX: val, sizePreset: "custom" })
                  }
                  min={0}
                  max={64}
                />
              </PropertyRow>

              <PropertyRow label="Padding Y">
                <NumberSliderInput
                  value={activeButton.dimensions.paddingY}
                  onChange={(val) =>
                    updateDimensions({ paddingY: val, sizePreset: "custom" })
                  }
                  min={0}
                  max={36}
                />
              </PropertyRow>

              <PropertyRow label="Min Width">
                <NumberSliderInput
                  value={activeButton.dimensions.minWidth}
                  onChange={(val) => updateDimensions({ minWidth: val })}
                  min={0}
                  max={320}
                />
              </PropertyRow>

              <PropertyRow label="Max Width">
                <NumberSliderInput
                  value={activeButton.dimensions.maxWidth}
                  onChange={(val) => updateDimensions({ maxWidth: val })}
                  min={0}
                  max={800}
                />
              </PropertyRow>
            </CollapsibleSection>

            {/* SECTION 7: TYPOGRAPHY */}
            <CollapsibleSection
              title="Typography"
              badge={`${activeButton.typography.fontSize}px`}
            >
              <PropertyRow label="Font Family">
                <select
                  className="bs-select"
                  value={activeButton.typography.fontFamily}
                  onChange={(e) =>
                    updateTypography({ fontFamily: e.target.value })
                  }
                >
                  {FONT_FAMILY_OPTIONS.map((font) => (
                    <option key={font.label} value={font.value}>
                      {font.label}
                    </option>
                  ))}
                </select>
              </PropertyRow>

              <PropertyRow label="Font Size">
                <NumberSliderInput
                  value={activeButton.typography.fontSize}
                  onChange={(val) => updateTypography({ fontSize: val })}
                  min={10}
                  max={32}
                />
              </PropertyRow>

              <PropertyRow label="Weight">
                <SegmentedControl<ButtonFontWeight>
                  value={activeButton.typography.fontWeight}
                  onChange={(w) => updateTypography({ fontWeight: w })}
                  options={[
                    { value: 400, label: "Reg" },
                    { value: 500, label: "Med" },
                    { value: 600, label: "Semi" },
                    { value: 700, label: "Bold" },
                  ]}
                />
              </PropertyRow>

              <PropertyRow label="Line Height">
                <NumberSliderInput
                  value={activeButton.typography.lineHeight}
                  onChange={(val) => updateTypography({ lineHeight: val })}
                  min={0.9}
                  max={2}
                  step={0.05}
                  unit="×"
                />
              </PropertyRow>

              <PropertyRow label="Tracking">
                <NumberSliderInput
                  value={activeButton.typography.letterSpacing}
                  onChange={(val) => updateTypography({ letterSpacing: val })}
                  min={-2}
                  max={6}
                  step={0.25}
                  unit="px"
                />
              </PropertyRow>

              <PropertyRow label="Transform">
                <select
                  className="bs-select"
                  value={activeButton.typography.textTransform}
                  onChange={(e) =>
                    updateTypography({
                      textTransform: e.target.value as ButtonTextTransform,
                    })
                  }
                >
                  <option value="none">None</option>
                  <option value="uppercase">UPPERCASE</option>
                  <option value="lowercase">lowercase</option>
                  <option value="capitalize">Capitalize</option>
                </select>
              </PropertyRow>
            </CollapsibleSection>

            {/* SECTION 8: BORDER AND SHAPE */}
            <CollapsibleSection
              title="Border & Shape"
              badge={`${activeButton.shape.borderRadius}px`}
            >
              <PropertyRow label="Radius Preset">
                <select
                  className="bs-select"
                  value={activeButton.shape.radiusPreset}
                  onChange={(e) => {
                    const preset = e.target.value as ButtonRadiusPreset;
                    if (preset === "custom") {
                      updateShape({ radiusPreset: "custom" });
                    } else {
                      selectRadiusPreset(preset);
                    }
                  }}
                >
                  <option value="none">None (0px)</option>
                  <option value="sm">Small (4px)</option>
                  <option value="md">Medium (8px)</option>
                  <option value="lg">Large (12px)</option>
                  <option value="xl">Extra Large (16px)</option>
                  <option value="full">Fully Rounded (Pill)</option>
                  <option value="custom">Custom</option>
                </select>
              </PropertyRow>

              <PropertyRow label="Radius">
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <div style={{ flex: 1 }}>
                    <NumberSliderInput
                      value={activeButton.shape.borderRadius}
                      onChange={(val) =>
                        updateShape({
                          borderRadius: val,
                          corners: {
                            topLeft: val,
                            topRight: val,
                            bottomRight: val,
                            bottomLeft: val,
                          },
                          radiusPreset: "custom",
                        })
                      }
                      min={0}
                      max={50}
                    />
                  </div>
                  <button
                    type="button"
                    className={`bs-btn bs-btn-icon ${
                      activeButton.shape.useIndividualRadius
                        ? "bs-btn-primary"
                        : ""
                    }`}
                    onClick={() =>
                      updateShape({
                        useIndividualRadius:
                          !activeButton.shape.useIndividualRadius,
                      })
                    }
                    title="Toggle individual corner radii"
                  >
                    <CornerUpLeft size={12} />
                  </button>
                </div>
              </PropertyRow>

              {activeButton.shape.useIndividualRadius && (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 6,
                    padding: "6px 8px",
                    background: "var(--bs-surface-muted)",
                    borderRadius: 6,
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: 10,
                        color: "var(--bs-text-subtle)",
                        marginBottom: 2,
                      }}
                    >
                      Top Left
                    </div>
                    <input
                      type="number"
                      className="bs-input bs-mono"
                      value={activeButton.shape.corners.topLeft}
                      onChange={(e) =>
                        updateShape({
                          corners: {
                            ...activeButton.shape.corners,
                            topLeft: Number(e.target.value),
                          },
                          radiusPreset: "custom",
                        })
                      }
                    />
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: 10,
                        color: "var(--bs-text-subtle)",
                        marginBottom: 2,
                      }}
                    >
                      Top Right
                    </div>
                    <input
                      type="number"
                      className="bs-input bs-mono"
                      value={activeButton.shape.corners.topRight}
                      onChange={(e) =>
                        updateShape({
                          corners: {
                            ...activeButton.shape.corners,
                            topRight: Number(e.target.value),
                          },
                          radiusPreset: "custom",
                        })
                      }
                    />
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: 10,
                        color: "var(--bs-text-subtle)",
                        marginBottom: 2,
                      }}
                    >
                      Bottom Left
                    </div>
                    <input
                      type="number"
                      className="bs-input bs-mono"
                      value={activeButton.shape.corners.bottomLeft}
                      onChange={(e) =>
                        updateShape({
                          corners: {
                            ...activeButton.shape.corners,
                            bottomLeft: Number(e.target.value),
                          },
                          radiusPreset: "custom",
                        })
                      }
                    />
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: 10,
                        color: "var(--bs-text-subtle)",
                        marginBottom: 2,
                      }}
                    >
                      Bottom Right
                    </div>
                    <input
                      type="number"
                      className="bs-input bs-mono"
                      value={activeButton.shape.corners.bottomRight}
                      onChange={(e) =>
                        updateShape({
                          corners: {
                            ...activeButton.shape.corners,
                            bottomRight: Number(e.target.value),
                          },
                          radiusPreset: "custom",
                        })
                      }
                    />
                  </div>
                </div>
              )}

              <PropertyRow label="Border Width">
                <NumberSliderInput
                  value={activeButton.shape.borderWidth}
                  onChange={(val) => updateShape({ borderWidth: val })}
                  min={0}
                  max={8}
                />
              </PropertyRow>

              <PropertyRow label="Border Color">
                <ColorPicker
                  value={activeButton.shape.borderColor}
                  onChange={(color) => updateShape({ borderColor: color })}
                  allowTransparent
                />
              </PropertyRow>

              <PropertyRow label="Border Style">
                <SegmentedControl<ButtonBorderStyle>
                  value={activeButton.shape.borderStyle}
                  onChange={(style) => updateShape({ borderStyle: style })}
                  options={[
                    { value: "none", label: "None" },
                    { value: "solid", label: "Solid" },
                    { value: "dashed", label: "Dash" },
                    { value: "dotted", label: "Dot" },
                  ]}
                />
              </PropertyRow>
            </CollapsibleSection>

            {/* SECTION 9: EFFECTS (BOX SHADOW) */}
            <CollapsibleSection
              title="Effects & Shadow"
              badge={activeButton.effects.preset}
            >
              <PropertyRow label="Preset">
                <select
                  className="bs-select"
                  value={activeButton.effects.preset}
                  onChange={(e) => {
                    const preset = e.target.value as ButtonShadowPreset;
                    if (preset === "custom") {
                      updateEffects({ preset: "custom" });
                    } else {
                      selectShadowPreset(preset);
                    }
                  }}
                >
                  <option value="none">None</option>
                  <option value="subtle">Subtle</option>
                  <option value="sm">Small</option>
                  <option value="md">Medium</option>
                  <option value="lg">Large</option>
                  <option value="elevated">Elevated</option>
                  <option value="glow">Primary Glow</option>
                  <option value="custom">Custom</option>
                </select>
              </PropertyRow>

              <PropertyRow label="Shadow">
                <SegmentedControl
                  value={activeButton.effects.enabled ? "on" : "off"}
                  onChange={(v) =>
                    updateEffects({
                      enabled: v === "on",
                      preset: v === "off" ? "none" : "custom",
                    })
                  }
                  options={[
                    { value: "on", label: "Enabled" },
                    { value: "off", label: "Disabled" },
                  ]}
                />
              </PropertyRow>

              {activeButton.effects.enabled && (
                <>
                  <PropertyRow label="Color">
                    <ColorPicker
                      value={activeButton.effects.color}
                      onChange={(color) =>
                        updateEffects({ color, preset: "custom" })
                      }
                      allowTransparent={false}
                    />
                  </PropertyRow>

                  <PropertyRow label="Opacity">
                    <NumberSliderInput
                      value={activeButton.effects.opacity}
                      onChange={(val) =>
                        updateEffects({ opacity: val, preset: "custom" })
                      }
                      min={0}
                      max={100}
                      unit="%"
                    />
                  </PropertyRow>

                  <PropertyRow label="Blur">
                    <NumberSliderInput
                      value={activeButton.effects.blur}
                      onChange={(val) =>
                        updateEffects({ blur: val, preset: "custom" })
                      }
                      min={0}
                      max={48}
                    />
                  </PropertyRow>

                  <PropertyRow label="Spread">
                    <NumberSliderInput
                      value={activeButton.effects.spread}
                      onChange={(val) =>
                        updateEffects({ spread: val, preset: "custom" })
                      }
                      min={-12}
                      max={24}
                    />
                  </PropertyRow>

                  <PropertyRow label="Offset X">
                    <NumberSliderInput
                      value={activeButton.effects.offsetX}
                      onChange={(val) =>
                        updateEffects({ offsetX: val, preset: "custom" })
                      }
                      min={-24}
                      max={24}
                    />
                  </PropertyRow>

                  <PropertyRow label="Offset Y">
                    <NumberSliderInput
                      value={activeButton.effects.offsetY}
                      onChange={(val) =>
                        updateEffects({ offsetY: val, preset: "custom" })
                      }
                      min={-24}
                      max={32}
                    />
                  </PropertyRow>
                </>
              )}
            </CollapsibleSection>

            {/* SECTION 10: INTERACTION STATES */}
            <CollapsibleSection
              title="Interaction States"
              badge={inspectorStateTab}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: 4,
                  marginBottom: 6,
                }}
              >
                {INTERACTION_STATES_LIST.map((st) => {
                  const isCurrent = inspectorStateTab === st.id;
                  return (
                    <button
                      key={st.id}
                      type="button"
                      className={`bs-btn ${isCurrent ? "bs-btn-primary" : ""}`}
                      style={{ height: 24, fontSize: 11, padding: "0 6px" }}
                      onClick={() => {
                        setInspectorStateTab(st.id);
                        setInteractivePreview(false);
                        setPreviewState(st.id);
                      }}
                    >
                      {st.label}
                    </button>
                  );
                })}
              </div>

              <div
                style={{
                  fontSize: 10.5,
                  color: "var(--bs-text-subtle)",
                  marginBottom: 4,
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <span>
                  Editing <strong>{inspectorStateTab.toUpperCase()}</strong>{" "}
                  properties
                </span>
                {previewState !== inspectorStateTab && (
                  <button
                    type="button"
                    onClick={() => {
                      setInteractivePreview(false);
                      setPreviewState(inspectorStateTab);
                    }}
                    style={{
                      background: "none",
                      border: "none",
                      color: "var(--bs-accent)",
                      fontSize: 10.5,
                      cursor: "pointer",
                      padding: 0,
                      fontWeight: 600,
                    }}
                  >
                    Preview state
                  </button>
                )}
              </div>

              <PropertyRow label="State BG">
                <ColorPicker
                  value={currentStateOverride.backgroundColor}
                  onChange={(val) =>
                    updateStateOverride(inspectorStateTab, {
                      backgroundColor: val,
                    })
                  }
                  allowTransparent
                />
              </PropertyRow>

              <PropertyRow label="State Text">
                <ColorPicker
                  value={currentStateOverride.textColor}
                  onChange={(val) =>
                    updateStateOverride(inspectorStateTab, { textColor: val })
                  }
                  allowTransparent={false}
                />
              </PropertyRow>

              <PropertyRow label="State Border">
                <ColorPicker
                  value={currentStateOverride.borderColor}
                  onChange={(val) =>
                    updateStateOverride(inspectorStateTab, { borderColor: val })
                  }
                  allowTransparent
                />
              </PropertyRow>

              <PropertyRow label="Opacity">
                <NumberSliderInput
                  value={currentStateOverride.opacity}
                  onChange={(val) =>
                    updateStateOverride(inspectorStateTab, { opacity: val })
                  }
                  min={0}
                  max={100}
                  unit="%"
                />
              </PropertyRow>

              <PropertyRow label="Scale">
                <NumberSliderInput
                  value={currentStateOverride.scale}
                  onChange={(val) =>
                    updateStateOverride(inspectorStateTab, { scale: val })
                  }
                  min={0.85}
                  max={1.15}
                  step={0.01}
                  unit="×"
                />
              </PropertyRow>

              {inspectorStateTab === "focus" && (
                <>
                  <PropertyRow label="Ring Color">
                    <ColorPicker
                      value={currentStateOverride.focusRingColor}
                      onChange={(val) =>
                        updateStateOverride("focus", { focusRingColor: val })
                      }
                      allowTransparent={false}
                    />
                  </PropertyRow>
                  <PropertyRow label="Ring Width">
                    <NumberSliderInput
                      value={currentStateOverride.focusRingWidth}
                      onChange={(val) =>
                        updateStateOverride("focus", { focusRingWidth: val })
                      }
                      min={0}
                      max={8}
                    />
                  </PropertyRow>
                  <PropertyRow label="Ring Offset">
                    <NumberSliderInput
                      value={currentStateOverride.focusRingOffset}
                      onChange={(val) =>
                        updateStateOverride("focus", { focusRingOffset: val })
                      }
                      min={0}
                      max={8}
                    />
                  </PropertyRow>
                </>
              )}

              {inspectorStateTab === "loading" && (
                <>
                  <PropertyRow label="Spinner Color">
                    <ColorPicker
                      value={currentStateOverride.spinnerColor}
                      onChange={(val) =>
                        updateStateOverride("loading", {
                          spinnerColor: val,
                        })
                      }
                      allowTransparent={false}
                    />
                  </PropertyRow>
                  <PropertyRow label="Loading Text">
                    <input
                      type="text"
                      className="bs-input"
                      value={currentStateOverride.loadingLabel}
                      onChange={(e) =>
                        updateStateOverride("loading", {
                          loadingLabel: e.target.value,
                        })
                      }
                      placeholder="Optional loading label..."
                    />
                  </PropertyRow>
                </>
              )}

              <PropertyRow label="Transition">
                <NumberSliderInput
                  value={activeButton.transitionDuration}
                  onChange={(val) => setTransitionDuration(val)}
                  min={0}
                  max={600}
                  step={10}
                  unit="ms"
                />
              </PropertyRow>
            </CollapsibleSection>
          </div>
        )}
      </div>
    </aside>
  );
}
