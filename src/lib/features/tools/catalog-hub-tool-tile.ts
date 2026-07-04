/**
 * Catalog hub tool tile - Free tools permanently purged.
 */

export interface CatalogHubToolTile {
  slug: string;
  title: string;
  description: string;
  category: string;
  sectorKey: string;
  href: string;
  name: string;
  shortDescription: string;
  tier: string;
  industrySlug: string;
}

export function toCatalogHubToolTile(tool: {
  slug: string;
  title: string;
  description: string;
  category?: string;
  sectorKey?: string;
  href: string;
  name?: string;
}): CatalogHubToolTile {
  return {
    slug: tool.slug,
    title: tool.title,
    description: tool.description,
    category: tool.category ?? "",
    sectorKey: tool.sectorKey ?? "",
    href: tool.href,
    name: tool.name ?? tool.title,
    shortDescription: tool.description,
    tier: "premium",
    industrySlug: tool.sectorKey ?? tool.slug,
  };
}

export function buildCatalogHubToolTiles(): CatalogHubToolTile[] {
  return [];
}
