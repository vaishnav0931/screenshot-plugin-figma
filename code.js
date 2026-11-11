// Bulk Website Screenshot — Figma Plugin Controller (code.js)
// Runs inside the Figma plugin sandbox.

figma.showUI(__html__, {
  width: 680,
  height: 780,
  themeColors: true,
  title: "Bulk Website Screenshot (Whole Screen)"
});

// Store batches and created nodes in memory for instant lookup and dynamic grid reflow
const batches = new Map();
const createdNodesById = new Map();

let fontsLoaded = false;

async function ensureFontsLoaded() {
  if (fontsLoaded) return;
  try {
    await Promise.all([
      figma.loadFontAsync({ family: "Inter", style: "Regular" }),
      figma.loadFontAsync({ family: "Inter", style: "Medium" }),
      figma.loadFontAsync({ family: "Inter", style: "Semi Bold" })
    ]);
    fontsLoaded = true;
    // Send saved Google Lighthouse API key (if any) to UI on startup
    figma.clientStorage
      .getAsync("google_lighthouse_api_key")
      .then((savedKey) => {
        if (savedKey) {
          figma.ui.postMessage({
            type: "LOAD_API_KEY",
            apiKey: savedKey
          });
        }
      })
      .catch(() => {});
  } catch (err) {
    try {
      await figma.loadFontAsync({ family: "Inter", style: "Regular" });
      await figma.loadFontAsync({ family: "Inter", style: "Bold" });
      fontsLoaded = true;
    } catch (e) {
      console.warn("Could not load Inter font:", e);
    }
  }
}

// Load saved API key on startup
figma.clientStorage
  .getAsync("google_lighthouse_api_key")
  .then((savedKey) => {
    if (savedKey) {
      figma.ui.postMessage({
        type: "LOAD_API_KEY",
        apiKey: savedKey
      });
    }
  })
  .catch(() => {});

/**
 * Find a clean starting (x, y) position on the current page so new screenshot
 * batches don't overlap existing frames on the canvas.
 */
function findCleanCanvasOrigin() {
  const existing = figma.currentPage.children;
  if (!existing || existing.length === 0) {
    const center = figma.viewport.center;
    return { x: Math.round(center.x - 1200), y: Math.round(center.y - 600) };
  }

  let maxRight = -Infinity;
  let minTop = Infinity;

  for (const node of existing) {
    if ("x" in node && "width" in node) {
      const right = node.x + node.width;
      if (right > maxRight) maxRight = right;
      if (node.y < minTop) minTop = node.y;
    }
  }

  if (maxRight === -Infinity) {
    const center = figma.viewport.center;
    return { x: Math.round(center.x), y: Math.round(center.y) };
  }

  return {
    x: Math.round(maxRight + 240),
    y: Math.round(minTop === Infinity ? 0 : minTop)
  };
}

/**
 * Re-layout all frames in a batch into an aligned grid based on their URL index.
 * Handles variable frame heights (full-page whole-screen captures) so rows never overlap.
 */
function relayoutBatch(batch) {
  const { columns, gapX, gapY, originX, originY, items, total } = batch;
  const maxIndex = Math.max(total - 1, ...Array.from(items.keys()), 0);
  const totalRows = Math.ceil((maxIndex + 1) / columns);

  const colWidths = new Array(columns).fill(batch.defaultWidth || 1440);
  const rowHeights = new Array(totalRows).fill(batch.defaultHeight || 900);

  for (const [idx, node] of items.entries()) {
    if (!node || node.removed) continue;
    const col = idx % columns;
    const row = Math.floor(idx / columns);
    if (node.width > colWidths[col]) colWidths[col] = node.width;
    if (node.height > rowHeights[row]) rowHeights[row] = node.height;
  }

  const colOffsets = [0];
  for (let c = 1; c < columns; c++) {
    colOffsets[c] = colOffsets[c - 1] + colWidths[c - 1] + gapX;
  }

  const rowOffsets = [0];
  for (let r = 1; r < totalRows; r++) {
    rowOffsets[r] = rowOffsets[r - 1] + rowHeights[r - 1] + gapY;
  }

  for (const [idx, node] of items.entries()) {
    if (!node || node.removed) continue;
    const col = idx % columns;
    const row = Math.floor(idx / columns);
    node.x = Math.round(originX + colOffsets[col]);
    node.y = Math.round(originY + rowOffsets[row]);
  }
}

/**
 * Create a styled browser header bar inside the screenshot frame.
 */
async function createBrowserHeader(width, url, index, deviceLabel) {
  await ensureFontsLoaded();

  const headerHeight = 48;
  const header = figma.createFrame();
  header.name = "Browser Header";
  header.resize(width, headerHeight);
  header.x = 0;
  header.y = 0;
  header.fills = [
    {
      type: "SOLID",
      color: { r: 0.965, g: 0.969, b: 0.976 }
    }
  ];

  const dotColors = [
    { r: 1.0, g: 0.373, b: 0.341 },
    { r: 0.996, g: 0.737, b: 0.18 },
    { r: 0.157, g: 0.784, b: 0.251 }
  ];

  dotColors.forEach((color, i) => {
    const dot = figma.createEllipse();
    dot.name = `Dot ${i + 1}`;
    dot.resize(12, 12);
    dot.x = 18 + i * 20;
    dot.y = Math.round((headerHeight - 12) / 2);
    dot.fills = [{ type: "SOLID", color }];
    header.appendChild(dot);
  });

  const pillX = 92;
  const pillWidth = Math.max(160, width - pillX - 160);
  const pillHeight = 30;
  const pill = figma.createFrame();
  pill.name = "Address Bar";
  pill.resize(pillWidth, pillHeight);
  pill.x = pillX;
  pill.y = Math.round((headerHeight - pillHeight) / 2);
  pill.cornerRadius = 6;
  pill.clipsContent = true;
  pill.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 } }];
  pill.strokes = [{ type: "SOLID", color: { r: 0.88, g: 0.89, b: 0.92 } }];
  pill.strokeWeight = 1;

  if (fontsLoaded) {
    const urlText = figma.createText();
    urlText.fontName = { family: "Inter", style: "Regular" };
    urlText.fontSize = 12;
    urlText.characters = `${url}`;
    urlText.fills = [{ type: "SOLID", color: { r: 0.2, g: 0.23, b: 0.28 } }];
    urlText.x = 12;
    urlText.y = Math.round((pillHeight - 15) / 2);

    try {
      urlText.hyperlink = { type: "URL", value: url };
    } catch (_) {}

    pill.appendChild(urlText);
  }
  header.appendChild(pill);

  if (fontsLoaded && width >= 420) {
    const badgeText = figma.createText();
    badgeText.fontName = { family: "Inter", style: "Medium" };
    badgeText.fontSize = 11;
    badgeText.characters = `#${index + 1} • ${deviceLabel || `${width}px`}`;
    badgeText.fills = [{ type: "SOLID", color: { r: 0.45, g: 0.48, b: 0.54 } }];
    badgeText.x = Math.max(pillX + pillWidth + 12, width - badgeText.width - 16);
    badgeText.y = Math.round((headerHeight - 14) / 2);
    header.appendChild(badgeText);
  }

  return header;
}

/**
 * Place a captured screenshot (composed of 1 or more vertical PNG tiles) onto the Figma canvas.
 * Preserves the exact full height of the whole website screen without clipping.
 */
async function placeScreenshotOnCanvas(msg) {
  const {
    batchId,
    index,
    total,
    url,
    hostname,
    width,
    height,
    tiles,
    options = {}
  } = msg;

  let batch = batches.get(batchId);
  if (!batch) {
    const origin = findCleanCanvasOrigin();
    batch = {
      batchId,
      originX: origin.x,
      originY: origin.y,
      columns: options.columns || 5,
      gapX: options.gapX || 120,
      gapY: options.gapY || 160,
      defaultWidth: width || 1440,
      defaultHeight: height || 900,
      total: total || 10,
      items: new Map()
    };
    batches.set(batchId, batch);
  }

  const includeHeader = options.includeHeader !== false;
  const headerOffset = includeHeader ? 48 : 0;

  // Compute exact total height from all vertical tiles so the whole screen is shown
  let computedTilesHeight = 0;
  let maxTileWidth = width || 1440;
  if (Array.isArray(tiles) && tiles.length > 0) {
    for (const tile of tiles) {
      const bottom = Math.round((tile.yOffset || 0) + (tile.height || 0));
      if (bottom > computedTilesHeight) computedTilesHeight = bottom;
      if (tile.width && tile.width > maxTileWidth) maxTileWidth = tile.width;
    }
  }

  const actualImageHeight = Math.max(computedTilesHeight, Math.round(height || 900));
  const frameWidth = Math.max(100, Math.round(maxTileWidth));
  const frameHeight = Math.max(100, actualImageHeight + headerOffset);

  let containerNode;

  if (typeof figma.createFrame === "function") {
    const frame = figma.createFrame();
    frame.name = `${String(index + 1).padStart(2, "0")} — ${hostname || url} (${frameWidth}×${actualImageHeight})`;
    frame.resize(frameWidth, frameHeight);
    frame.clipsContent = true;
    frame.cornerRadius = includeHeader ? 12 : 8;
    frame.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 } }];
    frame.strokes = [{ type: "SOLID", color: { r: 0.86, g: 0.88, b: 0.91 } }];
    frame.strokeWeight = 1;
    frame.effects = [
      {
        type: "DROP_SHADOW",
        color: { r: 0.06, g: 0.09, b: 0.16, a: 0.12 },
        offset: { x: 0, y: 12 },
        radius: 32,
        spread: -4,
        visible: true,
        blendMode: "NORMAL"
      }
    ];

    if (includeHeader) {
      const scoreSuffix =
        typeof msg.lighthouseScore === "number"
          ? ` • ⚡ ${msg.lighthouseScore}`
          : "";
      const header = await createBrowserHeader(
        frameWidth,
        url,
        index,
        `${frameWidth}×${actualImageHeight}${scoreSuffix}`
      );
      frame.appendChild(header);
    }

    // Place each vertical image tile seamlessly inside the frame
    let runningY = 0;
    for (let t = 0; t < tiles.length; t++) {
      const tile = tiles[t];
      const uint8 =
        tile.bytes instanceof Uint8Array
          ? tile.bytes
          : new Uint8Array(tile.bytes);
      const image = figma.createImage(uint8);

      const tileW = Math.round(tile.width || frameWidth);
      const tileH = Math.round(tile.height);
      const tileY = typeof tile.yOffset === "number" ? Math.round(tile.yOffset) : runningY;

      const rect = figma.createRectangle();
      rect.name =
        tiles.length > 1
          ? `Full Screen Part ${t + 1}/${tiles.length}`
          : "Full Website Screenshot";
      rect.resize(tileW, tileH);
      rect.x = 0;
      rect.y = headerOffset + tileY;
      rect.fills = [
        {
          type: "IMAGE",
          imageHash: image.hash,
          scaleMode: "FILL"
        }
      ];
      frame.appendChild(rect);
      runningY = tileY + tileH;
    }

    // Ensure the outer frame height matches the full stacked tiles height
    if (headerOffset + runningY > frame.height) {
      frame.resize(frameWidth, headerOffset + runningY);
    }

    containerNode = frame;
  } else {
    const firstTile = tiles[0];
    const uint8 =
      firstTile.bytes instanceof Uint8Array
        ? firstTile.bytes
        : new Uint8Array(firstTile.bytes);
    const image = figma.createImage(uint8);
    const rect = figma.createRectangle();
    rect.name = `${String(index + 1).padStart(2, "0")} — ${hostname || url}`;
    rect.resize(frameWidth, Math.round(firstTile.height));
    rect.fills = [
      {
        type: "IMAGE",
        imageHash: image.hash,
        scaleMode: "FILL"
      }
    ];
    containerNode = rect;
  }

  const prevNode = batch.items.get(index);
  if (prevNode && !prevNode.removed) {
    try {
      prevNode.remove();
    } catch (_) {}
  }

  figma.currentPage.appendChild(containerNode);
  batch.items.set(index, containerNode);
  createdNodesById.set(containerNode.id, containerNode);

  // Reflow the batch grid so every full-page screenshot has plenty of vertical space
  relayoutBatch(batch);

  // Zoom to show all placed screenshots so far
  const allPlacedSoFar = Array.from(batch.items.values()).filter(
    (n) => n && !n.removed
  );
  if (allPlacedSoFar.length > 0) {
    figma.viewport.scrollAndZoomIntoView(allPlacedSoFar);
  }

  return containerNode;
}

figma.ui.onmessage = async (msg) => {
  if (!msg || !msg.type) return;

  try {
    switch (msg.type) {
      case "RESIZE_UI": {
        const w = Math.max(480, Number(msg.width) || 680);
        const h = Math.max(500, Number(msg.height) || 780);
        figma.ui.resize(w, h);
        break;
      }

      case "SAVE_API_KEY": {
        await figma.clientStorage.setAsync(
          "google_lighthouse_api_key",
          String(msg.apiKey || "").trim()
        );
        break;
      }

      case "START_BATCH": {
        const origin = findCleanCanvasOrigin();
        const { batchId, total, options = {} } = msg;
        batches.set(batchId, {
          batchId,
          originX: origin.x,
          originY: origin.y,
          columns: Number(options.columns) || 5,
          gapX: Number(options.gapX) || 120,
          gapY: Number(options.gapY) || 160,
          defaultWidth: Number(options.width) || 1440,
          defaultHeight: Number(options.height) || 900,
          total: Number(total) || 10,
          items: new Map()
        });
        figma.notify(
          `🚀 Capturing whole-screen screenshots for ${total} website${
            total === 1 ? "" : "s"
          }...`
        );
        break;
      }

      case "PLACE_SCREENSHOT": {
        const node = await placeScreenshotOnCanvas(msg);
        figma.ui.postMessage({
          type: "SCREENSHOT_PLACED",
          batchId: msg.batchId,
          index: msg.index,
          nodeId: node.id,
          url: msg.url
        });
        break;
      }

      case "FINISH_BATCH": {
        const batch = batches.get(msg.batchId);
        if (batch && batch.items.size > 0) {
          relayoutBatch(batch);
          const placedNodes = Array.from(batch.items.values()).filter(
            (n) => n && !n.removed
          );
          if (placedNodes.length > 0) {
            figma.currentPage.selection = placedNodes;
            figma.viewport.scrollAndZoomIntoView(placedNodes);
            figma.notify(
              `✅ Placed ${placedNodes.length} full-screen website screenshot${
                placedNodes.length === 1 ? "" : "s"
              } on the canvas!`
            );
          }
        }
        break;
      }

      case "ZOOM_ALL": {
        const batch = batches.get(msg.batchId);
        if (batch && batch.items.size > 0) {
          const placedNodes = Array.from(batch.items.values()).filter(
            (n) => n && !n.removed
          );
          if (placedNodes.length > 0) {
            figma.currentPage.selection = placedNodes;
            figma.viewport.scrollAndZoomIntoView(placedNodes);
          }
        }
        break;
      }

      case "FOCUS_NODE": {
        const node = createdNodesById.get(msg.nodeId);
        if (node && !node.removed) {
          figma.currentPage.selection = [node];
          figma.viewport.scrollAndZoomIntoView([node]);
        }
        break;
      }

      case "NOTIFY": {
        if (msg.message) {
          figma.notify(msg.message, { error: Boolean(msg.error) });
        }
        break;
      }

      case "CLOSE_PLUGIN": {
        figma.closePlugin();
        break;
      }
    }
  } catch (err) {
    console.error("Plugin error:", err);
    figma.ui.postMessage({
      type: "PLACEMENT_ERROR",
      batchId: msg.batchId,
      index: msg.index,
      error: err && err.message ? err.message : String(err)
    });
  }
};
