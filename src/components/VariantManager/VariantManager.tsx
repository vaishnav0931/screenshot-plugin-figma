"use client";

import React, { useState } from "react";
import {
  Plus,
  Copy,
  Trash2,
  Edit3,
  Check,
  X,
  RotateCcw,
  Eye,
  EyeOff,
  RefreshCw,
  ArrowUpRight,
} from "lucide-react";
import { useButtonStore } from "@/src/store/useButtonStore";
import { ButtonRenderer } from "@/src/components/ButtonRenderer/ButtonRenderer";
import {
  ButtonAppearance,
  ButtonInteractionState,
  ButtonSizePreset,
} from "@/src/types/button";

export function VariantManager() {
  const {
    variants,
    addVariantFromCurrent,
    duplicateVariant,
    renameVariant,
    deleteVariant,
    toggleVariantComparison,
    updateVariantMeta,
    loadVariantIntoEditor,
    syncCurrentToVariant,
    resetVariantsToDefaults,
    setViewMode,
  } = useButtonStore();

  const [newVariantName, setNewVariantName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    addVariantFromCurrent(newVariantName.trim() || undefined);
    setNewVariantName("");
  };

  return (
    <div style={{ padding: 12, display: "flex", flexDirection: "column", gap: 12 }}>
      {/* Header & Actions */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 6,
        }}
      >
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: "var(--bs-text)" }}>
            Variant Manager ({variants.length})
          </div>
          <div style={{ fontSize: 10.5, color: "var(--bs-text-subtle)" }}>
            Create, compare, and sync button variants
          </div>
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          <button
            type="button"
            className="bs-btn"
            style={{ height: 24, fontSize: 11, padding: "0 8px" }}
            onClick={() => setViewMode("all-variants")}
            title="Show all variants on canvas"
          >
            Compare
          </button>
          <button
            type="button"
            className="bs-btn"
            style={{ height: 24, fontSize: 11, padding: "0 7px" }}
            onClick={() => resetVariantsToDefaults()}
            title="Reset variants to default set"
          >
            <RotateCcw size={11} />
          </button>
        </div>
      </div>

      {/* Add Variant Form */}
      <form
        onSubmit={handleAdd}
        style={{ display: "flex", alignItems: "center", gap: 6 }}
      >
        <input
          type="text"
          className="bs-input"
          placeholder="New variant name (from current)..."
          value={newVariantName}
          onChange={(e) => setNewVariantName(e.target.value)}
        />
        <button
          type="submit"
          className="bs-btn bs-btn-primary"
          style={{ flexShrink: 0 }}
        >
          <Plus size={12} />
          Add
        </button>
      </form>

      {/* Variants List */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {variants.map((v) => {
          const isEditing = editingId === v.id;

          return (
            <div
              key={v.id}
              style={{
                padding: 10,
                borderRadius: 8,
                border: "1px solid var(--bs-border)",
                background: "#FFFFFF",
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              {/* Title Row */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 6,
                }}
              >
                {isEditing ? (
                  <div style={{ display: "flex", alignItems: "center", gap: 4, flex: 1 }}>
                    <input
                      type="text"
                      className="bs-input"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      style={{ height: 24, fontSize: 11.5 }}
                      autoFocus
                    />
                    <button
                      type="button"
                      className="bs-btn bs-btn-icon"
                      style={{ width: 24, height: 24 }}
                      onClick={() => {
                        if (editingName.trim()) {
                          renameVariant(v.id, editingName.trim());
                        }
                        setEditingId(null);
                      }}
                    >
                      <Check size={12} />
                    </button>
                    <button
                      type="button"
                      className="bs-btn bs-btn-icon"
                      style={{ width: 24, height: 24 }}
                      onClick={() => setEditingId(null)}
                    >
                      <X size={12} />
                    </button>
                  </div>
                ) : (
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: "var(--bs-text)",
                    }}
                  >
                    {v.name}
                  </span>
                )}

                <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <button
                    type="button"
                    className="bs-btn bs-btn-ghost bs-btn-icon"
                    style={{ width: 22, height: 22 }}
                    onClick={() => toggleVariantComparison(v.id)}
                    title={
                      v.showInComparison
                        ? "Included in comparison view"
                        : "Excluded from comparison view"
                    }
                  >
                    {v.showInComparison ? (
                      <Eye size={11} style={{ color: "var(--bs-accent)" }} />
                    ) : (
                      <EyeOff size={11} />
                    )}
                  </button>
                  <button
                    type="button"
                    className="bs-btn bs-btn-ghost bs-btn-icon"
                    style={{ width: 22, height: 22 }}
                    onClick={() => {
                      setEditingId(v.id);
                      setEditingName(v.name);
                    }}
                    title="Rename variant"
                  >
                    <Edit3 size={11} />
                  </button>
                  <button
                    type="button"
                    className="bs-btn bs-btn-ghost bs-btn-icon"
                    style={{ width: 22, height: 22 }}
                    onClick={() => duplicateVariant(v.id)}
                    title="Duplicate variant"
                  >
                    <Copy size={11} />
                  </button>
                  <button
                    type="button"
                    className="bs-btn bs-btn-ghost bs-btn-icon"
                    style={{ width: 22, height: 22, color: "var(--bs-danger)" }}
                    onClick={() => deleteVariant(v.id)}
                    title="Delete variant"
                  >
                    <Trash2 size={11} />
                  </button>
                </div>
              </div>

              {/* Mini Preview Box */}
              <div
                style={{
                  padding: "10px 8px",
                  borderRadius: 6,
                  background: "var(--bs-surface-muted)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                }}
              >
                <ButtonRenderer
                  button={v.definition}
                  forcedState={v.previewState}
                  interactive={false}
                />
              </div>

              {/* Variant Dimensions Controls */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: 4,
                }}
              >
                <select
                  className="bs-select"
                  style={{ height: 24, fontSize: 10.5, padding: "0 4px" }}
                  value={v.appearance}
                  onChange={(e) =>
                    updateVariantMeta(v.id, {
                      appearance: e.target.value as ButtonAppearance,
                    })
                  }
                  aria-label="Variant appearance"
                >
                  <option value="primary">Primary</option>
                  <option value="secondary">Secondary</option>
                  <option value="tertiary">Tertiary</option>
                  <option value="outline">Outline</option>
                  <option value="ghost">Ghost</option>
                  <option value="destructive">Destructive</option>
                  <option value="link">Link</option>
                </select>

                <select
                  className="bs-select"
                  style={{ height: 24, fontSize: 10.5, padding: "0 4px" }}
                  value={v.size}
                  onChange={(e) =>
                    updateVariantMeta(v.id, {
                      size: e.target.value as ButtonSizePreset,
                    })
                  }
                  aria-label="Variant size"
                >
                  <option value="xs">XS</option>
                  <option value="sm">SM</option>
                  <option value="md">MD</option>
                  <option value="lg">LG</option>
                  <option value="xl">XL</option>
                </select>

                <select
                  className="bs-select"
                  style={{ height: 24, fontSize: 10.5, padding: "0 4px" }}
                  value={v.previewState}
                  onChange={(e) =>
                    updateVariantMeta(v.id, {
                      previewState: e.target.value as ButtonInteractionState,
                    })
                  }
                  aria-label="Variant state"
                >
                  <option value="default">Default</option>
                  <option value="hover">Hover</option>
                  <option value="focus">Focus</option>
                  <option value="pressed">Pressed</option>
                  <option value="disabled">Disabled</option>
                  <option value="loading">Loading</option>
                </select>
              </div>

              {/* Load / Overwrite Actions */}
              <div style={{ display: "flex", gap: 6 }}>
                <button
                  type="button"
                  className="bs-btn"
                  style={{ flex: 1, height: 24, fontSize: 11 }}
                  onClick={() => loadVariantIntoEditor(v.id)}
                >
                  <ArrowUpRight size={11} />
                  Load into Editor
                </button>
                <button
                  type="button"
                  className="bs-btn"
                  style={{ height: 24, fontSize: 11 }}
                  onClick={() => syncCurrentToVariant(v.id)}
                  title="Overwrite this variant with current editor state"
                >
                  <RefreshCw size={11} />
                  Sync
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
