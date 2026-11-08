#!/usr/bin/env bash
set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
: "${CAPTURE_URL:?Set CAPTURE_URL to the exact page URL to capture.}"
: "${CAPTURE_DIR:?Set CAPTURE_DIR to the evidence output directory.}"

run() { /usr/bin/time -p "$@"; }
run mkdir -p "$CAPTURE_DIR"

export PROJECT_DIR CAPTURE_URL CAPTURE_DIR
run node --input-type=module <<'NODE'
import { createRequire } from 'node:module';
import { join } from 'node:path';
const require = createRequire(join(process.env.HOME, '.local/share/omgithub-playwright/package.json'));
const { chromium } = require('playwright');
const url = process.env.CAPTURE_URL;
if (process.platform === 'linux' && !process.env.DISPLAY) {
  try {
    const { readFile } = await import('node:fs/promises');
    process.env.DISPLAY = ':' + (await readFile(join(process.env.HOME, '.local/share/omgithub-playwright/display'), 'utf8')).trim();
  } catch { /* Let browser launch classify missing display as infrastructure failure. */ }
}

let parsed;
try { parsed = new URL(url); } catch { console.error(`Invalid CAPTURE_URL: ${url}`); process.exit(1); }
if (!['http:', 'https:'].includes(parsed.protocol)) { console.error('CAPTURE_URL must use HTTP or HTTPS.'); process.exit(1); }
let browser;
let failureExit = 1;
try {
  try {
    browser = await chromium.launch({
      channel: 'chromium', headless: false,
      args: ['--enable-gpu', '--ignore-gpu-blocklist', '--enable-unsafe-webgpu', '--use-angle=vulkan', '--enable-features=Vulkan', '--use-vulkan=swiftshader', '--use-webgpu-adapter=swiftshader', '--disable-vulkan-surface']
    });
  } catch (error) {
    failureExit = 75;
    throw new Error(`Browser infrastructure failure: ${error.message}`);
  }
  for (const [name, width, height] of [['desktop', 1440, 900], ['mobile', 390, 844]]) {
    const page = await browser.newPage({ viewport: { width, height } });
    const pageErrors = [];
    page.on('pageerror', error => pageErrors.push(error.message));
    let response;
    try { response = await page.goto(url, { waitUntil: 'load', timeout: 45000 }); }
    catch (error) {
      failureExit = 75;
      throw new Error(`Navigation/browser infrastructure failure for ${url}: ${error.message}`);
    }
    if (!response || !response.ok()) {
      const status = response?.status();
      failureExit = !status || [408, 429, 500, 502, 503, 504].includes(status) ? 75 : 1;
      throw new Error(`Navigation returned HTTP ${status ?? 'no response'} for ${url}`);
    }
    try {
      await page.waitForFunction(() => {
        if (document.readyState !== 'complete' || !document.body) return false;
        const visible = element => {
          const box = element.getBoundingClientRect();
          const style = getComputedStyle(element);
          return box.width > 0 && box.height > 0 && style.display !== 'none' && style.visibility !== 'hidden';
        };
        return [...document.body.querySelectorAll('canvas, img, svg, video, main, header, section, article, [role="main"]')].some(visible) || (document.body.innerText || '').trim().length > 0;
      }, { timeout: 15000 });
      await page.waitForTimeout(1200);
    } catch (error) {
      throw new Error(`Rendering defect at ${url} (${name}): ${error.message}`);
    }
    const rendered = await page.evaluate(() => {
      const canvas = [...document.querySelectorAll('canvas')].some(c => c.width > 0 && c.height > 0 && c.getBoundingClientRect().width > 0 && c.getBoundingClientRect().height > 0);
      const text = (document.body?.innerText || '').trim().length > 0;
      const nonempty = document.body?.children.length > 0;
      return { canvas, text, nonempty };
    });
    if (!rendered.nonempty || (!rendered.text && !rendered.canvas)) throw new Error(`Rendering defect at ${url} (${name}): page has no rendered content.`);
    if (pageErrors.length) throw new Error(`Application rendering error (${name}): ${pageErrors.join('; ')}`);
    try { await page.screenshot({ path: join(process.env.CAPTURE_DIR, `final-${name}.png`), timeout: 30000 }); }
    catch (error) { failureExit = 75; throw new Error(`Browser screenshot infrastructure failure (${name}): ${error.message}`); }
    await page.close();
    console.log(`Captured ${name} at ${url}`);
  }
} catch (error) {
  console.error(error);
  process.exitCode = failureExit;
} finally {
  if (browser) await browser.close().catch(error => { console.error(`Could not close capture browser: ${error.message}`); process.exitCode ||= 75; });
}
NODE
