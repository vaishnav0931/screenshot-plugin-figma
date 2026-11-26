export type ButtonAppearance =
  | "primary"
  | "secondary"
  | "tertiary"
  | "outline"
  | "ghost"
  | "destructive"
  | "link"
  | "custom";

export type ButtonTypeKind =
  | "text"
  | "icon"
  | "icon-text"
  | "loading";

export type ButtonSizePreset =
  | "xs"
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "custom";

export type ButtonWidthMode = "hug" | "fixed" | "full";

export type ButtonIconPosition = "leading" | "trailing" | "both" | "only";

export type ButtonTextAlign = "left" | "center" | "right";

export type ButtonFontWeight = 400 | 500 | 600 | 700;

export type ButtonTextTransform =
  | "none"
  | "uppercase"
  | "lowercase"
  | "capitalize";

export type ButtonBorderStyle = "solid" | "dashed" | "dotted" | "none";

export type ButtonRadiusPreset =
  | "none"
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "full"
  | "custom";

export type ButtonShadowPreset =
  | "none"
  | "subtle"
  | "sm"
  | "md"
  | "lg"
  | "elevated"
  | "glow"
  | "custom";

export type ButtonInteractionState =
  | "default"
  | "hover"
  | "focus"
  | "pressed"
  | "disabled"
  | "loading";

export type PreviewCanvasBackground =
  | "light"
  | "dark"
  | "checkerboard"
  | "neutral";

export type PreviewViewMode =
  | "single"
  | "all-variants"
  | "all-states"
  | "comparison";

export interface CornerRadii {
  topLeft: number;
  topRight: number;
  bottomRight: number;
  bottomLeft: number;
}

export interface ButtonShadowConfig {
  enabled: boolean;
  preset: ButtonShadowPreset;
  color: string;
  opacity: number; // 0 - 100
  offsetX: number;
  offsetY: number;
  blur: number;
  spread: number;
}

export interface ButtonStateOverride {
  backgroundColor: string;
  textColor: string;
  borderColor: string;
  borderWidth: number;
  opacity: number; // 0 - 100
  scale: number; // e.g. 1, 0.98
  translateY: number; // px
  focusRingColor: string;
  focusRingWidth: number;
  focusRingOffset: number;
  shadowEnabled: boolean;
  shadowColor: string;
  shadowBlur: number;
  shadowOffsetY: number;
  loadingLabel: string;
  spinnerColor: string;
}

export type ButtonStatesMap = Record<
  ButtonInteractionState,
  ButtonStateOverride
>;

export interface ButtonContentConfig {
  label: string;
  buttonType: ButtonTypeKind;
  showIcon: boolean;
  iconPosition: ButtonIconPosition;
  leadingIcon: string;
  trailingIcon: string;
  iconSize: number;
  gap: number;
  textAlign: ButtonTextAlign;
}

export interface ButtonAppearanceConfig {
  variant: ButtonAppearance;
  customVariantName?: string;
  backgroundColor: string;
  textColor: string;
  borderColor: string;
  borderWidth: number;
  borderStyle: ButtonBorderStyle;
  opacity: number; // 0 - 100
  hoverBackgroundColor: string;
  hoverTextColor: string;
}

export interface ButtonDimensionsConfig {
  sizePreset: ButtonSizePreset;
  widthMode: ButtonWidthMode;
  width: number;
  height: number;
  minWidth: number;
  maxWidth: number; // 0 means unconstrained
  paddingX: number;
  paddingY: number;
}

export interface ButtonTypographyConfig {
  fontFamily: string;
  fontSize: number;
  fontWeight: ButtonFontWeight;
  lineHeight: number; // percentage or multiplier e.g. 1.25
  letterSpacing: number; // px
  textTransform: ButtonTextTransform;
}

export interface ButtonShapeConfig {
  radiusPreset: ButtonRadiusPreset;
  borderRadius: number;
  useIndividualRadius: boolean;
  corners: CornerRadii;
  borderWidth: number;
  borderColor: string;
  borderStyle: ButtonBorderStyle;
}

export interface ButtonDefinition {
  id: string;
  name: string;
  category?: string;
  createdAt: string;
  updatedAt: string;
  content: ButtonContentConfig;
  appearance: ButtonAppearanceConfig;
  dimensions: ButtonDimensionsConfig;
  typography: ButtonTypographyConfig;
  shape: ButtonShapeConfig;
  effects: ButtonShadowConfig;
  states: ButtonStatesMap;
  transitionDuration: number; // ms
  transitionEasing: string;
}

export interface ButtonVariantItem {
  id: string;
  name: string;
  appearance: ButtonAppearance;
  size: ButtonSizePreset;
  previewState: ButtonInteractionState;
  showInComparison: boolean;
  definition: ButtonDefinition;
}

export interface DesignTokens {
  colors: {
    primary: string;
    secondary: string;
    neutral: string;
    success: string;
    warning: string;
    danger: string;
  };
  spacing: {
    paddingX: number;
    paddingY: number;
    iconGap: number;
  };
  typography: {
    fontFamily: string;
    fontSize: number;
    fontWeight: ButtonFontWeight;
  };
  shape: {
    borderRadius: number;
    borderWidth: number;
  };
  effects: {
    shadowSm: string;
    shadowMd: string;
    shadowLg: string;
  };
}

export interface FigmaButtonExportNode {
  schemaVersion: "1.0.0";
  nodeType: "COMPONENT";
  name: string;
  variantProperties: {
    Appearance: string;
    Size: string;
    State: string;
    Type: string;
  };
  layout: {
    layoutMode: "HORIZONTAL";
    widthMode: ButtonWidthMode;
    width: number;
    height: number;
    minWidth: number;
    maxWidth: number | null;
    paddingLeft: number;
    paddingRight: number;
    paddingTop: number;
    paddingBottom: number;
    itemSpacing: number;
    primaryAxisAlignItems: "MIN" | "CENTER" | "MAX";
    counterAxisAlignItems: "CENTER";
  };
  fills: Array<{
    type: "SOLID";
    color: string;
    opacity: number;
  }>;
  strokes: Array<{
    type: "SOLID";
    color: string;
    weight: number;
    dashPattern: number[];
  }>;
  cornerRadius: {
    uniform: number;
    topLeft: number;
    topRight: number;
    bottomRight: number;
    bottomLeft: number;
  };
  typography: ButtonTypographyConfig;
  icon: {
    enabled: boolean;
    position: ButtonIconPosition;
    leadingIcon: string;
    trailingIcon: string;
    size: number;
  };
  effects: ButtonShadowConfig;
}

export interface ButtonStudioExportDocument {
  schemaVersion: "1.0.0";
  exportedAt: string;
  activeButton: ButtonDefinition;
  variants: ButtonVariantItem[];
  tokens: DesignTokens;
  figmaNode: FigmaButtonExportNode;
}
