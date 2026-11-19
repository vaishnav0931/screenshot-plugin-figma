"use client";

import * as React from "react";
import Link from "next/link";
import {
  PixelPromptButton,
  type PixelPromptButtonSize
} from "@/components/ui/pixel-prompt-button";

async function copyText(text: string): Promise<boolean> {
  try {
    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Fallback for HTTP LAN origins
  }
  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}

export default function ShowcaseClient({ sourceCode }: { sourceCode: string }) {
  const [tab, setTab] = React.useState<"preview" | "code">("preview");
  const [size, setSize] = React.useState<PixelPromptButtonSize>("lg");
  const [label, setLabel] = React.useState("Generate & copy prompt");
  const [copiedLabel, setCopiedLabel] = React.useState("Copied prompt!");
  const [prompt, setPrompt] = React.useState(
    "Create a cobalt-blue pill button (#2C5CF5) with an 8px pixel-mosaic tile pattern and outline lightning bolt."
  );
  const [copiedCode, setCopiedCode] = React.useState(false);
  const [copiedUsage, setCopiedUsage] = React.useState(false);
  const [lastCopiedPrompt, setLastCopiedPrompt] = React.useState<string | null>(null);

  const usageSnippet = `import { PixelPromptButton } from "@/components/ui/pixel-prompt-button";

export function Example() {
  return (
    <PixelPromptButton
      size="${size}"
      label={${JSON.stringify(label)}}
      copiedLabel={${JSON.stringify(copiedLabel)}}
      prompt={${JSON.stringify(prompt)}}
    />
  );
}`;

  const handleCopySource = async () => {
    const ok = await copyText(sourceCode);
    if (ok) {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 1800);
    }
  };

  const handleCopyUsage = async () => {
    const ok = await copyText(usageSnippet);
    if (ok) {
      setCopiedUsage(true);
      setTimeout(() => setCopiedUsage(false), 1800);
    }
  };

  return (
    <div style={styles.viewport}>
      <div style={styles.container}>
        {/* Breadcrumb + Top Actions */}
        <header style={styles.header}>
          <div>
            <div style={styles.breadcrumb}>
              <span style={styles.muted}>components</span>
              <span style={styles.muted}>/</span>
              <span style={styles.muted}>ui</span>
              <span style={styles.muted}>/</span>
              <span style={styles.crumbActive}>pixel-prompt-button.tsx</span>
            </div>
            <h1 style={styles.h1}>Pixel Prompt Button</h1>
            <p style={styles.lead}>
              Self-contained, copy-paste React component. Zero external CSS or package dependencies.
            </p>
          </div>

          <div style={styles.headerActions}>
            <Link href="/plugin" style={styles.ghostLink}>
              Plugin page
            </Link>
            <button type="button" onClick={handleCopySource} style={styles.copyPrimaryBtn}>
              {copiedCode ? "Copied component code!" : "Copy component code"}
            </button>
          </div>
        </header>

        {/* shadcn/ui-style Preview / Code Tabs */}
        <div style={styles.tabRow}>
          <div style={styles.tabList} role="tablist" aria-label="Component view">
            <button
              type="button"
              role="tab"
              aria-selected={tab === "preview"}
              onClick={() => setTab("preview")}
              style={{
                ...styles.tabBtn,
                ...(tab === "preview" ? styles.tabBtnActive : {})
              }}
            >
              Preview
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={tab === "code"}
              onClick={() => setTab("code")}
              style={{
                ...styles.tabBtn,
                ...(tab === "code" ? styles.tabBtnActive : {})
              }}
            >
              Code
            </button>
          </div>

          <span style={styles.fileChip}>components/ui/pixel-prompt-button.tsx</span>
        </div>

        {tab === "preview" ? (
          <section style={styles.panel}>
            {/* Interactive Dark Stage matching reference background #171717 */}
            <div style={styles.stage}>
              <PixelPromptButton
                size={size}
                label={label}
                copiedLabel={copiedLabel}
                prompt={prompt}
                onCopyPrompt={(text) => setLastCopiedPrompt(text)}
              />
              {lastCopiedPrompt && (
                <div style={styles.copiedNotice}>
                  Copied to clipboard: <code style={styles.inlineCode}>{lastCopiedPrompt}</code>
                </div>
              )}
            </div>

            {/* Interactive Prop Controls */}
            <div style={styles.controlsGrid}>
              <label style={styles.field}>
                <span style={styles.fieldLabel}>size</span>
                <div style={styles.segmented}>
                  {(["sm", "md", "lg"] as const).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSize(s)}
                      style={{
                        ...styles.segBtn,
                        ...(size === s ? styles.segBtnActive : {})
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </label>

              <label style={styles.field}>
                <span style={styles.fieldLabel}>label</span>
                <input
                  type="text"
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  style={styles.input}
                />
              </label>

              <label style={styles.field}>
                <span style={styles.fieldLabel}>copiedLabel</span>
                <input
                  type="text"
                  value={copiedLabel}
                  onChange={(e) => setCopiedLabel(e.target.value)}
                  style={styles.input}
                />
              </label>

              <label style={{ ...styles.field, gridColumn: "1 / -1" }}>
                <span style={styles.fieldLabel}>prompt (copied on click)</span>
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  style={styles.input}
                />
              </label>
            </div>
          </section>
        ) : (
          <section style={styles.codeCard}>
            <div style={styles.codeHeader}>
              <span style={styles.codeFilename}>components/ui/pixel-prompt-button.tsx</span>
              <button type="button" onClick={handleCopySource} style={styles.smallCopyBtn}>
                {copiedCode ? "Copied!" : "Copy"}
              </button>
            </div>
            <pre style={styles.pre}>
              <code>{sourceCode}</code>
            </pre>
          </section>
        )}

        {/* Size Presets */}
        <section style={styles.section}>
          <h2 style={styles.h2}>Sizes</h2>
          <div style={styles.sizesCard}>
            <div style={styles.sizeItem}>
              <PixelPromptButton size="lg" />
              <span style={styles.sizeMeta}>size=&quot;lg&quot; · 472 × 77 px (1:1 reference)</span>
            </div>
            <div style={styles.sizeItem}>
              <PixelPromptButton size="md" />
              <span style={styles.sizeMeta}>size=&quot;md&quot; · 310 × 50 px</span>
            </div>
            <div style={styles.sizeItem}>
              <PixelPromptButton size="sm" />
              <span style={styles.sizeMeta}>size=&quot;sm&quot; · 236 × 38 px</span>
            </div>
          </div>
        </section>

        {/* Installation & Usage (shadcn/ui style) */}
        <section style={styles.section}>
          <h2 style={styles.h2}>Installation</h2>
          <p style={styles.p}>
            Copy and paste <code style={styles.inlineCode}>components/ui/pixel-prompt-button.tsx</code> into
            your React or Next.js project. All styles and SVG mosaic tiles are self-contained inside the file.
          </p>

          <h2 style={{ ...styles.h2, marginTop: 22 }}>Usage</h2>
          <div style={styles.codeCard}>
            <div style={styles.codeHeader}>
              <span style={styles.codeFilename}>app/page.tsx</span>
              <button type="button" onClick={handleCopyUsage} style={styles.smallCopyBtn}>
                {copiedUsage ? "Copied!" : "Copy"}
              </button>
            </div>
            <pre style={styles.pre}>
              <code>{usageSnippet}</code>
            </pre>
          </div>
        </section>

        {/* Props Table */}
        <section style={styles.section}>
          <h2 style={styles.h2}>Props</h2>
          <div style={styles.tableWrap}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Prop</th>
                  <th style={styles.th}>Type</th>
                  <th style={styles.th}>Default</th>
                  <th style={styles.th}>Description</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={styles.tdMono}>label</td>
                  <td style={styles.tdMono}>string</td>
                  <td style={styles.tdMono}>&quot;Generate &amp; copy prompt&quot;</td>
                  <td style={styles.td}>Primary button label text.</td>
                </tr>
                <tr>
                  <td style={styles.tdMono}>copiedLabel</td>
                  <td style={styles.tdMono}>string</td>
                  <td style={styles.tdMono}>&quot;Copied prompt!&quot;</td>
                  <td style={styles.td}>Temporary text shown for 1.8s after clicking.</td>
                </tr>
                <tr>
                  <td style={styles.tdMono}>prompt</td>
                  <td style={styles.tdMono}>string</td>
                  <td style={styles.tdMono}>DEFAULT_PROMPT</td>
                  <td style={styles.td}>Text copied to clipboard when clicked.</td>
                </tr>
                <tr>
                  <td style={styles.tdMono}>size</td>
                  <td style={styles.tdMono}>&quot;sm&quot; | &quot;md&quot; | &quot;lg&quot;</td>
                  <td style={styles.tdMono}>&quot;lg&quot;</td>
                  <td style={styles.td}>Pill scale preset (lg matches 472×77 reference).</td>
                </tr>
                <tr>
                  <td style={styles.tdMono}>onCopyPrompt</td>
                  <td style={styles.tdMono}>(text: string) =&gt; void</td>
                  <td style={styles.tdMono}>—</td>
                  <td style={styles.td}>Callback fired after prompt text is copied.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  viewport: {
    height: "100vh",
    overflowY: "auto",
    background: "#09090b",
    color: "#fafafa",
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontSize: 14,
    lineHeight: 1.5
  },
  container: {
    maxWidth: 920,
    margin: "0 auto",
    padding: "40px 24px 80px"
  },
  header: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 16,
    marginBottom: 28
  },
  breadcrumb: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    fontSize: 12.5,
    fontFamily: "ui-monospace, Cascadia Mono, Consolas, monospace",
    marginBottom: 8
  },
  muted: { color: "#71717a" },
  crumbActive: { color: "#e4e4e7" },
  h1: {
    fontSize: 28,
    fontWeight: 700,
    letterSpacing: "-0.025em",
    color: "#fafafa",
    lineHeight: 1.2
  },
  lead: {
    marginTop: 6,
    color: "#a1a1aa",
    fontSize: 14
  },
  headerActions: {
    display: "flex",
    alignItems: "center",
    gap: 8
  },
  ghostLink: {
    display: "inline-flex",
    alignItems: "center",
    height: 34,
    padding: "0 12px",
    borderRadius: 6,
    border: "1px solid #27272a",
    color: "#d4d4d8",
    textDecoration: "none",
    fontSize: 13,
    fontWeight: 500
  },
  copyPrimaryBtn: {
    display: "inline-flex",
    alignItems: "center",
    height: 34,
    padding: "0 14px",
    borderRadius: 6,
    background: "#fafafa",
    color: "#09090b",
    border: "none",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer"
  },
  tabRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    borderBottom: "1px solid #27272a",
    marginBottom: 16
  },
  tabList: {
    display: "flex",
    gap: 4
  },
  tabBtn: {
    padding: "9px 14px",
    background: "none",
    border: "none",
    borderBottom: "2px solid transparent",
    color: "#a1a1aa",
    fontSize: 13.5,
    fontWeight: 500,
    cursor: "pointer",
    marginBottom: -1
  },
  tabBtnActive: {
    color: "#fafafa",
    borderBottomColor: "#fafafa"
  },
  fileChip: {
    fontSize: 12,
    color: "#71717a",
    fontFamily: "ui-monospace, Cascadia Mono, Consolas, monospace"
  },
  panel: {
    border: "1px solid #27272a",
    borderRadius: 10,
    overflow: "hidden",
    background: "#111113"
  },
  stage: {
    minHeight: 230,
    background: "#171717",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    padding: "40px 20px"
  },
  copiedNotice: {
    fontSize: 12,
    color: "#a1a1aa",
    maxWidth: "90%",
    textAlign: "center"
  },
  controlsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 14,
    padding: 16,
    borderTop: "1px solid #27272a",
    background: "#0c0c0e"
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: 6
  },
  fieldLabel: {
    fontSize: 12,
    color: "#a1a1aa",
    fontFamily: "ui-monospace, Cascadia Mono, Consolas, monospace"
  },
  input: {
    height: 34,
    padding: "0 10px",
    borderRadius: 6,
    border: "1px solid #27272a",
    background: "#18181b",
    color: "#fafafa",
    fontSize: 13,
    outline: "none"
  },
  segmented: {
    display: "inline-flex",
    padding: 3,
    borderRadius: 6,
    border: "1px solid #27272a",
    background: "#18181b",
    gap: 3,
    alignSelf: "flex-start"
  },
  segBtn: {
    height: 26,
    padding: "0 12px",
    borderRadius: 4,
    border: "none",
    background: "transparent",
    color: "#a1a1aa",
    fontSize: 12,
    fontFamily: "ui-monospace, Cascadia Mono, Consolas, monospace",
    cursor: "pointer"
  },
  segBtnActive: {
    background: "#27272a",
    color: "#fafafa"
  },
  codeCard: {
    border: "1px solid #27272a",
    borderRadius: 10,
    overflow: "hidden",
    background: "#111113"
  },
  codeHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "10px 14px",
    borderBottom: "1px solid #27272a",
    background: "#18181b"
  },
  codeFilename: {
    fontSize: 12,
    color: "#a1a1aa",
    fontFamily: "ui-monospace, Cascadia Mono, Consolas, monospace"
  },
  smallCopyBtn: {
    height: 26,
    padding: "0 10px",
    borderRadius: 5,
    border: "1px solid #3f3f46",
    background: "#27272a",
    color: "#fafafa",
    fontSize: 12,
    fontWeight: 500,
    cursor: "pointer"
  },
  pre: {
    margin: 0,
    padding: 16,
    overflowX: "auto",
    maxHeight: 520,
    fontSize: 12.5,
    lineHeight: 1.6,
    color: "#e4e4e7",
    fontFamily: "ui-monospace, Cascadia Mono, Consolas, monospace"
  },
  section: {
    marginTop: 36
  },
  h2: {
    fontSize: 18,
    fontWeight: 600,
    letterSpacing: "-0.015em",
    marginBottom: 10
  },
  p: {
    color: "#a1a1aa",
    fontSize: 14,
    marginBottom: 12
  },
  inlineCode: {
    fontFamily: "ui-monospace, Cascadia Mono, Consolas, monospace",
    fontSize: 12,
    background: "#18181b",
    border: "1px solid #27272a",
    padding: "2px 6px",
    borderRadius: 4,
    color: "#e4e4e7"
  },
  sizesCard: {
    border: "1px solid #27272a",
    borderRadius: 10,
    background: "#171717",
    padding: "28px 20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 24
  },
  sizeItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 10,
    maxWidth: "100%"
  },
  sizeMeta: {
    fontSize: 11.5,
    color: "#71717a",
    fontFamily: "ui-monospace, Cascadia Mono, Consolas, monospace"
  },
  tableWrap: {
    border: "1px solid #27272a",
    borderRadius: 10,
    overflowX: "auto",
    background: "#111113"
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    textAlign: "left",
    fontSize: 13
  },
  th: {
    padding: "10px 14px",
    borderBottom: "1px solid #27272a",
    color: "#a1a1aa",
    fontWeight: 500,
    background: "#18181b"
  },
  td: {
    padding: "10px 14px",
    borderBottom: "1px solid #27272a",
    color: "#d4d4d8"
  },
  tdMono: {
    padding: "10px 14px",
    borderBottom: "1px solid #27272a",
    color: "#fafafa",
    fontFamily: "ui-monospace, Cascadia Mono, Consolas, monospace",
    fontSize: 12
  }
};
