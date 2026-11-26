"use client";

import * as React from "react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Bell,
  Bookmark,
  Check,
  ChevronDown,
  ChevronRight,
  Copy,
  Download,
  Edit3,
  ExternalLink,
  Eye,
  FileText,
  Folder,
  Globe,
  Heart,
  Home,
  Image,
  Info,
  Layers,
  LayoutGrid,
  Link,
  Loader2,
  Lock,
  LogIn,
  LogOut,
  Mail,
  Menu,
  MessageSquare,
  MoreHorizontal,
  Package,
  Paperclip,
  Pause,
  Phone,
  Play,
  Plus,
  Printer,
  RefreshCw,
  Rocket,
  Save,
  Search,
  Send,
  Settings,
  Share2,
  Shield,
  ShoppingBag,
  SlidersHorizontal,
  Sparkles,
  Star,
  Terminal,
  ThumbsUp,
  Trash2,
  Unlock,
  Upload,
  User,
  Users,
  Wand2,
  X,
  Zap,
  type LucideIcon
} from "lucide-react";

export const LUCIDE_ICON_MAP: Record<string, LucideIcon> = {
  Sparkles,
  Plus,
  ArrowRight,
  ArrowLeft,
  ArrowUpRight,
  Check,
  ChevronRight,
  ChevronDown,
  Download,
  Upload,
  Trash2,
  Settings,
  Search,
  Send,
  Share2,
  Copy,
  Edit3,
  Eye,
  Heart,
  Star,
  Bookmark,
  Bell,
  Lock,
  Unlock,
  Mail,
  MessageSquare,
  Phone,
  Play,
  Pause,
  RefreshCw,
  Rocket,
  Save,
  Shield,
  SlidersHorizontal,
  Terminal,
  User,
  Users,
  Zap,
  ExternalLink,
  FileText,
  Folder,
  Globe,
  Home,
  Image,
  Info,
  Layers,
  LayoutGrid,
  Link,
  Loader2,
  LogIn,
  LogOut,
  Menu,
  MoreHorizontal,
  Package,
  Paperclip,
  Printer,
  ShoppingBag,
  ThumbsUp,
  Wand2,
  X
};

export const LUCIDE_ICON_NAMES = Object.keys(LUCIDE_ICON_MAP);

export function LucideIconByName({
  name,
  size = 16,
  color = "currentColor",
  className
}: {
  name: string;
  size?: number;
  color?: string;
  className?: string;
}) {
  const IconComponent = LUCIDE_ICON_MAP[name] ?? Sparkles;
  return (
    <IconComponent
      size={size}
      color={color}
      className={className}
      aria-hidden="true"
      style={{ flexShrink: 0 }}
    />
  );
}

export function IconPicker({
  value,
  onChange,
  label
}: {
  value: string;
  onChange: (iconName: string) => void;
  label?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const containerRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open]);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return LUCIDE_ICON_NAMES;
    return LUCIDE_ICON_NAMES.filter((n) => n.toLowerCase().includes(q));
  }, [query]);

  return (
    <div ref={containerRef} style={{ position: "relative" }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={label || "Select icon"}
        className="bs-btn"
        style={{
          width: "100%",
          justifyContent: "space-between",
          height: 28,
          backgroundColor: "#f8fafc"
        }}
      >
        <span style={{ display: "inline-flex", alignItems: "center", gap: 7 }}>
          <LucideIconByName name={value} size={14} />
          <span style={{ fontSize: 12 }}>{value}</span>
        </span>
        <ChevronDown size={13} color="#64748b" />
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            left: 0,
            right: 0,
            zIndex: 60,
            backgroundColor: "#ffffff",
            borderWidth: 1,
            borderStyle: "solid",
            borderColor: "#cbd5e1",
            borderRadius: 8,
            padding: 8,
            boxShadow: "0 12px 28px rgba(15, 23, 42, 0.16)",
            display: "flex",
            flexDirection: "column",
            gap: 8
          }}
        >
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Lucide icons..."
            className="bs-input"
            autoFocus
            style={{ height: 26 }}
          />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(6, minmax(0, 1fr))",
              gap: 4,
              maxHeight: 176,
              overflowY: "auto",
              padding: 2
            }}
          >
            {filtered.map((iconName) => {
              const selected = iconName === value;
              return (
                <button
                  key={iconName}
                  type="button"
                  title={iconName}
                  onClick={() => {
                    onChange(iconName);
                    setOpen(false);
                  }}
                  style={{
                    height: 32,
                    borderRadius: 5,
                    borderWidth: 1,
                    borderStyle: "solid",
                    borderColor: selected ? "#2563eb" : "transparent",
                    backgroundColor: selected ? "#eff6ff" : "transparent",
                    color: selected ? "#2563eb" : "#334155",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer"
                  }}
                >
                  <LucideIconByName name={iconName} size={15} />
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
