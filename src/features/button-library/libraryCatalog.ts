import type {
  ButtonAppearance,
  ButtonDefinition,
  ButtonTypeKind
} from "@/src/types/button";
import { createButtonDefinition } from "@/src/utils/presets";

export interface LibraryCatalogEntry {
  id: string;
  name: string;
  group: "appearance" | "type";
  appearance: Exclude<ButtonAppearance, "custom">;
  buttonType: ButtonTypeKind;
  description: string;
  create: () => ButtonDefinition;
}

export const LIBRARY_APPEARANCE_ITEMS: ReadonlyArray<LibraryCatalogEntry> = [
  {
    id: "lib-app-primary",
    name: "Primary",
    group: "appearance",
    appearance: "primary",
    buttonType: "icon-text",
    description: "Solid cobalt primary CTA",
    create: () =>
      createButtonDefinition({
        id: "preset-primary",
        name: "Primary Button",
        appearance: "primary",
        buttonType: "icon-text",
        label: "Create Project",
        leadingIcon: "Plus"
      })
  },
  {
    id: "lib-app-secondary",
    name: "Secondary",
    group: "appearance",
    appearance: "secondary",
    buttonType: "icon-text",
    description: "High-contrast slate action",
    create: () =>
      createButtonDefinition({
        id: "preset-secondary",
        name: "Secondary Button",
        appearance: "secondary",
        buttonType: "icon-text",
        label: "Deploy Build",
        leadingIcon: "Rocket"
      })
  },
  {
    id: "lib-app-tertiary",
    name: "Tertiary",
    group: "appearance",
    appearance: "tertiary",
    buttonType: "text",
    description: "Subtle surface fill control",
    create: () =>
      createButtonDefinition({
        id: "preset-tertiary",
        name: "Tertiary Button",
        appearance: "tertiary",
        buttonType: "text",
        label: "View Details"
      })
  },
  {
    id: "lib-app-outline",
    name: "Outline",
    group: "appearance",
    appearance: "outline",
    buttonType: "icon-text",
    description: "1px neutral border on white",
    create: () =>
      createButtonDefinition({
        id: "preset-outline",
        name: "Outline Button",
        appearance: "outline",
        buttonType: "icon-text",
        label: "Export Config",
        leadingIcon: "Download"
      })
  },
  {
    id: "lib-app-ghost",
    name: "Ghost",
    group: "appearance",
    appearance: "ghost",
    buttonType: "icon-text",
    description: "Transparent background until hovered",
    create: () =>
      createButtonDefinition({
        id: "preset-ghost",
        name: "Ghost Button",
        appearance: "ghost",
        buttonType: "icon-text",
        label: "Filter View",
        leadingIcon: "SlidersHorizontal"
      })
  },
  {
    id: "lib-app-destructive",
    name: "Destructive",
    group: "appearance",
    appearance: "destructive",
    buttonType: "icon-text",
    description: "Danger state for delete or revoke",
    create: () =>
      createButtonDefinition({
        id: "preset-destructive",
        name: "Destructive Button",
        appearance: "destructive",
        buttonType: "icon-text",
        label: "Delete Workspace",
        leadingIcon: "Trash2"
      })
  },
  {
    id: "lib-app-link",
    name: "Link",
    group: "appearance",
    appearance: "link",
    buttonType: "icon-text",
    description: "Inline navigational action",
    create: () =>
      createButtonDefinition({
        id: "preset-link",
        name: "Link Button",
        appearance: "link",
        buttonType: "icon-text",
        label: "Read documentation",
        trailingIcon: "ExternalLink"
      })
  }
];

export const LIBRARY_BUTTON_TYPE_ITEMS: ReadonlyArray<LibraryCatalogEntry> = [
  {
    id: "lib-type-text",
    name: "Text button",
    group: "type",
    appearance: "primary",
    buttonType: "text",
    description: "Label only without icons",
    create: () =>
      createButtonDefinition({
        id: "preset-type-text",
        name: "Text Button",
        appearance: "primary",
        buttonType: "text",
        label: "Save Changes"
      })
  },
  {
    id: "lib-type-icon",
    name: "Icon button",
    group: "type",
    appearance: "outline",
    buttonType: "icon",
    description: "Square compact icon-only button",
    create: () =>
      createButtonDefinition({
        id: "preset-type-icon",
        name: "Icon Button",
        appearance: "outline",
        buttonType: "icon",
        label: "Settings",
        leadingIcon: "Settings"
      })
  },
  {
    id: "lib-type-icon-text",
    name: "Icon + text button",
    group: "type",
    appearance: "primary",
    buttonType: "icon-text",
    description: "Leading or trailing icon with text",
    create: () =>
      createButtonDefinition({
        id: "preset-type-icon-text",
        name: "Icon + Text Button",
        appearance: "primary",
        buttonType: "icon-text",
        label: "Generate Token",
        leadingIcon: "Sparkles"
      })
  },
  {
    id: "lib-type-loading",
    name: "Loading button",
    group: "type",
    appearance: "primary",
    buttonType: "loading",
    description: "Animated spinner with status label",
    create: () =>
      createButtonDefinition({
        id: "preset-type-loading",
        name: "Loading Button",
        appearance: "primary",
        buttonType: "loading",
        label: "Saving changes..."
      })
  }
];
