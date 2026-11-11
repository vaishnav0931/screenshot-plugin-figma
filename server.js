/**
 * Optional Local Companion Screenshot Server (http://localhost:3456)
 *
 * The Figma plugin works out-of-the-box using cloud APIs (Microlink, Google Lighthouse, Thum.io).
 * Run this server (`node server.js`) only if you want to screenshot `localhost` URLs
 * or use a local headless browser with full-page auto-scrolling and zero rate limits.
 */

const http = require("http");
const { URL } = require("url");

const PORT = process.env.PORT || 3456;

let browserInstance = null;

async function getBrowser() {
  if (browserInstance) return browserInstance;
  try {
    const puppeteer = require("puppeteer");
    browserInstance = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });
    return browserInstance;
  } catch (err) {
    throw new Error(
      "Puppeteer is not installed. Run `npm install puppeteer` to use the local companion server."
    );
  }
}

/**
 * Scroll down the entire page to trigger lazy-loaded images and animations
 * before taking a whole-screen (full-page) screenshot.
 */
async function autoScrollFullPage(page) {
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let totalHeight = 0;
      const distance = 600;
      const maxScrollHeight = 25000;
      const timer = setInterval(() => {
        const scrollHeight = document.body ? document.body.scrollHeight : 0;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight || totalHeight >= maxScrollHeight) {
          clearInterval(timer);
          window.scrollTo(0, 0);
          setTimeout(resolve, 400);
        }
      }, 100);
    });
  });
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

  if (parsedUrl.pathname === "/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ status: "ok", port: PORT }));
    return;
  }

  if (parsedUrl.pathname === "/screenshot") {
    const targetUrl = parsedUrl.searchParams.get("url");
    const width = Math.min(3840, Math.max(320, Number(parsedUrl.searchParams.get("width")) || 1440));
    const height = Math.min(2160, Math.max(320, Number(parsedUrl.searchParams.get("height")) || 900));
    const fullPage = parsedUrl.searchParams.get("fullPage") !== "false";

    if (!targetUrl) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Missing ?url= parameter" }));
      return;
    }

    let page = null;
    try {
      const browser = await getBrowser();
      page = await browser.newPage();
      await page.setViewport({ width, height, deviceScaleFactor: 1 });
      await page.goto(targetUrl, { waitUntil: "networkidle2", timeout: 35000 });

      if (fullPage) {
        await autoScrollFullPage(page);
      }

      const buffer = await page.screenshot({ type: "png", fullPage });

      res.writeHead(200, {
        "Content-Type": "image/png",
        "Content-Length": buffer.length
      });
      res.end(buffer);
    } catch (err) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: err.message || String(err) }));
    } finally {
      if (page) {
        await page.close().catch(() => {});
      }
    }
    return;
  }

  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: "Not found" }));
});

server.listen(PORT, () => {
  console.log(`🚀 Local Whole-Screen Screenshot Server running at http://localhost:${PORT}`);
});
