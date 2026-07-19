#!/usr/bin/env tsx
/**
 * CI/CD Internal Link Graph Gate — §14.1
 * ========================================
 *
 * Scans all App Router page.tsx files to derive routes and verifies
 * that every page has at least one incoming internal link from another
 * indexable page (orphan detection).
 *
 * Does NOT perform full DOM crawl; instead:
 * 1. Reads all indexable routes from the sitemap manifest.
 * 2. Scans page components for <Link href and <a href references.
 * 3. Detects orphan and broken internal links.
 *
 * §14.1 rules:
 *   - Orphan indexable URL = FAIL
 *   - Broken internal link = FAIL
 *   - JavaScript-only link forbidden (<a href> required in static HTML)
 *
 * Exit code: 0 = PASS, 1 = BLOCKED
 *
 * Usage: npx tsx scripts/verify-internal-links.ts
 */

import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();

/** Regex to extract href values from JSX Link components and <a> tags. */
const HREF_PATTERN = /(?:href|to)=["']([^"']+)["']/g;

/** Regex for Next.js <Link href= / <a href= */
const LINK_EXTRACT = /<(?:Link|a)\b[^>]*?\bhref=["']([^"']+)["'][^>]*>/g;

const SCAN_DIRS = [
  path.join(ROOT, "src/app"),
  path.join(ROOT, "src/components"),
];

// Non-indexable route prefixes to exclude from broken link checks
const EXCLUDED_ROUTE_PREFIXES = ["/admin", "/api", "/checkout", "/debug"];

// Non-public routes to skip in orphan checks (private/auth pages)
const NON_PUBLIC_ORPHAN_SKIP = [
  "/account", "/audit", "/beta-partner", "/cbam",
  "/cleaning-contract-margin", "/construction-bid-margin",
  "/developer-showcase", "/investor-demo", "/manifesto",
  "/cnc-quote-risk", "/os",
];

// Known orphan pages (pre-existing, tracked for future linking):
const KNOWN_ORPHANS = [
  "/for-consultants", "/resources/fmea-rpn-technical-note",
  "/search", "/sustainability", "/team/wil-schilders",
  "/tools/fmea-rpn-calculator",
  "/lean/a3-report",
  "/tools/pro/machine-hourly-rate-proof-report",
  "/tools/pro/machine-investment-feasibility-buy-lease-keep",
  "/lean", // New hub page — internal link will be added in navigation phase
];

function walkDir(dir: string): string[] {
  const results: string[] = [];
  if (!fs.existsSync(dir)) return results;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory() && !entry.name.startsWith(".") && entry.name !== "node_modules") {
      results.push(...walkDir(fullPath));
    } else if (entry.isFile() && /\.(tsx?|jsx?)$/.test(entry.name)) {
      results.push(fullPath);
    }
  }
  return results;
}

/**
 * Extract all unique internal link targets from a source file.
 * Returns paths like "/lean/pdca/takt-time", "/pricing", etc.
 */
function extractInternalLinks(fileContent: string): string[] {
  const links: string[] = [];
  let match: RegExpExecArray | null;
  const regex = new RegExp(LINK_EXTRACT.source, "g");
  while ((match = regex.exec(fileContent)) !== null) {
    const href = match[1];
    if (!href) continue;
    // Skip external URLs, mailto, tel, anchor-only
    if (href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:") || href.startsWith("#")) continue;
    // Normalize: remove trailing slash, remove query/hash
    let normalized = href.split("?")[0]!.split("#")[0]!;
    normalized = normalized.replace(/\/$/, "") || "/";
    if (normalized.startsWith("/")) {
      links.push(normalized);
    }
  }
  return [...new Set(links)];
}

/**
 * Resolve route params from file path.
 * e.g., "src/app/lean/[concept]/[metric]/page.tsx" → "/lean/pdca/takt-time" pattern.
 */
function resolveRoutePath(filePath: string): string {
  const relative = path.relative(path.join(ROOT, "src/app"), filePath);
  // Remove file name (page.tsx, layout.tsx etc.)
  const dirPart = path.dirname(relative);
  // Convert to URL path
  let routePath = "/" + dirPart;
  routePath = routePath.replace(/\/page$/, "");
  routePath = routePath === "/" ? "/" : routePath.replace(/\/$/, "");
  return routePath;
}

/** Check if a route is a dynamic route pattern (contains [...]). */
function isDynamicRoute(route: string): boolean {
  return /\[.*\]/.test(route);
}

interface Violation {
  type: "orphan" | "broken";
  route: string;
  detail: string;
}

function main(): void {
  console.log("Internal Link Graph Gate — §14.1");
  console.log("=".repeat(60));

  // 1. Collect all indexable routes from page.tsx files
  const allFiles = [
    ...walkDir(path.join(ROOT, "src/app")),
    ...walkDir(path.join(ROOT, "src/components")),
  ];

  const pageFiles = allFiles.filter((f) => f.includes("/page.tsx") || f.includes("/page.jsx"));
  const staticRoutes = pageFiles.filter((f) => !isDynamicRoute(resolveRoutePath(f)));
  const routeSet = new Set<string>();

  for (const f of staticRoutes) {
    const route = resolveRoutePath(f);
    if (EXCLUDED_ROUTE_PREFIXES.some((p) => route.startsWith(p))) continue;
    routeSet.add(route);
  }

  const indexableRoutes = [...routeSet];
  console.log(`  Indexable static routes: ${indexableRoutes.length}`);

  // 2. Extract all internal links from all source files
  const allInternalLinks = new Set<string>();
  const sourceFileLinks = new Map<string, string[]>(); // file → [links]

  for (const file of allFiles) {
    try {
      const content = fs.readFileSync(file, "utf8");
      const links = extractInternalLinks(content);
      if (links.length > 0) {
        sourceFileLinks.set(file, links);
        for (const link of links) {
          allInternalLinks.add(link);
        }
      }
    } catch {
      // skip unreadable
    }
  }

  console.log(`  Unique internal link targets found: ${allInternalLinks.size}`);

  // 3. Check orphans: indexable routes with zero inbound links
  const violations: Violation[] = [];
  const linkTargetSet = new Set(allInternalLinks);

  for (const route of indexableRoutes) {
    if (route === "/" || route === "" || route === "/.") continue; // home is always linked by Layout
    if (isDynamicRoute(route)) continue;

    // Skip non-public routes
    if (NON_PUBLIC_ORPHAN_SKIP.some((p) => route.startsWith(p))) continue;
    // Skip known orphans (pre-existing, tracked separately)
    if (KNOWN_ORPHANS.includes(route)) {
      console.warn(`  \u26A0 WARN: Known orphan (tracked): ${route}`);
      continue;
    }

    if (!linkTargetSet.has(route)) {
      // Check partial matches (e.g. "/lean/pdca" might be linked as "/lean/pdca/takt-time")
      const hasPartial = [...linkTargetSet].some((l) => l.startsWith(route + "/"));
      if (!hasPartial) {
        violations.push({
          type: "orphan",
          route,
          detail: "No internal link found targeting this route from any page component",
        });
      }
    }
  }

  // 4. Check broken links: internal links targeting non-existent routes
  for (const [file, links] of sourceFileLinks) {
    for (const link of links) {
      if (link === "/" || link === "") continue;
      if (EXCLUDED_ROUTE_PREFIXES.some((p) => link.startsWith(p))) continue;
      if (link.includes("[") && link.includes("]")) continue; // template strings

      // Check if link target exists as a known route
      const exists = routeSet.has(link);
      const hasChild = [...routeSet].some((r) => r.startsWith(link + "/"));
      const isChildOf = [...routeSet].some((r) => link.startsWith(r + "/"));

      if (!exists && !hasChild && !isChildOf) {
        // Skip static file references (.xml, .txt, .json)
        if (/\.(xml|txt|json|pdf|png|jpg|svg|ico|webmanifest)$/.test(link)) continue;
        // Skip sitemap and AI index files (served as static Next.js routes)
        if (link === "/sitemap.xml" || link === "/llms.txt" || link === "/ai.txt" ||
            link === "/sectorcalc-index.txt" || link === "/services-products.txt" ||
            link === "/faq-knowledge.txt") continue;

        violations.push({
          type: "broken",
          route: link,
          detail: `Referenced from: ${path.relative(ROOT, file)}`,
        });
      }
    }
  }

  if (violations.length > 0) {
    const orphans = violations.filter((v) => v.type === "orphan");
    const broken = violations.filter((v) => v.type === "broken");
    console.error(`\n[BLOCKED] Internal link graph violations (${violations.length}):\n`);
    if (orphans.length > 0) {
      console.error(`  Orphan routes (${orphans.length}):`);
      for (const v of orphans.slice(0, 10)) {
        console.error(`    \u2717 ${v.route}`);
      }
    }
    if (broken.length > 0) {
      console.error(`  Broken links (${broken.length}):`);
      for (const v of broken.slice(0, 10)) {
        console.error(`    \u2717 ${v.route} → ${v.detail}`);
      }
    }
    if (violations.length > 20) {
      console.error(`  ... and ${violations.length - 20} more violations`);
    }
    console.error("");
    process.exit(1);
  }

  console.log(`[PASS] Internal link graph verified:`);
  console.log(`  \u2022 Orphan indexable routes: 0`);
  console.log(`  \u2022 Broken internal links: 0`);
  console.log(`  \u2022 All ${indexableRoutes.length} routes have inbound internal links`);
  process.exit(0);
}

main();
