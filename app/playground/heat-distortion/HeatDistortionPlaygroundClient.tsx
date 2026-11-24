"use client";

import * as React from "react";
import {
  buildHeatDistortionUsageSnippet,
  DEFAULT_HEAT_DISTORTION_CONFIG,
  HeatDistortion,
  type HeatDistortionConfig,
  type HeatDistortionHandle
} from "@/components/ui/heat-distortion";
import {
  HEAT_STUDIO_PRESETS,
  HeatDistortionControlPanel
} from "@/components/studio/HeatDistortionControlPanel";
import {
  getStageButtonStyle,
  PlaygroundWorkspace
} from "@/components/studio/PlaygroundWorkspace";
import { StudioHeaderButton } from "@/components/studio/StudioHeader";
import {
  copyImageBlobToClipboard,
  copyTextToClipboard
} from "@/lib/figma-export";

export default function HeatDistortionPlaygroundClient({
  sourceCode
}: {
  sourceCode: string;
}) {
  const [config, setConfig] = React.useState<HeatDistortionConfig>(
    DEFAULT_HEAT_DISTORTION_CONFIG
  );
  const [activePresetId, setActivePresetId] = React.useState("runway-shimmer");
  const [paused, setPaused] = React.useState(false);
  const [imageSrc, setImageSrc] = React.useState<string | null>(null);
  const [fileName, setFileName] = React.useState<string | null>(null);
  const [statusMsg, setStatusMsg] = React.useState<string | null>(null);

  const heatRef = React.useRef<HeatDistortionHandle | null>(null);
  const objectUrlRef = React.useRef<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const statusTimer = React.useRef<number | null>(null);

  const patch = React.useCallback((partial: Partial<HeatDistortionConfig>) => {
    setActivePresetId("");
    setConfig((prev) => ({ ...prev, ...partial }));
  }, []);

  const flashStatus = React.useCallback((msg: string) => {
    setStatusMsg(msg);
    if (statusTimer.current) window.clearTimeout(statusTimer.current);
    statusTimer.current = window.setTimeout(() => setStatusMsg(null), 2400);
  }, []);

  React.useEffect(() => {
    return () => {
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
      if (statusTimer.current) window.clearTimeout(statusTimer.current);
    };
  }, []);

  const usageSnippet = React.useMemo(
    () => buildHeatDistortionUsageSnippet(config),
    [config]
  );

  const handleImageFileSelect = React.useCallback((file: File) => {
    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    const nextUrl = URL.createObjectURL(file);
    objectUrlRef.current = nextUrl;
    setImageSrc(nextUrl);
    setFileName(file.name);
    setActivePresetId("");
    setConfig((prev) => ({ ...prev, mode: "image" }));
  }, []);

  const handleClearImage = React.useCallback(() => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
    setImageSrc(null);
    setFileName(null);
    setConfig((prev) =>
      prev.mode === "image" ? { ...prev, mode: "text" } : prev
    );
  }, []);

  const resetAll = React.useCallback(() => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
    setImageSrc(null);
    setFileName(null);
    setPaused(false);
    setActivePresetId("runway-shimmer");
    setConfig(DEFAULT_HEAT_DISTORTION_CONFIG);
  }, []);

  const applyPreset = (presetId: string) => {
    const found = HEAT_STUDIO_PRESETS.find((p) => p.id === presetId);
    if (!found) return;
    setActivePresetId(found.id);
    setConfig({ ...DEFAULT_HEAT_DISTORTION_CONFIG, ...found.values });
  };

  const handleCopyJsx = async () => {
    const ok = await copyTextToClipboard(usageSnippet);
    flashStatus(ok ? "Copied live JSX snippet" : "Clipboard blocked");
  };

  const handleCopyTsx = async () => {
    const ok = await copyTextToClipboard(sourceCode);
    flashStatus(ok ? "Copied component TSX" : "Clipboard blocked");
  };

  const handleCopyFigmaPng = async () => {
    const blob = await heatRef.current?.exportPngBlob();
    if (!blob) {
      flashStatus("Canvas unavailable");
      return;
    }
    const res = await copyImageBlobToClipboard(blob);
    flashStatus(
      res.ok ? "Copied PNG — Ctrl+V in Figma" : res.error || "Clipboard blocked"
    );
  };

  return (
    <PlaygroundWorkspace
      activeHref="/playground/heat-distortion"
      presets={HEAT_STUDIO_PRESETS}
      activePresetId={activePresetId}
      onSelectPreset={applyPreset}
      statusMsg={statusMsg}
      usageSnippet={usageSnippet}
      sourceCode={sourceCode}
      onCopyJsx={handleCopyJsx}
      onCopyTsx={handleCopyTsx}
      onResetAll={resetAll}
      headerActions={
        <StudioHeaderButton onClick={handleCopyFigmaPng}>
          Copy PNG for Figma
        </StudioHeaderButton>
      }
      stageContent={
        <div
          style={{
            width: "min(100%, 460px)",
            aspectRatio: "1",
            borderRadius: 12,
            overflow: "hidden",
            borderWidth: 1,
            borderStyle: "solid",
            borderColor: "#24242b",
            boxShadow: "0 14px 40px rgba(0, 0, 0, 0.45)"
          }}
        >
          <HeatDistortion
            ref={heatRef}
            {...config}
            imageSrc={imageSrc}
            paused={paused}
          />
        </div>
      }
      stageActions={(backdrop) => (
        <>
          <button
            type="button"
            onClick={() => setPaused((p) => !p)}
            style={getStageButtonStyle(backdrop, paused)}
          >
            {paused ? "Play" : "Pause"}
          </button>
          <button
            type="button"
            onClick={() => heatRef.current?.downloadPng("heat-distortion.png")}
            style={getStageButtonStyle(backdrop, false)}
          >
            Save PNG
          </button>
        </>
      )}
      panel={
        <HeatDistortionControlPanel
          config={config}
          fileName={fileName}
          fileInputRef={fileInputRef}
          onPatch={patch}
          onImageFileSelect={handleImageFileSelect}
          onClearImage={handleClearImage}
          onResetAll={resetAll}
          width={320}
        />
      }
    />
  );
}
