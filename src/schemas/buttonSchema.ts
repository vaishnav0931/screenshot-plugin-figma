import { z } from "zod";

export const CornerRadiiSchema = z.object({
  topLeft: z.number().min(0).max(9999),
  topRight: z.number().min(0).max(9999),
  bottomRight: z.number().min(0).max(9999),
  bottomLeft: z.number().min(0).max(9999)
});

export const ButtonShadowConfigSchema = z.object({
  enabled: z.boolean(),
  preset: z.enum([
    "none",
    "subtle",
    "sm",
    "md",
    "lg",
    "elevated",
    "glow",
    "custom"
  ]),
  color: z.string().min(1),
  opacity: z.number().min(0).max(100),
  offsetX: z.number().min(-100).max(100),
  offsetY: z.number().min(-100).max(100),
  blur: z.number().min(0).max(200),
  spread: z.number().min(-100).max(100)
});

export const ButtonStateOverrideSchema = z.object({
  backgroundColor: z.string().min(1),
  textColor: z.string().min(1),
  borderColor: z.string().min(1),
  borderWidth: z.number().min(0).max(32),
  opacity: z.number().min(0).max(100),
  scale: z.number().min(0.5).max(1.5),
  translateY: z.number().min(-24).max(24),
  focusRingColor: z.string().min(1),
  focusRingWidth: z.number().min(0).max(16),
  focusRingOffset: z.number().min(0).max(16),
  shadowEnabled: z.boolean(),
  shadowColor: z.string().min(1),
  shadowBlur: z.number().min(0).max(200),
  shadowOffsetY: z.number().min(-100).max(100),
  loadingLabel: z.string(),
  spinnerColor: z.string().min(1)
});

export const ButtonStatesMapSchema = z.object({
  default: ButtonStateOverrideSchema,
  hover: ButtonStateOverrideSchema,
  focus: ButtonStateOverrideSchema,
  pressed: ButtonStateOverrideSchema,
  disabled: ButtonStateOverrideSchema,
  loading: ButtonStateOverrideSchema
});

export const ButtonContentConfigSchema = z.object({
  label: z.string(),
  buttonType: z.enum(["text", "icon", "icon-text", "loading"]),
  showIcon: z.boolean(),
  iconPosition: z.enum(["leading", "trailing", "both", "only"]),
  leadingIcon: z.string().min(1),
  trailingIcon: z.string().min(1),
  iconSize: z.number().min(8).max(64),
  gap: z.number().min(0).max(64),
  textAlign: z.enum(["left", "center", "right"])
});

export const ButtonAppearanceConfigSchema = z.object({
  variant: z.enum([
    "primary",
    "secondary",
    "tertiary",
    "outline",
    "ghost",
    "destructive",
    "link",
    "custom"
  ]),
  customVariantName: z.string().optional(),
  backgroundColor: z.string().min(1),
  textColor: z.string().min(1),
  borderColor: z.string().min(1),
  borderWidth: z.number().min(0).max(32),
  borderStyle: z.enum(["solid", "dashed", "dotted", "none"]),
  opacity: z.number().min(0).max(100),
  hoverBackgroundColor: z.string().min(1),
  hoverTextColor: z.string().min(1)
});

export const ButtonDimensionsConfigSchema = z.object({
  sizePreset: z.enum(["xs", "sm", "md", "lg", "xl", "custom"]),
  widthMode: z.enum(["hug", "fixed", "full"]),
  width: z.number().min(20).max(1200),
  height: z.number().min(20).max(300),
  minWidth: z.number().min(0).max(1200),
  maxWidth: z.number().min(0).max(2000),
  paddingX: z.number().min(0).max(200),
  paddingY: z.number().min(0).max(120)
});

export const ButtonTypographyConfigSchema = z.object({
  fontFamily: z.string().min(1),
  fontSize: z.number().min(8).max(72),
  fontWeight: z.union([
    z.literal(400),
    z.literal(500),
    z.literal(600),
    z.literal(700)
  ]),
  lineHeight: z.number().min(0.8).max(3),
  letterSpacing: z.number().min(-5).max(20),
  textTransform: z.enum(["none", "uppercase", "lowercase", "capitalize"])
});

export const ButtonShapeConfigSchema = z.object({
  radiusPreset: z.enum(["none", "sm", "md", "lg", "xl", "full", "custom"]),
  borderRadius: z.number().min(0).max(9999),
  useIndividualRadius: z.boolean(),
  corners: CornerRadiiSchema,
  borderWidth: z.number().min(0).max(32),
  borderColor: z.string().min(1),
  borderStyle: z.enum(["solid", "dashed", "dotted", "none"])
});

export const ButtonDefinitionSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  category: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  content: ButtonContentConfigSchema,
  appearance: ButtonAppearanceConfigSchema,
  dimensions: ButtonDimensionsConfigSchema,
  typography: ButtonTypographyConfigSchema,
  shape: ButtonShapeConfigSchema,
  effects: ButtonShadowConfigSchema,
  states: ButtonStatesMapSchema,
  transitionDuration: z.number().min(0).max(2000),
  transitionEasing: z.string().min(1)
});

export const ButtonVariantItemSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  appearance: z.enum([
    "primary",
    "secondary",
    "tertiary",
    "outline",
    "ghost",
    "destructive",
    "link",
    "custom"
  ]),
  size: z.enum(["xs", "sm", "md", "lg", "xl", "custom"]),
  previewState: z.enum([
    "default",
    "hover",
    "focus",
    "pressed",
    "disabled",
    "loading"
  ]),
  showInComparison: z.boolean(),
  definition: ButtonDefinitionSchema
});

export const DesignTokensSchema = z.object({
  colors: z.object({
    primary: z.string().min(1),
    secondary: z.string().min(1),
    neutral: z.string().min(1),
    success: z.string().min(1),
    warning: z.string().min(1),
    danger: z.string().min(1)
  }),
  spacing: z.object({
    paddingX: z.number().min(0).max(200),
    paddingY: z.number().min(0).max(120),
    iconGap: z.number().min(0).max(64)
  }),
  typography: z.object({
    fontFamily: z.string().min(1),
    fontSize: z.number().min(8).max(72),
    fontWeight: z.union([
      z.literal(400),
      z.literal(500),
      z.literal(600),
      z.literal(700)
    ])
  }),
  shape: z.object({
    borderRadius: z.number().min(0).max(9999),
    borderWidth: z.number().min(0).max(32)
  }),
  effects: z.object({
    shadowSm: z.string(),
    shadowMd: z.string(),
    shadowLg: z.string()
  })
});

export const ButtonStudioExportDocumentSchema = z.object({
  schemaVersion: z.literal("1.0.0"),
  exportedAt: z.string(),
  activeButton: ButtonDefinitionSchema,
  variants: z.array(ButtonVariantItemSchema).optional().default([]),
  tokens: DesignTokensSchema.optional(),
  figmaNode: z.any().optional()
});
