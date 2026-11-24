"use client";

import * as React from "react";
import {
  DEFAULT_HEAT_DISTORTION_CONFIG,
  HEAT_DISTORTION_FONTS,
  HeatDistortion,
  type HeatDistortionConfig,
  type HeatDistortionHandle,
  type HeatDistortionImageFit,
  type HeatDistortionMode
} from "./heat-distortion";

export interface HeatDistortionStudioProps {
  /** Optional initial overrides over the studio defaults */
  initialConfig?: Partial<HeatDistortionConfig>;
  className?: string;
  style?: React.CSSProperties;
  /** Invoked whenever studio controls update the active config */
  onConfigChange?: (config: HeatDistortionConfig) => void;
  /** Optional ref to access the underlying WebGL canvas / PNG exporter */
  studioCanvasRef?: React.Ref<HeatDistortionHandle>;
}

const STUDIO_CSS = `
.hds-root {
  box-sizing: border-box;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 336px;
  gap: 20px;
  padding: 20px;
  align-items: start;
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  color: #f4f4f5;
  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  font-size: 13px;
  line-height: 1.4;
}

.hds-root *, .hds-root *::before, .hds-root *::after {
  box-sizing: border-box;
}

.hds-stage {
  width: min(100%, calc(100vh - 110px));
  min-height: 260px;
  aspect-ratio: 1;
  margin: 0 auto;
  border-radius: 14px;
  overflow: hidden;
  background-color: #09090b;
  border: 1px solid #24242b;
  box-shadow: 0 12px 36px rgba(0, 0, 0, 0.45);
}

.hds-panel {
  background-color: #16161a;
  border: 1px solid #24242b;
  border-radius: 12px;
  padding: 6px 14px 14px;
  position: sticky;
  top: 16px;
  max-height: calc(100vh - 96px);
  overflow-y: auto;
}

.hds-details {
  border-bottom: 1px solid #24242b;
  padding: 8px 0;
}

.hds-details summary {
  font-weight: 600;
  font-size: 12.5px;
  color: #e4e4e7;
  cursor: pointer;
  padding: 4px 0;
  user-select: none;
}

.hds-row {
  display: grid;
  grid-template-columns: 98px 1fr 44px;
  align-items: center;
  gap: 8px;
  margin: 8px 0;
  color: #9a9aa6;
  font-size: 12px;
}

.hds-row.hds-two {
  grid-template-columns: 98px 1fr;
}

.hds-range {
  width: 100%;
  accent-color: #3b82f6;
  cursor: ew-resize;
}

.hds-output {
  text-align: right;
  font-variant-numeric: tabular-nums;
  color: #e4e4e7;
  font-size: 11.5px;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
}

.hds-select,
.hds-textarea,
.hds-color {
  width: 100%;
  font: inherit;
  font-size: 12px;
  background-color: #24242a;
  color: #f4f4f5;
  border: 1px solid #32323c;
  border-radius: 6px;
  outline: none;
}

.hds-select {
  height: 30px;
  padding: 0 8px;
}

.hds-select option {
  background-color: #16161a;
  color: #f4f4f5;
}

.hds-textarea {
  resize: vertical;
  min-height: 58px;
  height: auto;
  padding: 7px 9px;
  line-height: 1.4;
}

.hds-color {
  padding: 2px;
  height: 30px;
  cursor: pointer;
}

.hds-file {
  width: 100%;
  font-size: 11.5px;
  color: #b4b4be;
  cursor: pointer;
}

.hds-file::file-selector-button {
  margin-right: 8px;
  padding: 4px 8px;
  border-radius: 5px;
  border: 1px solid #32323c;
  background-color: #24242a;
  color: #e4e4e7;
  font-size: 11px;
  cursor: pointer;
}

.hds-check-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #d4d4d8;
  cursor: pointer;
}

.hds-check {
  width: 15px;
  height: 15px;
  accent-color: #3b82f6;
  cursor: pointer;
}

.hds-btns {
  display: flex;
  gap: 8px;
  margin-top: 14px;
  flex-wrap: wrap;
}

.hds-btn {
  flex: 1;
  min-width: 78px;
  height: 34px;
  padding: 0 10px;
  border-radius: 8px;
  border: 1px solid #2e2e36;
  background-color: #24242a;
  color: #f4f4f5;
  font-size: 12.5px;
  font-weight: 500;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: background-color 140ms ease, border-color 140ms ease;
}

.hds-btn:hover {
  background-color: #2c2c34;
  border-color: #3c3c48;
}

.hds-btn.hds-primary {
  background-color: #3b82f6;
  border-color: #3b82f6;
  color: #ffffff;
}

.hds-btn.hds-primary:hover {
  background-color: #2563eb;
  border-color: #2563eb;
}

@media (max-width: 860px) {
  .hds-root {
    grid-template-columns: minmax(0, 1fr);
    padding: 14px;
  }
  .hds-panel {
    position: static;
    max-height: none;
  }
  .hds-stage {
    width: 100%;
  }
}
`;

function formatSliderNumber(val: number): string {
  return String(Number(val.toFixed(4)));
}

function StudioSlider({
  label,
  value,
  min,
  max,
  step,
  onChange
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (next: number) => void;
}) {
  return (
    <label className="hds-row">
      <span>{label}</span>
      <input
        className="hds-range"
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      <output className="hds-output">{formatSliderNumber(value)}</output>
    </label>
  );
}

export function HeatDistortionStudio({
  initialConfig,
  className,
  style,
  onConfigChange,
  studioCanvasRef
}: HeatDistortionStudioProps) {
  const [config, setConfig] = React.useState<HeatDistortionConfig>(() => ({
    ...DEFAULT_HEAT_DISTORTION_CONFIG,
    ...initialConfig
  }));
  const [imageSrc, setImageSrc] = React.useState<string | null>(null);
  const [paused, setPaused] = React.useState(false);

  const heatRef = React.useRef<HeatDistortionHandle | null>(null);
  const objectUrlRef = React.useRef<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const setCombinedRef = React.useCallback(
    (handle: HeatDistortionHandle | null) => {
      heatRef.current = handle;
      if (!studioCanvasRef) return;
      if (typeof studioCanvasRef === "function") {
        studioCanvasRef(handle);
      } else {
        (
          studioCanvasRef as React.MutableRefObject<HeatDistortionHandle | null>
        ).current = handle;
      }
    },
    [studioCanvasRef]
  );

  React.useEffect(() => {
    onConfigChange?.(config);
  }, [config, onConfigChange]);

  React.useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
    };
  }, []);

  const patch = React.useCallback((partial: Partial<HeatDistortionConfig>) => {
    setConfig((prev) => ({ ...prev, ...partial }));
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
    }
    const nextUrl = URL.createObjectURL(file);
    objectUrlRef.current = nextUrl;
    setImageSrc(nextUrl);
    patch({ mode: "image" });
  };

  const handleReset = () => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setImageSrc(null);
    setPaused(false);
    setConfig({ ...DEFAULT_HEAT_DISTORTION_CONFIG, ...initialConfig });
  };

  return (
    <>
      <style>{STUDIO_CSS}</style>
      <div
        className={className ? `hds-root ${className}` : "hds-root"}
        style={style}
      >
        <div className="hds-stage">
          <HeatDistortion
            ref={setCombinedRef}
            {...config}
            imageSrc={imageSrc}
            paused={paused}
          />
        </div>

        <aside className="hds-panel" aria-label="Heat Distortion controls">
          <details className="hds-details" open>
            <summary>Source</summary>
            <label className="hds-row hds-two">
              <span>Mode</span>
              <select
                className="hds-select"
                value={config.mode}
                onChange={(e) =>
                  patch({ mode: e.target.value as HeatDistortionMode })
                }
              >
                <option value="text">Text</option>
                <option value="image">Image</option>
              </select>
            </label>
            <label className="hds-row hds-two">
              <span>Upload image</span>
              <input
                ref={fileInputRef}
                className="hds-file"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
            </label>
            <label className="hds-row hds-two">
              <span>Image fit</span>
              <select
                className="hds-select"
                value={config.imageFit}
                onChange={(e) =>
                  patch({ imageFit: e.target.value as HeatDistortionImageFit })
                }
              >
                <option value="contain">Contain</option>
                <option value="cover">Cover</option>
              </select>
            </label>
            <StudioSlider
              label="Image scale"
              value={config.imageScale}
              min={0.2}
              max={2}
              step={0.01}
              onChange={(imageScale) => patch({ imageScale })}
            />
          </details>

          <details className="hds-details" open>
            <summary>Text</summary>
            <label className="hds-row hds-two">
              <span>Text</span>
              <textarea
                className="hds-textarea"
                value={config.text}
                onChange={(e) => patch({ text: e.target.value })}
              />
            </label>
            <label className="hds-row hds-two">
              <span>Font</span>
              <select
                className="hds-select"
                value={config.fontFamily}
                onChange={(e) => patch({ fontFamily: e.target.value })}
              >
                {HEAT_DISTORTION_FONTS.map((f) => (
                  <option key={f.label} value={f.value}>
                    {f.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="hds-row hds-two">
              <span>Weight</span>
              <select
                className="hds-select"
                value={config.fontWeight}
                onChange={(e) => patch({ fontWeight: e.target.value })}
              >
                <option value="300">300</option>
                <option value="400">400</option>
                <option value="600">600</option>
                <option value="800">800</option>
              </select>
            </label>
            <label className="hds-row hds-two">
              <span>Text color</span>
              <input
                className="hds-color"
                type="color"
                value={config.textColor}
                onChange={(e) => patch({ textColor: e.target.value })}
              />
            </label>
            <label className="hds-row hds-two">
              <span>Background</span>
              <input
                className="hds-color"
                type="color"
                value={config.backgroundColor}
                onChange={(e) => patch({ backgroundColor: e.target.value })}
              />
            </label>
            <StudioSlider
              label="Size"
              value={config.fontSize}
              min={20}
              max={200}
              step={1}
              onChange={(fontSize) => patch({ fontSize })}
            />
            <StudioSlider
              label="Letter spacing"
              value={config.letterSpacing}
              min={-5}
              max={30}
              step={0.5}
              onChange={(letterSpacing) => patch({ letterSpacing })}
            />
            <StudioSlider
              label="Line height"
              value={config.lineHeight}
              min={0.8}
              max={2}
              step={0.01}
              onChange={(lineHeight) => patch({ lineHeight })}
            />
          </details>

          <details className="hds-details" open>
            <summary>Distortion</summary>
            <StudioSlider
              label="Strength"
              value={config.strength}
              min={0}
              max={4}
              step={0.01}
              onChange={(strength) => patch({ strength })}
            />
            <StudioSlider
              label="Speed"
              value={config.speed}
              min={0}
              max={4}
              step={0.01}
              onChange={(speed) => patch({ speed })}
            />
            <StudioSlider
              label="Wave frequency"
              value={config.frequency}
              min={2}
              max={120}
              step={1}
              onChange={(frequency) => patch({ frequency })}
            />
            <StudioSlider
              label="Turbulence"
              value={config.turbulence}
              min={0}
              max={2}
              step={0.01}
              onChange={(turbulence) => patch({ turbulence })}
            />
          </details>

          <details className="hds-details" open>
            <summary>Color split</summary>
            <StudioSlider
              label="Color split"
              value={config.chromaticAberration}
              min={0}
              max={0.01}
              step={0.0001}
              onChange={(chromaticAberration) => patch({ chromaticAberration })}
            />
          </details>

          <details className="hds-details" open>
            <summary>Heat mask</summary>
            <StudioSlider
              label="Direction °"
              value={config.maskAngle}
              min={0}
              max={360}
              step={1}
              onChange={(maskAngle) => patch({ maskAngle })}
            />
            <StudioSlider
              label="Position"
              value={config.maskPosition}
              min={0}
              max={1}
              step={0.01}
              onChange={(maskPosition) => patch({ maskPosition })}
            />
            <StudioSlider
              label="Softness"
              value={config.maskSoftness}
              min={0.02}
              max={0.8}
              step={0.01}
              onChange={(maskSoftness) => patch({ maskSoftness })}
            />
            <StudioSlider
              label="Patchiness"
              value={config.patchiness}
              min={0}
              max={1}
              step={0.01}
              onChange={(patchiness) => patch({ patchiness })}
            />
          </details>

          <details className="hds-details">
            <summary>Interaction</summary>
            <label className="hds-row hds-two">
              <span>Mouse heat</span>
              <span className="hds-check-wrap">
                <input
                  className="hds-check"
                  type="checkbox"
                  checked={config.mouseHeat}
                  onChange={(e) => patch({ mouseHeat: e.target.checked })}
                />
                <span>{config.mouseHeat ? "Enabled" : "Disabled"}</span>
              </span>
            </label>
          </details>

          <div className="hds-btns">
            <button
              type="button"
              className="hds-btn"
              onClick={() => setPaused((p) => !p)}
            >
              {paused ? "Play" : "Pause"}
            </button>
            <button type="button" className="hds-btn" onClick={handleReset}>
              Reset
            </button>
            <button
              type="button"
              className="hds-btn hds-primary"
              onClick={() => heatRef.current?.downloadPng("heat-distortion.png")}
            >
              Save PNG
            </button>
          </div>
        </aside>
      </div>
    </>
  );
}

export default HeatDistortionStudio;
