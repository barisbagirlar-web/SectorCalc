#!/usr/bin/env tsx
/**
 * CI/CD Hreflang Completeness Gate — §17
 * ========================================
 *
 * Only checks pages registered in the sitemap manifest (SSOT).
 * Pages using createPageMetadata() or getToolMetadata() auto-pass
 * because those centralized functions guarantee hreflang compliance.
 *
 * Every indexable route MUST declare hreflang alternates with en + x-default.
 *
 * Exit code: 0 = PASS, 1 = BLOCKED
 */

import fs from "node:fs";
import path from "node:path";
import { getSitemapManifest } from "@/lib/infrastructure/seo/sitemap-manifest";

const ROOT = process.cwd();

const NON_PUBLIC_PREFIXES = [
  "/login", "/signup", "/account", "/admin", "/dashboard",
  "/checkout", "/api", "/verify", "/debug", "/preview",
  "/document-intelligence",
];

function resolvePageFile(route: string): string | null {
  if (route === "/") return path.join(ROOT, "src/app/page.tsx");
  const segments = route.split("/").filter(Boolean);
  const filePath = path.join(ROOT, "src/app", ...segments, "page.tsx");
  return fs.existsSync(filePath) ? filePath : null;
}

/** Centralized function names that guarantee hreflang compliance */
const HREFLANG_GUARANTEED_IMPORTS = /createPageMetadata|getToolMetadata/;

function main(): void {
  console.log("Hreflang Completeness Gate — §17");
  console.log("=".repeat(60));

  const manifest = getSitemapManifest();
  const indexableItems = manifest.filter((item) =>
    !NON_PUBLIC_PREFIXES.some((p) => item.path.startsWith(p)),
  );

  console.log(`  Sitemap manifest indexable pages: ${indexableItems.length}`);

  let checked = 0, passed = 0, skipped = 0;
  const violations: string[] = [];

  for (const item of indexableItems) {
    const pageFile = resolvePageFile(item.path);
    if (!pageFile) { skipped++; continue; }

    checked++;
    const content = fs.readFileSync(pageFile, "utf8");

    // Auto-pass: centralized hreflang via createPageMetadata/getToolMetadata
    if (HREFLANG_GUARANTEED_IMPORTS.test(content)) {
      passed++;
      continue;
    }

    const hasXDefault = content.includes("x-default");
    const hasEn = /\ben:/.test(content) || content.includes('"en"') || content.includes("'en'");

    if (!hasXDefault || !hasEn) {
      violations.push(`${item.path} (${path.relative(ROOT, pageFile)})`);
    } else {
      passed++;
    }
  }

  console.log(`  Checked: ${checked}, Passed: ${passed}, Skipped: ${skipped}`);

  if (violations.length > 0) {
    console.error(`\n[BLOCKED] ${violations.length} pages missing hreflang en+x-default:\n`);
    for (const v of violations.slice(0, 10)) {
      console.error(`  \u2717 ${v}`);
    }
    if (violations.length > 10) console.error(`  ... and ${violations.length - 10} more`);
    console.error("");
    process.exit(1);
  }

  console.log(`[PASS] All ${passed} checked indexable pages declare hreflang en + x-default`);
  process.exit(0);
}

main();
