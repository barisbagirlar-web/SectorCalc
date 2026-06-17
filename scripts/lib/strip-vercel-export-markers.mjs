#!/usr/bin/env node
/**
 * Vercel App Router must not ship export-marker.json — cached Firebase stubs cause www NOT_FOUND.
 */
import { existsSync, rmSync } from "node:fs";
import { join } from "node:path";

/** @param {string} [nextDir] */
export function stripVercelExportMarkers(nextDir = join(process.cwd(), ".next")) {
  if (process.env.VERCEL !== "1") {
    return { removed: [] };
  }

  const removed = [];
  for (const rel of ["export-marker.json", "export-detail.json"]) {
    const abs = join(nextDir, rel);
    if (existsSync(abs)) {
      rmSync(abs, { force: true });
      removed.push(rel);
    }
  }

  if (removed.length > 0) {
    console.warn(`strip-vercel-export-markers: removed ${removed.join(", ")}`);
  }

  return { removed };
}
