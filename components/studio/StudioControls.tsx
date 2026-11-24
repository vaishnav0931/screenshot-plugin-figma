"use client";

import * as React from "react";

export function ResetIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M3.2 6.5A5.2 5.2 0 1 1 4.1 11.4M3.2 3.2v3.3h3.3"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      style={{
        transform: open ? "rotate(0deg)" : "rotate(180deg)",
        transition: "transform 160ms ease"
      }}
    >
      <path
        d="M4.5 9.5L8 6l3.5 3.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function HintBadge({ title }: { title?: string }) {
  if (!title) return null;
  return (
    <span
      title={title}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: 13,
        height: 13,
        borderRadius: "9999px",
        backgroundColor: "#2d2d36",
        color: "#9898a3",
        fontSize: "9px",
        fontWeight: 600,
        lineHeight: 1,
        cursor: "help",
        flexShrink: 0
      }}
    >
      ?
    </span>
  );
}

export function StudioPanel({
  title,
  onResetAll,
  children,
  width = 320
}: {
  title: string;
  onResetAll: () => void;
  children: React.ReactNode;
  width?: number;
}) {
  return (
    <aside
      className="studio-inspector"
      aria-label={`${title} controls`}
      style={{ width }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 14px",
          borderBottomWidth: 1,
          borderBottomStyle: "solid",
          borderBottomColor: "#24242b"
        }}
      >
        <span
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: "#f4f4f5",
            letterSpacing: "-0.01em"
          }}
        >
          {title}
        </span>

        <button
          type="button"
          title="Reset all controls"
          aria-label="Reset all controls"
          onClick={onResetAll}
          style={{
            width: 24,
            height: 24,
            borderRadius: 5,
            borderWidth: 0,
            backgroundColor: "transparent",
            color: "#9a9aa6",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer"
          }}
        >
          <ResetIcon />
        </button>
      </div>

      {children}
    </aside>
  );
}

export function StudioSection({
  title,
  onReset,
  children,
  defaultOpen = true
}: {
  title: string;
  onReset?: () => void;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = React.useState(defaultOpen);

  return (
    <div
      style={{
        borderBottomWidth: 1,
        borderBottomStyle: "solid",
        borderBottomColor: "#24242b"
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 14px"
        }}
      >
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            backgroundColor: "transparent",
            borderWidth: 0,
            padding: 0,
            color: "#d4d4dc",
            fontSize: 12,
            fontWeight: 600,
            cursor: "pointer"
          }}
        >
          <span>{title}</span>
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          {onReset && (
            <button
              type="button"
              onClick={onReset}
              title={`Reset ${title.toLowerCase()}`}
              aria-label={`Reset ${title.toLowerCase()}`}
              style={{
                width: 22,
                height: 22,
                borderRadius: 5,
                borderWidth: 0,
                backgroundColor: "transparent",
                color: "#8f8f97",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer"
              }}
            >
              <ResetIcon />
            </button>
          )}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? `Collapse ${title}` : `Expand ${title}`}
            style={{
              width: 22,
              height: 22,
              borderRadius: 5,
              borderWidth: 0,
              backgroundColor: "#24242a",
              color: "#d4d4dc",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer"
            }}
          >
            <ChevronIcon open={open} />
          </button>
        </div>
      </div>

      {open && (
        <div
          style={{
            padding: "0 14px 14px",
            display: "flex",
            flexDirection: "column",
            gap: 12
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}

export function StudioSlider({
  label,
  hint,
  value,
  min,
  max,
  step = 1,
  unit = "",
  formatValue,
  onChange
}: {
  label: string;
  hint?: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  formatValue?: (n: number) => string;
  onChange: (next: number) => void;
}) {
  const clamped = Math.min(max, Math.max(min, value));
  const pct = max > min ? ((clamped - min) / (max - min)) * 100 : 0;
  const display = formatValue ? formatValue(value) : String(Number(value.toFixed(4)));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 8
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <span style={{ fontSize: 12, color: "#c2c2c8", fontWeight: 500 }}>
            {label}
          </span>
          <HintBadge title={hint} />
        </div>
        <span
          style={{
            fontSize: 11.5,
            color: "#9a9aa6",
            fontFamily: "var(--font-mono)",
            fontVariantNumeric: "tabular-nums"
          }}
        >
          {display}
          {unit}
        </span>
      </div>

      <div
        style={{
          position: "relative",
          height: 18,
          display: "flex",
          alignItems: "center"
        }}
      >
        <div
          style={{
            position: "relative",
            width: "100%",
            height: 2,
            borderRadius: 9999,
            backgroundColor: "#32323c"
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: `${pct}%`,
              borderRadius: 9999,
              backgroundColor: "#3b82f6"
            }}
          />
          <div
            style={{
              position: "absolute",
              left: `${pct}%`,
              top: "50%",
              width: 10,
              height: 13,
              borderRadius: 3,
              backgroundColor: "#f4f4f5",
              transform: "translate(-50%, -50%)",
              boxShadow: "0 1px 4px rgba(0, 0, 0, 0.5)",
              pointerEvents: "none"
            }}
          />
        </div>

        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          aria-label={label}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            opacity: 0,
            cursor: "ew-resize",
            margin: 0
          }}
        />
      </div>
    </div>
  );
}

export function StudioSelect<T extends string>({
  label,
  hint,
  value,
  options,
  onChange
}: {
  label: string;
  hint?: string;
  value: T;
  options: ReadonlyArray<{ value: T; label: string }>;
  onChange: (next: T) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const rootRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const active = options.find((o) => o.value === value) ?? options[0];

  return (
    <div
      ref={rootRef}
      style={{ position: "relative", display: "flex", flexDirection: "column", gap: 6 }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
        <span style={{ fontSize: 12, color: "#c2c2c8", fontWeight: 500 }}>
          {label}
        </span>
        <HintBadge title={hint} />
      </div>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        style={{
          height: 30,
          paddingLeft: 10,
          paddingRight: 9,
          borderRadius: 6,
          backgroundColor: "#24242a",
          borderWidth: 1,
          borderStyle: "solid",
          borderColor: open ? "#3b82f6" : "#32323c",
          color: "#ececf0",
          fontSize: 12.5,
          fontWeight: 500,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: "pointer"
        }}
      >
        <span>{active.label}</span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
          style={{
            color: "#9a9aa6",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 150ms ease"
          }}
        >
          <path
            d="M4.5 6.5L8 10l3.5-3.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open && (
        <div
          role="listbox"
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            left: 0,
            right: 0,
            zIndex: 50,
            backgroundColor: "#16161a",
            borderWidth: 1,
            borderStyle: "solid",
            borderColor: "#32323c",
            borderRadius: 8,
            padding: 4,
            boxShadow: "0 14px 32px rgba(0, 0, 0, 0.65)",
            display: "flex",
            flexDirection: "column",
            gap: 2
          }}
        >
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <button
                key={opt.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "6px 8px",
                  borderRadius: 5,
                  borderWidth: 0,
                  backgroundColor: isSelected ? "#24242a" : "transparent",
                  color: isSelected ? "#ffffff" : "#c6c6cc",
                  fontSize: 12.5,
                  fontWeight: isSelected ? 500 : 400,
                  textAlign: "left",
                  cursor: "pointer"
                }}
              >
                <span>{opt.label}</span>
                {isSelected && (
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 16 16"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M3.5 8.5L6.5 11.5L12.5 5"
                      stroke="#3b82f6"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function StudioColorRow({
  label,
  hint,
  value,
  onChange,
  onClear
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (hex: string) => void;
  onClear?: () => void;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 8
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
        <span style={{ fontSize: 12, color: "#c2c2c8", fontWeight: 500 }}>
          {label}
        </span>
        <HintBadge title={hint} />
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        {onClear && (
          <button
            type="button"
            onClick={onClear}
            title="Reset color"
            aria-label={`Reset ${label.toLowerCase()}`}
            style={{
              width: 22,
              height: 22,
              borderRadius: 5,
              borderWidth: 0,
              backgroundColor: "transparent",
              color: "#8f8f97",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer"
            }}
          >
            <ResetIcon />
          </button>
        )}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            backgroundColor: "#24242a",
            borderWidth: 1,
            borderStyle: "solid",
            borderColor: "#32323c",
            borderRadius: 6,
            padding: "3px 7px 3px 4px"
          }}
        >
          <input
            type="color"
            value={/^#[0-9a-fA-F]{6}$/.test(value) ? value : "#3b82f6"}
            onChange={(e) => onChange(e.target.value)}
            aria-label={`${label} picker`}
            style={{
              width: 18,
              height: 18,
              padding: 0,
              borderWidth: 0,
              borderRadius: 4,
              backgroundColor: "transparent",
              cursor: "pointer"
            }}
          />
          <input
            type="text"
            value={value}
            maxLength={7}
            onChange={(e) => onChange(e.target.value)}
            aria-label={`${label} hex`}
            style={{
              width: 58,
              backgroundColor: "transparent",
              borderWidth: 0,
              color: "#e6e6eb",
              fontSize: 11.5,
              fontFamily: "var(--font-mono)",
              outline: "none"
            }}
          />
        </div>
      </div>
    </div>
  );
}

export function StudioToggle({
  label,
  hint,
  checked,
  onChange
}: {
  label: string;
  hint?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 8
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
        <span style={{ fontSize: 12, color: "#c2c2c8", fontWeight: 500 }}>
          {label}
        </span>
        <HintBadge title={hint} />
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        style={{
          position: "relative",
          width: 34,
          height: 20,
          borderRadius: 9999,
          borderWidth: 1,
          borderStyle: "solid",
          borderColor: checked ? "#3b82f6" : "#32323c",
          backgroundColor: checked ? "#3b82f6" : "#24242a",
          cursor: "pointer",
          padding: 0,
          transition: "background-color 140ms ease, border-color 140ms ease"
        }}
      >
        <span
          style={{
            position: "absolute",
            top: 2,
            left: checked ? 16 : 2,
            width: 14,
            height: 14,
            borderRadius: "9999px",
            backgroundColor: "#ffffff",
            transition: "left 140ms ease"
          }}
        />
      </button>
    </div>
  );
}

export function StudioTextarea({
  label,
  hint,
  value,
  rows = 2,
  onChange
}: {
  label: string;
  hint?: string;
  value: string;
  rows?: number;
  onChange: (next: string) => void;
}) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
        <span style={{ fontSize: 12, color: "#c2c2c8", fontWeight: 500 }}>
          {label}
        </span>
        <HintBadge title={hint} />
      </div>
      <textarea
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: "100%",
          minHeight: 58,
          resize: "vertical",
          backgroundColor: "#24242a",
          borderWidth: 1,
          borderStyle: "solid",
          borderColor: "#32323c",
          borderRadius: 6,
          padding: "7px 9px",
          color: "#f4f4f5",
          fontSize: 12.5,
          lineHeight: 1.45,
          outline: "none"
        }}
      />
    </label>
  );
}

export function StudioFileRow({
  label,
  hint,
  accept = "image/*",
  fileName,
  onFileSelect,
  onClear,
  inputRef
}: {
  label: string;
  hint?: string;
  accept?: string;
  fileName?: string | null;
  onFileSelect: (file: File) => void;
  onClear?: () => void;
  inputRef?: React.RefObject<HTMLInputElement | null>;
}) {
  const localRef = React.useRef<HTMLInputElement | null>(null);
  const resolvedRef = inputRef ?? localRef;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
        <span style={{ fontSize: 12, color: "#c2c2c8", fontWeight: 500 }}>
          {label}
        </span>
        <HintBadge title={hint} />
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <input
          ref={resolvedRef}
          type="file"
          accept={accept}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onFileSelect(file);
          }}
          style={{ display: "none" }}
        />
        <button
          type="button"
          onClick={() => resolvedRef.current?.click()}
          style={{
            flex: 1,
            height: 30,
            padding: "0 10px",
            borderRadius: 6,
            backgroundColor: "#24242a",
            borderWidth: 1,
            borderStyle: "solid",
            borderColor: "#32323c",
            color: fileName ? "#f4f4f5" : "#c6c6cc",
            fontSize: 12,
            textAlign: "left",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            cursor: "pointer"
          }}
        >
          {fileName ? fileName : "Choose image file"}
        </button>

        {fileName && onClear && (
          <button
            type="button"
            onClick={onClear}
            title="Clear uploaded image"
            style={{
              height: 30,
              padding: "0 9px",
              borderRadius: 6,
              backgroundColor: "#1b1b21",
              borderWidth: 1,
              borderStyle: "solid",
              borderColor: "#32323c",
              color: "#a1a1aa",
              fontSize: 11.5,
              cursor: "pointer"
            }}
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
}
