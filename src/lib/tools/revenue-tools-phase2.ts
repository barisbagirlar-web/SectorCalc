/**
 * Phase-2 revenue registry segment — slug pairs for extended sectors.
 * Empty baseline until phase-2 tools are re-seeded.
 */

import type { RevenueTool } from "@/lib/tools/revenue-tools";

export const phase2RevenueTools: readonly RevenueTool[] = [];

export function getPhase2RevenueTools(): readonly RevenueTool[] {
  return phase2RevenueTools;
}

export const REVENUE_TOOLS_PHASE2 = phase2RevenueTools;

export function getRevenueToolsPhase2(): readonly RevenueTool[] {
  return phase2RevenueTools;
}
