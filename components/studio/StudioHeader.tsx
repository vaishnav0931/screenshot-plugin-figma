"use client";

import * as React from "react";
import Link from "next/link";

export type StudioRouteHref =
  | "/"
  | "/playground/pixel-prompt-button"
  | "/playground/heat-distortion";

const NAV_ITEMS: ReadonlyArray<{ href: StudioRouteHref; label: string }> = [
  { href: "/", label: "Components" },
  { href: "/playground/pixel-prompt-button", label: "Pixel Prompt Button" },
  { href: "/playground/heat-distortion", label: "Heat Distortion" }
];

export function StudioHeaderButton({
  children,
  onClick,
  active = false,
  muted = false,
  title
}: {
  children: React.ReactNode;
  onClick: () => void;
  active?: boolean;
  muted?: boolean;
  title?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      style={{
        height: 30,
        padding: "0 11px",
        borderRadius: 7,
        backgroundColor: active ? "#3b82f6" : "#18181c",
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: active ? "#3b82f6" : "#2e2e36",
        color: active ? "#ffffff" : muted ? "#a1a1aa" : "#e4e4e7",
        fontSize: 12,
        fontWeight: 500,
        cursor: "pointer",
        whiteSpace: "nowrap"
      }}
    >
      {children}
    </button>
  );
}

export function StudioHeader({
  activeHref,
  statusMsg,
  actions
}: {
  activeHref: StudioRouteHref;
  statusMsg?: string | null;
  actions?: React.ReactNode;
}) {
  return (
    <header
      style={{
        minHeight: 54,
        padding: "8px 18px",
        borderBottomWidth: 1,
        borderBottomStyle: "solid",
        borderBottomColor: "#24242b",
        backgroundColor: "#0d0d11",
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
        position: "sticky",
        top: 0,
        zIndex: 30
      }}
    >
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 14 }}>
        <Link
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 9,
            textDecoration: "none",
            color: "#f4f4f5"
          }}
        >
          <span
            style={{
              width: 24,
              height: 24,
              borderRadius: 6,
              backgroundImage: "linear-gradient(135deg, #2c5cf5, #60a5fa)",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 12,
              fontWeight: 700,
              color: "#ffffff"
            }}
          >
            P
          </span>
          <span style={{ fontSize: 13.5, fontWeight: 600, letterSpacing: "-0.01em" }}>
            Pixel UI
          </span>
        </Link>

        <nav
          aria-label="Component navigation"
          style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 4 }}
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activeHref === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  height: 28,
                  padding: "0 10px",
                  borderRadius: 6,
                  backgroundColor: isActive ? "#24242a" : "transparent",
                  borderWidth: 1,
                  borderStyle: "solid",
                  borderColor: isActive ? "#34343f" : "transparent",
                  color: isActive ? "#ffffff" : "#9a9aa6",
                  fontSize: 12.5,
                  fontWeight: 500,
                  display: "inline-flex",
                  alignItems: "center",
                  textDecoration: "none",
                  whiteSpace: "nowrap"
                }}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {(statusMsg || actions) && (
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8 }}>
          {statusMsg && (
            <span
              role="status"
              style={{
                fontSize: 12,
                color: "#93c5fd",
                backgroundColor: "rgba(59, 130, 246, 0.14)",
                borderWidth: 1,
                borderStyle: "solid",
                borderColor: "rgba(59, 130, 246, 0.35)",
                borderRadius: 6,
                padding: "4px 9px"
              }}
            >
              {statusMsg}
            </span>
          )}
          {actions}
        </div>
      )}
    </header>
  );
}
