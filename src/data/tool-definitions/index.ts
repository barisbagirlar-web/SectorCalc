import type { ToolDefinition } from "@/data/tool-schema";
import type { ToolSlug, ToolTier } from "@/data/tools";

const TOOL_DEFINITIONS: ToolDefinition[] = [];

const definitionKey = (tier: ToolTier, slug: ToolSlug): string =>
 `${tier}:${slug}`;

const DEFINITION_MAP = new Map<string, ToolDefinition>(
 TOOL_DEFINITIONS.map((d) => [definitionKey(d.tier, d.slug), d])
);

export function getToolDefinition(
 tier: ToolTier,
 slug: ToolSlug
): ToolDefinition | undefined {
 return DEFINITION_MAP.get(definitionKey(tier, slug));
}

export function getAllToolDefinitions(): ToolDefinition[] {
 return [...TOOL_DEFINITIONS];
}

export function isValidToolTier(tier: string): tier is ToolTier {
  return tier === "free" || tier === "premium" || tier === "generated";
}
