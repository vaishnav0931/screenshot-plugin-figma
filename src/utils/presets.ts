import type {
  ButtonAppearance,
  ButtonAppearanceConfig,
  ButtonDefinition,
  ButtonDimensionsConfig,
  ButtonRadiusPreset,
  ButtonShadowConfig,
  ButtonShadowPreset,
  ButtonSizePreset,
  ButtonTypeKind
} from "@/src/types/button";
import { buildStatesFromAppearance } from "@/src/features/button-states/stateConfig";

export const APPEARANCE_PRESETS: Record<
  Exclude<ButtonAppearance, "custom">,
  {
    label: string;
    description: string;
    config: Omit<ButtonAppearanceConfig, "customVariantName">;
    shadowPreset: Exclude<ButtonShadowPreset, "custom">;
  }
> = {
  primary: {
    label: "Primary",
    description: "High-emphasis solid call to action",
    config: {
      variant: "primary",
      backgroundColor: "#2563eb",
      textColor: "#ffffff",
      borderColor: "#1d4ed8",
      borderWidth: 1,
      borderStyle: "solid",
      opacity: 100,
      hoverBackgroundColor: "#1d4ed8",
      hoverTextColor: "#ffffff"
    },
    shadowPreset: "sm"
  },
  secondary: {
    label: "Secondary",
    description: "Dark neutral surface for secondary actions",
    config: {
      variant: "secondary",
      backgroundColor: "#0f172a",
      textColor: "#ffffff",
      borderColor: "#0f172a",
      borderWidth: 1,
      borderStyle: "solid",
      opacity: 100,
      hoverBackgroundColor: "#1e293b",
      hoverTextColor: "#ffffff"
    },
    shadowPreset: "subtle"
  },
  tertiary: {
    label: "Tertiary",
    description: "Soft tinted neutral fill for supporting controls",
    config: {
      variant: "tertiary",
      backgroundColor: "#f1f5f9",
      textColor: "#0f172a",
      borderColor: "#e2e8f0",
      borderWidth: 1,
      borderStyle: "solid",
      opacity: 100,
      hoverBackgroundColor: "#e2e8f0",
      hoverTextColor: "#0f172a"
    },
    shadowPreset: "none"
  },
  outline: {
    label: "Outline",
    description: "Crisp bordered button with transparent fill",
    config: {
      variant: "outline",
      backgroundColor: "#ffffff",
      textColor: "#0f172a",
      borderColor: "#cbd5e1",
      borderWidth: 1,
      borderStyle: "solid",
      opacity: 100,
      hoverBackgroundColor: "#f8fafc",
      hoverTextColor: "#0f172a"
    },
    shadowPreset: "subtle"
  },
  ghost: {
    label: "Ghost",
    description: "Borderless quiet action that reveals fill on hover",
    config: {
      variant: "ghost",
      backgroundColor: "transparent",
      textColor: "#334155",
      borderColor: "transparent",
      borderWidth: 0,
      borderStyle: "none",
      opacity: 100,
      hoverBackgroundColor: "#f1f5f9",
      hoverTextColor: "#0f172a"
    },
    shadowPreset: "none"
  },
  destructive: {
    label: "Destructive",
    description: "High-alert red button for irreversible actions",
    config: {
      variant: "destructive",
      backgroundColor: "#dc2626",
      textColor: "#ffffff",
      borderColor: "#b91c1c",
      borderWidth: 1,
      borderStyle: "solid",
      opacity: 100,
      hoverBackgroundColor: "#b91c1c",
      hoverTextColor: "#ffffff"
    },
    shadowPreset: "sm"
  },
  link: {
    label: "Link",
    description: "Inline hyperlink button style",
    config: {
      variant: "link",
      backgroundColor: "transparent",
      textColor: "#2563eb",
      borderColor: "transparent",
      borderWidth: 0,
      borderStyle: "none",
      opacity: 100,
      hoverBackgroundColor: "transparent",
      hoverTextColor: "#1d4ed8"
    },
    shadowPreset: "none"
  }
};

export const SIZE_PRESETS: Record<
  Exclude<ButtonSizePreset, "custom">,
  {
    label: string;
    shortLabel: string;
    height: number;
    paddingX: number;
    paddingY: number;
    fontSize: number;
    iconSize: number;
    gap: number;
    minWidth: number;
  }
> = {
  xs: {
    label: "Extra Small",
    shortLabel: "XS",
    height: 28,
    paddingX: 10,
    paddingY: 5,
    fontSize: 12,
    iconSize: 13,
    gap: 5,
    minWidth: 56
  },
  sm: {
    label: "Small",
    shortLabel: "SM",
    height: 34,
    paddingX: 12,
    paddingY: 7,
    fontSize: 13,
    iconSize: 15,
    gap: 6,
    minWidth: 68
  },
  md: {
    label: "Medium",
    shortLabel: "MD",
    height: 40,
    paddingX: 16,
    paddingY: 9,
    fontSize: 14,
    iconSize: 16,
    gap: 8,
    minWidth: 84
  },
  lg: {
    label: "Large",
    shortLabel: "LG",
    height: 46,
    paddingX: 20,
    paddingY: 11,
    fontSize: 15,
    iconSize: 18,
    gap: 9,
    minWidth: 96
  },
  xl: {
    label: "Extra Large",
    shortLabel: "XL",
    height: 54,
    paddingX: 26,
    paddingY: 14,
    fontSize: 16,
    iconSize: 20,
    gap: 10,
    minWidth: 116
  }
};

export const RADIUS_PRESETS: Record<
  Exclude<ButtonRadiusPreset, "custom">,
  { label: string; value: number }
> = {
  none: { label: "None", value: 0 },
  sm: { label: "Small", value: 4 },
  md: { label: "Medium", value: 8 },
  lg: { label: "Large", value: 12 },
  xl: { label: "Extra Large", value: 16 },
  full: { label: "Fully rounded", value: 9999 }
};

export const SHADOW_PRESETS: Record<
  Exclude<ButtonShadowPreset, "custom">,
  {
    label: string;
    config: Omit<ButtonShadowConfig, "preset">;
  }
> = {
  none: {
    label: "None",
    config: {
      enabled: false,
      color: "#0f172a",
      opacity: 0,
      offsetX: 0,
      offsetY: 0,
      blur: 0,
      spread: 0
    }
  },
  subtle: {
    label: "Subtle",
    config: {
      enabled: true,
      color: "#0f172a",
      opacity: 6,
      offsetX: 0,
      offsetY: 1,
      blur: 2,
      spread: 0
    }
  },
  sm: {
    label: "Small",
    config: {
      enabled: true,
      color: "#0f172a",
      opacity: 10,
      offsetX: 0,
      offsetY: 2,
      blur: 4,
      spread: -1
    }
  },
  md: {
    label: "Medium",
    config: {
      enabled: true,
      color: "#0f172a",
      opacity: 14,
      offsetX: 0,
      offsetY: 4,
      blur: 10,
      spread: -2
    }
  },
  lg: {
    label: "Large",
    config: {
      enabled: true,
      color: "#0f172a",
      opacity: 18,
      offsetX: 0,
      offsetY: 10,
      blur: 20,
      spread: -4
    }
  },
  elevated: {
    label: "Elevated",
    config: {
      enabled: true,
      color: "#0f172a",
      opacity: 24,
      offsetX: 0,
      offsetY: 14,
      blur: 28,
      spread: -6
    }
  },
  glow: {
    label: "Accent Glow",
    config: {
      enabled: true,
      color: "#2563eb",
      opacity: 38,
      offsetX: 0,
      offsetY: 4,
      blur: 18,
      spread: 0
    }
  }
};

export const FONT_FAMILY_OPTIONS: ReadonlyArray<{
  label: string;
  value: string;
}> = [
  {
    label: "Inter (Default Sans)",
    value:
      '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  {
    label: "System UI",
    value: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
  },
  {
    label: "Geometric Sans",
    value: '"Plus Jakarta Sans", "Inter", system-ui, sans-serif'
  },
  {
    label: "Helvetica Neue",
    value: '"Helvetica Neue", Helvetica, Arial, sans-serif'
  },
  {
    label: "Monospace (Code)",
    value: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
  },
  {
    label: "Editorial Serif",
    value: "Georgia, Cambria, 'Times New Roman', Times, serif"
  }
];

export function createButtonDefinition(options?: {
  id?: string;
  name?: string;
  appearance?: Exclude<ButtonAppearance, "custom">;
  size?: Exclude<ButtonSizePreset, "custom">;
  buttonType?: ButtonTypeKind;
  label?: string;
  leadingIcon?: string;
  trailingIcon?: string;
  radiusPreset?: Exclude<ButtonRadiusPreset, "custom">;
}): ButtonDefinition {
  const appearanceKey = options?.appearance ?? "primary";
  const sizeKey = options?.size ?? "md";
  const buttonType = options?.buttonType ?? "icon-text";
  const radiusKey = options?.radiusPreset ?? "md";

  const appPreset = APPEARANCE_PRESETS[appearanceKey];
  const sizePreset = SIZE_PRESETS[sizeKey];
  const radPreset = RADIUS_PRESETS[radiusKey];
  const shPreset = SHADOW_PRESETS[appPreset.shadowPreset];

  const isIconOnly = buttonType === "icon";
  const showIcon =
    buttonType === "icon" ||
    buttonType === "icon-text" ||
    buttonType === "loading";

  const appearance: ButtonAppearanceConfig = {
    ...appPreset.config
  };

  const effects: ButtonShadowConfig = {
    preset: appPreset.shadowPreset,
    ...shPreset.config
  };

  const dimensions: ButtonDimensionsConfig = {
    sizePreset: sizeKey,
    widthMode: isIconOnly ? "fixed" : "hug",
    width: isIconOnly ? sizePreset.height : 148,
    height: sizePreset.height,
    minWidth: isIconOnly ? sizePreset.height : sizePreset.minWidth,
    maxWidth: 0,
    paddingX: isIconOnly ? 0 : sizePreset.paddingX,
    paddingY: isIconOnly ? 0 : sizePreset.paddingY
  };

  const now = new Date().toISOString();

  return {
    id: options?.id ?? `btn-${Math.random().toString(36).slice(2, 9)}`,
    name: options?.name ?? `${appPreset.label} Button`,
    category: appearanceKey,
    createdAt: now,
    updatedAt: now,
    content: {
      label: options?.label ?? "Continue",
      buttonType,
      showIcon,
      iconPosition: isIconOnly ? "only" : "leading",
      leadingIcon: options?.leadingIcon ?? "Sparkles",
      trailingIcon: options?.trailingIcon ?? "ArrowRight",
      iconSize: sizePreset.iconSize,
      gap: sizePreset.gap,
      textAlign: "center"
    },
    appearance,
    dimensions,
    typography: {
      fontFamily: FONT_FAMILY_OPTIONS[0].value,
      fontSize: sizePreset.fontSize,
      fontWeight: 500,
      lineHeight: 1.2,
      letterSpacing: 0,
      textTransform: "none"
    },
    shape: {
      radiusPreset: radiusKey,
      borderRadius: radPreset.value,
      useIndividualRadius: false,
      corners: {
        topLeft: radPreset.value,
        topRight: radPreset.value,
        bottomRight: radPreset.value,
        bottomLeft: radPreset.value
      },
      borderWidth: appearance.borderWidth,
      borderColor: appearance.borderColor,
      borderStyle: appearance.borderStyle
    },
    effects,
    states: buildStatesFromAppearance(appearance, effects),
    transitionDuration: 160,
    transitionEasing: "cubic-bezier(0.22, 1, 0.36, 1)"
  };
}

export function applyAppearancePresetToButton(
  button: ButtonDefinition,
  variant: Exclude<ButtonAppearance, "custom">
): ButtonDefinition {
  const preset = APPEARANCE_PRESETS[variant];
  const shadow = SHADOW_PRESETS[preset.shadowPreset];
  const appearance: ButtonAppearanceConfig = {
    ...preset.config
  };
  const effects: ButtonShadowConfig = {
    preset: preset.shadowPreset,
    ...shadow.config
  };

  return {
    ...button,
    updatedAt: new Date().toISOString(),
    appearance,
    shape: {
      ...button.shape,
      borderWidth: appearance.borderWidth,
      borderColor: appearance.borderColor,
      borderStyle: appearance.borderStyle
    },
    effects,
    states: buildStatesFromAppearance(appearance, effects)
  };
}

export function applySizePresetToButton(
  button: ButtonDefinition,
  size: Exclude<ButtonSizePreset, "custom">
): ButtonDefinition {
  const preset = SIZE_PRESETS[size];
  const isIconOnly =
    button.content.buttonType === "icon" ||
    button.content.iconPosition === "only";

  return {
    ...button,
    updatedAt: new Date().toISOString(),
    content: {
      ...button.content,
      iconSize: preset.iconSize,
      gap: preset.gap
    },
    dimensions: {
      ...button.dimensions,
      sizePreset: size,
      widthMode: isIconOnly ? "fixed" : button.dimensions.widthMode,
      width: isIconOnly ? preset.height : button.dimensions.width,
      height: preset.height,
      minWidth: isIconOnly ? preset.height : preset.minWidth,
      paddingX: isIconOnly ? 0 : preset.paddingX,
      paddingY: isIconOnly ? 0 : preset.paddingY
    },
    typography: {
      ...button.typography,
      fontSize: preset.fontSize
    }
  };
}

export function applyButtonTypeToButton(
  button: ButtonDefinition,
  buttonType: ButtonTypeKind
): ButtonDefinition {
  const sizeKey =
    button.dimensions.sizePreset === "custom"
      ? "md"
      : button.dimensions.sizePreset;
  const sizeSpec = SIZE_PRESETS[sizeKey];

  if (buttonType === "text") {
    return {
      ...button,
      updatedAt: new Date().toISOString(),
      content: {
        ...button.content,
        buttonType: "text",
        showIcon: false,
        iconPosition: "leading"
      },
      dimensions: {
        ...button.dimensions,
        widthMode:
          button.dimensions.widthMode === "fixed"
            ? "hug"
            : button.dimensions.widthMode,
        paddingX: sizeSpec.paddingX,
        minWidth: sizeSpec.minWidth
      }
    };
  }

  if (buttonType === "icon") {
    return {
      ...button,
      updatedAt: new Date().toISOString(),
      content: {
        ...button.content,
        buttonType: "icon",
        showIcon: true,
        iconPosition: "only"
      },
      dimensions: {
        ...button.dimensions,
        widthMode: "fixed",
        width: button.dimensions.height,
        minWidth: button.dimensions.height,
        paddingX: 0,
        paddingY: 0
      }
    };
  }

  if (buttonType === "loading") {
    return {
      ...button,
      updatedAt: new Date().toISOString(),
      content: {
        ...button.content,
        buttonType: "loading",
        showIcon: true,
        iconPosition: "leading"
      },
      dimensions: {
        ...button.dimensions,
        widthMode: "hug",
        paddingX: sizeSpec.paddingX,
        minWidth: sizeSpec.minWidth
      }
    };
  }

  return {
    ...button,
    updatedAt: new Date().toISOString(),
    content: {
      ...button.content,
      buttonType: "icon-text",
      showIcon: true,
      iconPosition:
        button.content.iconPosition === "only"
          ? "leading"
          : button.content.iconPosition
    },
    dimensions: {
      ...button.dimensions,
      widthMode: "hug",
      paddingX: sizeSpec.paddingX,
      minWidth: sizeSpec.minWidth
    }
  };
}
