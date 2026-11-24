"use client";

import * as React from "react";
import type {
  PixelAnimationMode,
  PixelGradientCurve,
  PixelHoverEffect,
  PixelMouseOverMode,
  PixelTransitionEasing
} from "@/components/ui/pixel-prompt-button";
import {
  StudioColorRow,
  StudioPanel,
  StudioSection,
  StudioSelect,
  StudioSlider
} from "@/components/studio/StudioControls";

export interface PixelStudioConfig {
  baseColor: string;
  highlightColor: string;
  textColor: string;
  glowIntensity: number;
  pixelSize: number;
  pixelGap: number;
  pixelRadius: number;
  pixelContrast: number;
  animationMode: PixelAnimationMode;
  animationSpeed: number;
  danceAmount: number;
  mouseOverMode: PixelMouseOverMode;
  hoverEffect: PixelHoverEffect;
  hoverRadius: number;
  hoverIntensity: number;
  gradientCurve: PixelGradientCurve;
  gradientStart: number;
  gradientEnd: number;
  hoverBloom: number;
  hoverGradientColor: string;
  transitionDuration: number;
  transitionEasing: PixelTransitionEasing;
  cursorSmoothness: number;
  hoverLift: number;
}

export const DEFAULT_PIXEL_STUDIO_CONFIG: PixelStudioConfig = {
  baseColor: "#2c5cf5",
  highlightColor: "#bfd6ff",
  textColor: "#ffffff",
  glowIntensity: 55,
  pixelSize: 8,
  pixelGap: 1,
  pixelRadius: 0,
  pixelContrast: 65,
  animationMode: "dance",
  animationSpeed: 100,
  danceAmount: 50,
  mouseOverMode: "follow",
  hoverEffect: "gradient-1-0",
  hoverRadius: 38,
  hoverIntensity: 100,
  gradientCurve: "linear",
  gradientStart: 100,
  gradientEnd: 0,
  hoverBloom: 36,
  hoverGradientColor: "",
  transitionDuration: 280,
  transitionEasing: "ease-out",
  cursorSmoothness: 35,
  hoverLift: 1
};

export const COLOR_PRESETS: Array<{
  name: string;
  baseColor: string;
  highlightColor: string;
  textColor: string;
}> = [
  { name: "Cobalt", baseColor: "#2c5cf5", highlightColor: "#bfd6ff", textColor: "#ffffff" },
  { name: "Violet", baseColor: "#7c3aed", highlightColor: "#e9d5ff", textColor: "#ffffff" },
  { name: "Emerald", baseColor: "#10b981", highlightColor: "#d1fae5", textColor: "#ffffff" },
  { name: "Amber", baseColor: "#f59e0b", highlightColor: "#fef3c7", textColor: "#ffffff" },
  { name: "Rose", baseColor: "#f43f5e", highlightColor: "#ffe4e6", textColor: "#ffffff" },
  { name: "Mono", baseColor: "#52525b", highlightColor: "#f4f4f5", textColor: "#ffffff" }
];

export const STUDIO_PRESETS: Array<{
  id: string;
  name: string;
  accent: string;
  values: Partial<PixelStudioConfig>;
}> = [
  {
    id: "cobalt-classic",
    name: "Cobalt Classic",
    accent: "#2c5cf5",
    values: { ...DEFAULT_PIXEL_STUDIO_CONFIG }
  },
  {
    id: "neon-ripple",
    name: "Neon Ripple",
    accent: "#8b5cf6",
    values: {
      baseColor: "#6d28d9",
      highlightColor: "#ddd6fe",
      hoverGradientColor: "#38bdf8",
      pixelSize: 9,
      pixelGap: 1.5,
      pixelRadius: 1.5,
      animationMode: "sparkle",
      animationSpeed: 120,
      hoverEffect: "ripple",
      hoverRadius: 42,
      transitionEasing: "spring",
      transitionDuration: 360
    }
  },
  {
    id: "aurora-wave",
    name: "Aurora Wave",
    accent: "#10b981",
    values: {
      baseColor: "#059669",
      highlightColor: "#a7f3d0",
      hoverGradientColor: "#67e8f9",
      pixelSize: 7,
      pixelGap: 1,
      pixelRadius: 1,
      animationMode: "wave",
      animationSpeed: 110,
      danceAmount: 70,
      hoverEffect: "gradient-1-0",
      gradientCurve: "smooth",
      hoverRadius: 46
    }
  },
  {
    id: "cyber-rain",
    name: "Cyber Rain",
    accent: "#06b6d4",
    values: {
      baseColor: "#0284c7",
      highlightColor: "#bae6fd",
      hoverGradientColor: "#f0abfc",
      pixelSize: 6,
      pixelGap: 1,
      pixelRadius: 0,
      animationMode: "rain",
      animationSpeed: 130,
      danceAmount: 80,
      hoverEffect: "reveal",
      gradientCurve: "sharp",
      cursorSmoothness: 20
    }
  },
  {
    id: "solar-spotlight",
    name: "Solar Spotlight",
    accent: "#f59e0b",
    values: {
      baseColor: "#d97706",
      highlightColor: "#fef08a",
      hoverGradientColor: "#ffffff",
      glowIntensity: 70,
      pixelSize: 8,
      pixelGap: 1,
      pixelRadius: 2,
      animationMode: "pulse",
      hoverEffect: "spotlight",
      hoverBloom: 58,
      hoverRadius: 34,
      transitionDuration: 240
    }
  },
  {
    id: "rose-scatter",
    name: "Rose Scatter",
    accent: "#f43f5e",
    values: {
      baseColor: "#e11d48",
      highlightColor: "#fecdd3",
      hoverGradientColor: "#fda4af",
      pixelSize: 8,
      pixelGap: 1.5,
      pixelRadius: 2,
      animationMode: "dance",
      danceAmount: 65,
      hoverEffect: "scatter",
      hoverRadius: 36,
      hoverLift: 2,
      transitionEasing: "spring"
    }
  }
];

const ANIMATION_OPTIONS: Array<{ value: PixelAnimationMode; label: string }> = [
  { value: "dance", label: "Dance" },
  { value: "sparkle", label: "Sparkle" },
  { value: "wave", label: "Wave" },
  { value: "rain", label: "Digital rain" },
  { value: "pulse", label: "Pulse" },
  { value: "none", label: "None (static)" }
];

const MOUSE_OVER_OPTIONS: Array<{ value: PixelMouseOverMode; label: string }> = [
  { value: "follow", label: "Follow cursor" },
  { value: "full", label: "Full button" },
  { value: "edge-sweep", label: "Edge sweep" },
  { value: "always-on", label: "Always active (preview)" }
];

const HOVER_OPTIONS: Array<{ value: PixelHoverEffect; label: string }> = [
  { value: "gradient-1-0", label: "1 → 0 Gradient" },
  { value: "spotlight", label: "Spotlight" },
  { value: "ripple", label: "Ripple wave" },
  { value: "scatter", label: "Magnetic scatter" },
  { value: "reveal", label: "Highlight reveal" },
  { value: "none", label: "None" }
];

const CURVE_OPTIONS: Array<{ value: PixelGradientCurve; label: string }> = [
  { value: "linear", label: "Linear 1 → 0" },
  { value: "smooth", label: "Smooth ease" },
  { value: "sharp", label: "Sharp drop" },
  { value: "soft", label: "Soft spread" },
  { value: "arch", label: "Arch (center peak)" }
];

const EASING_OPTIONS: Array<{ value: PixelTransitionEasing; label: string }> = [
  { value: "ease-out", label: "Ease out" },
  { value: "ease-in-out", label: "Ease in-out" },
  { value: "linear", label: "Linear" },
  { value: "spring", label: "Spring bounce" }
];

export const PROPS_DOC: Array<{
  prop: string;
  type: string;
  def: string;
  desc: string;
}> = [
  { prop: "label", type: "string", def: '"Generate & copy prompt"', desc: "Primary button label text." },
  { prop: "copiedLabel", type: "string", def: '"Copied to clipboard"', desc: "Temporary confirmation label shown after click." },
  { prop: "prompt", type: "string", def: "label", desc: "String copied to clipboard (falls back to label)." },
  { prop: "size", type: '"sm" | "md" | "lg"', def: '"lg"', desc: "Preset dimensions matching Figma pill sizes." },
  { prop: "showIcon", type: "boolean", def: "true", desc: "Toggles trailing lightning bolt / checkmark icon." },
  { prop: "baseColor", type: "string", def: '"#2c5cf5"', desc: "Base hex color driving the pixel palette and outer rim." },
  { prop: "highlightColor", type: "string", def: '"#bfd6ff"', desc: "Highlight hex color for bright specular pixels & hover states." },
  { prop: "textColor", type: "string", def: '"#ffffff"', desc: "Foreground label and SVG icon hex color." },
  { prop: "glowIntensity", type: "number", def: "55", desc: "Outer luminance shadow strength (0 – 100%)." },
  { prop: "pixelSize", type: "number", def: "8", desc: "Logical SVG size of each pixel square (4 – 16)." },
  { prop: "pixelGap", type: "number", def: "1", desc: "Logical groove gap between pixels (0 – 4)." },
  { prop: "pixelRadius", type: "number", def: "0", desc: "Rounded corner radius per pixel cell (0 – 4)." },
  { prop: "pixelContrast", type: "number", def: "65", desc: "Tonal spread across shadow-to-highlight tiers (0 – 100%)." },
  { prop: "animationMode", type: '"dance" | "sparkle" | "wave" | "rain" | "pulse" | "none"', def: '"dance"', desc: "Always-on ambient motion pattern across the grid." },
  { prop: "animationSpeed", type: "number", def: "100", desc: "Ambient animation speed multiplier (0 – 200%)." },
  { prop: "danceAmount", type: "number", def: "50", desc: "Ambient shimmer amplitude (0 – 100%)." },
  { prop: "mouseOverMode", type: '"follow" | "full" | "edge-sweep" | "always-on"', def: '"follow"', desc: "Controls whether hover tracks cursor, fills full width, auto-sweeps, or stays active." },
  { prop: "hoverEffect", type: '"gradient-1-0" | "spotlight" | "ripple" | "scatter" | "reveal" | "none"', def: '"gradient-1-0"', desc: "Interactive hover / cursor effect mode." },
  { prop: "hoverRadius", type: "number", def: "38", desc: "Cursor influence width across the pill (10 – 60%)." },
  { prop: "hoverIntensity", type: "number", def: "100", desc: "Hover reaction strength multiplier (0 – 100%)." },
  { prop: "gradientCurve", type: '"linear" | "smooth" | "sharp" | "soft" | "arch"', def: '"linear"', desc: "Opacity curve shaping across the cursor-following hover gradient." },
  { prop: "gradientStart", type: "number", def: "100", desc: "Starting gradient intensity at leading edge (0 – 100%)." },
  { prop: "gradientEnd", type: "number", def: "0", desc: "Ending gradient intensity at trailing edge (0 – 100%)." },
  { prop: "hoverBloom", type: "number", def: "36", desc: "Cursor-following radial background glow opacity on hover (0 – 100%)." },
  { prop: "hoverGradientColor", type: "string", def: "highlightColor", desc: "Optional override hex tint for the hovered gradient pixels." },
  { prop: "transitionDuration", type: "number", def: "280", desc: "Enter/leave hover blend and lift duration in ms (60 – 1500)." },
  { prop: "transitionEasing", type: '"ease-out" | "ease-in-out" | "linear" | "spring"', def: '"ease-out"', desc: "Timing curve applied to hover transition and pill lift." },
  { prop: "cursorSmoothness", type: "number", def: "35", desc: "Pointer tracking smoothing (0 = instant snap, 100 = silky trail)." },
  { prop: "hoverLift", type: "number", def: "1", desc: "Subtle upward button translate lift in px on hover (0 – 8)." },
  { prop: "onCopyPrompt", type: "(text: string) => void", def: "undefined", desc: "Callback invoked right after copying text." }
];

export function buildPixelUsageSnippet(config: PixelStudioConfig): string {
  const props: string[] = [];
  if (config.baseColor !== DEFAULT_PIXEL_STUDIO_CONFIG.baseColor)
    props.push(`  baseColor="${config.baseColor}"`);
  if (config.highlightColor !== DEFAULT_PIXEL_STUDIO_CONFIG.highlightColor)
    props.push(`  highlightColor="${config.highlightColor}"`);
  if (config.textColor !== DEFAULT_PIXEL_STUDIO_CONFIG.textColor)
    props.push(`  textColor="${config.textColor}"`);
  if (config.glowIntensity !== DEFAULT_PIXEL_STUDIO_CONFIG.glowIntensity)
    props.push(`  glowIntensity={${config.glowIntensity}}`);
  if (config.pixelSize !== DEFAULT_PIXEL_STUDIO_CONFIG.pixelSize)
    props.push(`  pixelSize={${config.pixelSize}}`);
  if (config.pixelGap !== DEFAULT_PIXEL_STUDIO_CONFIG.pixelGap)
    props.push(`  pixelGap={${config.pixelGap}}`);
  if (config.pixelRadius !== DEFAULT_PIXEL_STUDIO_CONFIG.pixelRadius)
    props.push(`  pixelRadius={${config.pixelRadius}}`);
  if (config.pixelContrast !== DEFAULT_PIXEL_STUDIO_CONFIG.pixelContrast)
    props.push(`  pixelContrast={${config.pixelContrast}}`);
  if (config.animationMode !== DEFAULT_PIXEL_STUDIO_CONFIG.animationMode)
    props.push(`  animationMode="${config.animationMode}"`);
  if (config.animationSpeed !== DEFAULT_PIXEL_STUDIO_CONFIG.animationSpeed)
    props.push(`  animationSpeed={${config.animationSpeed}}`);
  if (config.danceAmount !== DEFAULT_PIXEL_STUDIO_CONFIG.danceAmount)
    props.push(`  danceAmount={${config.danceAmount}}`);
  if (config.mouseOverMode !== DEFAULT_PIXEL_STUDIO_CONFIG.mouseOverMode)
    props.push(`  mouseOverMode="${config.mouseOverMode}"`);
  if (config.hoverEffect !== DEFAULT_PIXEL_STUDIO_CONFIG.hoverEffect)
    props.push(`  hoverEffect="${config.hoverEffect}"`);
  if (config.hoverRadius !== DEFAULT_PIXEL_STUDIO_CONFIG.hoverRadius)
    props.push(`  hoverRadius={${config.hoverRadius}}`);
  if (config.hoverIntensity !== DEFAULT_PIXEL_STUDIO_CONFIG.hoverIntensity)
    props.push(`  hoverIntensity={${config.hoverIntensity}}`);
  if (config.gradientCurve !== DEFAULT_PIXEL_STUDIO_CONFIG.gradientCurve)
    props.push(`  gradientCurve="${config.gradientCurve}"`);
  if (config.gradientStart !== DEFAULT_PIXEL_STUDIO_CONFIG.gradientStart)
    props.push(`  gradientStart={${config.gradientStart}}`);
  if (config.gradientEnd !== DEFAULT_PIXEL_STUDIO_CONFIG.gradientEnd)
    props.push(`  gradientEnd={${config.gradientEnd}}`);
  if (config.hoverBloom !== DEFAULT_PIXEL_STUDIO_CONFIG.hoverBloom)
    props.push(`  hoverBloom={${config.hoverBloom}}`);
  if (
    config.hoverGradientColor !== DEFAULT_PIXEL_STUDIO_CONFIG.hoverGradientColor &&
    config.hoverGradientColor
  )
    props.push(`  hoverGradientColor="${config.hoverGradientColor}"`);
  if (config.transitionDuration !== DEFAULT_PIXEL_STUDIO_CONFIG.transitionDuration)
    props.push(`  transitionDuration={${config.transitionDuration}}`);
  if (config.transitionEasing !== DEFAULT_PIXEL_STUDIO_CONFIG.transitionEasing)
    props.push(`  transitionEasing="${config.transitionEasing}"`);
  if (config.cursorSmoothness !== DEFAULT_PIXEL_STUDIO_CONFIG.cursorSmoothness)
    props.push(`  cursorSmoothness={${config.cursorSmoothness}}`);
  if (config.hoverLift !== DEFAULT_PIXEL_STUDIO_CONFIG.hoverLift)
    props.push(`  hoverLift={${config.hoverLift}}`);

  const jsxTag =
    props.length === 0
      ? `<PixelPromptButton />`
      : `<PixelPromptButton\n${props.join("\n")}\n/>`;

  return `import { PixelPromptButton } from "@/components/ui/pixel-prompt-button";\n\nexport function Example() {\n  return (\n    ${jsxTag.replace(/\n/g, "\n    ")}\n  );\n}`;
}

export function PixelControlPanel({
  config,
  onPatch,
  onResetAll,
  width = 320
}: {
  config: PixelStudioConfig;
  onPatch: (partial: Partial<PixelStudioConfig>) => void;
  onResetAll: () => void;
  width?: number;
}) {
  return (
    <StudioPanel
      title="Pixel Prompt Button"
      onResetAll={onResetAll}
      width={width}
    >
      <StudioSection
        title="Colors & glow"
        onReset={() =>
          onPatch({
            baseColor: DEFAULT_PIXEL_STUDIO_CONFIG.baseColor,
            highlightColor: DEFAULT_PIXEL_STUDIO_CONFIG.highlightColor,
            textColor: DEFAULT_PIXEL_STUDIO_CONFIG.textColor,
            glowIntensity: DEFAULT_PIXEL_STUDIO_CONFIG.glowIntensity
          })
        }
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span style={{ fontSize: 11.5, color: "#9a9aa6" }}>
            Theme swatches
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            {COLOR_PRESETS.map((preset) => {
              const active =
                preset.baseColor.toLowerCase() ===
                config.baseColor.toLowerCase();
              return (
                <button
                  key={preset.name}
                  type="button"
                  title={preset.name}
                  onClick={() =>
                    onPatch({
                      baseColor: preset.baseColor,
                      highlightColor: preset.highlightColor,
                      textColor: preset.textColor
                    })
                  }
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 6,
                    backgroundImage: `linear-gradient(135deg, ${preset.highlightColor}, ${preset.baseColor})`,
                    borderWidth: active ? 2 : 1,
                    borderStyle: "solid",
                    borderColor: active ? "#ffffff" : "#32323c",
                    cursor: "pointer",
                    padding: 0
                  }}
                />
              );
            })}
          </div>
        </div>

        <StudioColorRow
          label="Base color"
          hint="Primary hue of the pixel mosaic and border rim"
          value={config.baseColor}
          onChange={(baseColor) => onPatch({ baseColor })}
        />
        <StudioColorRow
          label="Highlight color"
          hint="Peak color for dancing sparkles and hover reveals"
          value={config.highlightColor}
          onChange={(highlightColor) => onPatch({ highlightColor })}
        />
        <StudioColorRow
          label="Text & icon"
          hint="Color of the label and trailing bolt SVG"
          value={config.textColor}
          onChange={(textColor) => onPatch({ textColor })}
        />
        <StudioSlider
          label="Glow intensity"
          hint="Ambient outer shadow glow around the button pill"
          value={config.glowIntensity}
          min={0}
          max={100}
          unit="%"
          onChange={(glowIntensity) => onPatch({ glowIntensity })}
        />
      </StudioSection>

      <StudioSection
        title="Pixels & grid"
        onReset={() =>
          onPatch({
            pixelSize: DEFAULT_PIXEL_STUDIO_CONFIG.pixelSize,
            pixelGap: DEFAULT_PIXEL_STUDIO_CONFIG.pixelGap,
            pixelRadius: DEFAULT_PIXEL_STUDIO_CONFIG.pixelRadius,
            pixelContrast: DEFAULT_PIXEL_STUDIO_CONFIG.pixelContrast
          })
        }
      >
        <StudioSlider
          label="Pixel size"
          hint="Size of each mosaic block in logical SVG units"
          value={config.pixelSize}
          min={4}
          max={16}
          step={1}
          unit="px"
          onChange={(pixelSize) => onPatch({ pixelSize })}
        />
        <StudioSlider
          label="Pixel gap"
          hint="Spacing between adjacent pixel blocks"
          value={config.pixelGap}
          min={0}
          max={4}
          step={0.5}
          unit="px"
          onChange={(pixelGap) => onPatch({ pixelGap })}
        />
        <StudioSlider
          label="Pixel radius"
          hint="Corner rounding applied to every pixel tile"
          value={config.pixelRadius}
          min={0}
          max={4}
          step={0.5}
          unit="px"
          onChange={(pixelRadius) => onPatch({ pixelRadius })}
        />
        <StudioSlider
          label="Contrast"
          hint="Luminance spread between shadow and bright pixels"
          value={config.pixelContrast}
          min={0}
          max={100}
          unit="%"
          onChange={(pixelContrast) => onPatch({ pixelContrast })}
        />
      </StudioSection>

      <StudioSection
        title="Animation"
        onReset={() =>
          onPatch({
            animationMode: DEFAULT_PIXEL_STUDIO_CONFIG.animationMode,
            animationSpeed: DEFAULT_PIXEL_STUDIO_CONFIG.animationSpeed,
            danceAmount: DEFAULT_PIXEL_STUDIO_CONFIG.danceAmount
          })
        }
      >
        <StudioSelect
          label="Ambient mode"
          hint="Always-on idle motion pattern across the pixel matrix"
          value={config.animationMode}
          options={ANIMATION_OPTIONS}
          onChange={(animationMode) => onPatch({ animationMode })}
        />
        <StudioSlider
          label="Speed"
          hint="Playback speed multiplier for idle motion"
          value={config.animationSpeed}
          min={0}
          max={200}
          unit="%"
          onChange={(animationSpeed) => onPatch({ animationSpeed })}
        />
        <StudioSlider
          label="Dance amount"
          hint="Shimmer and pixel color shift depth"
          value={config.danceAmount}
          min={0}
          max={100}
          unit="%"
          onChange={(danceAmount) => onPatch({ danceAmount })}
        />
      </StudioSection>

      <StudioSection
        title="Mouse over & gradient"
        onReset={() =>
          onPatch({
            mouseOverMode: DEFAULT_PIXEL_STUDIO_CONFIG.mouseOverMode,
            hoverEffect: DEFAULT_PIXEL_STUDIO_CONFIG.hoverEffect,
            gradientCurve: DEFAULT_PIXEL_STUDIO_CONFIG.gradientCurve,
            gradientStart: DEFAULT_PIXEL_STUDIO_CONFIG.gradientStart,
            gradientEnd: DEFAULT_PIXEL_STUDIO_CONFIG.gradientEnd,
            hoverRadius: DEFAULT_PIXEL_STUDIO_CONFIG.hoverRadius,
            hoverIntensity: DEFAULT_PIXEL_STUDIO_CONFIG.hoverIntensity,
            hoverBloom: DEFAULT_PIXEL_STUDIO_CONFIG.hoverBloom,
            hoverGradientColor: DEFAULT_PIXEL_STUDIO_CONFIG.hoverGradientColor
          })
        }
      >
        <StudioSelect
          label="Mouse over"
          hint="Whether hover follows your pointer, covers the full pill, sweeps across, or stays active"
          value={config.mouseOverMode}
          options={MOUSE_OVER_OPTIONS}
          onChange={(mouseOverMode) => onPatch({ mouseOverMode })}
        />
        <StudioSelect
          label="Effect"
          hint="Interactive pixel reaction beneath the cursor"
          value={config.hoverEffect}
          options={HOVER_OPTIONS}
          onChange={(hoverEffect) => onPatch({ hoverEffect })}
        />
        <StudioSelect
          label="Gradient curve"
          hint="Opacity falloff shape across the hover gradient"
          value={config.gradientCurve}
          options={CURVE_OPTIONS}
          onChange={(gradientCurve) => onPatch({ gradientCurve })}
        />
        <StudioSlider
          label="Gradient start"
          hint="Starting opacity at the leading edge of the gradient"
          value={config.gradientStart}
          min={0}
          max={100}
          unit="%"
          onChange={(gradientStart) => onPatch({ gradientStart })}
        />
        <StudioSlider
          label="Gradient end"
          hint="Ending opacity at the trailing edge of the gradient"
          value={config.gradientEnd}
          min={0}
          max={100}
          unit="%"
          onChange={(gradientEnd) => onPatch({ gradientEnd })}
        />
        <StudioSlider
          label="Hover radius"
          hint="Width of the cursor spotlight/gradient zone"
          value={config.hoverRadius}
          min={10}
          max={60}
          unit="%"
          onChange={(hoverRadius) => onPatch({ hoverRadius })}
        />
        <StudioSlider
          label="Hover intensity"
          hint="Strength of the interactive hover transformation"
          value={config.hoverIntensity}
          min={0}
          max={100}
          unit="%"
          onChange={(hoverIntensity) => onPatch({ hoverIntensity })}
        />
        <StudioSlider
          label="Hover glow bloom"
          hint="Cursor-tracking radial bloom intensity behind hovered pixels"
          value={config.hoverBloom}
          min={0}
          max={100}
          unit="%"
          onChange={(hoverBloom) => onPatch({ hoverBloom })}
        />
        <StudioColorRow
          label="Gradient tint"
          hint="Optional custom highlight tint for hovered gradient pixels"
          value={config.hoverGradientColor || config.highlightColor}
          onChange={(hoverGradientColor) => onPatch({ hoverGradientColor })}
          onClear={
            config.hoverGradientColor
              ? () => onPatch({ hoverGradientColor: "" })
              : undefined
          }
        />
      </StudioSection>

      <StudioSection
        title="Transition"
        onReset={() =>
          onPatch({
            transitionEasing: DEFAULT_PIXEL_STUDIO_CONFIG.transitionEasing,
            transitionDuration: DEFAULT_PIXEL_STUDIO_CONFIG.transitionDuration,
            cursorSmoothness: DEFAULT_PIXEL_STUDIO_CONFIG.cursorSmoothness,
            hoverLift: DEFAULT_PIXEL_STUDIO_CONFIG.hoverLift
          })
        }
      >
        <StudioSelect
          label="Easing"
          hint="Timing curve applied to hover fade and pill elevation"
          value={config.transitionEasing}
          options={EASING_OPTIONS}
          onChange={(transitionEasing) => onPatch({ transitionEasing })}
        />
        <StudioSlider
          label="Duration"
          hint="Enter and leave hover transition duration"
          value={config.transitionDuration}
          min={80}
          max={1200}
          step={20}
          unit="ms"
          onChange={(transitionDuration) => onPatch({ transitionDuration })}
        />
        <StudioSlider
          label="Cursor smoothing"
          hint="Pointer follow damping (0% instant, 100% silky trail)"
          value={config.cursorSmoothness}
          min={0}
          max={100}
          unit="%"
          onChange={(cursorSmoothness) => onPatch({ cursorSmoothness })}
        />
        <StudioSlider
          label="Hover lift"
          hint="Upward pill elevation distance on hover"
          value={config.hoverLift}
          min={0}
          max={6}
          step={0.5}
          unit="px"
          onChange={(hoverLift) => onPatch({ hoverLift })}
        />
      </StudioSection>
    </StudioPanel>
  );
}
