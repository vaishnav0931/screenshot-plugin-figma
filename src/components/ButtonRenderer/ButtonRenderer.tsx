"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";
import type {
  ButtonDefinition,
  ButtonInteractionState
} from "@/src/types/button";
import { LucideIconByName } from "@/src/components/IconPicker/IconPicker";
import {
  computeBorderRadiusCss,
  computeBoxShadowCss
} from "@/src/utils/exportUtils";

export function ButtonRenderer({
  button,
  forcedState,
  interactive = true,
  onClick
}: {
  button: ButtonDefinition;
  forcedState?: ButtonInteractionState;
  interactive?: boolean;
  onClick?: () => void;
}) {
  const [hovered, setHovered] = React.useState(false);
  const [focused, setFocused] = React.useState(false);
  const [pressed, setPressed] = React.useState(false);

  const effectiveState: ButtonInteractionState = React.useMemo(() => {
    if (forcedState && (!interactive || forcedState !== "default")) {
      return forcedState;
    }
    if (button.content.buttonType === "loading") {
      return "loading";
    }
    if (!interactive) {
      return forcedState ?? "default";
    }
    if (pressed) return "pressed";
    if (hovered) return "hover";
    if (focused) return "focus";
    return "default";
  }, [
    forcedState,
    interactive,
    button.content.buttonType,
    pressed,
    hovered,
    focused
  ]);

  const st = button.states[effectiveState] ?? button.states.default;
  const d = button.dimensions;
  const t = button.typography;
  const s = button.shape;
  const c = button.content;

  const isDisabled = effectiveState === "disabled";
  const isLoading = effectiveState === "loading";
  const isIconOnly = c.buttonType === "icon" || c.iconPosition === "only";

  const showLeading =
    !isLoading &&
    c.showIcon &&
    c.buttonType !== "text" &&
    (c.iconPosition === "leading" ||
      c.iconPosition === "both" ||
      c.iconPosition === "only");

  const showTrailing =
    !isLoading &&
    !isIconOnly &&
    c.showIcon &&
    c.buttonType !== "text" &&
    (c.iconPosition === "trailing" || c.iconPosition === "both");

  const displayLabel =
    isLoading && st.loadingLabel ? st.loadingLabel : c.label;

  const hasBorder = s.borderStyle !== "none" && st.borderWidth > 0;
  const borderRadiusCss = computeBorderRadiusCss(s);
  const boxShadowCss = computeBoxShadowCss(button.effects, st);

  const justifyContent =
    c.textAlign === "left"
      ? "flex-start"
      : c.textAlign === "right"
      ? "flex-end"
      : "center";

  const widthStyle: React.CSSProperties =
    d.widthMode === "full"
      ? { width: "100%" }
      : d.widthMode === "fixed"
      ? { width: `${d.width}px` }
      : { width: "auto" };

  return (
    <button
      type="button"
      disabled={isDisabled}
      aria-busy={isLoading}
      aria-label={c.label || button.name}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setPressed(false);
      }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onFocus={() => setFocused(true)}
      onBlur={() => {
        setFocused(false);
        setPressed(false);
      }}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: isIconOnly ? "center" : justifyContent,
        gap: `${c.gap}px`,
        ...widthStyle,
        height: `${d.height}px`,
        minWidth: `${d.minWidth}px`,
        maxWidth: d.maxWidth > 0 ? `${d.maxWidth}px` : undefined,
        paddingLeft: isIconOnly ? 0 : `${d.paddingX}px`,
        paddingRight: isIconOnly ? 0 : `${d.paddingX}px`,
        paddingTop: isIconOnly ? 0 : `${d.paddingY}px`,
        paddingBottom: isIconOnly ? 0 : `${d.paddingY}px`,
        backgroundColor: st.backgroundColor,
        color: st.textColor,
        borderWidth: hasBorder ? `${st.borderWidth}px` : 0,
        borderStyle: hasBorder ? s.borderStyle : "none",
        borderColor: hasBorder ? st.borderColor : "transparent",
        borderRadius: borderRadiusCss,
        fontFamily: t.fontFamily,
        fontSize: `${t.fontSize}px`,
        fontWeight: t.fontWeight,
        lineHeight: t.lineHeight,
        letterSpacing: `${t.letterSpacing}px`,
        textTransform: t.textTransform,
        textDecoration:
          button.appearance.variant === "link" &&
          (effectiveState === "hover" || effectiveState === "pressed")
            ? "underline"
            : "none",
        opacity: st.opacity / 100,
        transform: `translateY(${st.translateY}px) scale(${st.scale})`,
        boxShadow: boxShadowCss,
        cursor: isDisabled
          ? "not-allowed"
          : isLoading
          ? "progress"
          : "pointer",
        userSelect: "none",
        outline: "none",
        whiteSpace: "nowrap",
        overflow: "hidden",
        transition: `all ${button.transitionDuration}ms ${button.transitionEasing}`
      }}
    >
      {isLoading && (
        <Loader2
          size={c.iconSize}
          color={st.spinnerColor || st.textColor}
          className="bs-spinner"
          style={{ flexShrink: 0 }}
        />
      )}

      {showLeading && (
        <LucideIconByName
          name={c.leadingIcon}
          size={c.iconSize}
          color={st.textColor}
        />
      )}

      {!isIconOnly && (
        <span
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap"
          }}
        >
          {displayLabel}
        </span>
      )}

      {showTrailing && (
        <LucideIconByName
          name={c.trailingIcon}
          size={c.iconSize}
          color={st.textColor}
        />
      )}
    </button>
  );
}
