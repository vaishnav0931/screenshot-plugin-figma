"use client";

import * as React from "react";
import { PixelPromptButton } from "@/components/ui/pixel-prompt-button";
import {
  buildPixelUsageSnippet,
  DEFAULT_PIXEL_STUDIO_CONFIG,
  PixelControlPanel,
  STUDIO_PRESETS,
  type PixelStudioConfig
} from "@/components/studio/PixelControlPanel";
import {
  getStageButtonStyle,
  PlaygroundWorkspace
} from "@/components/studio/PlaygroundWorkspace";
import { StudioHeaderButton } from "@/components/studio/StudioHeader";
import {
  buildPixelPromptButtonSvg,
  copyTextToClipboard
} from "@/lib/figma-export";

export default function PixelPlaygroundClient({
  sourceCode
}: {
  sourceCode: string;
}) {
  const [config, setConfig] = React.useState<PixelStudioConfig>(
    DEFAULT_PIXEL_STUDIO_CONFIG
  );
  const [activePresetId, setActivePresetId] = React.useState("cobalt-classic");
  const [statusMsg, setStatusMsg] = React.useState<string | null>(null);
  const [lastCopiedPrompt, setLastCopiedPrompt] = React.useState<string | null>(
    null
  );
  const statusTimer = React.useRef<number | null>(null);

  const patch = React.useCallback((partial: Partial<PixelStudioConfig>) => {
    setActivePresetId("");
    setConfig((prev) => ({ ...prev, ...partial }));
  }, []);

  const flashStatus = React.useCallback((msg: string) => {
    setStatusMsg(msg);
    if (statusTimer.current) window.clearTimeout(statusTimer.current);
    statusTimer.current = window.setTimeout(() => setStatusMsg(null), 2200);
  }, []);

  React.useEffect(() => {
    return () => {
      if (statusTimer.current) window.clearTimeout(statusTimer.current);
    };
  }, []);

  const usageSnippet = React.useMemo(
    () => buildPixelUsageSnippet(config),
    [config]
  );

  const handleCopyJsx = async () => {
    const ok = await copyTextToClipboard(usageSnippet);
    flashStatus(ok ? "Copied live JSX snippet" : "Clipboard blocked");
  };

  const handleCopyFigmaSvg = async () => {
    const svg = buildPixelPromptButtonSvg({
      baseColor: config.baseColor,
      highlightColor: config.highlightColor,
      hoverGradientColor: config.hoverGradientColor || undefined,
      textColor: config.textColor,
      pixelSize: config.pixelSize,
      pixelGap: config.pixelGap,
      pixelRadius: config.pixelRadius,
      pixelContrast: config.pixelContrast,
      gradientStart: config.gradientStart,
      gradientEnd: config.gradientEnd
    });
    const ok = await copyTextToClipboard(svg);
    flashStatus(
      ok ? "Copied Figma vector SVG — Ctrl+V in Figma" : "Clipboard blocked"
    );
  };

  const handleCopyTsx = async () => {
    const ok = await copyTextToClipboard(sourceCode);
    flashStatus(ok ? "Copied component TSX" : "Clipboard blocked");
  };

  const applyPreset = (presetId: string) => {
    const found = STUDIO_PRESETS.find((p) => p.id === presetId);
    if (!found) return;
    setActivePresetId(found.id);
    setConfig({ ...DEFAULT_PIXEL_STUDIO_CONFIG, ...found.values });
  };

  const resetAll = () => {
    setActivePresetId("cobalt-classic");
    setConfig(DEFAULT_PIXEL_STUDIO_CONFIG);
  };

  const isHoverLocked = config.mouseOverMode === "always-on";

  return (
    <PlaygroundWorkspace
      activeHref="/playground/pixel-prompt-button"
      presets={STUDIO_PRESETS}
      activePresetId={activePresetId}
      onSelectPreset={applyPreset}
      statusMsg={statusMsg}
      usageSnippet={usageSnippet}
      sourceCode={sourceCode}
      onCopyJsx={handleCopyJsx}
      onCopyTsx={handleCopyTsx}
      onResetAll={resetAll}
      headerActions={
        <StudioHeaderButton onClick={handleCopyFigmaSvg}>
          Copy SVG for Figma
        </StudioHeaderButton>
      }
      stageContent={
        <PixelPromptButton
          baseColor={config.baseColor}
          highlightColor={config.highlightColor}
          textColor={config.textColor}
          glowIntensity={config.glowIntensity}
          pixelSize={config.pixelSize}
          pixelGap={config.pixelGap}
          pixelRadius={config.pixelRadius}
          pixelContrast={config.pixelContrast}
          animationMode={config.animationMode}
          animationSpeed={config.animationSpeed}
          danceAmount={config.danceAmount}
          mouseOverMode={config.mouseOverMode}
          hoverEffect={config.hoverEffect}
          hoverRadius={config.hoverRadius}
          hoverIntensity={config.hoverIntensity}
          gradientCurve={config.gradientCurve}
          gradientStart={config.gradientStart}
          gradientEnd={config.gradientEnd}
          hoverBloom={config.hoverBloom}
          hoverGradientColor={config.hoverGradientColor || undefined}
          transitionDuration={config.transitionDuration}
          transitionEasing={config.transitionEasing}
          cursorSmoothness={config.cursorSmoothness}
          hoverLift={config.hoverLift}
          onCopyPrompt={(text) => setLastCopiedPrompt(text)}
        />
      }
      stageActions={(backdrop) => (
        <button
          type="button"
          onClick={() =>
            patch({ mouseOverMode: isHoverLocked ? "follow" : "always-on" })
          }
          style={getStageButtonStyle(backdrop, isHoverLocked)}
        >
          {isHoverLocked ? "Hover preview locked" : "Lock hover preview"}
        </button>
      )}
      stageNote={
        lastCopiedPrompt
          ? `Copied prompt: "${lastCopiedPrompt}"`
          : undefined
      }
      panel={
        <PixelControlPanel
          config={config}
          onPatch={patch}
          onResetAll={resetAll}
          width={320}
        />
      }
    />
  );
}
