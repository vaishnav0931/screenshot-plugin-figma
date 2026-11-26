"use client";

import React, { useState } from "react";
import {
  Search,
  Plus,
  Bookmark,
  Clock,
  Layers,
  MousePointerClick,
  Trash2,
  Copy,
  Edit3,
  Check,
  X,
  RotateCcw,
} from "lucide-react";
import { useButtonStore } from "@/src/store/useButtonStore";
import {
  LIBRARY_APPEARANCE_ITEMS,
  LIBRARY_BUTTON_TYPE_ITEMS,
} from "@/src/features/button-library/libraryCatalog";
import { APPEARANCE_PRESETS } from "@/src/utils/presets";

export function ButtonLibrary() {
  const {
    activeButton,
    savedButtons,
    recentButtons,
    createNewButton,
    selectAppearancePreset,
    selectButtonType,
    saveCurrentButton,
    loadSavedButton,
    renameSavedButton,
    duplicateSavedButton,
    deleteSavedButton,
    resetActiveButton,
  } = useButtonStore();

  const [librarySearch, setLibrarySearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");

  const query = librarySearch.trim().toLowerCase();

  const filteredAppearances = LIBRARY_APPEARANCE_ITEMS.filter(
    (item) =>
      !query ||
      item.name.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query)
  );

  const filteredTypes = LIBRARY_BUTTON_TYPE_ITEMS.filter(
    (item) =>
      !query ||
      item.name.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query)
  );

  const filteredSaved = savedButtons.filter(
    (b) =>
      !query ||
      b.name.toLowerCase().includes(query) ||
      b.content.label.toLowerCase().includes(query) ||
      b.appearance.variant.toLowerCase().includes(query)
  );

  const filteredRecent = recentButtons.filter(
    (b) =>
      !query ||
      b.name.toLowerCase().includes(query) ||
      b.content.label.toLowerCase().includes(query)
  );

  const startRename = (id: string, currentName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(id);
    setEditingName(currentName);
  };

  const commitRename = (id: string, e: React.MouseEvent | React.FormEvent) => {
    e.stopPropagation();
    if (editingName.trim()) {
      renameSavedButton(id, editingName.trim());
    }
    setEditingId(null);
  };

  return (
    <aside className="bs-sidebar-left">
      {/* Studio Brand Header */}
      <div
        style={{
          padding: "12px 14px",
          borderBottom: "1px solid var(--bs-border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 8,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <div
            style={{
              width: 26,
              height: 26,
              borderRadius: 6,
              background: "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#FFFFFF",
              boxShadow: "0 1px 3px rgba(37,99,235,0.28)",
              flexShrink: 0,
            }}
          >
            <MousePointerClick size={14} />
          </div>
          <div>
            <div
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: "var(--bs-text)",
                letterSpacing: "-0.01em",
                lineHeight: 1.15,
              }}
            >
              Button Studio
            </div>
            <div style={{ fontSize: 10, color: "var(--bs-text-subtle)" }}>
              Component Playground
            </div>
          </div>
        </div>

        <button
          type="button"
          className="bs-btn bs-btn-primary"
          onClick={() => createNewButton()}
          title="Create new default button"
          style={{ padding: "0 9px", height: 26, fontSize: 11 }}
        >
          <Plus size={12} />
          New
        </button>
      </div>

      {/* Search & Quick Actions */}
      <div
        style={{
          padding: "10px 12px",
          borderBottom: "1px solid var(--bs-border)",
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
          <Search
            size={13}
            style={{
              position: "absolute",
              left: 9,
              color: "var(--bs-text-subtle)",
              pointerEvents: "none",
            }}
          />
          <input
            type="text"
            className="bs-input"
            placeholder="Search library & saved..."
            value={librarySearch}
            onChange={(e) => setLibrarySearch(e.target.value)}
            style={{ paddingLeft: 28, paddingRight: librarySearch ? 26 : 8 }}
          />
          {librarySearch && (
            <button
              type="button"
              onClick={() => setLibrarySearch("")}
              style={{
                position: "absolute",
                right: 6,
                background: "transparent",
                border: "none",
                color: "var(--bs-text-subtle)",
                cursor: "pointer",
                padding: 2,
                display: "flex",
              }}
              aria-label="Clear search"
            >
              <X size={12} />
            </button>
          )}
        </div>

        <div style={{ display: "flex", gap: 6 }}>
          <button
            type="button"
            className="bs-btn"
            style={{ flex: 1, fontSize: 11, height: 26 }}
            onClick={() => saveCurrentButton()}
          >
            <Bookmark size={12} />
            Save Current
          </button>
          <button
            type="button"
            className="bs-btn"
            style={{ fontSize: 11, height: 26 }}
            onClick={() => resetActiveButton()}
            title="Reset active button to default"
          >
            <RotateCcw size={12} />
          </button>
        </div>
      </div>

      {/* Library Scroll Content */}
      <div className="bs-scroll" style={{ flex: 1, padding: "10px 10px 18px" }}>
        {/* Appearance Categories */}
        <div style={{ marginBottom: 16 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 4px 6px",
            }}
          >
            <span className="bs-section-title">Appearance</span>
            <span className="bs-badge">{filteredAppearances.length}</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {filteredAppearances.map((item) => {
              const isSelected = activeButton.appearance.variant === item.appearance;
              const presetCfg = APPEARANCE_PRESETS[item.appearance].config;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => selectAppearancePreset(item.appearance)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 8,
                    width: "100%",
                    padding: "6px 8px",
                    borderRadius: 6,
                    border: isSelected
                      ? "1px solid #BFDBFE"
                      : "1px solid transparent",
                    background: isSelected ? "var(--bs-accent-soft)" : "transparent",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "background 120ms ease",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                    <span
                      style={{
                        width: 14,
                        height: 14,
                        borderRadius: 4,
                        background:
                          presetCfg.backgroundColor === "transparent"
                            ? "#FFFFFF"
                            : presetCfg.backgroundColor,
                        border: `1.5px solid ${
                          presetCfg.borderColor === "transparent"
                            ? "#CBD5E1"
                            : presetCfg.borderColor
                        }`,
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <span
                        style={{
                          width: 5,
                          height: 5,
                          borderRadius: 99,
                          background: presetCfg.textColor,
                        }}
                      />
                    </span>
                    <div style={{ minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: 12,
                          fontWeight: isSelected ? 600 : 500,
                          color: isSelected ? "var(--bs-accent)" : "var(--bs-text)",
                          lineHeight: 1.2,
                        }}
                      >
                        {item.name}
                      </div>
                      <div
                        style={{
                          fontSize: 10,
                          color: "var(--bs-text-subtle)",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {item.description}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Button Types */}
        <div style={{ marginBottom: 16 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 4px 6px",
            }}
          >
            <span className="bs-section-title">Button Types</span>
            <span className="bs-badge">{filteredTypes.length}</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {filteredTypes.map((item) => {
              const isSelected = activeButton.content.buttonType === item.buttonType;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => selectButtonType(item.buttonType)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 8,
                    width: "100%",
                    padding: "6px 8px",
                    borderRadius: 6,
                    border: isSelected
                      ? "1px solid #BFDBFE"
                      : "1px solid transparent",
                    background: isSelected ? "var(--bs-accent-soft)" : "transparent",
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  <div style={{ minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: isSelected ? 600 : 500,
                        color: isSelected ? "var(--bs-accent)" : "var(--bs-text)",
                      }}
                    >
                      {item.name}
                    </div>
                    <div
                      style={{
                        fontSize: 10,
                        color: "var(--bs-text-subtle)",
                      }}
                    >
                      {item.description}
                    </div>
                  </div>
                  <Layers
                    size={12}
                    style={{
                      color: isSelected ? "var(--bs-accent)" : "var(--bs-text-subtle)",
                      flexShrink: 0,
                    }}
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* Saved Buttons */}
        <div style={{ marginBottom: 16 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 4px 6px",
            }}
          >
            <span
              className="bs-section-title"
              style={{ display: "inline-flex", alignItems: "center", gap: 4 }}
            >
              <Bookmark size={11} />
              Saved Buttons
            </span>
            <span className="bs-badge">{filteredSaved.length}</span>
          </div>

          {filteredSaved.length === 0 ? (
            <div
              style={{
                padding: "10px 8px",
                fontSize: 11,
                color: "var(--bs-text-subtle)",
                background: "var(--bs-surface-muted)",
                borderRadius: 6,
                textAlign: "center",
              }}
            >
              No saved buttons match.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {filteredSaved.map((btn) => {
                const isActive = activeButton.id === btn.id;
                const isEditing = editingId === btn.id;

                return (
                  <div
                    key={btn.id}
                    onClick={() => !isEditing && loadSavedButton(btn.id)}
                    style={{
                      padding: "7px 8px",
                      borderRadius: 6,
                      border: isActive
                        ? "1px solid var(--bs-accent)"
                        : "1px solid var(--bs-border)",
                      background: isActive ? "var(--bs-accent-soft)" : "#FFFFFF",
                      cursor: "pointer",
                      display: "flex",
                      flexDirection: "column",
                      gap: 5,
                    }}
                  >
                    {isEditing ? (
                      <form
                        onSubmit={(e) => commitRename(btn.id, e)}
                        style={{ display: "flex", alignItems: "center", gap: 4 }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="text"
                          className="bs-input"
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          autoFocus
                          style={{ height: 24, fontSize: 11 }}
                        />
                        <button
                          type="submit"
                          className="bs-btn bs-btn-icon"
                          style={{ width: 24, height: 24 }}
                          title="Save name"
                        >
                          <Check size={12} />
                        </button>
                        <button
                          type="button"
                          className="bs-btn bs-btn-icon"
                          style={{ width: 24, height: 24 }}
                          onClick={() => setEditingId(null)}
                          title="Cancel"
                        >
                          <X size={12} />
                        </button>
                      </form>
                    ) : (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: 6,
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                            minWidth: 0,
                          }}
                        >
                          <span
                            style={{
                              width: 10,
                              height: 10,
                              borderRadius: 3,
                              background:
                                btn.appearance.backgroundColor === "transparent"
                                  ? "#E2E8F0"
                                  : btn.appearance.backgroundColor,
                              border: "1px solid rgba(15,23,42,0.15)",
                              flexShrink: 0,
                            }}
                          />
                          <span
                            style={{
                              fontSize: 12,
                              fontWeight: 600,
                              color: "var(--bs-text)",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {btn.name}
                          </span>
                        </div>

                        <div
                          style={{ display: "flex", alignItems: "center", gap: 2 }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            type="button"
                            className="bs-btn bs-btn-ghost bs-btn-icon"
                            style={{ width: 22, height: 22 }}
                            title="Rename"
                            onClick={(e) => startRename(btn.id, btn.name, e)}
                          >
                            <Edit3 size={11} />
                          </button>
                          <button
                            type="button"
                            className="bs-btn bs-btn-ghost bs-btn-icon"
                            style={{ width: 22, height: 22 }}
                            title="Duplicate"
                            onClick={() => duplicateSavedButton(btn.id)}
                          >
                            <Copy size={11} />
                          </button>
                          <button
                            type="button"
                            className="bs-btn bs-btn-ghost bs-btn-icon"
                            style={{
                              width: 22,
                              height: 22,
                              color: "var(--bs-danger)",
                            }}
                            title="Delete"
                            onClick={() => deleteSavedButton(btn.id)}
                          >
                            <Trash2 size={11} />
                          </button>
                        </div>
                      </div>
                    )}

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        fontSize: 10,
                        color: "var(--bs-text-subtle)",
                      }}
                    >
                      <span className="bs-badge" style={{ fontSize: 10 }}>
                        {btn.appearance.variant}
                      </span>
                      <span className="bs-badge" style={{ fontSize: 10 }}>
                        {btn.dimensions.sizePreset}
                      </span>
                      <span
                        style={{
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        “{btn.content.label}”
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent Buttons */}
        {filteredRecent.length > 0 && (
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 4px 6px",
              }}
            >
              <span
                className="bs-section-title"
                style={{ display: "inline-flex", alignItems: "center", gap: 4 }}
              >
                <Clock size={11} />
                Recent
              </span>
              <span className="bs-badge">{filteredRecent.length}</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {filteredRecent.slice(0, 5).map((btn) => (
                <button
                  key={btn.id}
                  type="button"
                  onClick={() => useButtonStore.getState().setActiveButton(btn)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 8,
                    padding: "5px 8px",
                    borderRadius: 6,
                    border: "1px solid transparent",
                    background: "transparent",
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 7,
                      minWidth: 0,
                    }}
                  >
                    <span
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: 99,
                        background:
                          btn.appearance.backgroundColor === "transparent"
                            ? "#94A3B8"
                            : btn.appearance.backgroundColor,
                        flexShrink: 0,
                      }}
                    />
                    <span
                      style={{
                        fontSize: 11.5,
                        color: "var(--bs-text-muted)",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {btn.name}
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: 10,
                      color: "var(--bs-text-subtle)",
                      textTransform: "uppercase",
                    }}
                  >
                    {btn.dimensions.sizePreset}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
