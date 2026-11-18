/**
 * Zero-Dependency Local Whole-Screen Screenshot Server (http://localhost:3456)
 *
 * Uses your installed Google Chrome or Microsoft Edge browser via Chrome DevTools Protocol (CDP)
 * and Node.js v24 built-in WebSocket/fetch — NO `npm install` or API keys required!
 * Zero quota limits, 100% full-page whole-screen screenshots.
 */

const http = require("http");
const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");
const os = require("os");
const { URL } = require("url");

const ENV_FILE_PATH = path.resolve(__dirname, "..", ".env");

// Optional .env for server settings only (PORT, CDP_PORT, CHROME_PATH). No API keys needed.
try {
  if (fs.existsSync(ENV_FILE_PATH)) {
    for (const line of fs.readFileSync(ENV_FILE_PATH, "utf8").split(/\r?\n/)) {
      const t = line.trim();
      if (!t || t.startsWith("#")) continue;
      const i = t.indexOf("=");
      if (i === -1) continue;
      const key = t.slice(0, i).trim();
      let val = t.slice(i + 1).trim().replace(/^["']|["']$/g, "");
      if (val && !process.env[key]) process.env[key] = val;
    }
  }
} catch (_) {}

const PORT = Number(process.env.PORT) || 3456;
const CDP_PORT = Number(process.env.CDP_PORT) || 9333;

// Chrome/Chromium hard limit for a single captured texture. Anything taller is truncated.
const MAX_CAPTURE_HEIGHT = 16384;

const BROWSER_PATHS = [
  process.env.CHROME_PATH,
  // Windows
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
  // macOS
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
  // Linux
  "/usr/bin/google-chrome",
  "/usr/bin/google-chrome-stable",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser"
].filter(Boolean);

function findBrowserExecutable() {
  for (const p of BROWSER_PATHS) {
    if (fs.existsSync(p)) return p;
  }
  throw new Error(
    "Could not find Google Chrome or Microsoft Edge. Set the CHROME_PATH environment variable to your browser executable."
  );
}

let chromeProc = null;
let browserReadyPromise = null;

async function ensureChromeRunning() {
  if (browserReadyPromise) {
    try {
      const res = await fetch(`http://127.0.0.1:${CDP_PORT}/json/version`);
      if (res.ok) return;
    } catch (_) {
      browserReadyPromise = null;
    }
  }

  browserReadyPromise = (async () => {
    const exe = findBrowserExecutable();
    const userDataDir = path.join(os.tmpdir(), `figma_shot_chrome_${CDP_PORT}`);

    chromeProc = spawn(
      exe,
      [
        "--headless=new",
        `--remote-debugging-port=${CDP_PORT}`,
        "--remote-allow-origins=*",
        `--user-data-dir=${userDataDir}`,
        "--no-first-run",
        "--no-default-browser-check",
        "--disable-gpu",
        "--disable-dev-shm-usage",
        "--disable-background-timer-throttling",
        "--disable-backgrounding-occluded-windows",
        "--disable-renderer-backgrounding",
        "--hide-scrollbars",
        "--mute-audio",
        "--disable-blink-features=AutomationControlled",
        "--lang=en-US",
        ...(typeof process.getuid === "function" && process.getuid() === 0
          ? ["--no-sandbox"]
          : [])
      ],
      { stdio: "ignore", windowsHide: true }
    );

    chromeProc.on("exit", () => {
      browserReadyPromise = null;
    });

    // Wait for CDP endpoint to respond
    for (let i = 0; i < 40; i++) {
      try {
        const res = await fetch(`http://127.0.0.1:${CDP_PORT}/json/version`);
        if (res.ok) return;
      } catch (_) {}
      await new Promise((r) => setTimeout(r, 200));
    }
    throw new Error("Timed out waiting for headless Chrome DevTools Protocol.");
  })();

  return browserReadyPromise;
}

/**
 * Minimal CDP client over native WebSocket
 */
function connectCDP(wsUrl) {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(wsUrl);
    let nextId = 1;
    const pending = new Map();
    const listeners = new Map();

    const timer = setTimeout(() => {
      try {
        ws.close();
      } catch (_) {}
      reject(new Error("CDP WebSocket connect timeout"));
    }, 10000);

    ws.addEventListener("open", () => {
      clearTimeout(timer);
      resolve({
        send(method, params = {}) {
          return new Promise((res, rej) => {
            const id = nextId++;
            pending.set(id, { res, rej });
            ws.send(JSON.stringify({ id, method, params }));
          });
        },
        on(event, fn) {
          if (!listeners.has(event)) listeners.set(event, []);
          listeners.get(event).push(fn);
        },
        close() {
          try {
            ws.close();
          } catch (_) {}
        }
      });
    });

    ws.addEventListener("message", (ev) => {
      try {
        const msg = JSON.parse(typeof ev.data === "string" ? ev.data : ev.data.toString());
        if (msg.id && pending.has(msg.id)) {
          const { res, rej } = pending.get(msg.id);
          pending.delete(msg.id);
          if (msg.error) rej(new Error(msg.error.message || "CDP error"));
          else res(msg.result);
        } else if (msg.method && listeners.has(msg.method)) {
          for (const fn of listeners.get(msg.method)) {
            fn(msg.params);
          }
        }
      } catch (_) {}
    });

    ws.addEventListener("error", (err) => {
      clearTimeout(timer);
      for (const { rej } of pending.values()) {
        rej(new Error("CDP WebSocket error"));
      }
      pending.clear();
      reject(err);
    });
  });
}

/**
 * Capture a full-page or viewport PNG screenshot of a URL using Chrome CDP.
 */
async function captureWithChromeCDP(targetUrl, width, height, fullPage) {
  await ensureChromeRunning();

  // Create a new tab target
  const newTabRes = await fetch(`http://127.0.0.1:${CDP_PORT}/json/new?about:blank`, {
    method: "PUT"
  });
  if (!newTabRes.ok) {
    throw new Error(`Failed to open Chrome tab: HTTP ${newTabRes.status}`);
  }
  const tabInfo = await newTabRes.json();
  const cdp = await connectCDP(tabInfo.webSocketDebuggerUrl);

  try {
    await cdp.send("Page.enable");
    await cdp.send("Runtime.enable");
    // Make sure the tab is treated as visible/focused so lazy-loaders and observers fire
    await cdp.send("Page.bringToFront").catch(() => {});
    await cdp.send("Emulation.setFocusEmulationEnabled", { enabled: true }).catch(() => {});
    await cdp.send("Emulation.setDeviceMetricsOverride", {
      width,
      height,
      deviceScaleFactor: 1,
      mobile: width <= 500
    });

    // Headless Chrome advertises "HeadlessChrome" in its user agent, which makes many sites
    // (Cloudflare, OpenAI, GitHub...) serve a bot-check / blank page. Present as normal Chrome.
    try {
      const ver = await (await fetch(`http://127.0.0.1:${CDP_PORT}/json/version`)).json();
      const ua = String(ver["User-Agent"] || "").replace("HeadlessChrome", "Chrome");
      if (ua) {
        await cdp.send("Network.enable");
        await cdp.send("Network.setUserAgentOverride", {
          userAgent: ua,
          acceptLanguage: "en-US,en;q=0.9"
        });
      }
    } catch (_) {}

    // Track in-flight requests so we can wait for the page to actually finish rendering
    let inflight = 0;
    let lastNetActivity = Date.now();
    cdp.on("Network.requestWillBeSent", () => {
      inflight++;
      lastNetActivity = Date.now();
    });
    const done = () => {
      inflight = Math.max(0, inflight - 1);
      lastNetActivity = Date.now();
    };
    cdp.on("Network.loadingFinished", done);
    cdp.on("Network.loadingFailed", done);

    // Navigate and wait for load event (with timeout fallback)
    const loadPromise = new Promise((resolve) => {
      const t = setTimeout(resolve, 18000);
      cdp.on("Page.loadEventFired", () => {
        clearTimeout(t);
        setTimeout(resolve, 1000);
      });
    });

    await cdp.send("Page.navigate", { url: targetUrl });
    await loadPromise;

    // Wait for the network to go quiet (SPAs like openai.com / github.com render after "load"),
    // but never longer than ~10s so one slow tracker can't hang a capture.
    const idleDeadline = Date.now() + 10000;
    while (Date.now() < idleDeadline) {
      if (inflight <= 2 && Date.now() - lastNetActivity > 900) break;
      await new Promise((r) => setTimeout(r, 150));
    }
    // Let web fonts finish so text isn't blank/fallback in the shot
    await cdp.send("Runtime.evaluate", {
      awaitPromise: true,
      expression: "document.fonts && document.fonts.ready ? document.fonts.ready.then(() => true) : true"
    }).catch(() => {});

    let captureHeight = height;
    let pageHeight = height;
    let truncated = false;

    if (fullPage) {
      // 1) Scroll down in steps so lazy-loaded images / IntersectionObserver content renders.
      //    The page height is re-measured every step because it often grows while scrolling.
      await cdp.send("Runtime.evaluate", {
        awaitPromise: true,
        returnByValue: true,
        expression: `
          (async () => {
            const step = Math.max(250, Math.round(window.innerHeight * 0.5));
            const maxScroll = ${MAX_CAPTURE_HEIGHT};
            const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
            // Wait for a real rendered frame (observers / lazy-loaders run on frames), with a fallback
            const nextFrame = () =>
              Promise.race([
                new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))),
                sleep(400)
              ]);
            const docHeight = () => Math.max(
              document.body ? document.body.scrollHeight : 0,
              document.documentElement ? document.documentElement.scrollHeight : 0
            );

            let y = 0;
            let lastHeight = docHeight();
            let stable = 0;
            while (y < maxScroll) {
              window.scrollTo(0, y);
              await nextFrame();
              await sleep(160);
              const h = docHeight();
              if (h > lastHeight) { lastHeight = h; stable = 0; }
              y += step;
              if (y >= lastHeight) {
                // Reached the bottom: pause so late lazy content can extend the page, then re-check
                await sleep(500);
                const h2 = docHeight();
                if (h2 > lastHeight) { lastHeight = h2; stable = 0; continue; }
                if (++stable >= 1) break;
              }
            }
            window.scrollTo(0, 0);
            await nextFrame();
            await sleep(500);
            return docHeight();
          })()
        `
      });

      // 2) Lock any "100vh" / viewport-dependent elements to their true pixel height at the
      //    normal viewport BEFORE Page.captureScreenshot(captureBeyondViewport: true) runs.
      //    Why: Chromium internally resizes the layout viewport to the full document height
      //    during captureBeyondViewport, which causes 100vh hero sections (like Canva's hero
      //    gradient) to stretch to 6,000+ px tall.
      await cdp.send("Runtime.evaluate", {
        expression: `
          (() => {
            window.__vhBaseHeights = new WeakMap();
            const all = document.querySelectorAll("*");
            for (let i = 0; i < all.length; i++) {
              const el = all[i];
              const tag = el.tagName;
              if (tag === "HTML" || tag === "BODY" || tag === "SCRIPT" || tag === "STYLE") continue;
              window.__vhBaseHeights.set(el, Math.round(el.getBoundingClientRect().height));
            }
          })()
        `
      }).catch(() => {});

      // Probe with a taller viewport (+700px) to see which elements stretch with viewport height
      await cdp.send("Emulation.setDeviceMetricsOverride", {
        width,
        height: height + 700,
        deviceScaleFactor: 1,
        mobile: width <= 500
      }).catch(() => {});

      // Walk the DOM bottom-up (deepest children first): any element whose height grew when the
      // viewport height increased is using vh/dvh/svh or fixed viewport sizing — lock it to its
      // original pixel height so its parent containers also return to their true height.
      await cdp.send("Runtime.evaluate", {
        expression: `
          (() => {
            if (!window.__vhBaseHeights) return;
            const all = Array.from(document.querySelectorAll("*")).reverse();
            for (const el of all) {
              const tag = el.tagName;
              if (tag === "HTML" || tag === "BODY" || tag === "SCRIPT" || tag === "STYLE") continue;
              const origH = window.__vhBaseHeights.get(el);
              if (typeof origH !== "number" || origH <= 0) continue;
              const newH = Math.round(el.getBoundingClientRect().height);
              if (newH - origH > 40) {
                el.style.setProperty("height", origH + "px", "important");
                el.style.setProperty("min-height", origH + "px", "important");
                el.style.setProperty("max-height", origH + "px", "important");
                const cs = window.getComputedStyle(el);
                if (cs.position === "fixed" || cs.position === "sticky") {
                  el.style.setProperty("bottom", "auto", "important");
                }
              }
            }
            document.documentElement.style.setProperty("height", "auto", "important");
            if (document.body) {
              document.body.style.setProperty("height", "auto", "important");
            }
          })()
        `
      }).catch(() => {});

      // Restore original viewport and measure true document height
      await cdp.send("Emulation.setDeviceMetricsOverride", {
        width,
        height,
        deviceScaleFactor: 1,
        mobile: width <= 500
      }).catch(() => {});

      const measuredDocHeight = await cdp.send("Runtime.evaluate", {
        returnByValue: true,
        expression: `Math.max(
          document.body ? document.body.scrollHeight : 0,
          document.documentElement ? document.documentElement.scrollHeight : 0,
          document.body ? document.body.offsetHeight : 0,
          document.documentElement ? document.documentElement.offsetHeight : 0
        )`
      }).catch(() => null);

      const metrics = await cdp.send("Page.getLayoutMetrics");
      const cssContent =
        (metrics && (metrics.cssContentSize || metrics.contentSize)) || null;
      const domH =
        measuredDocHeight &&
        measuredDocHeight.result &&
        typeof measuredDocHeight.result.value === "number"
          ? Math.ceil(measuredDocHeight.result.value)
          : 0;
      pageHeight = Math.max(
        height,
        domH || (cssContent ? Math.ceil(cssContent.height) : height)
      );

      if (pageHeight > MAX_CAPTURE_HEIGHT) {
        pageHeight = MAX_CAPTURE_HEIGHT;
        truncated = true;
      }
      captureHeight = Math.max(height, pageHeight);
    }

    const shot = await cdp.send("Page.captureScreenshot", {
      format: "png",
      captureBeyondViewport: true,
      fromSurface: true,
      clip: {
        x: 0,
        y: 0,
        width,
        height: captureHeight,
        scale: 1
      }
    });

    if (!shot || !shot.data) {
      throw new Error("Chrome returned empty screenshot data");
    }

    return {
      buffer: Buffer.from(shot.data, "base64"),
      pageHeight: captureHeight,
      truncated
    };
  } finally {
    cdp.close();
    fetch(`http://127.0.0.1:${CDP_PORT}/json/close/${tabInfo.id}`).catch(() => {});
  }
}

const server = http.createServer(async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  const parsedUrl = new URL(req.url, `http://localhost:${PORT}`);

  if (parsedUrl.pathname === "/" || parsedUrl.pathname === "/ui") {
    try {
      const html = fs.readFileSync(path.resolve(__dirname, "..", "plugin", "ui.html"));
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(html);
    } catch (err) {
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("Could not read plugin/ui.html");
    }
    return;
  }

  if (parsedUrl.pathname === "/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ status: "ok", port: PORT, engine: "Chrome CDP" }));
    return;
  }

  if (parsedUrl.pathname === "/screenshot") {
    const targetUrl = parsedUrl.searchParams.get("url");
    const width = Math.min(
      3840,
      Math.max(320, Number(parsedUrl.searchParams.get("width")) || 1440)
    );
    const height = Math.min(
      2160,
      Math.max(320, Number(parsedUrl.searchParams.get("height")) || 900)
    );
    const fullPage = parsedUrl.searchParams.get("fullPage") !== "false";

    if (!targetUrl) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Missing ?url= parameter" }));
      return;
    }

    try {
      const { buffer, pageHeight, truncated } = await captureWithChromeCDP(
        targetUrl,
        width,
        height,
        fullPage
      );
      res.writeHead(200, {
        "Content-Type": "image/png",
        "Content-Length": buffer.length,
        "X-Page-Height": String(pageHeight),
        "X-Page-Truncated": String(truncated),
        "Access-Control-Expose-Headers": "X-Page-Height, X-Page-Truncated"
      });
      res.end(buffer);
    } catch (err) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: err.message || String(err) }));
    }
    return;
  }

  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: "Not found" }));
});

server.listen(PORT, () => {
  console.log(
    `🚀 Local Chrome Whole-Screen Screenshot Server running at http://localhost:${PORT}`
  );
});
