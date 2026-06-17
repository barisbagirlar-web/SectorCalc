/**
 * Additional revenue registry segment — slug pairs beyond core catalog.
 * Empty baseline until additional tools are re-seeded.
 */

import type { RevenueTool } from "@/lib/tools/revenue-tools";

export const additionalRevenueTools: readonly RevenueTool[] = [];

export function getAdditionalRevenueTools(): readonly RevenueTool[] {
  return additionalRevenueTools;
}
