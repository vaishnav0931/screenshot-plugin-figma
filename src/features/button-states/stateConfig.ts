import type {
  ButtonAppearanceConfig,
  ButtonInteractionState,
  ButtonShadowConfig,
  ButtonStatesMap
} from "@/src/types/button";

export const INTERACTION_STATES_LIST: ReadonlyArray<{
  id: ButtonInteractionState;
  label: string;
  description: string;
}> = [
  {
    id: "default",
    label: "Default",
    description: "Resting state when idle"
  },
  {
    id: "hover",
    label: "Hover",
    description: "Pointer positioned over the button"
  },
  {
    id: "focus",
    label: "Focus",
    description: "Keyboard focus ring active (:focus-visible)"
  },
  {
    id: "pressed",
    label: "Pressed",
    description: "Active pointer/keyboard press (:active)"
  },
  {
    id: "disabled",
    label: "Disabled",
    description: "Non-interactive disabled state"
  },
  {
    id: "loading",
    label: "Loading",
    description: "Asynchronous action in progress with spinner"
  }
];

export function buildStatesFromAppearance(
  appearance: ButtonAppearanceConfig,
  effects: ButtonShadowConfig
): ButtonStatesMap {
  const base = {
    backgroundColor: appearance.backgroundColor,
    textColor: appearance.textColor,
    borderColor: appearance.borderColor,
    borderWidth: appearance.borderWidth,
    opacity: appearance.opacity,
    scale: 1,
    translateY: 0,
    focusRingColor: "#3b82f6",
    focusRingWidth: 0,
    focusRingOffset: 2,
    shadowEnabled: effects.enabled,
    shadowColor: effects.color,
    shadowBlur: effects.blur,
    shadowOffsetY: effects.offsetY,
    loadingLabel: "Processing...",
    spinnerColor: appearance.textColor
  };

  return {
    default: { ...base },
    hover: {
      ...base,
      backgroundColor: appearance.hoverBackgroundColor,
      textColor: appearance.hoverTextColor,
      translateY: -0.5,
      shadowBlur: effects.enabled ? Math.min(200, effects.blur + 4) : 0
    },
    focus: {
      ...base,
      focusRingColor: "#2563eb",
      focusRingWidth: 3,
      focusRingOffset: 2
    },
    pressed: {
      ...base,
      backgroundColor: appearance.hoverBackgroundColor,
      textColor: appearance.hoverTextColor,
      scale: 0.98,
      translateY: 0.5,
      shadowBlur: effects.enabled ? Math.max(0, effects.blur - 2) : 0
    },
    disabled: {
      ...base,
      opacity: 45,
      shadowEnabled: false
    },
    loading: {
      ...base,
      opacity: 85,
      spinnerColor: appearance.textColor
    }
  };
}
