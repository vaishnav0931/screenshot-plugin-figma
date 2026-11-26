import type { ButtonDefinition, DesignTokens } from "@/src/types/button";

export const DEFAULT_DESIGN_TOKENS: DesignTokens = {
  colors: {
    primary: "#2563eb",
    secondary: "#0f172a",
    neutral: "#64748b",
    success: "#16a34a",
    warning: "#d97706",
    danger: "#dc2626"
  },
  spacing: {
    paddingX: 16,
    paddingY: 10,
    iconGap: 8
  },
  typography: {
    fontFamily:
      '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontSize: 14,
    fontWeight: 500
  },
  shape: {
    borderRadius: 8,
    borderWidth: 1
  },
  effects: {
    shadowSm: "0 1px 2px rgba(15, 23, 42, 0.08)",
    shadowMd: "0 4px 10px rgba(15, 23, 42, 0.12)",
    shadowLg: "0 10px 24px rgba(15, 23, 42, 0.18)"
  }
};

export function applyTokensToButton(
  button: ButtonDefinition,
  tokens: DesignTokens,
  colorRole?: keyof DesignTokens["colors"]
): ButtonDefinition {
  const chosenBg = colorRole
    ? tokens.colors[colorRole]
    : button.appearance.backgroundColor;

  return {
    ...button,
    updatedAt: new Date().toISOString(),
    content: {
      ...button.content,
      gap: tokens.spacing.iconGap
    },
    appearance: {
      ...button.appearance,
      backgroundColor: chosenBg,
      borderWidth: tokens.shape.borderWidth
    },
    dimensions: {
      ...button.dimensions,
      paddingX: tokens.spacing.paddingX,
      paddingY: tokens.spacing.paddingY
    },
    typography: {
      ...button.typography,
      fontFamily: tokens.typography.fontFamily,
      fontSize: tokens.typography.fontSize,
      fontWeight: tokens.typography.fontWeight
    },
    shape: {
      ...button.shape,
      borderRadius: tokens.shape.borderRadius,
      borderWidth: tokens.shape.borderWidth,
      corners: {
        topLeft: tokens.shape.borderRadius,
        topRight: tokens.shape.borderRadius,
        bottomRight: tokens.shape.borderRadius,
        bottomLeft: tokens.shape.borderRadius
      }
    },
    states: {
      ...button.states,
      default: {
        ...button.states.default,
        backgroundColor: chosenBg,
        borderWidth: tokens.shape.borderWidth
      }
    }
  };
}
