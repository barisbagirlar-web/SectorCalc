import "server-only";

import type { AccessTier, ToolSource } from "./build-tool-render-contract";

import { listProToolSchemaSlugs } from "@/sectorcalc/runtime/pro-schema-loader";

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

// ── Pro-only manifest builder ──

let _manifest: Map<string, PublicToolManifestEntry> | null = null;

function buildManifest(): Map<string, PublicToolManifestEntry> {
  if (_manifest) return _manifest;

  const entries: Array<{ slug: string; entry: PublicToolManifestEntry }> = [];

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

  const manifest = new Map<string, PublicToolManifestEntry>();
  const seen = new Set<string>();

  for (const { slug, entry } of entries) {
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
