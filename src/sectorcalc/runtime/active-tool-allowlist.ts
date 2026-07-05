// SectorCalc V5.4 Core — Active Tool Allowlist
// Only tools listed here are active for public execution.
// All other tools are quarantined until rebuilt and verified under V5.4 Core standard.
// This is not a temporary patch — this is the production recovery strategy.
// Canonical slugs: Free uses hyphens, Pro uses underscores (sc_* convention).

export const ACTIVE_FREE_TOOL_SLUGS: readonly string[] = [
  "break-even-and-margin-of-safety-analysis",
];

// All 135 Pro formula modules are auto-generated generic templates
// with identical placeholder outputs across all keys.
// No Pro tool has real semantic calculations — all are quarantined
// until a genuinely domain-specific Pro formula module is built.
export const ACTIVE_PRO_TOOL_SLUGS: readonly string[] = [];

export function isActiveFreeTool(slug: string): boolean {
  return ACTIVE_FREE_TOOL_SLUGS.includes(slug);
}

export function isActiveProTool(slug: string): boolean {
  return ACTIVE_PRO_TOOL_SLUGS.includes(slug);
}

export function isActiveTool(slug: string): boolean {
  return isActiveFreeTool(slug) || isActiveProTool(slug);
}
