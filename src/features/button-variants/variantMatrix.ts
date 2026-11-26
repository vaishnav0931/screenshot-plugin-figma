import type {
  ButtonAppearance,
  ButtonDefinition,
  ButtonInteractionState,
  ButtonSizePreset,
  ButtonVariantItem
} from "@/src/types/button";
import {
  applyAppearancePresetToButton,
  applySizePresetToButton,
  createButtonDefinition
} from "@/src/utils/presets";

export const MATRIX_APPEARANCES: ReadonlyArray<
  Exclude<ButtonAppearance, "custom">
> = ["primary", "secondary", "outline", "tertiary", "ghost", "destructive", "link"];

export const MATRIX_SIZES: ReadonlyArray<Exclude<ButtonSizePreset, "custom">> = [
  "xs",
  "sm",
  "md",
  "lg",
  "xl"
];

export const MATRIX_STATES: ReadonlyArray<ButtonInteractionState> = [
  "default",
  "hover",
  "focus",
  "pressed",
  "disabled",
  "loading"
];

export function createInitialVariants(): ButtonVariantItem[] {
  const primaryMd = createButtonDefinition({
    id: "var-def-primary-md",
    name: "Primary / Medium",
    appearance: "primary",
    size: "md",
    label: "Publish Changes",
    leadingIcon: "Sparkles"
  });

  const secondaryMd = createButtonDefinition({
    id: "var-def-secondary-md",
    name: "Secondary / Medium",
    appearance: "secondary",
    size: "md",
    label: "Save Draft",
    leadingIcon: "Bookmark"
  });

  const outlineMd = createButtonDefinition({
    id: "var-def-outline-md",
    name: "Outline / Medium",
    appearance: "outline",
    size: "md",
    label: "Preview",
    leadingIcon: "Eye"
  });

  const destructiveSm = createButtonDefinition({
    id: "var-def-destructive-sm",
    name: "Destructive / Small",
    appearance: "destructive",
    size: "sm",
    label: "Delete",
    leadingIcon: "Trash2"
  });

  return [
    {
      id: "variant-1",
      name: "Primary / MD / Default",
      appearance: "primary",
      size: "md",
      previewState: "default",
      showInComparison: true,
      definition: primaryMd
    },
    {
      id: "variant-2",
      name: "Secondary / MD / Default",
      appearance: "secondary",
      size: "md",
      previewState: "default",
      showInComparison: true,
      definition: secondaryMd
    },
    {
      id: "variant-3",
      name: "Outline / MD / Default",
      appearance: "outline",
      size: "md",
      previewState: "default",
      showInComparison: true,
      definition: outlineMd
    },
    {
      id: "variant-4",
      name: "Destructive / SM / Default",
      appearance: "destructive",
      size: "sm",
      previewState: "default",
      showInComparison: true,
      definition: destructiveSm
    }
  ];
}

export function deriveMatrixVariantButton(
  base: ButtonDefinition,
  appearance: Exclude<ButtonAppearance, "custom">,
  size: Exclude<ButtonSizePreset, "custom">
): ButtonDefinition {
  const withApp = applyAppearancePresetToButton(base, appearance);
  return applySizePresetToButton(withApp, size);
}
