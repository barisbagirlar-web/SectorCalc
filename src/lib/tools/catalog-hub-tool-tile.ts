import type { Tool } from "@/data/tools";
import type { ToolData } from "@/lib/tools/all-tools-data";

export function toCatalogHubToolTile(tool: ToolData): Tool {
  return {
    slug: tool.slug,
    name: tool.name,
    shortDescription: "",
    description: "",
    tier: tool.premiumRequired ? "premium" : "free",
    industrySlug: tool.sectorKey,
    href: tool.href,
  };
}
