"use client";

import * as React from "react";
import {
  buildSilkDesignsUsageSnippet,
  DEFAULT_SILK_DESIGNS_CONFIG,
  SILK_SHUFFLE_PALETTES,
  SilkDesignsCard,
  type SilkDesignsCardConfig,
  type SilkDesignsCardHandle,
} from "@/components/ui/silk-designs-card";
import {
  SILK_DESIGNS_PRESETS,
  SilkDesignsControlPanel,
} from "@/components/studio/SilkDesignsControlPanel";
import {
  getStageButtonStyle,
  PlaygroundWorkspace,
} from "@/components/studio/PlaygroundWorkspace";
import { copyTextToClipboard } from "@/lib/figma-export";

export default function SilkDesignsPlaygroundClient({
  sourceCode,
}: {
  sourceCode: string;
}) {
  const [config, setConfig] = React.useState<SilkDesignsCardConfig>(
    DEFAULT_SILK_DESIGNS_CONFIG
  );
  const [activePresetId, setActivePresetId] = React.useState("Editorial-silk");
  const [statusMsg, setStatusMsg] = React.useState<string | null>(null);

  const cardRef = React.useRef<SilkDesignsCardHandle | null>(null);
  const statusTimer = React.useRef<number | null>(null);

  const patch = React.useCallback((partial: Partial<SilkDesignsCardConfig>) => {
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
      if (statusTimer.current) window.clearTimeout(statusTimer.current);
    };
  }, []);

  const usageSnippet = React.useMemo(
    () => buildSilkDesignsUsageSnippet(config),
    [config]
  );

  const resetAll = React.useCallback(() => {
    setActivePresetId("Editorial-silk");
    setConfig(DEFAULT_SILK_DESIGNS_CONFIG);
    cardRef.current?.replayCountUp();
  }, []);

  const applyPreset = (presetId: string) => {
    const found = SILK_DESIGNS_PRESETS.find((p) => p.id === presetId);
    if (!found) return;
    setActivePresetId(found.id);
    setConfig({ ...DEFAULT_SILK_DESIGNS_CONFIG, ...found.values });
  };

  const handleShuffleColors = React.useCallback(() => {
    const pick =
      SILK_SHUFFLE_PALETTES[
        Math.floor(Math.random() * SILK_SHUFFLE_PALETTES.length)
      ];
    if (pick.colorTopLeft !== config.colorTopLeft) {
      patch(pick);
    } else {
      const randHex = () =>
        "#" +
        Math.floor(Math.random() * 0xffffff)
          .toString(16)
          .padStart(6, "0");
      patch({
        colorTopLeft: randHex(),
        colorRight: randHex(),
        colorMiddle: randHex(),
        colorTopRight: randHex(),
      });
    }
    flashStatus("Shuffled silk gradient colors");
  }, [config.colorTopLeft, patch, flashStatus]);

  const handleCopyJsx = async () => {
    const ok = await copyTextToClipboard(usageSnippet);
    flashStatus(ok ? "Copied live JSX snippet" : "Clipboard blocked");
  };

  const handleCopyTsx = async () => {
    const ok = await copyTextToClipboard(sourceCode);
    flashStatus(ok ? "Copied component TSX" : "Clipboard blocked");
  };

  return (
    <PlaygroundWorkspace
      activeHref="/playground/silk-designs-card"
      presets={SILK_DESIGNS_PRESETS}
      activePresetId={activePresetId}
      onSelectPreset={applyPreset}
      statusMsg={statusMsg}
      usageSnippet={usageSnippet}
      sourceCode={sourceCode}
      onCopyJsx={handleCopyJsx}
      onCopyTsx={handleCopyTsx}
      onResetAll={resetAll}
      stageContent={
        <SilkDesignsCard
          ref={cardRef}
          {...config}
          showControls={false}
          cardOnly
        />
      }
      stageActions={(backdrop) => (
        <>
          <button
            type="button"
            onClick={() => patch({ paused: !config.paused })}
            style={getStageButtonStyle(backdrop, config.paused)}
          >
            {config.paused ? "Resume shader" : "Pause shader"}
          </button>
          <button
            type="button"
            onClick={handleShuffleColors}
            style={getStageButtonStyle(backdrop, false)}
          >
            Shuffle colors
          </button>
          <button
            type="button"
            onClick={() => cardRef.current?.replayCountUp()}
            style={getStageButtonStyle(backdrop, false)}
          >
            Replay count-up
          </button>
        </>
      )}
      stageNote="Move pointer across the 300×300 card to steer the 3D silk light and perspective tilt"
      panel={
        <SilkDesignsControlPanel
          config={config}
          onPatch={patch}
          onResetAll={resetAll}
          onShuffleColors={handleShuffleColors}
          width={320}
        />
      }
    />
  );
}
