import "server-only";

import type { AccessTier, ToolSource } from "./build-tool-render-contract";

import { listGeneratedToolSchemaSlugs } from "@/lib/features/generated-tools/schema-loader";
import { industrialFormulaTools } from "@/lib/features/tools/revenue-tools-industrial-formulas";
import { listProToolSchemaSlugs } from "@/sectorcalc/runtime/pro-schema-loader";
import { listFreeToolSchemaSlugs } from "@/sectorcalc/runtime/free-schema-loader";

export interface PublicToolManifestEntry {
  toolKey: string;
  slug: string;
  toolName: string;
  categoryLabel: string;
  source: ToolSource;
  accessTier: AccessTier;
  route: string;
  renderMode: "V531_UNIVERSAL_FORM";
  formulaMode: "SERVER_ONLY" | "REVIEW_ONLY";
  sitemap: boolean;
  public: boolean;
}

function normalizeSlug(value: string): string {
  return value.trim().toLowerCase();
}

function isProSlug(slug: string): boolean {
  return slug.startsWith("sc_") || slug.startsWith("pro_");
}

export function getToolAccessTier(slug: string): AccessTier {
  return isProSlug(slug) ? "PRO" : "FREE";
}

export function getToolRoute(slug: string): string {
  return isProSlug(slug)
    ? `/tools/pro/${slug}`
    : `/tools/generated/${slug}`;
}

export function createManifestEntry(input: {
  slug: string;
  toolName: string;
  categoryLabel: string;
  source: ToolSource;
  formulaMode?: "SERVER_ONLY" | "REVIEW_ONLY";
}): PublicToolManifestEntry {
  const slug = normalizeSlug(input.slug);
  const accessTier = getToolAccessTier(slug);

  return {
    toolKey: slug,
    slug,
    toolName: input.toolName,
    categoryLabel: input.categoryLabel,
    source: input.source,
    accessTier,
    route: getToolRoute(slug),
    renderMode: "V531_UNIVERSAL_FORM",
    formulaMode: input.formulaMode ?? "SERVER_ONLY",
    sitemap: true,
    public: true,
  };
}

// ── Existing manifest builder (preserved for backward compatibility) ──

let _manifest: Map<string, PublicToolManifestEntry> | null = null;

function buildManifest(): Map<string, PublicToolManifestEntry> {
  if (_manifest) return _manifest;

  const entries: Array<{ slug: string; entry: PublicToolManifestEntry }> = [];

  for (const slug of listGeneratedToolSchemaSlugs()) {
    entries.push({
      slug,
      entry: {
        toolKey: slug, slug,
        toolName: "", categoryLabel: "",
        source: "legacy_generated" as ToolSource,
        accessTier: "FREE" as AccessTier,
        route: `/tools/generated/${slug}`,
        renderMode: "V531_UNIVERSAL_FORM",
        formulaMode: "SERVER_ONLY",
        sitemap: true, public: true,
      },
    });
  }

  for (const tool of industrialFormulaTools) {
    const slug = tool.freeSlug;
    if (!slug) continue;
    entries.push({
      slug,
      entry: {
        toolKey: slug, slug,
        toolName: "", categoryLabel: "",
        source: "industrial_free" as ToolSource,
        accessTier: "FREE" as AccessTier,
        route: `/tools/generated/${slug}`,
        renderMode: "V531_UNIVERSAL_FORM",
        formulaMode: "SERVER_ONLY",
        sitemap: true, public: true,
      },
    });
  }

  for (const slug of listProToolSchemaSlugs()) {
    entries.push({
      slug,
      entry: {
        toolKey: slug, slug,
        toolName: "", categoryLabel: "",
        source: "pro_v531" as ToolSource,
        accessTier: "PRO" as AccessTier,
        route: `/tools/pro/${slug}`,
        renderMode: "V531_UNIVERSAL_FORM",
        formulaMode: "SERVER_ONLY",
        sitemap: true, public: true,
      },
    });
  }

  for (const slug of listFreeToolSchemaSlugs()) {
    entries.push({
      slug,
      entry: {
        toolKey: slug, slug,
        toolName: "", categoryLabel: "",
        source: "free_v531" as ToolSource,
        accessTier: "FREE" as AccessTier,
        route: `/tools/generated/${slug}`,
        renderMode: "V531_UNIVERSAL_FORM",
        formulaMode: "SERVER_ONLY",
        sitemap: true, public: true,
      },
    });
  }

  const manifest = new Map<string, PublicToolManifestEntry>();
  const seen = new Set<string>();

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
  return buildManifest().get(normalizeSlug(slug)) ?? null;
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
