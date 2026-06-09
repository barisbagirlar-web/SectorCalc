#!/usr/bin/env node
/**
 * Guard hub catalog routes against accidental dynamic SSR regression.
 * Fails CI when cache policy exports are removed from hub page files.
 */

import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = process.cwd();

const HUB_ROUTE_FILES = [
  "src/app/[locale]/free-tools/page.tsx",
  "src/app/[locale]/premium-tools/page.tsx",
  "src/app/[locale]/industries/page.tsx",
  "src/app/[locale]/categories/page.tsx",
];

function read(relPath) {
  return readFileSync(resolve(ROOT, relPath), "utf8");
}

function assertHubRoutePolicy(relPath) {
  const source = read(relPath);
  const hasRevalidate = /export\s+const\s+revalidate\s*=/.test(source);
  const hasForceStatic = /export\s+const\s+dynamic\s*=\s*["']force-static["']/.test(source);
  const hasDynamicSsr =
    /export\s+const\s+dynamic\s*=\s*["']force-dynamic["']/.test(source) ||
    /export\s+const\s+dynamic\s*=\s*["']auto["']/.test(source);

  const errors = [];

  if (!hasRevalidate) {
    errors.push("missing export const revalidate");
  }
  if (!hasForceStatic) {
    errors.push('missing export const dynamic = "force-static"');
  }
  if (hasDynamicSsr) {
    errors.push("explicit dynamic SSR export detected");
  }

  return { relPath, ok: errors.length === 0, errors, hasRevalidate, hasForceStatic };
}

function main() {
  console.log("=== Hub route cache policy ===\n");

  const results = HUB_ROUTE_FILES.map(assertHubRoutePolicy);
  let failed = false;

  for (const result of results) {
    if (result.ok) {
      console.log(`✓ ${result.relPath} — force-static + revalidate`);
    } else {
      failed = true;
      console.error(`✗ ${result.relPath}`);
      for (const err of result.errors) {
        console.error(`  - ${err}`);
      }
    }
  }

  console.log("");
  if (failed) {
    console.error("Route cache policy check FAILED.");
    console.error("Hub catalog pages must stay static/ISR:");
    console.error('  export const dynamic = "force-static";');
    console.error("  export const revalidate = 3600;");
    process.exit(1);
  }

  console.log(`All ${results.length} hub routes have static/ISR cache policy.`);
}

main();
