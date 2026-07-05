#!/usr/bin/env node
/**
 * Post-build artifacts required by Firebase Hosting (web frameworks) + static 500 fallback.
 */
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync, cpSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const NEXT = join(ROOT, ".next");

const FALLBACK_500 =
  '<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"/><title>500</title></head><body><h1>500 — Server error</h1></body></html>\n';

function ensure500StaticFiles() {
  const exportDir = join(NEXT, "export");
  const serverPagesDir = join(NEXT, "server/pages");
  mkdirSync(exportDir, { recursive: true });
  mkdirSync(serverPagesDir, { recursive: true });

  for (const target of [
    join(exportDir, "500.html"),
    join(serverPagesDir, "500.html"),
  ]) {
    if (!existsSync(target)) {
      writeFileSync(target, FALLBACK_500, "utf8");
    }
  }
}

function ensureMiddlewareManifest() {
  const manifestPath = join(NEXT, "server/middleware-manifest.json");
  if (existsSync(manifestPath)) {
    return;
  }
  mkdirSync(join(NEXT, "server"), { recursive: true });
  writeFileSync(
    manifestPath,
    JSON.stringify({ sortedMiddleware: [], middleware: {}, functions: {}, version: 2 }),
    "utf8",
  );
}

function ensureExportMarker() {
  const markerPath = join(NEXT, "export-marker.json");
  if (existsSync(markerPath)) {
    return;
  }

  writeFileSync(
    markerPath,
    JSON.stringify({
      version: 1,
      hasExportPathMap: false,
      exportTrailingSlash: false,
      isNextImageImported: false,
    }),
    "utf8",
  );
}

function ensureExportDetail() {
  const detailPath = join(NEXT, "export-detail.json");
  if (existsSync(detailPath)) {
    return;
  }

  writeFileSync(
    detailPath,
    JSON.stringify({ version: 1, outDirectory: NEXT, success: true }),
    "utf8",
  );
}

/**
 * Stub missing .nft.json trace files for any server JS modules.
 * Without these, standalone trace collection crashes with ENOENT during
 * Firebase Hosting deploy for stub modules and some edge/API routes.
 */
function stubMissingNftTraces(dir) {
  if (!existsSync(dir)) return;
  const entries = readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      stubMissingNftTraces(fullPath);
    } else if (entry.name.endsWith(".js")) {
      const nftPath = fullPath + ".nft.json";
      if (!existsSync(nftPath)) {
        writeFileSync(nftPath, JSON.stringify({ version: 1, files: [] }), "utf8");
      }
    }
  }
}

function ensureFirebasePagesManifest() {
  const serverPagesDir = join(NEXT, "server/pages");
  mkdirSync(serverPagesDir, { recursive: true });
  const appCode = 'const React = require("react");\n' +
    'function App({ Component, pageProps }) {\n' +
    '  return React.createElement(Component, pageProps);\n' +
    '}\n' +
    'module.exports = App;\n' +
    'module.exports.default = App;\n';

  const docCode = 'const React = require("react");\n' +
    'const { Html, Head, Main, NextScript } = require("next/document");\n' +
    'function Document() {\n' +
    '  return React.createElement(Html, { lang: "en" },\n' +
    '    React.createElement(Head),\n' +
    '    React.createElement("body", null,\n' +
    '      React.createElement(Main),\n' +
    '      React.createElement(NextScript)\n' +
    '    )\n' +
    '  );\n' +
    '}\n' +
    'module.exports = Document;\n' +
    'module.exports.default = Document;\n';

  writeFileSync(join(serverPagesDir, "_document.js"), docCode, "utf8");
  writeFileSync(join(serverPagesDir, "_app.js"), appCode, "utf8");

  const manifestPath = join(NEXT, "server/pages-manifest.json");
  let manifest = {};
  if (existsSync(manifestPath)) {
    try { manifest = JSON.parse(readFileSync(manifestPath, "utf8")); } catch {}
  }
  manifest["/_document"] = "pages/_document.js";
  manifest["/_app"] = "pages/_app.js";
  writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), "utf8");
}

/**
 * Fireproof vendor-chunks against Firebase deploy stripping.
 * Next.js vendor-chunks are lazy-loaded by webpack-runtime.js and
 * may be stripped during Cloud Function packaging. Write module.exports = {}
 * stubs so SSR does not crash with MODULE_NOT_FOUND.
 */
function ensureVendorChunks() {
  const vendorDir = join(NEXT, "server", "vendor-chunks");
  mkdirSync(vendorDir, { recursive: true });

  const stubs = ["@opentelemetry.js"];
  for (const file of stubs) {
    const target = join(vendorDir, file);
    writeFileSync(target, "module.exports = {};\n", "utf8");
    console.log("finalize-next-build: fireproofed vendor-chunks/" + file);
  }
}

function main() {
  if (!existsSync(join(NEXT, "BUILD_ID"))) {
    console.error("finalize-next-build: BUILD_ID missing — run next build first.");
    process.exit(1);
  }

  ensure500StaticFiles();
  ensureMiddlewareManifest();
  ensureExportMarker();
  ensureExportDetail();
  ensureFirebasePagesManifest();
  ensureVendorChunks();

  // Stub any .js files missing .nft.json traces in server/ (stubs, edge, API routes)
  stubMissingNftTraces(join(NEXT, "server"));

  // Copy generated schemas into .next/server so all deployment targets (Firebase SSR, local serve, ISR)
  // can read them at runtime without relying on files outside .next/
  const ROOT = process.cwd();
  const srcSchemas = join(ROOT, "generated", "schemas");
  const dstSchemas = join(NEXT, "server", "generated", "schemas");
  if (existsSync(srcSchemas)) {
    cpSync(srcSchemas, dstSchemas, { recursive: true, force: true });
  }

  const buildId = readFileSync(join(NEXT, "BUILD_ID"), "utf8").trim();
  console.log(`finalize-next-build: ready (BUILD_ID=${buildId})`);
}

main();
