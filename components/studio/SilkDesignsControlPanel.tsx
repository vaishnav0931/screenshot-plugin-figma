"use client";

import * as React from "react";
import {
  DEFAULT_SILK_DESIGNS_CONFIG,
  SILK_SHUFFLE_PALETTES,
  type SilkDesignsCardConfig,
} from "@/components/ui/silk-designs-card";
import {
  StudioColorRow,
  StudioPanel,
  StudioSection,
  StudioSlider,
  StudioToggle,
} from "@/components/studio/StudioControls";

export const SILK_DESIGNS_PRESETS: ReadonlyArray<{
  id: string;
  name: string;
  accent: string;
  values: Partial<SilkDesignsCardConfig>;
}> = [
  {
    id: "Editorial-silk",
    name: "Editorial Silk",
    accent: "#ff2e93",
    values: { ...DEFAULT_SILK_DESIGNS_CONFIG },
  },
  {
    id: "sunset-velvet",
    name: "Sunset Velvet",
    accent: "#ef476f",
    values: {
      colorTopLeft: "#ffd166",
      colorRight: "#ef476f",
      colorMiddle: "#5a189a",
      colorTopRight: "#90e0ef",
      foldScale: 2.1,
      relief: 1.65,
      highlight: 0.95,
    },
  },
  {
    id: "aurora-satin",
    name: "Aurora Satin",
    accent: "#4cc9f0",
    values: {
      colorTopLeft: "#f9f871",
      colorRight: "#ff4d6d",
      colorMiddle: "#4361ee",
      colorTopRight: "#b8f2e6",
      foldScale: 2.75,
      relief: 1.35,
      glow: 0.9,
      bloom: 0.65,
    },
  },
  {
    id: "neon-drape",
    name: "Neon Drape",
    accent: "#8338ec",
    values: {
      colorTopLeft: "#ffbe0b",
      colorRight: "#ff006e",
      colorMiddle: "#8338ec",
      colorTopRight: "#a2d2ff",
      speed: 0.8,
      relief: 1.85,
      highlight: 1.15,
    },
  },
  {
    id: "prism-fold",
    name: "Prism Fold",
    accent: "#f72585",
    values: {
      colorTopLeft: "#ffe66d",
      colorRight: "#f72585",
      colorMiddle: "#7209b7",
      colorTopRight: "#4cc9f0",
      foldScale: 3.1,
      relief: 1.55,
      grain: 0.06,
    },
  },
];

export function SilkDesignsControlPanel({
  config,
  onPatch,
  onResetAll,
  onShuffleColors,
  width = 320,
}: {
  config: SilkDesignsCardConfig;
  onPatch: (partial: Partial<SilkDesignsCardConfig>) => void;
  onResetAll: () => void;
  onShuffleColors: () => void;
  width?: number;
}) {
  return (
    <StudioPanel title="Silk Designs Card" onResetAll={onResetAll} width={width}>
      <StudioSection
        title="Silk folds & motion"
        onReset={() =>
          onPatch({
            speed: DEFAULT_SILK_DESIGNS_CONFIG.speed,
            foldScale: DEFAULT_SILK_DESIGNS_CONFIG.foldScale,
            relief: DEFAULT_SILK_DESIGNS_CONFIG.relief,
            paused: DEFAULT_SILK_DESIGNS_CONFIG.paused,
          })
        }
      >
        <StudioSlider
          label="Scroll speed"
          hint="Velocity of the domain-warped fBm silk height field"
          value={config.speed}
          min={0}
          max={2}
          step={0.05}
          unit="x"
          formatValue={(v) => v.toFixed(2)}
          onChange={(speed) => onPatch({ speed })}
        />
        <StudioSlider
          label="Fold size"
          hint="Spatial scale of the domain-warped silk folds"
          value={config.foldScale}
          min={0.8}
          max={5}
          step={0.05}
          formatValue={(v) => v.toFixed(2)}
          onChange={(foldScale) => onPatch({ foldScale })}
        />
        <StudioSlider
          label="3D relief"
          hint="Finite-difference surface normal depth for 3D silk shading"
          value={config.relief}
          min={0}
          max={3}
          step={0.05}
          formatValue={(v) => v.toFixed(2)}
          onChange={(relief) => onPatch({ relief })}
        />
        <StudioToggle
          label="Pause animation"
          hint="Freeze the scrolling height field while keeping pointer lighting active"
          checked={config.paused}
          onChange={(paused) => onPatch({ paused })}
        />
      </StudioSection>

      <StudioSection
        title="Lighting & finish"
        onReset={() =>
          onPatch({
            highlight: DEFAULT_SILK_DESIGNS_CONFIG.highlight,
            glow: DEFAULT_SILK_DESIGNS_CONFIG.glow,
            bloom: DEFAULT_SILK_DESIGNS_CONFIG.bloom,
            grain: DEFAULT_SILK_DESIGNS_CONFIG.grain,
            tiltMax: DEFAULT_SILK_DESIGNS_CONFIG.tiltMax,
          })
        }
      >
        <StudioSlider
          label="Highlights"
          hint="Specular sheen intensity following the pointer light"
          value={config.highlight}
          min={0}
          max={2}
          step={0.05}
          formatValue={(v) => v.toFixed(2)}
          onChange={(highlight) => onPatch({ highlight })}
        />
        <StudioSlider
          label="Rim glow"
          hint="Fresnel pink rim glow along grazing silk folds"
          value={config.glow}
          min={0}
          max={2}
          step={0.05}
          formatValue={(v) => v.toFixed(2)}
          onChange={(glow) => onPatch({ glow })}
        />
        <StudioSlider
          label="Inner bloom"
          hint="Soft inner radiance around the pointer and center"
          value={config.bloom}
          min={0}
          max={2}
          step={0.05}
          formatValue={(v) => v.toFixed(2)}
          onChange={(bloom) => onPatch({ bloom })}
        />
        <StudioSlider
          label="Film grain"
          hint="Fine animated film grain over the silk gradient"
          value={config.grain}
          min={0}
          max={0.2}
          step={0.005}
          formatValue={(v) => v.toFixed(3)}
          onChange={(grain) => onPatch({ grain })}
        />
        <StudioSlider
          label="3D pointer tilt"
          hint="Maximum CSS perspective tilt angle toward the pointer (up to 16° default)"
          value={config.tiltMax}
          min={0}
          max={28}
          step={1}
          unit="°"
          onChange={(tiltMax) => onPatch({ tiltMax })}
        />
      </StudioSection>

      <StudioSection
        title="Gradient palette"
        onReset={() =>
          onPatch({
            colorTopLeft: DEFAULT_SILK_DESIGNS_CONFIG.colorTopLeft,
            colorTopRight: DEFAULT_SILK_DESIGNS_CONFIG.colorTopRight,
            colorMiddle: DEFAULT_SILK_DESIGNS_CONFIG.colorMiddle,
            colorRight: DEFAULT_SILK_DESIGNS_CONFIG.colorRight,
          })
        }
      >
        <StudioColorRow
          label="Top-left (Yellow)"
          hint="Warm yellow highlight anchored in the top-left corner"
          value={config.colorTopLeft}
          onChange={(colorTopLeft) => onPatch({ colorTopLeft })}
          onClear={() =>
            onPatch({
              colorTopLeft: DEFAULT_SILK_DESIGNS_CONFIG.colorTopLeft,
            })
          }
        />
        <StudioColorRow
          label="Top-right (Pale blue)"
          hint="Cool pale blue wash in the top-right corner"
          value={config.colorTopRight}
          onChange={(colorTopRight) => onPatch({ colorTopRight })}
          onClear={() =>
            onPatch({
              colorTopRight: DEFAULT_SILK_DESIGNS_CONFIG.colorTopRight,
            })
          }
        />
        <StudioColorRow
          label="Middle (Violet)"
          hint="Deep violet core in the center of the silk folds"
          value={config.colorMiddle}
          onChange={(colorMiddle) => onPatch({ colorMiddle })}
          onClear={() =>
            onPatch({ colorMiddle: DEFAULT_SILK_DESIGNS_CONFIG.colorMiddle })
          }
        />
        <StudioColorRow
          label="Right (Hot pink)"
          hint="Vibrant hot pink accent along the right side and rim glow"
          value={config.colorRight}
          onChange={(colorRight) => onPatch({ colorRight })}
          onClear={() =>
            onPatch({ colorRight: DEFAULT_SILK_DESIGNS_CONFIG.colorRight })
          }
        />

        <div style={{ display: "flex", gap: 8, paddingTop: 4 }}>
          <button
            type="button"
            onClick={onShuffleColors}
            style={{
              flex: 1,
              height: 30,
              padding: "0 10px",
              borderRadius: 6,
              backgroundColor: "#24242a",
              borderWidth: 1,
              borderStyle: "solid",
              borderColor: "#32323c",
              color: "#ececf0",
              fontSize: 12,
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Shuffle colors
          </button>
          <button
            type="button"
            onClick={onResetAll}
            style={{
              height: 30,
              padding: "0 12px",
              borderRadius: 6,
              backgroundColor: "#18181c",
              borderWidth: 1,
              borderStyle: "solid",
              borderColor: "#2e2e36",
              color: "#a1a1aa",
              fontSize: 12,
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Reset
          </button>
        </div>
      </StudioSection>
    </StudioPanel>
  );
}

export { SILK_SHUFFLE_PALETTES };
