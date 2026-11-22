# Pixel UI — React Component Library & Figma-Ready UI Kit

A copy-pasteable, zero-dependency **React + TypeScript component library** built for modern web apps **and ready to paste directly into your Figma projects** — featuring interactive animated SVG pixel components, a live visual control panel playground, 1-click Figma vector SVG export, and bundled Figma/FigJam screenshot companion tools.

---

## Repository Description (GitHub About)

> Zero-dependency React + TypeScript component library with animated pixel UI components, an interactive Next.js playground, 1-click Figma SVG paste, and bundled Figma/FigJam screenshot tools.

**Suggested Topics:** `react`, `react-components`, `component-library`, `ui-components`, `typescript`, `nextjs`, `svg-animation`, `figma`, `figma-svg`, `figma-plugin`, `design-system`, `design-tools`

---

## Highlights

- **Drop-In React Components**: Copy [`components/ui/pixel-prompt-button.tsx`](./components/ui/pixel-prompt-button.tsx) directly into Next.js (App Router ready with `"use client"`), Vite, or any React 18/19 app. Zero external runtime dependencies beyond `react`, scoped CSS classes (`.ppb-*`), `React.forwardRef`, built-in clipboard copy feedback, and `prefers-reduced-motion` support.
- **Ready for Your Figma Projects**: Click **Copy SVG for Figma** from Docs (`/`) or Playground (`/playground`) and press `Ctrl+V` / `Cmd+V` onto any Figma Design or FigJam canvas. Powered by [`buildPixelPromptButtonSvg`](./web/lib/figma-export.ts), generating Figma-safe vectors with explicit hex `stop-color` + `stop-opacity` gradients, clipped pixel mosaic `<rect>` layers, editable `<text>`, and crisp vector icons.
- **Interactive Control Panel Playground (`/playground`)**: Customize every visual and motion parameter live in **Pixel Flow Studio** — with 6 built-in presets (*Cobalt Classic*, *Neon Ripple*, *Aurora Wave*, *Cyber Rain*, *Solar Spotlight*, *Rose Scatter*), 4 stage backdrops (*Dot Grid*, *Obsidian*, *Slate*, *Light*), collapsible sections for *Colors & Glow*, *Pixels & Grid*, *Animation*, *Mouse Over & Gradient*, and *Transition*, plus 1-click **Copy JSX**, **Copy SVG for Figma**, and **Copy TSX**.
- **Bundled Figma Companion Tools (`/plugin` & `plugin/`)**: Also includes the **Bulk Website Screenshot** Figma & FigJam plugin and standalone Next.js infinite artboard studio powered by a zero-dependency local Chrome/Edge CDP capture server.

---

## Using in Your React Project

This library distributes components as clean, self-contained TSX source files (like shadcn-style copy-paste components) rather than a black-box npm package, so you own every line and can customize tokens freely.

### 1. Add the Component to Your Project

Copy [`components/ui/pixel-prompt-button.tsx`](./components/ui/pixel-prompt-button.tsx) into your codebase (for example, `components/ui/pixel-prompt-button.tsx`), or open the local Docs/Playground app and click **Copy full TSX**.

- **Requirements**: React `18+` or `19+` (works with Next.js App Router, Vite, Remix, etc.)
- **External dependencies**: None (`react` only)

### 2. Basic & Customized Usage

```tsx
import { PixelPromptButton } from "@/components/ui/pixel-prompt-button";

export function BasicExample() {
  return (
    <PixelPromptButton
      label="Generate & copy prompt"
      prompt="Design a modular dashboard card system with clean contrast."
      onCopyPrompt={(text) => console.log("Copied:", text)}
    />
  );
}
```

```tsx
import { PixelPromptButton } from "@/components/ui/pixel-prompt-button";

export function CustomizedExample() {
  return (
    <PixelPromptButton
      label="Copy Design Prompt"
      copiedLabel="Copied!"
      size="md"
      baseColor="#6d28d9"
      highlightColor="#ddd6fe"
      hoverGradientColor="#38bdf8"
      pixelSize={9}
      pixelGap={1.5}
      pixelRadius={1.5}
      animationMode="wave"
      animationSpeed={120}
      mouseOverMode="follow"
      hoverEffect="gradient-1-0"
      gradientCurve="smooth"
      transitionEasing="spring"
      transitionDuration={360}
    />
  );
}
```

### 3. `PixelPromptButtonProps` Reference

All standard `React.ButtonHTMLAttributes<HTMLButtonElement>` props (except `children`) are also forwarded to the underlying `<button>` element.

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | `string` | `"Generate & copy prompt"` | Primary button label text |
| `copiedLabel` | `string` | `"Copied to clipboard"` | Temporary confirmation label shown after click |
| `prompt` | `string` | `label` | Text written to clipboard on click |
| `size` | `"sm" \| "md" \| "lg"` | `"lg"` | Pill size preset (`236x38`, `310x50`, or `472x77` px) |
| `showIcon` | `boolean` | `true` | Toggles trailing lightning bolt / checkmark SVG |
| `onCopyPrompt` | `(text: string) => void` | `undefined` | Callback fired right after copying `prompt` |
| `baseColor` | `string` | `"#2c5cf5"` | Base hex color driving the pixel palette and outer rim |
| `highlightColor` | `string` | `"#bfd6ff"` | Highlight hex color for bright pixels and hover states |
| `textColor` | `string` | `"#ffffff"` | Label text and trailing SVG icon hex color |
| `glowIntensity` | `number` | `55` | Outer glow shadow intensity (`0` – `100`) |
| `pixelSize` | `number` | `8` | Logical SVG width/height of each pixel cell (`4` – `16`) |
| `pixelGap` | `number` | `1` | Logical gap between adjacent pixels (`0` – `4`) |
| `pixelRadius` | `number` | `0` | Corner radius per pixel tile (`0` – `4`) |
| `pixelContrast` | `number` | `65` | Luminance spread across shadow-to-highlight tiers (`0` – `100`) |
| `animationMode` | `"dance" \| "sparkle" \| "wave" \| "rain" \| "pulse" \| "none"` | `"dance"` | Continuous ambient animation pattern |
| `animationSpeed` | `number` | `100` | Ambient animation speed multiplier in percent (`0` – `200`) |
| `danceAmount` | `number` | `50` | Ambient pixel shimmer intensity (`0` – `100`) |
| `mouseOverMode` | `"follow" \| "full" \| "edge-sweep" \| "always-on"` | `"follow"` | Interactive hover targeting behavior |
| `hoverEffect` | `"gradient-1-0" \| "spotlight" \| "ripple" \| "scatter" \| "reveal" \| "none"` | `"gradient-1-0"` | Interactive cursor/hover pixel reaction |
| `hoverRadius` | `number` | `38` | Hover influence width in percent of button width (`10` – `60`) |
| `hoverIntensity` | `number` | `100` | Hover reaction strength multiplier (`0` – `100`) |
| `gradientCurve` | `"linear" \| "smooth" \| "sharp" \| "soft" \| "arch"` | `"linear"` | Opacity falloff curve across the hover gradient |
| `gradientStart` | `number` | `100` | Starting gradient intensity at leading edge (`0` – `100`) |
| `gradientEnd` | `number` | `0` | Ending gradient intensity at trailing edge (`0` – `100`) |
| `hoverBloom` | `number` | `36` | Cursor-following radial background glow opacity (`0` – `100`) |
| `hoverGradientColor` | `string` | `highlightColor` | Optional override hex tint for hovered gradient pixels |
| `transitionDuration` | `number` | `280` | Enter/leave hover blend and lift duration in ms (`60` – `1500`) |
| `transitionEasing` | `"ease-out" \| "ease-in-out" \| "linear" \| "spring"` | `"ease-out"` | Timing curve for hover transitions and lift |
| `cursorSmoothness` | `number` | `35` | Pointer tracking damping (`0` = instant, `100` = silky trail) |
| `hoverLift` | `number` | `1` | Upward pill lift in pixels on hover (`0` – `8`) |

---

## Using in Your Figma Projects

Every visual state of `PixelPromptButton` exports cleanly into editable vector layers for Figma Design and FigJam.

### Option A — Paste Directly from Docs or Playground (Fastest)

1. Start the local Docs & Playground app (`npm run web` -> <http://localhost:3000>).
2. Open <http://localhost:3000/playground> (or <http://localhost:3000>), choose a preset or dial in your colors, pixels, and gradient intensity.
3. Click **Copy SVG for Figma**.
4. Open any **Figma Design** or **FigJam** file and press `Ctrl+V` (Windows) / `Cmd+V` (macOS) to paste crisp vector layers (clipped pill frame, gradient rims, individual pixel tiles, editable text layer, and vector bolt icon).

### Option B — Generate Figma-Safe SVG Programmatically

Use [`buildPixelPromptButtonSvg`](./web/lib/figma-export.ts) directly in scripts, internal design-system tools, or Figma plugin generators:

```ts
import { buildPixelPromptButtonSvg } from "@/lib/figma-export";

const svgMarkup = buildPixelPromptButtonSvg({
  label: "Generate & copy prompt",
  size: "lg",
  showIcon: true,
  baseColor: "#2c5cf5",
  highlightColor: "#bfd6ff",
  hoverGradientColor: "#38bdf8",
  textColor: "#ffffff",
  pixelSize: 8,
  pixelGap: 1,
  pixelRadius: 0,
  pixelContrast: 65,
  gradientStart: 100,
  gradientEnd: 0
});
```

---

## Quick Start

### 1. Run the React Component Docs & Playground

Install dependencies once and start the Next.js workspace:

```bash
cd web
npm install
cd ..
npm run web
```

Available routes:
- <http://localhost:3000> (also `/component` and `/ui`) — Component Showcase, live preview, full TSX source viewer, JSX usage snippet, Props table, and **Copy SVG for Figma**
- <http://localhost:3000/playground> — **Pixel Flow Studio** interactive control panel playground
- <http://localhost:3000/plugin> — **Bulk Website Screenshot Studio** infinite artboard canvas

### 2. Optional: Bundled Figma & FigJam Screenshot Plugin + Local Chrome Server

If you also want to capture bulk full-page screenshots into Figma frames:

1. **Start the Local Chrome/Edge CDP Server** (requires **Node.js 22+** and Google Chrome or Microsoft Edge; no extra `npm install` needed at root):
   - **Windows:** double-click [`start-server.bat`](./start-server.bat) or [`scripts/start-server.bat`](./scripts/start-server.bat) (or [`scripts/start-all.bat`](./scripts/start-all.bat) to start both the capture server `:3456` and Next.js web app `:3000`)
   - **macOS:** double-click [`scripts/start-server.command`](./scripts/start-server.command)
   - **CLI:**
     ```bash
     npm start
     ```
   Verify at <http://localhost:3456/health>. (`server/index.js` exposes `GET /health`, `GET /screenshot?url=...&width=...&height=...&fullPage=...` up to Chrome's `16384` px texture limit, and serves `plugin/ui.html` at `/` and `/ui`.)
2. **Load the Plugin in Figma Desktop**:
   - Open Figma Desktop (Design or FigJam).
   - Go to **Menu -> Plugins -> Development -> Import plugin from manifest...**.
   - Select [`manifest.json`](./manifest.json) and run **Bulk Website Screenshot** (slices tall captures cleanly into `<= 3600` px tiles inside auto-arranged grid frames, with Microlink / Thum.io cloud fallbacks).
3. **Optional `.env` Configuration**:
   Copy [`.env.example`](./.env.example) to `.env` to override ports or browser binary path:
   ```dotenv
   PORT=3456
   CDP_PORT=9333
   CHROME_PATH=
   ```
   In `web/`, you can optionally set `NEXT_PUBLIC_SHOT_SERVER` to override the capture server URL (defaults to `http://<current-hostname>:3456`).

---

## Project Structure

```text
.
├── components/
│   └── ui/
│       └── pixel-prompt-button.tsx   # Standalone React + TS component (copy into your app)
├── web/                              # Next.js 15 Docs, Playground & Screenshot Studio
│   ├── app/
│   │   ├── page.tsx                  # Component Docs showcase (/)
│   │   ├── component/                # Docs route (/component) & ShowcaseClient.tsx
│   │   ├── ui/                       # Docs alias route (/ui)
│   │   ├── playground/               # Pixel Flow Studio control panel (/playground)
│   │   ├── plugin/                   # Bulk Screenshot Artboard Studio (/plugin)
│   │   ├── globals.css
│   │   └── layout.tsx
│   ├── components/
│   │   ├── ui/pixel-prompt-button.tsx
│   │   ├── PixelControlPanel.tsx     # Control panel presets, sliders, swatches & JSX generator
│   │   ├── Canvas.tsx                # Infinite pan/zoom screenshot artboard canvas
│   │   ├── LeftPanel.tsx             # Layers tree & Capture settings
│   │   ├── RightPanel.tsx            # Design inspector & PNG export
│   │   ├── TopBar.tsx                # Studio toolbar & actions
│   │   └── Icons.tsx
│   ├── lib/
│   │   ├── figma-export.ts           # Figma-safe SVG exporter & clipboard helpers
│   │   ├── load-source.ts            # Reads component TSX for Docs/Playground code views
│   │   ├── capture.ts                # Capture server client
│   │   ├── types.ts
│   │   └── utils.ts
│   ├── next.config.js
│   └── package.json
├── plugin/                           # Bundled Figma & FigJam Screenshot plugin
│   ├── code.js                       # Figma sandbox controller (frame creation, tiling, grid layout)
│   └── ui.html                       # Plugin UI
├── server/                           # Zero-dependency Node.js CDP screenshot server
│   └── index.js
├── scripts/                          # Launch helpers
│   ├── start-all.bat                 # Windows: starts Chrome server (:3456) + Next.js (:3000)
│   ├── start-server.bat              # Windows: starts Local Chrome Server
│   └── start-server.command          # macOS: starts Local Chrome Server
├── manifest.json                     # Figma plugin manifest
├── package.json                      # Root scripts (start, server, web, web:build, web:start)
├── start-server.bat
└── .env.example
```
