// SectorCalc V5.4 Core — Active Tool Allowlist
// Only tools listed here are active for public execution.
// All other tools are quarantined until rebuilt and verified under V5.4 Core standard.
// This is not a temporary patch — this is the production recovery strategy.
// Canonical slugs: Free uses hyphens, Pro uses underscores (sc_* convention).

import { CERTIFIED_FREE_TOOL_SLUGS } from "@/sectorcalc/formulas/free-v531/free-formula-verification-manifest";
import { CERTIFIED_PRO_TOOL_SLUGS } from "@/sectorcalc/formulas/pro-v531/pro-certified-tool-keys";

export const ACTIVE_FREE_TOOL_SLUGS: readonly string[] = CERTIFIED_FREE_TOOL_SLUGS;

// Only tools with a Decimal model, schema-version binding, exact audit output,
// and property evidence may be active for public execution.
export const ACTIVE_PRO_TOOL_SLUGS: readonly string[] = CERTIFIED_PRO_TOOL_SLUGS;

export function isActiveFreeTool(slug: string): boolean {
  return ACTIVE_FREE_TOOL_SLUGS.includes(slug);
}

export function isActiveProTool(slug: string): boolean {
  return ACTIVE_PRO_TOOL_SLUGS.includes(slug);
}

export function isActiveTool(slug: string): boolean {
  return isActiveFreeTool(slug) || isActiveProTool(slug);
}
