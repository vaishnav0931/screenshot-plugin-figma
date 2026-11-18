# Site Screenshots — Figma Plugin & Artboard Canvas

Bulk full-page website screenshot tool — available as a **Figma & FigJam plugin** and a **Next.js Figma-style infinite canvas web app**, powered by a zero-dependency local headless Chrome/Edge capture server. No API keys required.

## Repository Description (GitHub About)

> Bulk full-page website screenshot tool — available as a Figma & FigJam plugin and a Figma-style infinite canvas web app powered by local headless Chrome.

**Suggested Topics:** `figma`, `figma-plugin`, `figjam`, `screenshot`, `full-page-screenshot`, `nextjs`, `react`, `typescript`, `chrome-devtools-protocol`, `design-tools`, `web-capture`

---

## Project Structure

```text
.
├── manifest.json             # Figma plugin manifest (points to plugin/code.js & plugin/ui.html)
├── package.json              # Root scripts for server and web app
├── start-server.bat          # Windows root launcher for the Local Chrome Server
├── .env / .env.example       # Optional server configuration (PORT, CDP_PORT, CHROME_PATH)
├── .gitignore
├── plugin/                   # Figma & FigJam plugin
│   ├── code.js               # Figma sandbox controller (frame creation, tiling, grid layout)
│   └── ui.html               # Plugin UI (also served at http://localhost:3456/)
├── server/                   # Zero-dependency Node.js screenshot server
│   └── index.js              # Drives Chrome/Edge via Chrome DevTools Protocol (CDP)
├── web/                      # Standalone Next.js 15 Figma-style artboard web app
│   ├── app/
│   │   ├── globals.css       # Figma-style dark workspace styling
│   │   ├── layout.tsx
│   │   └── page.tsx          # Main workspace state, canvas, and capture queue
│   ├── components/
│   │   ├── Canvas.tsx        # Infinite pan/zoom artboard canvas & selection handles
│   │   ├── LeftPanel.tsx     # Layers tree & Capture settings panel
│   │   ├── RightPanel.tsx    # Design inspector & PNG export panel
│   │   ├── TopBar.tsx        # Tools, zoom controls, server status, Capture CTA
│   │   └── Icons.tsx
│   ├── lib/
│   │   ├── capture.ts        # Capture server client (auto-resolves localhost / LAN host)
│   │   ├── types.ts          # Shared Frame, Settings, View, and Tool types
│   │   └── utils.ts          # URL parser, grid auto-layout, download helpers
│   ├── next.config.js        # Dev origin configuration (allowedDevOrigins)
│   ├── package.json
│   └── tsconfig.json
└── scripts/                  # Launch helpers
    ├── start-all.bat         # Windows: starts both Local Chrome Server and Next.js Web App
    ├── start-server.bat      # Windows: starts Local Chrome Server
    └── start-server.command  # macOS: starts Local Chrome Server
```

---

## Architecture & Capture Pipeline

1. **Local Chrome CDP Server (`server/index.js`)**
   - Uses your installed **Google Chrome** or **Microsoft Edge** over the Chrome DevTools Protocol (`WebSocket` + `fetch`, zero external `npm` dependencies on Node.js 22+).
   - Auto-scrolls pages to trigger lazy-loaded images and `IntersectionObserver` sections, waits for network idle and `document.fonts.ready`, and locks `100vh`/`vh` hero sections before capture so full-page screenshots never stretch.
   - Exposes `GET /health`, `GET /screenshot?url=...&width=...&height=...&fullPage=...`, and serves `plugin/ui.html` at `/` and `/ui`.
   - Pages taller than `16384` px are truncated (Chromium texture limit).

2. **Figma Plugin (`plugin/code.js` + `plugin/ui.html`)**
   - **Auto Engine Fallback**: Uses **Local Chrome Server** (`http://localhost:3456`) first, with cloud fallbacks (**Microlink Full-Page** → **Thum.io** top-only).
   - **Seamless Vertical Tiling**: Slices tall screenshots into vertical PNG tiles (`<= 3600` px each) in `plugin/ui.html` and stacks them inside a single Figma frame so tall pages render cleanly under Figma's `4096` px image limit.
   - **Dynamic Grid Layout**: Arranges frames into configurable columns (`2`–`10`), with optional macOS-style browser headers and clickable URLs.

3. **Next.js Figma-Style Web App (`web/`)**
   - **Infinite Artboard Canvas**: Scroll to pan, `Ctrl`/`Cmd + Scroll` to zoom toward cursor, `Space + Drag` or Hand tool (`H`) to pan, Move tool (`V`) to drag frames, `Shift + 1` (fit all), `Shift + 2` (fit selection).
   - **Layers & Inspector**: Live layer list with status indicators, X/Y position editing, grid re-layout ("Tidy up frames"), and 1x PNG export (single or batch).

---

## Quick Start

### 1. Local Chrome Screenshot Server (Recommended for Full-Page Captures)
Requires **Node.js 22+** and **Chrome** or **Edge**:
- **Windows:** double-click `start-server.bat` (or `scripts/start-server.bat`)
- **macOS:** double-click `scripts/start-server.command`
- **CLI:**
  ```bash
  npm start
  ```
Verify at <http://localhost:3456/health> (or open <http://localhost:3456> to preview the plugin UI in a browser).

### 2. Figma Desktop Plugin
1. Open the **Figma Desktop App** (Design or FigJam file).
2. Go to **Menu → Plugins → Development → Import plugin from manifest...**.
3. Select [`manifest.json`](./manifest.json).
4. Run **Plugins → Development → Bulk Website Screenshot**.
5. Keep the Local Chrome Server running for unlimited full-page captures.

### 3. Next.js Figma-Style Web App
Install dependencies once and run the dev server (alongside the Local Chrome Server):
```bash
cd web
npm install
cd ..
npm run web
```
Or on **Windows**, double-click [`scripts/start-all.bat`](./scripts/start-all.bat) to start both the Local Chrome Server (`:3456`) and the Next.js web app (`:3000`) together.

---

## Environment Configuration (`.env`)

Copy `.env.example` to `.env` if you need custom ports or a custom browser binary:

```dotenv
PORT=3456
CDP_PORT=9333
CHROME_PATH=
```

In `web/`, you can optionally set `NEXT_PUBLIC_SHOT_SERVER` to override the screenshot server URL (otherwise it automatically uses `http://<current-hostname>:3456` in the browser).
