# Bulk Website Screenshot — Figma Plugin

Capture screenshots of **10+ websites at a time** and place them on your Figma canvas in a clean grid. No API keys needed.

## User Flow

1. **Step 1 — Share URLs**: paste URLs (one per line / comma-separated), import a `.txt`/`.csv`, or click **Load 10 Sample Sites**. Choose screen width, **Whole Screen (Full-Page)**, **Browser Header Frame**, and grid columns.
2. **Step 2 — Screenshot & Place in Figma**: click **Screenshot** — each capture is placed on the canvas with a browser-style header and clickable URL. Use **View Full**, **Zoom in Figma**, or **Retry** per item.

## Load in Figma Desktop

1. Open the **Figma Desktop App** and any Design or FigJam file.
2. **Menu → Plugins → Development → Import plugin from manifest...**
3. Select [`manifest.json`](./manifest.json).
4. Run **Plugins → Development → Bulk Website Screenshot**.

## Local Chrome Server (recommended)

Uses your own Chrome/Edge to capture the entire page: scrolls to trigger lazy content, waits for the network to go idle, and keeps `100vh` hero sections from stretching.

1. Install **Node.js 22+** and have Chrome or Edge installed.
2. **Windows:** double-click `start-server.bat` · **macOS:** `start-server.command` · or `node server.js`
3. Keep that window open. The plugin shows **● Local Chrome server running**.

Optional settings (`PORT`, `CDP_PORT`, `CHROME_PATH`) go in `.env`. Pages taller than 16,384 px are truncated (Chrome limit).

## Engine order (Auto mode)

1. **Local Chrome server** — whole page, unlimited
2. **Microlink** — full page, free daily limit
3. **Thum.io** — last resort, top ~1200 px only (flagged in the UI)
