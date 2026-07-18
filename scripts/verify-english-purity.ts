#!/usr/bin/env tsx
/**
 * CI/CD English Purity Invariant Gate
 * =====================================
 *
 * Verifies sectorcalc.com's "Pure English" global-target invariant:
 * - No Turkish Unicode (ç, ğ, ı, ö, ş, ü) in slug, path, or metadata
 * - No local-currency leakage (TRY, TL, ₺) in public content
 * - Slug format: lowercase alphanumeric + hyphens only
 *
 * Exit code: 0 = PASS, 1 = BLOCKED
 *
 * Usage: npx tsx scripts/verify-english-purity.ts [--routes public/routes.json]
 */

import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const ROUTES_FILE = process.argv.find((a) => a.startsWith("--routes="))?.split("=")[1]
  ?? path.join(ROOT, "public/routes.json");

const TURKISH_UNICODE = /[\u00E7\u011F\u0131\u00F6\u015F\u00FC\u00C7\u011E\u0130\u00D6\u015E\u00DC]/;
const TURKISH_ASCII = /[çğıöşüÇĞİÖŞÜ]/;

const FORBIDDEN_CURRENCIES = ["TRY", "TL", "₺"];

const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

interface RouteEntry {
  path?: string;
  slug?: string;
  title?: string;
  description?: string;
}

function checkFile(filePath: string): string[] {
  const violations: string[] = [];

  const raw = fs.readFileSync(filePath, "utf8");

  // 1. Turkish Unicode in file content
  if (TURKISH_UNICODE.test(raw) || TURKISH_ASCII.test(raw)) {
    const lines = raw.split("\n");
    for (let i = 0; i < lines.length; i++) {
      if (TURKISH_UNICODE.test(lines[i]) || TURKISH_ASCII.test(lines[i])) {
        violations.push(
          `Turkish characters at ${filePath}:${i + 1}: "${lines[i].trim().slice(0, 80)}"`,
        );
        if (violations.length >= 5) {
          break;
        }
      }
    }
  }

  // 2. Forbidden currencies
  for (const currency of FORBIDDEN_CURRENCIES) {
    if (raw.includes(currency)) {
      violations.push(`Local currency "${currency}" found in ${filePath}`);
    }
  }

  return violations;
}

function checkSlugFormat(slug: string): boolean {
  return SLUG_REGEX.test(slug);
}

function verifyRoutePurity(): string[] {
  const violations: string[] = [];

  if (!fs.existsSync(ROUTES_FILE)) {
    violations.push(`Routes file not found: ${ROUTES_FILE}`);
    return violations;
  }

  let routes: RouteEntry[];
  try {
    routes = JSON.parse(fs.readFileSync(ROUTES_FILE, "utf8"));
  } catch {
    violations.push(`Failed to parse routes file: ${ROUTES_FILE}`);
    return violations;
  }

  for (const route of routes) {
    const slug = route.slug ?? extractSlugFromPath(route.path);
    if (slug && !checkSlugFormat(slug)) {
      violations.push(
        `Non-English slug format: "${slug}" (path: ${route.path ?? "unknown"})`,
      );
    }

    // Check title for Turkish
    if (route.title && (TURKISH_UNICODE.test(route.title) || TURKISH_ASCII.test(route.title))) {
      violations.push(
        `Turkish in title: "${route.title}" (path: ${route.path ?? "unknown"})`,
      );
    }

    // Check description for Turkish
    if (route.description && (TURKISH_UNICODE.test(route.description) || TURKISH_ASCII.test(route.description))) {
      violations.push(
        `Turkish in description for: ${route.path ?? route.slug ?? "unknown"}`,
      );
    }
  }

  return violations;
}

function extractSlugFromPath(rawPath?: string): string | undefined {
  if (!rawPath) {
    return undefined;
  }
  const parts = rawPath.replace(/^\/+|\/+$/g, "").split("/");
  return parts[parts.length - 1];
}

function scanSourceFiles(): string[] {
  const violations: string[] = [];

  const criticalDirs = [
    path.join(ROOT, "src/app"),
    path.join(ROOT, "src/components"),
    path.join(ROOT, "src/lib/infrastructure/seo"),
  ];

  for (const dir of criticalDirs) {
    if (!fs.existsSync(dir)) {
      continue;
    }
    const files = walkDir(dir);
    for (const file of files) {
      if (!file.endsWith(".tsx") && !file.endsWith(".ts")) {
        continue;
      }
      const fileViolations = checkFile(file);
      violations.push(...fileViolations);
    }
  }

  return violations;
}

function walkDir(dir: string): string[] {
  const results: string[] = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory() && !entry.name.startsWith(".") && entry.name !== "node_modules") {
      results.push(...walkDir(fullPath));
    } else if (entry.isFile()) {
      results.push(fullPath);
    }
  }
  return results;
}

function main(): void {
  const allViolations: string[] = [];

  // Check 1: Route metadata purity
  allViolations.push(...verifyRoutePurity());

  // Check 2: Source file Turkish check
  const sourceViolations = scanSourceFiles();
  allViolations.push(...sourceViolations);

  if (allViolations.length > 0) {
    console.error("\n[BLOCKED] English Purity invariant violations:\n");
    for (const v of allViolations) {
      console.error(`  ❌ ${v}`);
    }
    console.error(`\n  Total violations: ${allViolations.length}`);
    console.error("");
    process.exit(1);
  }

  console.log("[PASS] English Purity Invariant Verified.");
  console.log("[PASS] All slugs English-only. No Turkish characters. No local currency leakage.");
  process.exit(0);
}

main();
