"use client";

import { create } from "zustand";
import type {
  ButtonAppearance,
  ButtonAppearanceConfig,
  ButtonContentConfig,
  ButtonDefinition,
  ButtonDimensionsConfig,
  ButtonInteractionState,
  ButtonRadiusPreset,
  ButtonShadowConfig,
  ButtonShadowPreset,
  ButtonShapeConfig,
  ButtonSizePreset,
  ButtonStateOverride,
  ButtonTypeKind,
  ButtonTypographyConfig,
  ButtonVariantItem,
  DesignTokens,
  PreviewCanvasBackground,
  PreviewViewMode
} from "@/src/types/button";
import {
  APPEARANCE_PRESETS,
  applyAppearancePresetToButton,
  applyButtonTypeToButton,
  applySizePresetToButton,
  createButtonDefinition,
  RADIUS_PRESETS,
  SHADOW_PRESETS,
  SIZE_PRESETS
} from "@/src/utils/presets";
import {
  applyTokensToButton,
  DEFAULT_DESIGN_TOKENS
} from "@/src/features/button-tokens/defaultTokens";
import { buildStatesFromAppearance } from "@/src/features/button-states/stateConfig";
import { createInitialVariants } from "@/src/features/button-variants/variantMatrix";
import {
  ButtonDefinitionSchema,
  ButtonStudioExportDocumentSchema
} from "@/src/schemas/buttonSchema";

const STORAGE_KEY = "button-studio-storage-v1";

function createInitialSavedButtons(): ButtonDefinition[] {
  return [
    createButtonDefinition({
      id: "saved-primary-cta",
      name: "Primary CTA",
      appearance: "primary",
      size: "md",
      buttonType: "icon-text",
      label: "Get Started",
      leadingIcon: "Sparkles"
    }),
    createButtonDefinition({
      id: "saved-outline-export",
      name: "Outline Export",
      appearance: "outline",
      size: "md",
      buttonType: "icon-text",
      label: "Export JSON",
      leadingIcon: "Download"
    }),
    createButtonDefinition({
      id: "saved-destructive-delete",
      name: "Delete Account",
      appearance: "destructive",
      size: "sm",
      buttonType: "icon-text",
      label: "Delete Account",
      leadingIcon: "Trash2"
    })
  ];
}

export interface ButtonStudioState {
  activeButton: ButtonDefinition;
  savedButtons: ButtonDefinition[];
  recentButtons: ButtonDefinition[];
  variants: ButtonVariantItem[];
  tokens: DesignTokens;

  previewState: ButtonInteractionState;
  interactivePreview: boolean;
  inspectorStateTab: ButtonInteractionState;
  canvasBg: PreviewCanvasBackground;
  viewMode: PreviewViewMode;
  zoom: number;
  rightTab: "inspector" | "variants" | "tokens";
  exportModalTab: "json" | "import" | "css" | "svg" | "figma" | null;
  toastMessage: string | null;
  hydrated: boolean;

  hydrateFromStorage: () => void;
  persistToStorage: () => void;
  showToast: (msg: string) => void;

  setPreviewState: (state: ButtonInteractionState) => void;
  setInteractivePreview: (interactive: boolean) => void;
  setInspectorStateTab: (state: ButtonInteractionState) => void;
  setCanvasBg: (bg: PreviewCanvasBackground) => void;
  setViewMode: (mode: PreviewViewMode) => void;
  setZoom: (zoom: number) => void;
  resetPreviewCanvas: () => void;
  setRightTab: (tab: "inspector" | "variants" | "tokens") => void;
  setExportModalTab: (
    tab: "json" | "import" | "css" | "svg" | "figma" | null
  ) => void;

  setActiveButton: (btn: ButtonDefinition, recordRecent?: boolean) => void;
  createNewButton: () => void;
  resetActiveButton: () => void;

  updateButtonName: (name: string) => void;
  updateContent: (partial: Partial<ButtonContentConfig>) => void;
  updateAppearance: (partial: Partial<ButtonAppearanceConfig>) => void;
  selectAppearancePreset: (
    variant: Exclude<ButtonAppearance, "custom">
  ) => void;
  selectSizePreset: (size: Exclude<ButtonSizePreset, "custom">) => void;
  selectButtonType: (buttonType: ButtonTypeKind) => void;
  updateDimensions: (partial: Partial<ButtonDimensionsConfig>) => void;
  updateTypography: (partial: Partial<ButtonTypographyConfig>) => void;
  updateShape: (partial: Partial<ButtonShapeConfig>) => void;
  selectRadiusPreset: (preset: Exclude<ButtonRadiusPreset, "custom">) => void;
  updateEffects: (partial: Partial<ButtonShadowConfig>) => void;
  selectShadowPreset: (preset: Exclude<ButtonShadowPreset, "custom">) => void;
  updateStateOverride: (
    state: ButtonInteractionState,
    partial: Partial<ButtonStateOverride>
  ) => void;
  resetStateOverrides: () => void;
  setTransitionDuration: (ms: number) => void;

  saveCurrentButton: (customName?: string) => void;
  renameSavedButton: (id: string, name: string) => void;
  duplicateSavedButton: (id: string) => void;
  deleteSavedButton: (id: string) => void;
  loadSavedButton: (id: string) => void;

  addVariantFromCurrent: (customName?: string) => void;
  duplicateVariant: (id: string) => void;
  renameVariant: (id: string, name: string) => void;
  deleteVariant: (id: string) => void;
  toggleVariantComparison: (id: string) => void;
  updateVariantMeta: (
    id: string,
    partial: Partial<
      Pick<ButtonVariantItem, "appearance" | "size" | "previewState" | "name">
    >
  ) => void;
  loadVariantIntoEditor: (id: string) => void;
  syncCurrentToVariant: (id: string) => void;
  resetVariantsToDefaults: () => void;

  updateTokenColor: (
    key: keyof DesignTokens["colors"],
    value: string
  ) => void;
  updateTokenSpacing: (partial: Partial<DesignTokens["spacing"]>) => void;
  updateTokenTypography: (
    partial: Partial<DesignTokens["typography"]>
  ) => void;
  updateTokenShape: (partial: Partial<DesignTokens["shape"]>) => void;
  applyTokensToActive: (colorRole?: keyof DesignTokens["colors"]) => void;
  resetTokens: () => void;

  importJsonDocument: (rawJson: string) => { ok: boolean; error?: string };
}

let toastTimer: ReturnType<typeof setTimeout> | null = null;

function pushRecent(
  recent: ButtonDefinition[],
  item: ButtonDefinition
): ButtonDefinition[] {
  const filtered = recent.filter((r) => r.id !== item.id);
  return [item, ...filtered].slice(0, 6);
}

export const useButtonStore = create<ButtonStudioState>((set, get) => ({
  activeButton: createButtonDefinition({
    id: "btn-initial",
    name: "Primary Action",
    appearance: "primary",
    size: "md",
    buttonType: "icon-text",
    label: "Create Button",
    leadingIcon: "Sparkles"
  }),
  savedButtons: createInitialSavedButtons(),
  recentButtons: [],
  variants: createInitialVariants(),
  tokens: DEFAULT_DESIGN_TOKENS,

  previewState: "default",
  interactivePreview: true,
  inspectorStateTab: "default",
  canvasBg: "light",
  viewMode: "single",
  zoom: 1,
  rightTab: "inspector",
  exportModalTab: null,
  toastMessage: null,
  hydrated: false,

  showToast: (msg: string) => {
    if (toastTimer) clearTimeout(toastTimer);
    set({ toastMessage: msg });
    toastTimer = setTimeout(() => {
      set({ toastMessage: null });
    }, 2400);
  },

  hydrateFromStorage: () => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        set({ hydrated: true });
        return;
      }
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") {
        const activeCheck = ButtonDefinitionSchema.safeParse(
          parsed.activeButton
        );
        set({
          activeButton: activeCheck.success
            ? activeCheck.data
            : get().activeButton,
          savedButtons: Array.isArray(parsed.savedButtons)
            ? parsed.savedButtons
            : get().savedButtons,
          recentButtons: Array.isArray(parsed.recentButtons)
            ? parsed.recentButtons
            : [],
          variants: Array.isArray(parsed.variants)
            ? parsed.variants
            : get().variants,
          tokens: parsed.tokens ?? get().tokens,
          hydrated: true
        });
      }
    } catch {
      set({ hydrated: true });
    }
  },

  persistToStorage: () => {
    if (typeof window === "undefined") return;
    try {
      const s = get();
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          activeButton: s.activeButton,
          savedButtons: s.savedButtons,
          recentButtons: s.recentButtons,
          variants: s.variants,
          tokens: s.tokens
        })
      );
    } catch {
      // Ignore quota errors
    }
  },

  setPreviewState: (previewState) =>
    set({
      previewState,
      inspectorStateTab: previewState
    }),

  setInteractivePreview: (interactivePreview) => set({ interactivePreview }),

  setInspectorStateTab: (inspectorStateTab) =>
    set({
      inspectorStateTab,
      previewState: inspectorStateTab
    }),

  setCanvasBg: (canvasBg) => set({ canvasBg }),
  setViewMode: (viewMode) => set({ viewMode }),
  setZoom: (zoom) =>
    set({ zoom: Math.min(3, Math.max(0.5, +zoom.toFixed(2))) }),

  resetPreviewCanvas: () =>
    set({
      zoom: 1,
      previewState: "default",
      inspectorStateTab: "default",
      interactivePreview: true,
      viewMode: "single",
      canvasBg: "light"
    }),

  setRightTab: (rightTab) => set({ rightTab }),
  setExportModalTab: (exportModalTab) => set({ exportModalTab }),

  setActiveButton: (btn, recordRecent = true) => {
    const nextRecent = recordRecent
      ? pushRecent(get().recentButtons, btn)
      : get().recentButtons;
    set({
      activeButton: btn,
      recentButtons: nextRecent,
      previewState:
        btn.content.buttonType === "loading" ? "loading" : get().previewState
    });
    get().persistToStorage();
  },

  createNewButton: () => {
    const fresh = createButtonDefinition({
      name: `New Button ${get().savedButtons.length + 1}`,
      appearance: "primary",
      size: "md",
      buttonType: "icon-text",
      label: "New Button",
      leadingIcon: "Plus"
    });
    set((s) => ({
      activeButton: fresh,
      recentButtons: pushRecent(s.recentButtons, fresh),
      previewState: "default",
      inspectorStateTab: "default"
    }));
    get().persistToStorage();
    get().showToast("Created new button");
  },

  resetActiveButton: () => {
    const current = get().activeButton;
    const appKey =
      current.appearance.variant === "custom"
        ? "primary"
        : current.appearance.variant;
    const sizeKey =
      current.dimensions.sizePreset === "custom"
        ? "md"
        : current.dimensions.sizePreset;
    const resetBtn = createButtonDefinition({
      id: current.id,
      name: current.name,
      appearance: appKey,
      size: sizeKey,
      buttonType: "icon-text",
      label: "Continue"
    });
    set({
      activeButton: resetBtn,
      previewState: "default",
      inspectorStateTab: "default"
    });
    get().persistToStorage();
    get().showToast("Reset button to default properties");
  },

  updateButtonName: (name) => {
    set((s) => ({
      activeButton: {
        ...s.activeButton,
        name,
        updatedAt: new Date().toISOString()
      }
    }));
    get().persistToStorage();
  },

  updateContent: (partial) => {
    set((s) => {
      const nextContent = { ...s.activeButton.content, ...partial };
      return {
        activeButton: {
          ...s.activeButton,
          updatedAt: new Date().toISOString(),
          content: nextContent
        }
      };
    });
    get().persistToStorage();
  },

  updateAppearance: (partial) => {
    set((s) => {
      const prevApp = s.activeButton.appearance;
      const nextApp: ButtonAppearanceConfig = {
        ...prevApp,
        ...partial
      };
      const nextShape = {
        ...s.activeButton.shape,
        borderColor:
          partial.borderColor !== undefined
            ? partial.borderColor
            : s.activeButton.shape.borderColor,
        borderWidth:
          partial.borderWidth !== undefined
            ? partial.borderWidth
            : s.activeButton.shape.borderWidth,
        borderStyle:
          partial.borderStyle !== undefined
            ? partial.borderStyle
            : s.activeButton.shape.borderStyle
      };
      const nextStates = {
        ...s.activeButton.states,
        default: {
          ...s.activeButton.states.default,
          backgroundColor: nextApp.backgroundColor,
          textColor: nextApp.textColor,
          borderColor: nextApp.borderColor,
          borderWidth: nextApp.borderWidth,
          opacity: nextApp.opacity,
          spinnerColor: nextApp.textColor
        },
        hover: {
          ...s.activeButton.states.hover,
          backgroundColor: nextApp.hoverBackgroundColor,
          textColor: nextApp.hoverTextColor,
          borderColor: nextApp.borderColor,
          borderWidth: nextApp.borderWidth
        },
        focus: {
          ...s.activeButton.states.focus,
          backgroundColor: nextApp.backgroundColor,
          textColor: nextApp.textColor,
          borderColor: nextApp.borderColor,
          borderWidth: nextApp.borderWidth
        },
        pressed: {
          ...s.activeButton.states.pressed,
          backgroundColor: nextApp.hoverBackgroundColor,
          textColor: nextApp.hoverTextColor,
          borderColor: nextApp.borderColor,
          borderWidth: nextApp.borderWidth
        },
        disabled: {
          ...s.activeButton.states.disabled,
          backgroundColor: nextApp.backgroundColor,
          textColor: nextApp.textColor,
          borderColor: nextApp.borderColor,
          borderWidth: nextApp.borderWidth
        },
        loading: {
          ...s.activeButton.states.loading,
          backgroundColor: nextApp.backgroundColor,
          textColor: nextApp.textColor,
          borderColor: nextApp.borderColor,
          borderWidth: nextApp.borderWidth,
          spinnerColor: nextApp.textColor
        }
      };

      return {
        activeButton: {
          ...s.activeButton,
          updatedAt: new Date().toISOString(),
          appearance: nextApp,
          shape: nextShape,
          states: nextStates
        }
      };
    });
    get().persistToStorage();
  },

  selectAppearancePreset: (variant) => {
    const updated = applyAppearancePresetToButton(get().activeButton, variant);
    set((s) => ({
      activeButton: updated,
      recentButtons: pushRecent(s.recentButtons, updated)
    }));
    get().persistToStorage();
  },

  selectSizePreset: (size) => {
    const updated = applySizePresetToButton(get().activeButton, size);
    set({ activeButton: updated });
    get().persistToStorage();
  },

  selectButtonType: (buttonType) => {
    const updated = applyButtonTypeToButton(get().activeButton, buttonType);
    set({
      activeButton: updated,
      previewState: buttonType === "loading" ? "loading" : "default",
      inspectorStateTab: buttonType === "loading" ? "loading" : "default"
    });
    get().persistToStorage();
  },

  updateDimensions: (partial) => {
    set((s) => ({
      activeButton: {
        ...s.activeButton,
        updatedAt: new Date().toISOString(),
        dimensions: {
          ...s.activeButton.dimensions,
          sizePreset:
            partial.sizePreset ??
            (partial.height !== undefined ||
            partial.paddingX !== undefined ||
            partial.paddingY !== undefined
              ? "custom"
              : s.activeButton.dimensions.sizePreset),
          ...partial
        }
      }
    }));
    get().persistToStorage();
  },

  updateTypography: (partial) => {
    set((s) => ({
      activeButton: {
        ...s.activeButton,
        updatedAt: new Date().toISOString(),
        typography: {
          ...s.activeButton.typography,
          ...partial
        }
      }
    }));
    get().persistToStorage();
  },

  updateShape: (partial) => {
    set((s) => {
      const prevShape = s.activeButton.shape;
      const nextRadius =
        partial.borderRadius !== undefined
          ? partial.borderRadius
          : prevShape.borderRadius;
      const nextCorners = partial.corners
        ? { ...prevShape.corners, ...partial.corners }
        : partial.borderRadius !== undefined && !prevShape.useIndividualRadius
        ? {
            topLeft: nextRadius,
            topRight: nextRadius,
            bottomRight: nextRadius,
            bottomLeft: nextRadius
          }
        : prevShape.corners;

      const nextBorderColor =
        partial.borderColor !== undefined
          ? partial.borderColor
          : prevShape.borderColor;
      const nextBorderWidth =
        partial.borderWidth !== undefined
          ? partial.borderWidth
          : prevShape.borderWidth;
      const nextBorderStyle =
        partial.borderStyle !== undefined
          ? partial.borderStyle
          : prevShape.borderStyle;

      const nextShape: ButtonShapeConfig = {
        ...prevShape,
        ...partial,
        borderRadius: nextRadius,
        corners: nextCorners,
        borderColor: nextBorderColor,
        borderWidth: nextBorderWidth,
        borderStyle: nextBorderStyle
      };

      return {
        activeButton: {
          ...s.activeButton,
          updatedAt: new Date().toISOString(),
          appearance: {
            ...s.activeButton.appearance,
            borderColor: nextBorderColor,
            borderWidth: nextBorderWidth,
            borderStyle: nextBorderStyle
          },
          shape: nextShape,
          states: {
            ...s.activeButton.states,
            default: {
              ...s.activeButton.states.default,
              borderColor: nextBorderColor,
              borderWidth: nextBorderWidth
            }
          }
        }
      };
    });
    get().persistToStorage();
  },

  selectRadiusPreset: (preset) => {
    const val = RADIUS_PRESETS[preset].value;
    get().updateShape({
      radiusPreset: preset,
      borderRadius: val,
      useIndividualRadius: false,
      corners: {
        topLeft: val,
        topRight: val,
        bottomRight: val,
        bottomLeft: val
      }
    });
  },

  updateEffects: (partial) => {
    set((s) => {
      const nextEffects: ButtonShadowConfig = {
        ...s.activeButton.effects,
        preset: partial.preset ?? "custom",
        ...partial
      };
      return {
        activeButton: {
          ...s.activeButton,
          updatedAt: new Date().toISOString(),
          effects: nextEffects,
          states: {
            ...s.activeButton.states,
            default: {
              ...s.activeButton.states.default,
              shadowEnabled: nextEffects.enabled,
              shadowColor: nextEffects.color,
              shadowBlur: nextEffects.blur,
              shadowOffsetY: nextEffects.offsetY
            },
            hover: {
              ...s.activeButton.states.hover,
              shadowEnabled: nextEffects.enabled,
              shadowColor: nextEffects.color,
              shadowBlur: nextEffects.enabled
                ? Math.min(200, nextEffects.blur + 4)
                : 0,
              shadowOffsetY: nextEffects.offsetY
            }
          }
        }
      };
    });
    get().persistToStorage();
  },

  selectShadowPreset: (preset) => {
    const cfg = SHADOW_PRESETS[preset].config;
    get().updateEffects({
      preset,
      ...cfg
    });
  },

  updateStateOverride: (stateKey, partial) => {
    set((s) => ({
      activeButton: {
        ...s.activeButton,
        updatedAt: new Date().toISOString(),
        states: {
          ...s.activeButton.states,
          [stateKey]: {
            ...s.activeButton.states[stateKey],
            ...partial
          }
        }
      }
    }));
    get().persistToStorage();
  },

  resetStateOverrides: () => {
    set((s) => ({
      activeButton: {
        ...s.activeButton,
        updatedAt: new Date().toISOString(),
        states: buildStatesFromAppearance(
          s.activeButton.appearance,
          s.activeButton.effects
        )
      }
    }));
    get().persistToStorage();
    get().showToast("Reset all interaction states to appearance defaults");
  },

  setTransitionDuration: (transitionDuration) => {
    set((s) => ({
      activeButton: {
        ...s.activeButton,
        transitionDuration
      }
    }));
    get().persistToStorage();
  },

  saveCurrentButton: (customName) => {
    const current = get().activeButton;
    const now = new Date().toISOString();
    const existingIdx = get().savedButtons.findIndex(
      (b) => b.id === current.id
    );
    const savedCopy: ButtonDefinition = {
      ...JSON.parse(JSON.stringify(current)),
      id:
        existingIdx >= 0
          ? current.id
          : `saved-${Math.random().toString(36).slice(2, 9)}`,
      name: customName?.trim() || current.name || "Untitled Button",
      updatedAt: now
    };

    set((s) => {
      const nextList =
        existingIdx >= 0
          ? s.savedButtons.map((b, idx) =>
              idx === existingIdx ? savedCopy : b
            )
          : [savedCopy, ...s.savedButtons];
      return {
        activeButton: savedCopy,
        savedButtons: nextList,
        recentButtons: pushRecent(s.recentButtons, savedCopy)
      };
    });
    get().persistToStorage();
    get().showToast(`Saved "${savedCopy.name}"`);
  },

  renameSavedButton: (id, name) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    set((s) => ({
      savedButtons: s.savedButtons.map((b) =>
        b.id === id ? { ...b, name: trimmed } : b
      ),
      activeButton:
        s.activeButton.id === id
          ? { ...s.activeButton, name: trimmed }
          : s.activeButton
    }));
    get().persistToStorage();
  },

  duplicateSavedButton: (id) => {
    const found = get().savedButtons.find((b) => b.id === id);
    if (!found) return;
    const copy: ButtonDefinition = {
      ...JSON.parse(JSON.stringify(found)),
      id: `saved-${Math.random().toString(36).slice(2, 9)}`,
      name: `${found.name} Copy`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    set((s) => ({
      savedButtons: [copy, ...s.savedButtons],
      activeButton: copy
    }));
    get().persistToStorage();
    get().showToast(`Duplicated "${found.name}"`);
  },

  deleteSavedButton: (id) => {
    set((s) => ({
      savedButtons: s.savedButtons.filter((b) => b.id !== id),
      recentButtons: s.recentButtons.filter((b) => b.id !== id)
    }));
    get().persistToStorage();
    get().showToast("Deleted saved button");
  },

  loadSavedButton: (id) => {
    const found =
      get().savedButtons.find((b) => b.id === id) ||
      get().recentButtons.find((b) => b.id === id);
    if (!found) return;
    const copy: ButtonDefinition = JSON.parse(JSON.stringify(found));
    set((s) => ({
      activeButton: copy,
      recentButtons: pushRecent(s.recentButtons, copy)
    }));
    get().persistToStorage();
  },

  addVariantFromCurrent: (customName) => {
    const cur = get().activeButton;
    const count = get().variants.length + 1;
    const newVar: ButtonVariantItem = {
      id: `variant-${Math.random().toString(36).slice(2, 9)}`,
      name:
        customName?.trim() ||
        `${cur.appearance.variant.toUpperCase()} / ${cur.dimensions.sizePreset.toUpperCase()} #${count}`,
      appearance: cur.appearance.variant,
      size: cur.dimensions.sizePreset,
      previewState: get().previewState,
      showInComparison: true,
      definition: JSON.parse(JSON.stringify(cur))
    };
    set((s) => ({
      variants: [...s.variants, newVar]
    }));
    get().persistToStorage();
    get().showToast(`Added variant "${newVar.name}"`);
  },

  duplicateVariant: (id) => {
    const found = get().variants.find((v) => v.id === id);
    if (!found) return;
    const copy: ButtonVariantItem = {
      ...JSON.parse(JSON.stringify(found)),
      id: `variant-${Math.random().toString(36).slice(2, 9)}`,
      name: `${found.name} Copy`
    };
    set((s) => ({
      variants: [...s.variants, copy]
    }));
    get().persistToStorage();
    get().showToast(`Duplicated variant "${found.name}"`);
  },

  renameVariant: (id, name) => {
    set((s) => ({
      variants: s.variants.map((v) =>
        v.id === id
          ? {
              ...v,
              name,
              definition: { ...v.definition, name }
            }
          : v
      )
    }));
    get().persistToStorage();
  },

  deleteVariant: (id) => {
    set((s) => ({
      variants: s.variants.filter((v) => v.id !== id)
    }));
    get().persistToStorage();
    get().showToast("Removed variant");
  },

  toggleVariantComparison: (id) => {
    set((s) => ({
      variants: s.variants.map((v) =>
        v.id === id ? { ...v, showInComparison: !v.showInComparison } : v
      )
    }));
    get().persistToStorage();
  },

  updateVariantMeta: (id, partial) => {
    set((s) => ({
      variants: s.variants.map((v) => {
        if (v.id !== id) return v;
        let nextDef = { ...v.definition };
        if (
          partial.appearance &&
          partial.appearance !== "custom" &&
          partial.appearance !== v.appearance
        ) {
          nextDef = applyAppearancePresetToButton(nextDef, partial.appearance);
        }
        if (
          partial.size &&
          partial.size !== "custom" &&
          partial.size !== v.size
        ) {
          nextDef = applySizePresetToButton(nextDef, partial.size);
        }
        return {
          ...v,
          ...partial,
          definition: nextDef
        };
      })
    }));
    get().persistToStorage();
  },

  loadVariantIntoEditor: (id) => {
    const found = get().variants.find((v) => v.id === id);
    if (!found) return;
    set({
      activeButton: JSON.parse(JSON.stringify(found.definition)),
      previewState: found.previewState,
      inspectorStateTab: found.previewState
    });
    get().showToast(`Loaded variant "${found.name}" into editor`);
  },

  syncCurrentToVariant: (id) => {
    const cur = get().activeButton;
    set((s) => ({
      variants: s.variants.map((v) =>
        v.id === id
          ? {
              ...v,
              appearance: cur.appearance.variant,
              size: cur.dimensions.sizePreset,
              definition: JSON.parse(JSON.stringify(cur))
            }
          : v
      )
    }));
    get().persistToStorage();
    get().showToast("Updated variant with current editor settings");
  },

  resetVariantsToDefaults: () => {
    set({ variants: createInitialVariants() });
    get().persistToStorage();
    get().showToast("Reset variants to default set");
  },

  updateTokenColor: (key, value) => {
    set((s) => ({
      tokens: {
        ...s.tokens,
        colors: {
          ...s.tokens.colors,
          [key]: value
        }
      }
    }));
    get().persistToStorage();
  },

  updateTokenSpacing: (partial) => {
    set((s) => ({
      tokens: {
        ...s.tokens,
        spacing: {
          ...s.tokens.spacing,
          ...partial
        }
      }
    }));
    get().persistToStorage();
  },

  updateTokenTypography: (partial) => {
    set((s) => ({
      tokens: {
        ...s.tokens,
        typography: {
          ...s.tokens.typography,
          ...partial
        }
      }
    }));
    get().persistToStorage();
  },

  updateTokenShape: (partial) => {
    set((s) => ({
      tokens: {
        ...s.tokens,
        shape: {
          ...s.tokens.shape,
          ...partial
        }
      }
    }));
    get().persistToStorage();
  },

  applyTokensToActive: (colorRole) => {
    set((s) => ({
      activeButton: applyTokensToButton(
        s.activeButton,
        s.tokens,
        colorRole
      )
    }));
    get().persistToStorage();
    get().showToast("Applied design tokens to active button");
  },

  resetTokens: () => {
    set({ tokens: DEFAULT_DESIGN_TOKENS });
    get().persistToStorage();
    get().showToast("Reset design tokens");
  },

  importJsonDocument: (rawJson) => {
    try {
      const parsed = JSON.parse(rawJson);
      const docResult = ButtonStudioExportDocumentSchema.safeParse(parsed);
      if (docResult.success) {
        const doc = docResult.data;
        set((s) => ({
          activeButton: doc.activeButton,
          variants:
            doc.variants && doc.variants.length > 0
              ? doc.variants
              : s.variants,
          tokens: doc.tokens ?? s.tokens,
          recentButtons: pushRecent(s.recentButtons, doc.activeButton)
        }));
        get().persistToStorage();
        get().showToast("Imported Button Studio JSON document");
        return { ok: true };
      }

      const btnResult = ButtonDefinitionSchema.safeParse(parsed);
      if (btnResult.success) {
        set((s) => ({
          activeButton: btnResult.data,
          recentButtons: pushRecent(s.recentButtons, btnResult.data)
        }));
        get().persistToStorage();
        get().showToast("Imported button configuration");
        return { ok: true };
      }

      const firstErr =
        docResult.error.issues[0]?.message || "Invalid button JSON schema.";
      return {
        ok: false,
        error: `Schema validation failed: ${firstErr}`
      };
    } catch (err) {
      return {
        ok: false,
        error:
          err instanceof Error ? err.message : "Could not parse JSON string."
      };
    }
  }
}));
