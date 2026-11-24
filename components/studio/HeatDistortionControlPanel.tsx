"use client";

import * as React from "react";
import {
  DEFAULT_HEAT_DISTORTION_CONFIG,
  HEAT_DISTORTION_FONTS,
  type HeatDistortionConfig,
  type HeatDistortionImageFit,
  type HeatDistortionMode
} from "@/components/ui/heat-distortion";
import {
  StudioColorRow,
  StudioFileRow,
  StudioPanel,
  StudioSection,
  StudioSelect,
  StudioSlider,
  StudioTextarea,
  StudioToggle
} from "@/components/studio/StudioControls";

export const HEAT_STUDIO_PRESETS: ReadonlyArray<{
  id: string;
  name: string;
  accent: string;
  values: Partial<HeatDistortionConfig>;
}> = [
  {
    id: "runway-shimmer",
    name: "Runway Shimmer",
    accent: "#3b82f6",
    values: { ...DEFAULT_HEAT_DISTORTION_CONFIG }
  },
  {
    id: "desert-mirage",
    name: "Desert Mirage",
    accent: "#d97706",
    values: {
      backgroundColor: "#f4eadc",
      textColor: "#3c2618",
      fontFamily: "Georgia, serif",
      strength: 2.1,
      turbulence: 1.25,
      maskAngle: 90,
      maskPosition: 0.45,
      patchiness: 0.75
    }
  },
  {
    id: "chromatic-heat",
    name: "Chromatic Heat",
    accent: "#8b5cf6",
    values: {
      backgroundColor: "#11131a",
      textColor: "#f4f4f5",
      fontWeight: "600",
      chromaticAberration: 0.0045,
      strength: 1.7,
      frequency: 55
    }
  },
  {
    id: "editorial-mono",
    name: "Editorial Mono",
    accent: "#a1a1aa",
    values: {
      backgroundColor: "#e6e6e6",
      textColor: "#141414",
      fontFamily: "Impact, Haettenschweiler, sans-serif",
      fontSize: 84,
      letterSpacing: 4,
      maskAngle: 180,
      strength: 1.1,
      patchiness: 0.65
    }
  },
  {
    id: "thermal-wave",
    name: "Thermal Wave",
    accent: "#06b6d4",
    values: {
      backgroundColor: "#0b1220",
      textColor: "#93c5fd",
      fontFamily: "Courier New, monospace",
      frequency: 72,
      speed: 1.6,
      strength: 1.85,
      chromaticAberration: 0.003
    }
  }
];

const MODE_OPTIONS: ReadonlyArray<{ value: HeatDistortionMode; label: string }> = [
  { value: "text", label: "Text" },
  { value: "image", label: "Image" }
];

const FIT_OPTIONS: ReadonlyArray<{ value: HeatDistortionImageFit; label: string }> = [
  { value: "contain", label: "Contain" },
  { value: "cover", label: "Cover" }
];

const FONT_OPTIONS = HEAT_DISTORTION_FONTS.map((f) => ({
  value: f.value,
  label: f.label
}));

const WEIGHT_OPTIONS: ReadonlyArray<{ value: string; label: string }> = [
  { value: "300", label: "Light (300)" },
  { value: "400", label: "Regular (400)" },
  { value: "600", label: "Semibold (600)" },
  { value: "800", label: "Extrabold (800)" }
];

export function HeatDistortionControlPanel({
  config,
  fileName,
  onPatch,
  onImageFileSelect,
  onClearImage,
  onResetAll,
  width = 320,
  fileInputRef
}: {
  config: HeatDistortionConfig;
  fileName?: string | null;
  onPatch: (partial: Partial<HeatDistortionConfig>) => void;
  onImageFileSelect: (file: File) => void;
  onClearImage?: () => void;
  onResetAll: () => void;
  width?: number;
  fileInputRef?: React.RefObject<HTMLInputElement | null>;
}) {
  return (
    <StudioPanel
      title="Heat Distortion"
      onResetAll={onResetAll}
      width={width}
    >
      <StudioSection
        title="Source"
        onReset={() => {
          onClearImage?.();
          onPatch({
            mode: DEFAULT_HEAT_DISTORTION_CONFIG.mode,
            imageFit: DEFAULT_HEAT_DISTORTION_CONFIG.imageFit,
            imageScale: DEFAULT_HEAT_DISTORTION_CONFIG.imageScale
          });
        }}
      >
        <StudioSelect
          label="Mode"
          hint="Render source canvas from crisp typography or an uploaded image"
          value={config.mode}
          options={MODE_OPTIONS}
          onChange={(mode) => onPatch({ mode })}
        />
        <StudioFileRow
          label="Upload image"
          hint="Select a local PNG, JPEG, or WebP to distort"
          fileName={fileName}
          inputRef={fileInputRef}
          onFileSelect={onImageFileSelect}
          onClear={onClearImage}
        />
        <StudioSelect
          label="Image fit"
          hint="Contain inside or cover the square WebGL canvas"
          value={config.imageFit}
          options={FIT_OPTIONS}
          onChange={(imageFit) => onPatch({ imageFit })}
        />
        <StudioSlider
          label="Image scale"
          hint="Multiplier applied when drawing the image source"
          value={config.imageScale}
          min={0.2}
          max={2}
          step={0.01}
          onChange={(imageScale) => onPatch({ imageScale })}
        />
      </StudioSection>

      <StudioSection
        title="Text"
        onReset={() =>
          onPatch({
            text: DEFAULT_HEAT_DISTORTION_CONFIG.text,
            fontFamily: DEFAULT_HEAT_DISTORTION_CONFIG.fontFamily,
            fontWeight: DEFAULT_HEAT_DISTORTION_CONFIG.fontWeight,
            textColor: DEFAULT_HEAT_DISTORTION_CONFIG.textColor,
            backgroundColor: DEFAULT_HEAT_DISTORTION_CONFIG.backgroundColor,
            fontSize: DEFAULT_HEAT_DISTORTION_CONFIG.fontSize,
            letterSpacing: DEFAULT_HEAT_DISTORTION_CONFIG.letterSpacing,
            lineHeight: DEFAULT_HEAT_DISTORTION_CONFIG.lineHeight
          })
        }
      >
        <StudioTextarea
          label="Text"
          hint="Multiline copy rendered into the WebGL source texture"
          value={config.text}
          onChange={(text) => onPatch({ text })}
        />
        <StudioSelect
          label="Font"
          hint="Typography stack drawn onto the source canvas"
          value={config.fontFamily}
          options={FONT_OPTIONS}
          onChange={(fontFamily) => onPatch({ fontFamily })}
        />
        <StudioSelect
          label="Weight"
          hint="CSS font weight for text rendering"
          value={config.fontWeight}
          options={WEIGHT_OPTIONS}
          onChange={(fontWeight) => onPatch({ fontWeight })}
        />
        <StudioColorRow
          label="Text color"
          hint="Foreground text color"
          value={config.textColor}
          onChange={(textColor) => onPatch({ textColor })}
        />
        <StudioColorRow
          label="Background"
          hint="Background fill behind typography or image"
          value={config.backgroundColor}
          onChange={(backgroundColor) => onPatch({ backgroundColor })}
        />
        <StudioSlider
          label="Size"
          hint="Base typography size before automatic line-fit clamping"
          value={config.fontSize}
          min={20}
          max={200}
          step={1}
          onChange={(fontSize) => onPatch({ fontSize })}
        />
        <StudioSlider
          label="Letter spacing"
          hint="Tracking adjustment applied per glyph"
          value={config.letterSpacing}
          min={-5}
          max={30}
          step={0.5}
          onChange={(letterSpacing) => onPatch({ letterSpacing })}
        />
        <StudioSlider
          label="Line height"
          hint="Vertical line spacing multiplier for multiline copy"
          value={config.lineHeight}
          min={0.8}
          max={2}
          step={0.01}
          onChange={(lineHeight) => onPatch({ lineHeight })}
        />
      </StudioSection>

      <StudioSection
        title="Distortion"
        onReset={() =>
          onPatch({
            strength: DEFAULT_HEAT_DISTORTION_CONFIG.strength,
            speed: DEFAULT_HEAT_DISTORTION_CONFIG.speed,
            frequency: DEFAULT_HEAT_DISTORTION_CONFIG.frequency,
            turbulence: DEFAULT_HEAT_DISTORTION_CONFIG.turbulence
          })
        }
      >
        <StudioSlider
          label="Strength"
          hint="Overall UV displacement amplitude"
          value={config.strength}
          min={0}
          max={4}
          step={0.01}
          onChange={(strength) => onPatch({ strength })}
        />
        <StudioSlider
          label="Speed"
          hint="Shader time rate multiplier"
          value={config.speed}
          min={0}
          max={4}
          step={0.01}
          onChange={(speed) => onPatch({ speed })}
        />
        <StudioSlider
          label="Wave frequency"
          hint="Density of vertical heat shimmer ripples"
          value={config.frequency}
          min={2}
          max={120}
          step={1}
          onChange={(frequency) => onPatch({ frequency })}
        />
        <StudioSlider
          label="Turbulence"
          hint="Amount of multi-axis value noise mixing"
          value={config.turbulence}
          min={0}
          max={2}
          step={0.01}
          onChange={(turbulence) => onPatch({ turbulence })}
        />
      </StudioSection>

      <StudioSection
        title="Color split"
        onReset={() =>
          onPatch({
            chromaticAberration: DEFAULT_HEAT_DISTORTION_CONFIG.chromaticAberration
          })
        }
      >
        <StudioSlider
          label="Color split"
          hint="Horizontal RGB channel offset scaled by the heat mask"
          value={config.chromaticAberration}
          min={0}
          max={0.01}
          step={0.0001}
          onChange={(chromaticAberration) => onPatch({ chromaticAberration })}
        />
      </StudioSection>

      <StudioSection
        title="Heat mask"
        onReset={() =>
          onPatch({
            maskAngle: DEFAULT_HEAT_DISTORTION_CONFIG.maskAngle,
            maskPosition: DEFAULT_HEAT_DISTORTION_CONFIG.maskPosition,
            maskSoftness: DEFAULT_HEAT_DISTORTION_CONFIG.maskSoftness,
            patchiness: DEFAULT_HEAT_DISTORTION_CONFIG.patchiness
          })
        }
      >
        <StudioSlider
          label="Direction"
          hint="Directional sweep angle across the canvas"
          value={config.maskAngle}
          min={0}
          max={360}
          step={1}
          unit="°"
          onChange={(maskAngle) => onPatch({ maskAngle })}
        />
        <StudioSlider
          label="Position"
          hint="Gradient threshold midpoint along the mask axis"
          value={config.maskPosition}
          min={0}
          max={1}
          step={0.01}
          onChange={(maskPosition) => onPatch({ maskPosition })}
        />
        <StudioSlider
          label="Softness"
          hint="Smoothstep feather width around the heat mask edge"
          value={config.maskSoftness}
          min={0.02}
          max={0.8}
          step={0.01}
          onChange={(maskSoftness) => onPatch({ maskSoftness })}
        />
        <StudioSlider
          label="Patchiness"
          hint="Moving noise pockets breaking up the heat mask"
          value={config.patchiness}
          min={0}
          max={1}
          step={0.01}
          onChange={(patchiness) => onPatch({ patchiness })}
        />
      </StudioSection>

      <StudioSection
        title="Interaction"
        defaultOpen={false}
        onReset={() =>
          onPatch({
            mouseHeat: DEFAULT_HEAT_DISTORTION_CONFIG.mouseHeat
          })
        }
      >
        <StudioToggle
          label="Mouse heat"
          hint="Add localized heat shimmer around your pointer on hover"
          checked={config.mouseHeat}
          onChange={(mouseHeat) => onPatch({ mouseHeat })}
        />
      </StudioSection>
    </StudioPanel>
  );
}
