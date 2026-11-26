"use client";

import React, { useState } from "react";
import {
  X,
  Copy,
  Check,
  Download,
  Upload,
  Layers,
  Code2,
  FileJson,
  FileCode,
  AlertCircle,
} from "lucide-react";
import { useButtonStore } from "@/src/store/useButtonStore";
import {
  buildExportDocument,
  buildFigmaNodePayload,
  generateButtonCss,
  generateButtonSvg,
} from "@/src/utils/exportUtils";

export type ExportModalTab = "json" | "import" | "css" | "svg" | "figma";

interface ExportModalProps {
  isOpen: boolean;
  initialTab?: ExportModalTab;
  onClose: () => void;
}

export function ExportModal({
  isOpen,
  initialTab = "json",
  onClose,
}: ExportModalProps) {
  const {
    activeButton,
    variants,
    tokens,
    importJsonDocument,
    showToast,
  } = useButtonStore();

  const [activeTab, setActiveTab] = useState<ExportModalTab>(initialTab);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [importText, setImportText] = useState("");
  const [importError, setImportError] = useState<string | null>(null);

  React.useEffect(() => {
    if (isOpen && initialTab) {
      setActiveTab(initialTab);
      setImportError(null);
    }
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  const exportDoc = buildExportDocument(activeButton, variants, tokens);
  const jsonOutput = JSON.stringify(exportDoc, null, 2);
  const cssOutput = generateButtonCss(activeButton);
  const svgOutput = generateButtonSvg(activeButton);
  const figmaPayload = buildFigmaNodePayload(activeButton);
  const figmaJsonOutput = JSON.stringify(figmaPayload, null, 2);

  const handleCopy = async (content: string, key: string, label: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedKey(key);
      showToast(`Copied ${label} to clipboard`);
      setTimeout(() => setCopiedKey(null), 1800);
    } catch {
      showToast("Failed to copy to clipboard");
    }
  };

  const handleDownloadFile = (
    content: string,
    filename: string,
    mimeType: string
  ) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    showToast(`Downloaded ${filename}`);
  };

  const handleImportSubmit = () => {
    setImportError(null);
    const result = importJsonDocument(importText);
    if (!result.ok) {
      setImportError(result.error || "Invalid JSON configuration");
    } else {
      setImportText("");
      onClose();
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        background: "rgba(15, 23, 42, 0.45)",
        backdropFilter: "blur(2px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 720,
          maxHeight: "86vh",
          background: "#FFFFFF",
          borderRadius: 12,
          border: "1px solid var(--bs-border)",
          boxShadow: "var(--bs-shadow-lg)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: "14px 18px",
            borderBottom: "1px solid var(--bs-border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: "var(--bs-text)",
              }}
            >
              Export & Figma Integration
            </div>
            <div style={{ fontSize: 11, color: "var(--bs-text-subtle)" }}>
              Schema v1.0.0 • Export JSON, CSS, SVG, or inspect Figma node structure
            </div>
          </div>
          <button
            type="button"
            className="bs-btn bs-btn-ghost bs-btn-icon"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Tabs */}
        <div
          style={{
            padding: "8px 18px",
            background: "var(--bs-surface-muted)",
            borderBottom: "1px solid var(--bs-border)",
            display: "flex",
            gap: 6,
            flexWrap: "wrap",
          }}
        >
          <button
            type="button"
            className={`bs-btn ${activeTab === "json" ? "bs-btn-primary" : ""}`}
            onClick={() => setActiveTab("json")}
          >
            <FileJson size={13} />
            Export JSON
          </button>
          <button
            type="button"
            className={`bs-btn ${activeTab === "import" ? "bs-btn-primary" : ""}`}
            onClick={() => setActiveTab("import")}
          >
            <Upload size={13} />
            Import JSON
          </button>
          <button
            type="button"
            className={`bs-btn ${activeTab === "css" ? "bs-btn-primary" : ""}`}
            onClick={() => setActiveTab("css")}
          >
            <Code2 size={13} />
            Copy CSS
          </button>
          <button
            type="button"
            className={`bs-btn ${activeTab === "svg" ? "bs-btn-primary" : ""}`}
            onClick={() => setActiveTab("svg")}
          >
            <FileCode size={13} />
            Copy SVG
          </button>
          <button
            type="button"
            className={`bs-btn ${activeTab === "figma" ? "bs-btn-primary" : ""}`}
            onClick={() => setActiveTab("figma")}
          >
            <Layers size={13} />
            Send to Figma (Preview)
          </button>
        </div>

        {/* Modal Body */}
        <div
          className="bs-scroll"
          style={{
            padding: 18,
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: 12,
            overflowY: "auto",
          }}
        >
          {/* TAB 1: EXPORT JSON */}
          {activeTab === "json" && (
            <>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span style={{ fontSize: 12, color: "var(--bs-text-muted)" }}>
                  Complete versioned Button Studio document (`schemaVersion: &quot;1.0.0&quot;`)
                </span>
                <div style={{ display: "flex", gap: 6 }}>
                  <button
                    type="button"
                    className="bs-btn"
                    onClick={() =>
                      handleCopy(jsonOutput, "json", "Button Studio JSON")
                    }
                  >
                    {copiedKey === "json" ? (
                      <Check size={13} />
                    ) : (
                      <Copy size={13} />
                    )}
                    Copy JSON
                  </button>
                  <button
                    type="button"
                    className="bs-btn bs-btn-primary"
                    onClick={() =>
                      handleDownloadFile(
                        jsonOutput,
                        `${activeButton.name
                          .toLowerCase()
                          .replace(/\s+/g, "-")}.button.json`,
                        "application/json"
                      )
                    }
                  >
                    <Download size={13} />
                    Download .json
                  </button>
                </div>
              </div>
              <pre
                className="bs-mono"
                style={{
                  margin: 0,
                  padding: 12,
                  borderRadius: 8,
                  background: "#0F172A",
                  color: "#E2E8F0",
                  fontSize: 11.5,
                  lineHeight: 1.5,
                  maxHeight: 360,
                  overflow: "auto",
                }}
              >
                {jsonOutput}
              </pre>
            </>
          )}

          {/* TAB 2: IMPORT JSON */}
          {activeTab === "import" && (
            <>
              <div style={{ fontSize: 12, color: "var(--bs-text-muted)" }}>
                Paste a Button Studio JSON document or single button definition. Input is
                validated with Zod before applying.
              </div>
              <textarea
                className="bs-input bs-mono"
                rows={12}
                placeholder='{"schemaVersion": "1.0.0", "activeButton": { ... }}'
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                style={{
                  height: "auto",
                  padding: 10,
                  fontSize: 11.5,
                  lineHeight: 1.45,
                  resize: "vertical",
                }}
              />
              {importError && (
                <div
                  style={{
                    padding: "8px 10px",
                    borderRadius: 6,
                    background: "#FEF2F2",
                    border: "1px solid #FECACA",
                    color: "#DC2626",
                    fontSize: 11.5,
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <AlertCircle size={14} />
                  <span>{importError}</span>
                </div>
              )}
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                <button
                  type="button"
                  className="bs-btn"
                  onClick={() => setImportText(jsonOutput)}
                >
                  Load Current as Template
                </button>
                <button
                  type="button"
                  className="bs-btn bs-btn-primary"
                  onClick={handleImportSubmit}
                  disabled={!importText.trim()}
                >
                  <Upload size={13} />
                  Validate & Import JSON
                </button>
              </div>
            </>
          )}

          {/* TAB 3: COPY CSS */}
          {activeTab === "css" && (
            <>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span style={{ fontSize: 12, color: "var(--bs-text-muted)" }}>
                  Production-ready CSS class including hover, focus-visible, active, and
                  disabled states.
                </span>
                <button
                  type="button"
                  className="bs-btn bs-btn-primary"
                  onClick={() => handleCopy(cssOutput, "css", "CSS styles")}
                >
                  {copiedKey === "css" ? <Check size={13} /> : <Copy size={13} />}
                  Copy CSS
                </button>
              </div>
              <pre
                className="bs-mono"
                style={{
                  margin: 0,
                  padding: 12,
                  borderRadius: 8,
                  background: "#0F172A",
                  color: "#E2E8F0",
                  fontSize: 11.5,
                  lineHeight: 1.5,
                  maxHeight: 360,
                  overflow: "auto",
                }}
              >
                {cssOutput}
              </pre>
            </>
          )}

          {/* TAB 4: COPY SVG */}
          {activeTab === "svg" && (
            <>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span style={{ fontSize: 12, color: "var(--bs-text-muted)" }}>
                  Standalone vector SVG snapshot of the button.
                </span>
                <div style={{ display: "flex", gap: 6 }}>
                  <button
                    type="button"
                    className="bs-btn"
                    onClick={() => handleCopy(svgOutput, "svg", "SVG markup")}
                  >
                    {copiedKey === "svg" ? <Check size={13} /> : <Copy size={13} />}
                    Copy SVG
                  </button>
                  <button
                    type="button"
                    className="bs-btn bs-btn-primary"
                    onClick={() =>
                      handleDownloadFile(
                        svgOutput,
                        `${activeButton.name
                          .toLowerCase()
                          .replace(/\s+/g, "-")}.svg`,
                        "image/svg+xml"
                      )
                    }
                  >
                    <Download size={13} />
                    Download .svg
                  </button>
                </div>
              </div>

              <div
                style={{
                  padding: 18,
                  borderRadius: 8,
                  background: "var(--bs-surface-muted)",
                  border: "1px solid var(--bs-border)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                dangerouslySetInnerHTML={{ __html: svgOutput }}
              />

              <pre
                className="bs-mono"
                style={{
                  margin: 0,
                  padding: 12,
                  borderRadius: 8,
                  background: "#0F172A",
                  color: "#E2E8F0",
                  fontSize: 11.5,
                  lineHeight: 1.5,
                  maxHeight: 240,
                  overflow: "auto",
                }}
              >
                {svgOutput}
              </pre>
            </>
          )}

          {/* TAB 5: SEND TO FIGMA (FUTURE INTEGRATION) */}
          {activeTab === "figma" && (
            <>
              <div
                style={{
                  padding: "12px 14px",
                  borderRadius: 8,
                  background: "#EFF6FF",
                  border: "1px solid #BFDBFE",
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  gap: 12,
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: 12.5,
                      fontWeight: 700,
                      color: "#1E40AF",
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <Layers size={14} />
                    Send to Figma — Future Plugin Bridge Ready
                  </div>
                  <div
                    style={{
                      fontSize: 11.5,
                      color: "#1E3A8A",
                      marginTop: 4,
                      lineHeight: 1.45,
                    }}
                  >
                    Direct one-click live sync to the Figma Desktop Plugin is marked as a{" "}
                    <strong>future action</strong>. Below is the complete, lossless{" "}
                    <code>COMPONENT</code> Auto-Layout node payload preserved by Button
                    Studio for direct consumption by the Figma Plugin API.
                  </div>
                </div>
                <button
                  type="button"
                  className="bs-btn bs-btn-primary"
                  style={{ flexShrink: 0 }}
                  onClick={() =>
                    handleCopy(
                      figmaJsonOutput,
                      "figma",
                      "Figma Component Node Payload"
                    )
                  }
                >
                  {copiedKey === "figma" ? (
                    <Check size={13} />
                  ) : (
                    <Copy size={13} />
                  )}
                  Copy Figma Payload
                </button>
              </div>

              <pre
                className="bs-mono"
                style={{
                  margin: 0,
                  padding: 12,
                  borderRadius: 8,
                  background: "#0F172A",
                  color: "#E2E8F0",
                  fontSize: 11.5,
                  lineHeight: 1.5,
                  maxHeight: 330,
                  overflow: "auto",
                }}
              >
                {figmaJsonOutput}
              </pre>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
