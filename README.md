ZombieUI — React Component Library & Figma-Ready UI Kit

A copy-pasteable, zero-dependency **React + TypeScript component library** built for modern web apps **and ready to use in your Figma projects** — featuring a unified component catalog (`/`) where every component opens directly into its interactive studio playground, complete with 1-click Figma export and JSX/TSX source copying.

---

## Repository Description (GitHub About)

> Zero-dependency React + TypeScript component library with live interactive playgrounds and 1-click Figma SVG & PNG export.

**Suggested Topics:** `react`, `react-components`, `component-library`, `ui-components`, `typescript`, `nextjs`, `svg-animation`, `webgl`, `figma`, `figma-svg`, `design-system`, `design-tools`

---

## Components

1. **Pixel Prompt Button** ([`components/ui/pixel-prompt-button.tsx`](./components/ui/pixel-prompt-button.tsx))
   - Animated SVG pixel-mosaic action pill (`"use client"`, `React.forwardRef`, zero dependencies beyond `react`).
   - Configurable pixel grid size/gap/radius/contrast, ambient animation patterns (`dance`, `sparkle`, `wave`, `rain`, `pulse`, `none`), cursor-reactive hover effects (`gradient-1-0`, `spotlight`, `ripple`, `scatter`, `reveal`), clipboard feedback, and `prefers-reduced-motion` support.
   - Exports Figma-safe editable vectors via **Copy SVG for Figma** (`buildPixelPromptButtonSvg` in [`lib/figma-export.ts`](./lib/figma-export.ts)).

2. **Heat Distortion** ([`components/ui/heat-distortion.tsx`](./components/ui/heat-distortion.tsx) & [`components/ui/heat-distortion-studio.tsx`](./components/ui/heat-distortion-studio.tsx))
   - Real-time native **WebGL1** heat-shimmer shader component (`"use client"`, `React.forwardRef<HeatDistortionHandle, HeatDistortionProps>`, zero dependencies beyond `react`).
   - Supports typography mode (multiline text, font stack, weight, size, letter spacing, line height) and image mode (`contain` / `cover` scaling), distortion waves & turbulence, chromatic aberration, directional heat mask, localized mouse heat boost, and PNG export (`exportPngBlob()`, `downloadPng()`, and **Copy PNG for Figma**).

---

## Using in Your React Project

Copy any component file from [`components/ui/`](./components/ui) directly into your codebase (Next.js App Router, Vite, Remix, etc.) — no npm package wrapper or external CSS dependencies required:

- [`components/ui/pixel-prompt-button.tsx`](./components/ui/pixel-prompt-button.tsx)
- [`components/ui/heat-distortion.tsx`](./components/ui/heat-distortion.tsx)
- [`components/ui/heat-distortion-studio.tsx`](./components/ui/heat-distortion-studio.tsx) (optional standalone workbench)

```tsx
import { PixelPromptButton } from "@/components/ui/pixel-prompt-button";
import { HeatDistortion } from "@/components/ui/heat-distortion";

export function Example() {
  return (
    <div style={{ display: "grid", gap: 24 }}>
      <PixelPromptButton
        label="Generate & copy prompt"
        animationMode="wave"
        hoverEffect="gradient-1-0"
      />
      <div style={{ width: 420, aspectRatio: "1" }}>
        <HeatDistortion
          text="Building Fast Planes. Fast."
          strength={1.3}
          chromaticAberration={0.002}
        />
      </div>
    </div>
  );
}
```

---

## Using in Your Figma Projects

- **Pixel Prompt Button (Editable Vector SVG)**: Open `/playground/pixel-prompt-button`, customize colors/grid/gradient, click **Copy SVG for Figma**, and press `Ctrl+V` / `Cmd+V` onto any Figma Design or FigJam canvas.
- **Heat Distortion (PNG Layer)**: Open `/playground/heat-distortion`, dial in distortion/typography/image settings, and click **Copy PNG for Figma** (`Ctrl+V` / `Cmd+V` into Figma) or **Save PNG**.

---

## Quick Start

Install dependencies once (if `node_modules/` is not already present) and start the local development server from the project root:

```bash
npm install
npm run dev
```

Or run a production build:

```bash
npm run build
npm start
```

Available routes:
- <http://localhost:3000> — Unified **Components** catalog page listing live interactive previews for all components
- <http://localhost:3000/playground/pixel-prompt-button> — **Pixel Prompt Button** interactive playground
- <http://localhost:3000/playground/heat-distortion> — **Heat Distortion** interactive playground

---

## Project Structure

```text
.
├── app/
│   ├── globals.css                      # Shared studio design tokens & layout classes
│   ├── layout.tsx
│   ├── page.tsx                         # Single-page Component Catalog (/)
│   └── playground/
│       ├── page.tsx                     # Redirects to /playground/pixel-prompt-button
│       ├── heat-distortion/             # Heat Distortion playground
│       └── pixel-prompt-button/         # Pixel Prompt Button playground
├── components/
│   ├── catalog/
│   │   └── CatalogClient.tsx            # Component catalog cards & live previews
│   ├── studio/
│   │   ├── HeatDistortionControlPanel.tsx
│   │   ├── PixelControlPanel.tsx
│   │   ├── PlaygroundWorkspace.tsx
│   │   ├── StudioControls.tsx
│   │   └── StudioHeader.tsx
│   └── ui/
│       ├── heat-distortion-studio.tsx   # Standalone drop-in studio workbench
│       ├── heat-distortion.tsx          # Standalone WebGL1 heat shimmer component
│       └── pixel-prompt-button.tsx      # Standalone animated SVG pixel button
├── lib/
│   ├── figma-export.ts                  # Figma SVG builder & PNG/text clipboard helpers
│   └── load-source.ts                   # Reads TSX source for playground code drawer
├── next.config.js
├── package.json
└── tsconfig.json
```
