// SectorCalc V5.3.1 — Public Tool Manifest
// Single source of truth for all route-visible calculator tools.
// Server-only. Used by routes, sitemap, guards, and execution policy.
//
// Rules:
// - route slug must equal toolKey
// - no duplicate toolKey, slug, route, or sitemap URL
// - Free tools must have accessTier FREE
// - Pro tools must have accessTier PRO
// - legacy tools must not bypass render contract

import "server-only";

export type AccessTier = "FREE" | "PRO";

export type ToolSource = "free_v531" | "pro_v531" | "industrial_free" | "legacy_generated";

export type RenderMode = "V531_UNIVERSAL_FORM";

export type FormulaMode = "SERVER_ONLY";

export interface PublicToolManifestEntry {
  toolKey: string;
  slug: string;
  accessTier: AccessTier;
  renderMode: RenderMode;
  formulaMode: FormulaMode;
  source: ToolSource;
}

// ── Load all schemas ──────────────────────────────────────────────

import { listGeneratedToolSchemaSlugs } from "@/lib/features/generated-tools/schema-loader";
import { industrialFormulaTools } from "@/lib/features/tools/revenue-tools-industrial-formulas";
import { listProToolSchemaSlugs } from "@/sectorcalc/runtime/pro-schema-loader";
import { listFreeToolSchemaSlugs } from "@/sectorcalc/runtime/free-schema-loader";

// ── Build manifest ────────────────────────────────────────────────

let _manifest: Map<string, PublicToolManifestEntry> | null = null;

function buildManifest(): Map<string, PublicToolManifestEntry> {
  if (_manifest) return _manifest;

  const entries: Array<{ slug: string; entry: PublicToolManifestEntry }> = [];

  // Generated Free Tools
  for (const slug of listGeneratedToolSchemaSlugs()) {
    entries.push({
      slug,
      entry: {
        toolKey: slug,
        slug,
        accessTier: "FREE" as AccessTier,
        renderMode: "V531_UNIVERSAL_FORM" as RenderMode,
        formulaMode: "SERVER_ONLY" as FormulaMode,
        source: "legacy_generated" as ToolSource,
      },
    });
  }

  // Industrial Free Tools
  for (const tool of industrialFormulaTools) {
    const slug = tool.freeSlug;
    if (!slug) continue;
    entries.push({
      slug,
      entry: {
        toolKey: slug,
        slug,
        accessTier: "FREE" as AccessTier,
        renderMode: "V531_UNIVERSAL_FORM" as RenderMode,
        formulaMode: "SERVER_ONLY" as FormulaMode,
        source: "industrial_free" as ToolSource,
      },
    });
  }

  // Pro V5.3.1 Tools
  for (const slug of listProToolSchemaSlugs()) {
    entries.push({
      slug,
      entry: {
        toolKey: slug,
        slug,
        accessTier: "PRO" as AccessTier,
        renderMode: "V531_UNIVERSAL_FORM" as RenderMode,
        formulaMode: "SERVER_ONLY" as FormulaMode,
        source: "pro_v531" as ToolSource,
      },
    });
  }

  // Free V5.3.1 Tools
  for (const slug of listFreeToolSchemaSlugs()) {
    entries.push({
      slug,
      entry: {
        toolKey: slug,
        slug,
        accessTier: "FREE" as AccessTier,
        renderMode: "V531_UNIVERSAL_FORM" as RenderMode,
        formulaMode: "SERVER_ONLY" as FormulaMode,
        source: "free_v531" as ToolSource,
      },
    });
  }

  // Deduplicate by slug (PRO overrides FREE for same slug)
  const manifest = new Map<string, PublicToolManifestEntry>();
  const seen = new Set<string>();

  // Process PRO entries first so they take priority
  const sorted = [...entries].sort((a, b) => {
    const tierOrder = { PRO: 0, FREE: 1 };
    const aOrder = tierOrder[a.entry.accessTier] ?? 1;
    const bOrder = tierOrder[b.entry.accessTier] ?? 1;
    return aOrder - bOrder;
  });

  for (const { slug, entry } of sorted) {
    if (seen.has(slug)) continue;
    seen.add(slug);
    manifest.set(slug, entry);
  }

  _manifest = manifest;
  return _manifest;
}

export function getPublicToolManifest(): PublicToolManifestEntry[] {
  return [...buildManifest().values()];
}

export function getPublicToolBySlug(slug: string): PublicToolManifestEntry | null {
  return buildManifest().get(slug) ?? null;
}

export function getPublicToolAccessTier(slug: string): AccessTier | null {
  return buildManifest().get(slug)?.accessTier ?? null;
}

export function isFreeTool(slug: string): boolean {
  return getPublicToolAccessTier(slug) === "FREE";
}

export function isProTool(slug: string): boolean {
  return getPublicToolAccessTier(slug) === "PRO";
}

export function listPublicToolSlugs(): string[] {
  return [...buildManifest().keys()].sort();
}

export function clearPublicToolManifestCache(): void {
  _manifest = null;
}
