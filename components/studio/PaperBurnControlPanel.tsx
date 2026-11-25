"use client";

import * as React from "react";
import {
  DEFAULT_PAPER_BURN_CONFIG,
  PAPER_BURN_FONTS,
  type PaperBurnConfig,
  type PaperBurnImageFit,
  type PaperBurnMode,
  type PaperBurnOrigin,
  type PaperBurnReleaseBehavior,
  type PaperBurnSize,
  type PaperBurnSourceMode
} from "@/components/ui/paper-burn";
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

export const PAPER_BURN_PRESETS: ReadonlyArray<{
  id: string;
  name: string;
  accent: string;
  values: Partial<PaperBurnConfig>;
}> = [
  {
    id: "archival-pill",
    name: "Archival Pill",
    accent: "#f97316",
    values: { ...DEFAULT_PAPER_BURN_CONFIG }
  },
  {
    id: "midnight-ash",
    name: "Midnight Ash",
    accent: "#ef4444",
    values: {
      paperColor: "#1a1b23",
      inkColor: "#f4f4f5",
      emberColor: "#ff551a",
      charColor: "#08090d",
      glowStrength: 88,
      emberWidth: 34,
      paperGrain: 20
    }
  },
  {
    id: "plasma-torch",
    name: "Plasma Torch",
    accent: "#38bdf8",
    values: {
      paperColor: "#121723",
      inkColor: "#e2e8f0",
      emberColor: "#38bdf8",
      charColor: "#080c15",
      burnOrigin: "right",
      glowStrength: 90,
      emberWidth: 36
    }
  },
  {
    id: "relic-ticket",
    name: "Relic Ticket",
    accent: "#d97706",
    values: {
      label: "Hold to destroy",
      paperColor: "#efe2c8",
      inkColor: "#2b1d14",
      fontFamily: "Georgia, serif",
      borderRadius: 12,
      burnOrigin: "edges",
      raggedness: 74,
      charWidth: 56
    }
  },
  {
    id: "fuse-sweep",
    name: "Fuse Sweep",
    accent: "#f59e0b",
    values: {
      label: "Hold to ignite",
      paperColor: "#faf6ef",
      inkColor: "#18181b",
      fontFamily: "Courier New, monospace",
      burnOrigin: "left",
      holdDuration: 1800,
      emberColor: "#f97316",
      raggedness: 58
    }
  }
];

const BURN_MODE_OPTIONS: ReadonlyArray<{ value: PaperBurnMode; label: string }> = [
  { value: "hold", label: "Press & hold button" },
  { value: "scrub", label: "Static scrub (preview)" },
  { value: "loop", label: "Auto loop" }
];

const RELEASE_OPTIONS: ReadonlyArray<{
  value: PaperBurnReleaseBehavior;
  label: string;
}> = [
  { value: "recover", label: "Extinguish & heal" },
  { value: "stay", label: "Keep partial burn" }
];

const ORIGIN_OPTIONS: ReadonlyArray<{ value: PaperBurnOrigin; label: string }> = [
  { value: "pointer", label: "Where pressed" },
  { value: "right", label: "Right flame icon" },
  { value: "left", label: "Left fuse sweep" },
  { value: "edges", label: "Outer edges inward" },
  { value: "center", label: "Center outward" }
];

const SIZE_OPTIONS: ReadonlyArray<{ value: PaperBurnSize; label: string }> = [
  { value: "lg", label: "Large (380 × 68)" },
  { value: "md", label: "Medium (284 × 52)" },
  { value: "sm", label: "Small (216 × 40)" }
];

const MODE_OPTIONS: ReadonlyArray<{ value: PaperBurnSourceMode; label: string }> = [
  { value: "text", label: "Paper stock" },
  { value: "image", label: "Image texture" }
];

const FIT_OPTIONS: ReadonlyArray<{ value: PaperBurnImageFit; label: string }> = [
  { value: "cover", label: "Cover" },
  { value: "contain", label: "Contain" }
];

const FONT_OPTIONS = PAPER_BURN_FONTS.map((f) => ({
  value: f.value,
  label: f.label
}));

const WEIGHT_OPTIONS: ReadonlyArray<{ value: string; label: string }> = [
  { value: "400", label: "Regular (400)" },
  { value: "500", label: "Medium (500)" },
  { value: "600", label: "Semibold (600)" },
  { value: "700", label: "Bold (700)" }
];

export function PaperBurnControlPanel({
  config,
  fileName,
  onPatch,
  onImageFileSelect,
  onClearImage,
  onResetAll,
  width = 320,
  fileInputRef
}: {
  config: PaperBurnConfig;
  fileName?: string | null;
  onPatch: (partial: Partial<PaperBurnConfig>) => void;
  onImageFileSelect: (file: File) => void;
  onClearImage?: () => void;
  onResetAll: () => void;
  width?: number;
  fileInputRef?: React.RefObject<HTMLInputElement | null>;
}) {
  return (
    <StudioPanel title="Paper Burn" onResetAll={onResetAll} width={width}>
      <StudioSection
        title="Hold interaction"
        onReset={() =>
          onPatch({
            burnMode: DEFAULT_PAPER_BURN_CONFIG.burnMode,
            holdDuration: DEFAULT_PAPER_BURN_CONFIG.holdDuration,
            releaseBehavior: DEFAULT_PAPER_BURN_CONFIG.releaseBehavior,
            autoResetDelay: DEFAULT_PAPER_BURN_CONFIG.autoResetDelay,
            showRestoreButton: DEFAULT_PAPER_BURN_CONFIG.showRestoreButton,
            restoreLabel: DEFAULT_PAPER_BURN_CONFIG.restoreLabel,
            burnOrigin: DEFAULT_PAPER_BURN_CONFIG.burnOrigin,
            hoverEmber: DEFAULT_PAPER_BURN_CONFIG.hoverEmber,
            progress: DEFAULT_PAPER_BURN_CONFIG.progress,
            speed: DEFAULT_PAPER_BURN_CONFIG.speed
          })
        }
      >
        <StudioSelect
          label="Trigger mode"
          hint="Press and hold the button to burn it, scrub a static frame, or auto-loop"
          value={config.burnMode}
          options={BURN_MODE_OPTIONS}
          onChange={(burnMode) => onPatch({ burnMode })}
        />
        <StudioSelect
          label="Ignition origin"
          hint="Where the flame starts when you press and hold the button"
          value={config.burnOrigin}
          options={ORIGIN_OPTIONS}
          onChange={(burnOrigin) => onPatch({ burnOrigin })}
        />
        {config.burnMode === "hold" && (
          <>
            <StudioSlider
              label="Hold duration"
              hint="Time required to burn the button completely away"
              value={config.holdDuration}
              min={400}
              max={4000}
              step={100}
              unit="ms"
              onChange={(holdDuration) => onPatch({ holdDuration })}
            />
            <StudioSelect
              label="Early release"
              hint="Extinguish back to intact paper or freeze the partial burn"
              value={config.releaseBehavior}
              options={RELEASE_OPTIONS}
              onChange={(releaseBehavior) => onPatch({ releaseBehavior })}
            />
            <StudioSlider
              label="Auto restore"
              hint="0ms stays burned with flying ashes & Restore button; >0ms auto-restores"
              value={config.autoResetDelay}
              min={0}
              max={4000}
              step={100}
              unit="ms"
              onChange={(autoResetDelay) => onPatch({ autoResetDelay })}
            />
            <StudioToggle
              label="Restore button"
              hint="Show built-in Restore button amidst the flying ashes after 100% burn"
              checked={config.showRestoreButton}
              onChange={(showRestoreButton) => onPatch({ showRestoreButton })}
            />
            {config.showRestoreButton && (
              <StudioTextarea
                label="Restore label"
                hint="Text displayed on the post-burn Restore button"
                rows={1}
                value={config.restoreLabel}
                onChange={(restoreLabel) =>
                  onPatch({ restoreLabel: restoreLabel.replace(/\n/g, " ") })
                }
              />
            )}
          </>
        )}
        {config.burnMode === "scrub" && (
          <StudioSlider
            label="Burn progress"
            hint="Static burn percentage for inspecting or exporting to Figma"
            value={config.progress}
            min={0}
            max={100}
            step={1}
            unit="%"
            onChange={(progress) => onPatch({ progress })}
          />
        )}
        {config.burnMode === "loop" && (
          <StudioSlider
            label="Loop speed"
            hint="Playback rate for continuous preview loop"
            value={config.speed}
            min={0.1}
            max={2.5}
            step={0.05}
            unit="x"
            onChange={(speed) => onPatch({ speed })}
          />
        )}
        <StudioToggle
          label="Hover singe"
          hint="Show subtle warm ember toast under the cursor before pressing"
          checked={config.hoverEmber}
          onChange={(hoverEmber) => onPatch({ hoverEmber })}
        />
      </StudioSection>

      <StudioSection
        title="Ember & char"
        onReset={() =>
          onPatch({
            emberColor: DEFAULT_PAPER_BURN_CONFIG.emberColor,
            charColor: DEFAULT_PAPER_BURN_CONFIG.charColor,
            emberWidth: DEFAULT_PAPER_BURN_CONFIG.emberWidth,
            charWidth: DEFAULT_PAPER_BURN_CONFIG.charWidth,
            raggedness: DEFAULT_PAPER_BURN_CONFIG.raggedness,
            noiseScale: DEFAULT_PAPER_BURN_CONFIG.noiseScale,
            glowStrength: DEFAULT_PAPER_BURN_CONFIG.glowStrength,
            ashIntensity: DEFAULT_PAPER_BURN_CONFIG.ashIntensity,
            transparentBurn: DEFAULT_PAPER_BURN_CONFIG.transparentBurn,
            revealColor: DEFAULT_PAPER_BURN_CONFIG.revealColor
          })
        }
      >
        <StudioColorRow
          label="Ember glow"
          hint="Incandescent filament and spark color along the burning edge"
          value={config.emberColor}
          onChange={(emberColor) => onPatch({ emberColor })}
        />
        <StudioColorRow
          label="Char carbon"
          hint="Color of blackened carbonized paper"
          value={config.charColor}
          onChange={(charColor) => onPatch({ charColor })}
        />
        <StudioSlider
          label="Edge raggedness"
          hint="Organic FBM tearing depth along the flame front"
          value={config.raggedness}
          min={0}
          max={100}
          step={1}
          unit="%"
          onChange={(raggedness) => onPatch({ raggedness })}
        />
        <StudioSlider
          label="Pocket scale"
          hint="Spatial frequency of irregular burn pockets"
          value={config.noiseScale}
          min={1}
          max={10}
          step={0.1}
          onChange={(noiseScale) => onPatch({ noiseScale })}
        />
        <StudioSlider
          label="Ember width"
          hint="Thickness of the glowing combustion line"
          value={config.emberWidth}
          min={5}
          max={100}
          step={1}
          unit="%"
          onChange={(emberWidth) => onPatch({ emberWidth })}
        />
        <StudioSlider
          label="Char & scorch"
          hint="Width of blackened char and toasted sepia halo"
          value={config.charWidth}
          min={5}
          max={100}
          step={1}
          unit="%"
          onChange={(charWidth) => onPatch({ charWidth })}
        />
        <StudioSlider
          label="Glow & sparks"
          hint="Intensity of outer heat bloom and rising sparks"
          value={config.glowStrength}
          min={0}
          max={100}
          step={1}
          unit="%"
          onChange={(glowStrength) => onPatch({ glowStrength })}
        />
        <StudioSlider
          label="Flying ashes"
          hint="Density of random tumbling ash flakes during and after burn"
          value={config.ashIntensity}
          min={0}
          max={100}
          step={1}
          unit="%"
          onChange={(ashIntensity) => onPatch({ ashIntensity })}
        />
        <StudioToggle
          label="Transparent cutout"
          hint="Make burned holes transparent so backdrops and Figma layers show through"
          checked={config.transparentBurn}
          onChange={(transparentBurn) => onPatch({ transparentBurn })}
        />
        {!config.transparentBurn && (
          <StudioColorRow
            label="Reveal fill"
            hint="Solid color revealed inside burned holes"
            value={config.revealColor}
            onChange={(revealColor) => onPatch({ revealColor })}
          />
        )}
      </StudioSection>

      <StudioSection
        title="Button & text"
        onReset={() =>
          onPatch({
            label: DEFAULT_PAPER_BURN_CONFIG.label,
            size: DEFAULT_PAPER_BURN_CONFIG.size,
            borderRadius: DEFAULT_PAPER_BURN_CONFIG.borderRadius,
            showIcon: DEFAULT_PAPER_BURN_CONFIG.showIcon,
            paperColor: DEFAULT_PAPER_BURN_CONFIG.paperColor,
            inkColor: DEFAULT_PAPER_BURN_CONFIG.inkColor,
            paperGrain: DEFAULT_PAPER_BURN_CONFIG.paperGrain,
            fontFamily: DEFAULT_PAPER_BURN_CONFIG.fontFamily,
            fontWeight: DEFAULT_PAPER_BURN_CONFIG.fontWeight,
            letterSpacing: DEFAULT_PAPER_BURN_CONFIG.letterSpacing
          })
        }
      >
        <StudioTextarea
          label="Button label"
          hint="Text printed onto the button surface"
          rows={1}
          value={config.label}
          onChange={(label) => onPatch({ label: label.replace(/\n/g, " ") })}
        />
        <StudioSelect
          label="Size"
          hint="Preset button dimensions"
          value={config.size}
          options={SIZE_OPTIONS}
          onChange={(size) => onPatch({ size })}
        />
        <StudioSlider
          label="Corner radius"
          hint="Button corner rounding (34px+ creates a full pill)"
          value={config.borderRadius}
          min={4}
          max={36}
          step={1}
          unit="px"
          onChange={(borderRadius) => onPatch({ borderRadius })}
        />
        <StudioToggle
          label="Flame icon"
          hint="Display trailing flame icon on the right side of the button"
          checked={config.showIcon}
          onChange={(showIcon) => onPatch({ showIcon })}
        />
        <StudioColorRow
          label="Paper stock"
          hint="Base button surface color"
          value={config.paperColor}
          onChange={(paperColor) => onPatch({ paperColor })}
        />
        <StudioColorRow
          label="Ink color"
          hint="Printed label and icon color"
          value={config.inkColor}
          onChange={(inkColor) => onPatch({ inkColor })}
        />
        <StudioSlider
          label="Paper grain"
          hint="Cellulose fiber texture across unburned paper"
          value={config.paperGrain}
          min={0}
          max={100}
          step={1}
          unit="%"
          onChange={(paperGrain) => onPatch({ paperGrain })}
        />
        <StudioSelect
          label="Font"
          hint="Typeface printed on the button"
          value={config.fontFamily}
          options={FONT_OPTIONS}
          onChange={(fontFamily) => onPatch({ fontFamily })}
        />
        <StudioSelect
          label="Weight"
          hint="Font weight for button text"
          value={config.fontWeight}
          options={WEIGHT_OPTIONS}
          onChange={(fontWeight) => onPatch({ fontWeight })}
        />
        <StudioSlider
          label="Letter spacing"
          hint="Glyph tracking adjustment"
          value={config.letterSpacing}
          min={-3}
          max={12}
          step={0.2}
          unit="px"
          onChange={(letterSpacing) => onPatch({ letterSpacing })}
        />
      </StudioSection>

      <StudioSection
        title="Image texture"
        defaultOpen={false}
        onReset={() => {
          onClearImage?.();
          onPatch({
            mode: DEFAULT_PAPER_BURN_CONFIG.mode,
            imageFit: DEFAULT_PAPER_BURN_CONFIG.imageFit,
            imageScale: DEFAULT_PAPER_BURN_CONFIG.imageScale
          });
        }}
      >
        <StudioSelect
          label="Surface fill"
          hint="Use plain paper stock or overlay a custom image onto the button"
          value={config.mode}
          options={MODE_OPTIONS}
          onChange={(mode) => onPatch({ mode })}
        />
        <StudioFileRow
          label="Upload texture"
          hint="Select an image to print onto the button surface"
          fileName={fileName}
          inputRef={fileInputRef}
          onFileSelect={onImageFileSelect}
          onClear={onClearImage}
        />
        <StudioSelect
          label="Image fit"
          hint="Cover or contain the uploaded image inside the button"
          value={config.imageFit}
          options={FIT_OPTIONS}
          onChange={(imageFit) => onPatch({ imageFit })}
        />
        <StudioSlider
          label="Image scale"
          hint="Scale factor applied to the uploaded texture"
          value={config.imageScale}
          min={0.2}
          max={2}
          step={0.01}
          onChange={(imageScale) => onPatch({ imageScale })}
        />
      </StudioSection>
    </StudioPanel>
  );
}
