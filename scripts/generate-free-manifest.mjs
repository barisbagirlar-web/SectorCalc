#!/usr/bin/env node
/**
 * Generate the full public-free-tool-manifest.ts with all 294 tools.
 */
import { readFileSync, readdirSync, writeFileSync } from "fs";
import { join } from "path";

const ROOT = process.cwd();
const SCHEMAS_DIR = join(ROOT, "src/sectorcalc/schemas/free-v531");
const OUT = join(ROOT, "src/sectorcalc/runtime/public-free-tool-manifest.ts");

const files = readdirSync(SCHEMAS_DIR)
  .filter((f) => f.endsWith(".json"))
  .sort();

const entries = [];
for (const file of files) {
  const raw = JSON.parse(readFileSync(join(SCHEMAS_DIR, file), "utf8"));
  const toolKey = raw.tool_key;
  const toolName = raw.tool_name || toolKey.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  const slug = toolKey;
  entries.push(`  { slug: "${slug}", toolKey: "${toolKey}", toolName: "${toolName}", route: "/tools/free/${slug}", accessTier: "FREE" }`);
}

const content = `// SectorCalc Free V5.3.1 Public-Safe Tool Manifest
// This file is fs-free and contains NO formulas, NO private registry,
// NO schema contract body, NO internal trace.
// Only public-safe route metadata for sitemap, catalog, and routing use.
// AUTO-GENERATED — do not edit manually. Run scripts/generate-free-manifest.mjs

export interface FreeToolManifestEntry {
  slug: string;
  toolKey: string;
  toolName: string;
  route: string;
  accessTier: "FREE";
}

const FREE_TOOLS: FreeToolManifestEntry[] = [
${entries.join(",\n")},
];

const freeToolSlugs: string[] = FREE_TOOLS.map((t) => t.slug).sort();
const freeToolBySlug = new Map<string, FreeToolManifestEntry>(FREE_TOOLS.map((t) => [t.slug, t]));

export function listFreeToolSlugs(): string[] {
  return [...freeToolSlugs];
}

export function listFreeToolManifestEntries(): FreeToolManifestEntry[] {
  return FREE_TOOLS.map((t) => ({ ...t }));
}

export function getFreeToolManifestEntry(slug: string): FreeToolManifestEntry | undefined {
  return freeToolBySlug.get(slug);
}

export function getFreeToolSitemapItems(): { slug: string; route: string; toolName: string }[] {
  return FREE_TOOLS.map((t) => ({ slug: t.slug, route: t.route, toolName: t.toolName }));
}
`;

writeFileSync(OUT, content, "utf8");
console.log(`Generated manifest with ${entries.length} entries → ${OUT}`);
