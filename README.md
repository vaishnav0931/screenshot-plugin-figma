# Bulk Website Screenshot — Figma Plugin

A Figma plugin designed to capture screenshots of **10+ websites at a time** and place them directly onto your Figma canvas in a clean, customizable grid.

## User Flow

1. **Step 1 — Share URLs**:
   - Paste 10, 20, or 50+ website URLs (one per line, comma-separated, or extracted from raw text), import a `.txt`/`.csv` file, or click **Load 10 Sample Sites**.
   - Choose viewport size (`1440×900`, `1920×1080`, `1280×800`, Tablet, Mobile), **Full-Page Screenshot** mode, **Browser Header Frame**, and **Grid Columns** (default: 5 columns per row).
2. **Step 2 — Screenshot & Place in Figma**:
   - Click **Screenshot Websites →** to capture URLs in parallel.
   - Watch real-time progress with live thumbnail previews as each screenshot is placed onto your Figma canvas, complete with browser chrome and a clickable URL pill.
   - Click **Zoom** on any item to jump to its frame in Figma, or **Retry** any individual URL.

## How to Load in Figma Desktop

1. Open the **Figma Desktop App** and open any Design or FigJam file.
2. Go to **Menu → Plugins → Development → Import plugin from manifest...**
3. Select [`manifest.json`](./manifest.json) from this folder (`d:\vaishnav\figma\plugin\manifest.json`).
4. Run the plugin via **Plugins → Development → Bulk Website Screenshot**.

## Optional Local Server (for `localhost` or Unlimited Captures)

The plugin works out-of-the-box with zero setup using a multi-engine cloud fallback pipeline (**Microlink API → Google Lighthouse API → Thum.io**).

If you want to capture local development URLs (`http://localhost:...`) or use a local headless browser:

```bash
npm install puppeteer
npm start
```

Then select **Local Server (localhost:3456)** in the **Screenshot Engine** dropdown.
