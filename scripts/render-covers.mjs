#!/usr/bin/env node
// Renders each <section class="canvas" id="cN"> in an HTML file to a PNG at 2x scale
// (1200x900 CSS px -> 2400x1800 px, Etsy/Payhip-ready).
// Usage: node scripts/render-covers.mjs marketing/pound-planner/covers.html out/pound-planner
import { mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright");

const [src = "marketing/pound-planner/covers.html", outDir = "out/pound-planner"] = process.argv.slice(2);
mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 900 }, deviceScaleFactor: 2 });
await page.goto(pathToFileURL(resolve(src)).href);
await page.evaluate(() => document.fonts.ready);
const ids = await page.$$eval("section.canvas", (els) => els.map((e) => e.id));
for (const [i, id] of ids.entries()) {
  const file = `${outDir}/${String(i + 1).padStart(2, "0")}-${id}.png`;
  await page.locator(`#${id}`).screenshot({ path: file });
  console.log("wrote", file);
}
await browser.close();
