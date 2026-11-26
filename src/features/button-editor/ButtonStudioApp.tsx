"use client";

import React, { useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import "@/src/styles/buttonStudio.css";
import { useButtonStore } from "@/src/store/useButtonStore";
import { ButtonLibrary } from "@/src/components/ButtonLibrary/ButtonLibrary";
import { ButtonToolbar } from "@/src/components/ButtonToolbar/ButtonToolbar";
import { ButtonPreview } from "@/src/components/ButtonPreview/ButtonPreview";
import { ButtonInspector } from "@/src/components/ButtonInspector/ButtonInspector";
import {
  ExportModal,
  ExportModalTab,
} from "@/src/features/button-export/ExportModal";

export function ButtonStudioApp() {
  const { hydrateFromStorage, toastMessage } = useButtonStore();
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [exportModalTab, setExportModalTab] = useState<ExportModalTab>("json");

  useEffect(() => {
    hydrateFromStorage();
  }, [hydrateFromStorage]);

  const handleOpenExport = (tab: ExportModalTab = "json") => {
    setExportModalTab(tab);
    setExportModalOpen(true);
  };

  return (
    <div className="bs-app">
      <div className="bs-workspace">
        {/* LEFT SIDEBAR: BUTTON LIBRARY */}
        <ButtonLibrary />

        {/* CENTER: TOOLBAR + LIVE BUTTON PREVIEW CANVAS */}
        <main className="bs-center">
          <ButtonToolbar onOpenExportModal={handleOpenExport} />
          <ButtonPreview />
        </main>

        {/* RIGHT SIDEBAR: PROPERTY INSPECTOR / VARIANTS / TOKENS */}
        <ButtonInspector />
      </div>

      {/* EXPORT / IMPORT / CSS / SVG / FIGMA MODAL */}
      <ExportModal
        isOpen={exportModalOpen}
        initialTab={exportModalTab}
        onClose={() => setExportModalOpen(false)}
      />

      {/* FLOATING TOAST FEEDBACK */}
      {toastMessage && (
        <div
          style={{
            position: "fixed",
            bottom: 18,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 120,
            background: "#0F172A",
            color: "#F8FAFC",
            padding: "8px 14px",
            borderRadius: 999,
            fontSize: 12,
            fontWeight: 500,
            boxShadow: "var(--bs-shadow-md)",
            display: "inline-flex",
            alignItems: "center",
            gap: 7,
            pointerEvents: "none",
          }}
        >
          <CheckCircle2 size={14} style={{ color: "#22C55E" }} />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
