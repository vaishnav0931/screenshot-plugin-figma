"use client";

import * as React from "react";

export function CollapsibleSection({
  title,
  badge,
  defaultOpen = true,
  onReset,
  children
}: {
  title: string;
  badge?: string;
  defaultOpen?: boolean;
  onReset?: () => void;
  children: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(defaultOpen);

  return (
    <section
      style={{
        borderBottomWidth: 1,
        borderBottomStyle: "solid",
        borderBottomColor: "#e2e8f0"
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "9px 14px",
          backgroundColor: open ? "#ffffff" : "#f8fafc"
        }}
      >
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: 0,
            borderWidth: 0,
            backgroundColor: "transparent",
            color: "#0f172a",
            fontSize: 12,
            fontWeight: 600,
            cursor: "pointer"
          }}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
            style={{
              color: "#64748b",
              transform: open ? "rotate(90deg)" : "rotate(0deg)",
              transition: "transform 140ms ease"
            }}
          >
            <path
              d="M6 4l4 4-4 4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>{title}</span>
          {badge && (
            <span
              style={{
                fontSize: 10.5,
                fontWeight: 500,
                padding: "1px 6px",
                borderRadius: 9999,
                backgroundColor: "#eff6ff",
                color: "#2563eb"
              }}
            >
              {badge}
            </span>
          )}
        </button>

        {onReset && (
          <button
            type="button"
            onClick={onReset}
            title={`Reset ${title}`}
            style={{
              borderWidth: 0,
              backgroundColor: "transparent",
              color: "#64748b",
              fontSize: 11,
              cursor: "pointer",
              padding: "2px 4px",
              borderRadius: 4
            }}
          >
            Reset
          </button>
        )}
      </div>

      {open && (
        <div
          style={{
            padding: "4px 14px 14px",
            display: "flex",
            flexDirection: "column",
            gap: 10
          }}
        >
          {children}
        </div>
      )}
    </section>
  );
}

export function PropertyRow({
  label,
  children,
  stacked = false
}: {
  label: string;
  children: React.ReactNode;
  stacked?: boolean;
}) {
  if (stacked) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
        <span style={{ fontSize: 11.5, fontWeight: 500, color: "#475569" }}>
          {label}
        </span>
        {children}
      </div>
    );
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "102px minmax(0, 1fr)",
        alignItems: "center",
        gap: 8
      }}
    >
      <span
        style={{
          fontSize: 11.5,
          fontWeight: 500,
          color: "#475569",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap"
        }}
      >
        {label}
      </span>
      <div style={{ minWidth: 0 }}>{children}</div>
    </div>
  );
}

export function NumberSliderInput({
  value,
  min,
  max,
  step = 1,
  unit = "px",
  onChange,
  ariaLabel
}: {
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (val: number) => void;
  ariaLabel?: string;
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(0, 1fr) 64px",
        alignItems: "center",
        gap: 8
      }}
    >
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={Math.min(max, Math.max(min, value))}
        aria-label={ariaLabel}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{
          width: "100%",
          accentColor: "#2563eb",
          cursor: "ew-resize"
        }}
      />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          height: 26,
          padding: "0 6px",
          borderRadius: 5,
          borderWidth: 1,
          borderStyle: "solid",
          borderColor: "#e2e8f0",
          backgroundColor: "#f8fafc"
        }}
      >
        <input
          type="number"
          min={min}
          max={max}
          step={step}
          value={value}
          aria-label={ariaLabel ? `${ariaLabel} number` : undefined}
          onChange={(e) => {
            const parsed = Number(e.target.value);
            if (!Number.isNaN(parsed)) {
              onChange(parsed);
            }
          }}
          style={{
            width: "100%",
            borderWidth: 0,
            backgroundColor: "transparent",
            color: "#0f172a",
            fontSize: 11.5,
            fontFamily: "var(--bs-font-mono)",
            outline: "none",
            textAlign: "right"
          }}
        />
        {unit && (
          <span
            style={{
              fontSize: 10.5,
              color: "#94a3b8",
              marginLeft: 2,
              userSelect: "none"
            }}
          >
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}

export function SegmentedControl<T extends string | number>({
  value,
  options,
  onChange
}: {
  value: T;
  options: ReadonlyArray<{ value: T; label: React.ReactNode }>;
  onChange: (next: T) => void;
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))`,
        gap: 2,
        padding: 2,
        borderRadius: 6,
        backgroundColor: "#f1f5f9",
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: "#e2e8f0"
      }}
    >
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            style={{
              height: 23,
              padding: "0 6px",
              borderRadius: 4,
              borderWidth: 0,
              backgroundColor: active ? "#ffffff" : "transparent",
              color: active ? "#0f172a" : "#64748b",
              fontSize: 11,
              fontWeight: active ? 600 : 500,
              boxShadow: active ? "0 1px 2px rgba(15, 23, 42, 0.08)" : "none",
              cursor: "pointer",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap"
            }}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
