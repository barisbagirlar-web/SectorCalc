#!/usr/bin/env node
/**
 * Post-build artifacts required by Firebase Hosting (web frameworks) + static 500 fallback.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
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

function main() {
  if (!existsSync(join(NEXT, "BUILD_ID"))) {
    console.error("finalize-next-build: BUILD_ID missing — run next build first.");
    process.exit(1);
  }

  ensure500StaticFiles();

  // Firebase Hosting expects export markers; Vercel App Router must stay serverless.
  // Fake export markers on Vercel trigger `next export` routing and www NOT_FOUND.
  if (process.env.VERCEL !== "1") {
    ensureExportMarker();
    ensureExportDetail();
  }

  const buildId = readFileSync(join(NEXT, "BUILD_ID"), "utf8").trim();
  console.log(`finalize-next-build: ready (BUILD_ID=${buildId})`);
}

main();
