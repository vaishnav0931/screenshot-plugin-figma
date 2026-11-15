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

## Google Lighthouse API (recommended)

The plugin uses Google's **PageSpeed Insights API** (which runs Lighthouse) as the primary engine. It returns a
true full-page screenshot **plus Lighthouse scores** (Performance, Accessibility, Best Practices, SEO), which are
shown in the progress list and in the Figma browser-header badge (also stored on each frame as plugin data).

Google's shared anonymous quota is almost always exhausted, so add a free API key:

1. Go to <https://console.cloud.google.com/> and create/select a project.
2. **APIs & Services → Library →** enable **PageSpeed Insights API**.
3. **APIs & Services → Credentials → Create credentials → API key.**
4. Paste the key into the plugin's **Google Lighthouse API Key** field (it is saved in Figma and re-loaded next time).

Notes: Lighthouse can only reach **public** URLs (not `localhost`), and the image it returns is capped at ~16,000 px tall.

## Engine order (Auto mode)

1. **Google Lighthouse API** — full page + scores
2. **Local Chrome server** — full page, unlimited (see below; skipped quickly if not running)
3. **Microlink** — full page, free daily limit
4. **Thum.io** — last resort. Its free tier only returns the **top ~1200 px**, so such results are flagged
   with a "top only" warning instead of being passed off as the whole page.

If Lighthouse returns only a small viewport thumbnail (no full-page image), it is **rejected** and the next engine is used.

## Local Server — guaranteed whole-page screenshots (recommended)

The cloud engines are limited (free Thum.io only returns the top ~1200 px, Microlink/Google have quotas). The **local
Chrome server** uses your own Chrome/Edge and always captures the entire page: it scrolls to trigger lazy-loaded
content, waits for the network to go idle, and presents itself as a normal browser so sites don't serve bot-check
or blank pages.

1. Install **Node.js 22+** (<https://nodejs.org/>) and have Chrome or Edge installed.
2. **Windows:** double-click `start-server.bat`  ·  **macOS:** double-click `start-server.command`  ·  or run `node server.js`
3. Keep that window open. The plugin shows **● Local Chrome server running** under *Screenshot Engine*, and Auto mode uses it automatically.

Set `CHROME_PATH` if your browser is installed somewhere unusual. Pages taller than 16,384 px are truncated (Chrome limit).
Sites behind a login or a hard bot-wall (e.g. Cloudflare challenges) can still return the challenge page.
