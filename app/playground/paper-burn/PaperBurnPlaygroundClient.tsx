"use client";

import * as React from "react";
import {
  buildPaperBurnUsageSnippet,
  DEFAULT_PAPER_BURN_CONFIG,
  PaperBurn,
  type PaperBurnConfig,
  type PaperBurnHandle
} from "@/components/ui/paper-burn";
import {
  PAPER_BURN_PRESETS,
  PaperBurnControlPanel
} from "@/components/studio/PaperBurnControlPanel";
import {
  getStageButtonStyle,
  PlaygroundWorkspace
} from "@/components/studio/PlaygroundWorkspace";
import { StudioHeaderButton } from "@/components/studio/StudioHeader";
import {
  copyImageBlobToClipboard,
  copyTextToClipboard
} from "@/lib/figma-export";

export default function PaperBurnPlaygroundClient({
  sourceCode
}: {
  sourceCode: string;
}) {
  const [config, setConfig] = React.useState<PaperBurnConfig>(
    DEFAULT_PAPER_BURN_CONFIG
  );
  const [activePresetId, setActivePresetId] = React.useState("archival-pill");
  const [liveProgress, setLiveProgress] = React.useState(0);
  const [imageSrc, setImageSrc] = React.useState<string | null>(null);
  const [fileName, setFileName] = React.useState<string | null>(null);
  const [statusMsg, setStatusMsg] = React.useState<string | null>(null);

  const burnRef = React.useRef<PaperBurnHandle | null>(null);
  const objectUrlRef = React.useRef<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const statusTimer = React.useRef<number | null>(null);

  const patch = React.useCallback((partial: Partial<PaperBurnConfig>) => {
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
    () => buildPaperBurnUsageSnippet(config),
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
    setActivePresetId("archival-pill");
    setConfig(DEFAULT_PAPER_BURN_CONFIG);
    burnRef.current?.reset();
  }, []);

  const applyPreset = (presetId: string) => {
    const found = PAPER_BURN_PRESETS.find((p) => p.id === presetId);
    if (!found) return;
    setActivePresetId(found.id);
    setConfig({ ...DEFAULT_PAPER_BURN_CONFIG, ...found.values });
    burnRef.current?.reset();
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
    const blob = await burnRef.current?.exportPngBlob();
    if (!blob) {
      flashStatus("Canvas unavailable");
      return;
    }
    const res = await copyImageBlobToClipboard(blob);
    flashStatus(
      res.ok ? "Copied PNG — Ctrl+V in Figma" : res.error || "Clipboard blocked"
    );
  };

  const isScrubLocked = config.burnMode === "scrub";

  let stageInstruction = "Press and hold the button to ignite";
  if (config.burnMode === "scrub") {
    stageInstruction = `Mid-burn preview locked at ${config.progress}%`;
  } else if (config.burnMode === "loop") {
    stageInstruction = "Auto-looping burn cycle";
  } else if (liveProgress >= 1) {
    stageInstruction =
      config.autoResetDelay > 0
        ? "Burned completely — ashes drifting, auto-restoring..."
        : "Burned to ash — ashes drifting randomly. Click Restore to bring the button back.";
  } else if (liveProgress > 0.01) {
    stageInstruction = `Burning: ${Math.round(liveProgress * 100)}%`;
  }

  return (
    <PlaygroundWorkspace
      activeHref="/playground/paper-burn"
      presets={PAPER_BURN_PRESETS}
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
        <PaperBurn
          ref={burnRef}
          {...config}
          imageSrc={imageSrc}
          onBurnProgress={setLiveProgress}
          onBurnComplete={() => flashStatus("Burn complete")}
        />
      }
      stageActions={(backdrop) => (
        <>
          <button
            type="button"
            onClick={() =>
              patch({
                burnMode: isScrubLocked ? "hold" : "scrub",
                progress: isScrubLocked ? config.progress : 45
              })
            }
            style={getStageButtonStyle(backdrop, isScrubLocked)}
          >
            {isScrubLocked ? "Mid-burn locked" : "Lock mid-burn"}
          </button>
          <button
            type="button"
            onClick={() => burnRef.current?.reset()}
            style={getStageButtonStyle(backdrop, false)}
          >
            Restore button
          </button>
          <button
            type="button"
            onClick={() => burnRef.current?.downloadPng("paper-burn-button.png")}
            style={getStageButtonStyle(backdrop, false)}
          >
            Save PNG
          </button>
        </>
      )}
      stageNote={stageInstruction}
      panel={
        <PaperBurnControlPanel
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
