import type {
  ButtonDefinition,
  ButtonInteractionState,
  ButtonShadowConfig,
  ButtonStudioExportDocument,
  ButtonVariantItem,
  DesignTokens,
  FigmaButtonExportNode
} from "@/src/types/button";

export function hexToRgbaString(hex: string, opacityPercent: number): string {
  const clean = (hex || "#0f172a").trim().replace(/^#/, "");
  if (clean.toLowerCase() === "transparent") return "rgba(0, 0, 0, 0)";
  let full = clean;
  if (/^[0-9a-fA-F]{3}$/.test(clean)) {
    full = `${clean[0]}${clean[0]}${clean[1]}${clean[1]}${clean[2]}${clean[2]}`;
  }
  if (!/^[0-9a-fA-F]{6}$/.test(full)) {
    return `rgba(15, 23, 42, ${(opacityPercent / 100).toFixed(2)})`;
  }
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  const a = Math.min(1, Math.max(0, opacityPercent / 100));
  return `rgba(${r}, ${g}, ${b}, ${a.toFixed(2)})`;
}

export function computeBoxShadowCss(
  shadow: ButtonShadowConfig,
  state?: ButtonDefinition["states"][ButtonInteractionState]
): string {
  const enabled = state ? state.shadowEnabled : shadow.enabled;
  const ringWidth = state ? state.focusRingWidth : 0;
  const ringColor = state ? state.focusRingColor : "#2563eb";
  const ringOffset = state ? state.focusRingOffset : 2;

  const parts: string[] = [];

  if (ringWidth > 0) {
    if (ringOffset > 0) {
      parts.push(`0 0 0 ${ringOffset}px #ffffff`);
    }
    parts.push(`0 0 0 ${ringOffset + ringWidth}px ${ringColor}`);
  }

  if (enabled && shadow.opacity > 0) {
    const blur = state ? state.shadowBlur : shadow.blur;
    const offsetY = state ? state.shadowOffsetY : shadow.offsetY;
    const color = state ? state.shadowColor : shadow.color;
    const rgba = hexToRgbaString(color, shadow.opacity);
    parts.push(`${shadow.offsetX}px ${offsetY}px ${blur}px ${shadow.spread}px ${rgba}`);
  }

  return parts.length > 0 ? parts.join(", ") : "none";
}

export function computeBorderRadiusCss(shape: ButtonDefinition["shape"]): string {
  if (shape.useIndividualRadius) {
    const { topLeft, topRight, bottomRight, bottomLeft } = shape.corners;
    return `${topLeft}px ${topRight}px ${bottomRight}px ${bottomLeft}px`;
  }
  return `${shape.borderRadius}px`;
}

export function buildFigmaNodePayload(
  button: ButtonDefinition,
  activeState: ButtonInteractionState = "default"
): FigmaButtonExportNode {
  const st = button.states[activeState];
  const { corners, useIndividualRadius, borderRadius } = button.shape;
  const dashPattern =
    button.shape.borderStyle === "dashed"
      ? [6, 4]
      : button.shape.borderStyle === "dotted"
      ? [2, 2]
      : [];

  return {
    schemaVersion: "1.0.0",
    nodeType: "COMPONENT",
    name: `Button / ${button.appearance.variant} / ${button.dimensions.sizePreset} / ${activeState}`,
    variantProperties: {
      Appearance: button.appearance.customVariantName || button.appearance.variant,
      Size: button.dimensions.sizePreset,
      State: activeState,
      Type: button.content.buttonType
    },
    layout: {
      layoutMode: "HORIZONTAL",
      widthMode: button.dimensions.widthMode,
      width: button.dimensions.width,
      height: button.dimensions.height,
      minWidth: button.dimensions.minWidth,
      maxWidth:
        button.dimensions.maxWidth > 0 ? button.dimensions.maxWidth : null,
      paddingLeft: button.dimensions.paddingX,
      paddingRight: button.dimensions.paddingX,
      paddingTop: button.dimensions.paddingY,
      paddingBottom: button.dimensions.paddingY,
      itemSpacing: button.content.gap,
      primaryAxisAlignItems:
        button.content.textAlign === "left"
          ? "MIN"
          : button.content.textAlign === "right"
          ? "MAX"
          : "CENTER",
      counterAxisAlignItems: "CENTER"
    },
    fills:
      st.backgroundColor === "transparent"
        ? []
        : [
            {
              type: "SOLID",
              color: st.backgroundColor,
              opacity: st.opacity / 100
            }
          ],
    strokes:
      button.shape.borderStyle === "none" || st.borderWidth <= 0
        ? []
        : [
            {
              type: "SOLID",
              color: st.borderColor,
              weight: st.borderWidth,
              dashPattern
            }
          ],
    cornerRadius: {
      uniform: borderRadius,
      topLeft: useIndividualRadius ? corners.topLeft : borderRadius,
      topRight: useIndividualRadius ? corners.topRight : borderRadius,
      bottomRight: useIndividualRadius ? corners.bottomRight : borderRadius,
      bottomLeft: useIndividualRadius ? corners.bottomLeft : borderRadius
    },
    typography: { ...button.typography },
    icon: {
      enabled: button.content.showIcon,
      position: button.content.iconPosition,
      leadingIcon: button.content.leadingIcon,
      trailingIcon: button.content.trailingIcon,
      size: button.content.iconSize
    },
    effects: { ...button.effects }
  };
}

export function buildExportDocument(
  button: ButtonDefinition,
  variants: ButtonVariantItem[],
  tokens: DesignTokens,
  activeState: ButtonInteractionState = "default"
): ButtonStudioExportDocument {
  return {
    schemaVersion: "1.0.0",
    exportedAt: new Date().toISOString(),
    activeButton: button,
    variants,
    tokens,
    figmaNode: buildFigmaNodePayload(button, activeState)
  };
}

export function generateButtonCss(button: ButtonDefinition): string {
  const d = button.dimensions;
  const t = button.typography;
  const s = button.shape;
  const stDefault = button.states.default;
  const stHover = button.states.hover;
  const stFocus = button.states.focus;
  const stPressed = button.states.pressed;
  const stDisabled = button.states.disabled;

  const widthRule =
    d.widthMode === "full"
      ? "width: 100%;"
      : d.widthMode === "fixed"
      ? `width: ${d.width}px;`
      : "width: auto;";

  const maxW = d.maxWidth > 0 ? `\n  max-width: ${d.maxWidth}px;` : "";
  const radius = computeBorderRadiusCss(s);
  const defaultShadow = computeBoxShadowCss(button.effects, stDefault);
  const hoverShadow = computeBoxShadowCss(button.effects, stHover);
  const focusShadow = computeBoxShadowCss(button.effects, stFocus);
  const pressedShadow = computeBoxShadowCss(button.effects, stPressed);

  const borderRule =
    s.borderStyle === "none" || stDefault.borderWidth === 0
      ? "border: none;"
      : `border: ${stDefault.borderWidth}px ${s.borderStyle} ${stDefault.borderColor};`;

  return `.btn-${button.appearance.variant} {
  display: inline-flex;
  align-items: center;
  justify-content: ${
    button.content.textAlign === "left"
      ? "flex-start"
      : button.content.textAlign === "right"
      ? "flex-end"
      : "center"
  };
  gap: ${button.content.gap}px;
  ${widthRule}
  height: ${d.height}px;
  min-width: ${d.minWidth}px;${maxW}
  padding: ${d.paddingY}px ${d.paddingX}px;
  background-color: ${stDefault.backgroundColor};
  color: ${stDefault.textColor};
  ${borderRule}
  border-radius: ${radius};
  font-family: ${t.fontFamily};
  font-size: ${t.fontSize}px;
  font-weight: ${t.fontWeight};
  line-height: ${t.lineHeight};
  letter-spacing: ${t.letterSpacing}px;
  text-transform: ${t.textTransform};
  opacity: ${(stDefault.opacity / 100).toFixed(2)};
  box-shadow: ${defaultShadow};
  cursor: pointer;
  user-select: none;
  transition: all ${button.transitionDuration}ms ${button.transitionEasing};
}

.btn-${button.appearance.variant}:hover:not(:disabled) {
  background-color: ${stHover.backgroundColor};
  color: ${stHover.textColor};
  border-color: ${stHover.borderColor};
  opacity: ${(stHover.opacity / 100).toFixed(2)};
  transform: translateY(${stHover.translateY}px) scale(${stHover.scale});
  box-shadow: ${hoverShadow};
}

.btn-${button.appearance.variant}:focus-visible {
  outline: none;
  box-shadow: ${focusShadow};
}

.btn-${button.appearance.variant}:active:not(:disabled) {
  background-color: ${stPressed.backgroundColor};
  color: ${stPressed.textColor};
  transform: translateY(${stPressed.translateY}px) scale(${stPressed.scale});
  box-shadow: ${pressedShadow};
}

.btn-${button.appearance.variant}:disabled {
  opacity: ${(stDisabled.opacity / 100).toFixed(2)};
  cursor: not-allowed;
  box-shadow: none;
}`;
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function roundedRectSvgPath(
  x: number,
  y: number,
  w: number,
  h: number,
  tl: number,
  tr: number,
  br: number,
  bl: number
): string {
  const maxR = Math.min(w / 2, h / 2);
  const rTL = Math.min(maxR, Math.max(0, tl));
  const rTR = Math.min(maxR, Math.max(0, tr));
  const rBR = Math.min(maxR, Math.max(0, br));
  const rBL = Math.min(maxR, Math.max(0, bl));

  return [
    `M ${x + rTL} ${y}`,
    `H ${x + w - rTR}`,
    `A ${rTR} ${rTR} 0 0 1 ${x + w} ${y + rTR}`,
    `V ${y + h - rBR}`,
    `A ${rBR} ${rBR} 0 0 1 ${x + w - rBR} ${y + h}`,
    `H ${x + rBL}`,
    `A ${rBL} ${rBL} 0 0 1 ${x} ${y + h - rBL}`,
    `V ${y + rTL}`,
    `A ${rTL} ${rTL} 0 0 1 ${x + rTL} ${y}`,
    "Z"
  ].join(" ");
}

export function generateButtonSvg(
  button: ButtonDefinition,
  activeState: ButtonInteractionState = "default"
): string {
  const st = button.states[activeState];
  const d = button.dimensions;
  const t = button.typography;
  const s = button.shape;
  const isIconOnly =
    button.content.buttonType === "icon" ||
    button.content.iconPosition === "only";
  const labelText =
    activeState === "loading" && st.loadingLabel
      ? st.loadingLabel
      : button.content.label;

  const estCharW = t.fontSize * 0.58;
  const textW = isIconOnly ? 0 : Math.ceil(labelText.length * estCharW);
  const hasLeading =
    button.content.showIcon &&
    (button.content.iconPosition === "leading" ||
      button.content.iconPosition === "both" ||
      isIconOnly ||
      activeState === "loading");
  const hasTrailing =
    !isIconOnly &&
    activeState !== "loading" &&
    button.content.showIcon &&
    (button.content.iconPosition === "trailing" ||
      button.content.iconPosition === "both");

  const iconCount = (hasLeading ? 1 : 0) + (hasTrailing ? 1 : 0);
  const gapTotal =
    !isIconOnly && iconCount > 0
      ? iconCount * button.content.gap
      : 0;
  const contentW =
    textW + iconCount * button.content.iconSize + gapTotal;

  const computedW =
    d.widthMode === "fixed"
      ? d.width
      : d.widthMode === "full"
      ? Math.max(260, contentW + d.paddingX * 2)
      : Math.max(d.minWidth, contentW + d.paddingX * 2);

  const w =
    d.maxWidth > 0 ? Math.min(d.maxWidth, computedW) : computedW;
  const h = d.height;

  const tl = s.useIndividualRadius ? s.corners.topLeft : s.borderRadius;
  const tr = s.useIndividualRadius ? s.corners.topRight : s.borderRadius;
  const br = s.useIndividualRadius ? s.corners.bottomRight : s.borderRadius;
  const bl = s.useIndividualRadius ? s.corners.bottomLeft : s.borderRadius;

  const halfStroke =
    s.borderStyle !== "none" && st.borderWidth > 0 ? st.borderWidth / 2 : 0;
  const pathData = roundedRectSvgPath(
    halfStroke,
    halfStroke,
    w - halfStroke * 2,
    h - halfStroke * 2,
    Math.max(0, tl - halfStroke),
    Math.max(0, tr - halfStroke),
    Math.max(0, br - halfStroke),
    Math.max(0, bl - halfStroke)
  );

  const fillAttr =
    st.backgroundColor === "transparent" ? "none" : escapeXml(st.backgroundColor);
  const strokeAttr =
    s.borderStyle !== "none" && st.borderWidth > 0
      ? ` stroke="${escapeXml(st.borderColor)}" stroke-width="${st.borderWidth}"`
      : "";

  const textY = +(h / 2 + t.fontSize * 0.35).toFixed(2);
  const textX = +(w / 2).toFixed(2);

  const textNode = isIconOnly
    ? ""
    : `\n  <text x="${textX}" y="${textY}" text-anchor="middle" fill="${escapeXml(
        st.textColor
      )}" font-family="${escapeXml(
        t.fontFamily.replace(/"/g, "'")
      )}" font-size="${t.fontSize}" font-weight="${t.fontWeight}" letter-spacing="${
        t.letterSpacing
      }">${escapeXml(labelText)}</text>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" fill="none" opacity="${(
    st.opacity / 100
  ).toFixed(2)}">
  <path d="${pathData}" fill="${fillAttr}"${strokeAttr} />${textNode}
</svg>`;
}
