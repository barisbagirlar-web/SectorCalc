// SectorCalc V5.4 Core — Active Tool Allowlist
// Only tools listed here are active for public execution.
// All other tools are quarantined until rebuilt and verified under V5.4 Core standard.
// This is not a temporary patch — this is the production recovery strategy.
// Canonical slugs: Free uses hyphens, Pro uses underscores (sc_* convention).

export const ACTIVE_FREE_TOOL_SLUGS: readonly string[] = [
  "break-even-and-margin-of-safety-analysis",
];

// V5.4 Core — First verified Pro pilot with real domain-specific calculations.
// Compressed Air Leak Cost Calculator uses choked flow gas dynamics to
// estimate leakage flow, annual energy loss, leak cost, and repair payback.
export const ACTIVE_PRO_TOOL_SLUGS: readonly string[] = [
  "compressed-air-leak-cost-calculator",
];

export function isActiveFreeTool(slug: string): boolean {
  return ACTIVE_FREE_TOOL_SLUGS.includes(slug);
}

export function isActiveProTool(slug: string): boolean {
  return ACTIVE_PRO_TOOL_SLUGS.includes(slug);
}

export function isActiveTool(slug: string): boolean {
  return isActiveFreeTool(slug) || isActiveProTool(slug);
}
