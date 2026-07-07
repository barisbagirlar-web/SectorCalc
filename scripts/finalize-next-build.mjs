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

function ensurePagesManifest() {
  const manifestPath = join(NEXT, "server/pages-manifest.json");
  if (existsSync(manifestPath)) {
    return;
  }
  mkdirSync(join(NEXT, "server"), { recursive: true });
  writeFileSync(
    manifestPath,
    JSON.stringify({ "/500": "pages/500.html" }),
    "utf8",
  );
}

function ensureAppPathsManifest() {
  const manifestPath = join(NEXT, "server/app-paths-manifest.json");
  if (existsSync(manifestPath)) {
    return;
  }
  mkdirSync(join(NEXT, "server"), { recursive: true });
  writeFileSync(
    manifestPath,
    JSON.stringify({}),
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
 * Create a patched server.js in the standalone directory that
 * uses distDir: ".." so Next.js finds chunks and pages at
 * .next/server/... (one level above standalone) instead of
 * the empty .next/standalone/.next/server/...
 * Create the file preemptively so the Firebase frameworks
 * integration does not overwrite it with the default distDir.
 */
function ensurePatchedServerJs() {
  const STANDALONE = join(NEXT, "standalone");
  const STANDALONE_NEXT = join(STANDALONE, ".next");
  mkdirSync(STANDALONE_NEXT, { recursive: true });

  // Copy .next/server content into standalone/.next/server so chunks
  // and pages are available if frameworks integration uses this path.
  const serverSrc = join(NEXT, "server");
  const serverDst = join(STANDALONE_NEXT, "server");
  if (existsSync(serverSrc)) {
    cpSync(serverSrc, serverDst, { recursive: true, force: true });
  }

  // Copy BUILD_ID
  const buildIdSrc = join(NEXT, "BUILD_ID");
  const buildIdDst = join(STANDALONE_NEXT, "BUILD_ID");
  if (existsSync(buildIdSrc)) {
    writeFileSync(buildIdDst, readFileSync(buildIdSrc, "utf8"), "utf8");
  }

  // Now create/fix server.js with distDir: ".."
  const SERVER_JS = join(STANDALONE, "server.js");
  if (!existsSync(SERVER_JS)) {
    // Read the real Next.js server template to extract distDir
    const buildId = readFileSync(buildIdSrc, "utf8").trim();
    // Build a complete server.js with minimal essential config and distDir: ".."
    writeFileSync(SERVER_JS, `const path = require('path')
const dir = path.join(__dirname)
process.env.NODE_ENV = 'production'
process.chdir(__dirname)
const currentPort = parseInt(process.env.PORT, 10) || 3000
const hostname = process.env.HOSTNAME || '0.0.0.0'
let keepAliveTimeout = parseInt(process.env.KEEP_ALIVE_TIMEOUT, 10)
const nextConfig = {"distDir":"..","output":"standalone","outputFileTracingRoot":${JSON.stringify(ROOT)}}
process.env.__NEXT_PRIVATE_STANDALONE_CONFIG = JSON.stringify(nextConfig)
require('next')
const { startServer } = require('next/dist/server/lib/start-server')
if (Number.isNaN(keepAliveTimeout) || !Number.isFinite(keepAliveTimeout) || keepAliveTimeout < 0) { keepAliveTimeout = undefined }
startServer({ dir, isDev: false, config: nextConfig, hostname, port: currentPort, allowRetry: false, keepAliveTimeout }).catch((err) => { console.error(err); process.exit(1); });
`);
    console.log("finalize-next-build: created standalone/server.js with distDir=..");
  } else {
    let content = readFileSync(SERVER_JS, "utf8");
    const patched = content.replace(/"distDir":"\.\/\.next"/g, '"distDir":".."');
    if (patched !== content) {
      writeFileSync(SERVER_JS, patched, "utf8");
      console.log("finalize-next-build: patched standalone/server.js (distDir → ..)");
    }
  }

  const standbyEntries = existsSync(STANDALONE_NEXT) ? readdirSync(STANDALONE_NEXT).length : 0;
  console.log(`finalize-next-build: standalone/.next has ${standbyEntries} entries`);
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
  ensurePagesManifest();
  ensureAppPathsManifest();
  ensureExportMarker();
  ensureExportDetail();
  ensureFirebasePagesManifest();
  ensureVendorChunks();
  ensurePatchedServerJs();

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

  // Copy PRO V5.3.1 schemas (Baris tools) into .next/server/
  const srcProV531 = join(ROOT, "src/sectorcalc/schemas/pro-v531");
  if (existsSync(srcProV531)) {
    mkdirSync(join(NEXT, "server/src/sectorcalc/schemas"), { recursive: true });
    cpSync(srcProV531, join(NEXT, "server/src/sectorcalc/schemas/pro-v531"), { recursive: true, force: true });
  }

  // Copy V5.3.1 engineering schemas into .next/server/
  const srcV531 = join(ROOT, "src/sectorcalc/schemas/v531");
  if (existsSync(srcV531)) {
    mkdirSync(join(NEXT, "server/src/sectorcalc/schemas"), { recursive: true });
    cpSync(srcV531, join(NEXT, "server/src/sectorcalc/schemas/v531"), { recursive: true, force: true });
  }

  const buildId = readFileSync(join(NEXT, "BUILD_ID"), "utf8").trim();
  console.log(`finalize-next-build: ready (BUILD_ID=${buildId})`);
}

main();
