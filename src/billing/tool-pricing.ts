/**
 * Tool → pricing tier classification SSOT.
 * Unclassified tools retain existing free behavior (no monetization).
 */
import type { PricingTier } from './types.js';
import { CREDIT_COST, creditCostForTier } from './pricing-tiers.js';

/** CORE — 3 credits */
const CORE_TOOLS = [
  'SC-001',
  'SC-010',
  'SC-012',
  'SC-028',
  'SC-037',
  'SC-038'
] as const;

/** PRO — 7 credits */
const PRO_TOOLS = [
  'SC-021',
  'SC-022',
  'SC-023',
  'SC-024',
  'SC-025',
  'SC-026',
  'SC-027',
  'SC-030',
  'SC-031',
  'SC-032',
  'SC-035',
  'SC-039',
  'SC-040'
] as const;

/** ADVANCED — 15 credits */
const ADVANCED_TOOLS = [
  'SC-008',
  'SC-020',
  'SC-029',
  'SC-033',
  'SC-034',
  'SC-036'
] as const;

/** DECISION reserved — no individual calculators assigned yet. */
const DECISION_TOOLS: readonly string[] = [];

const TIER_BY_TOOL: Record<string, PricingTier> = Object.create(null);

function register(tools: readonly string[], tier: PricingTier): void {
  for (const id of tools) {
    if (TIER_BY_TOOL[id]) {
      throw new Error(`Duplicate tool pricing classification: ${id}`);
    }
    TIER_BY_TOOL[id] = tier;
  }
}

register(CORE_TOOLS, 'CORE');
register(PRO_TOOLS, 'PRO');
register(ADVANCED_TOOLS, 'ADVANCED');
register(DECISION_TOOLS, 'DECISION');

export function getToolPricingTier(toolId: string): PricingTier | null {
  return TIER_BY_TOOL[toolId] ?? null;
}

/**
 * Server-resolved credit cost. Unclassified → null (free / existing behavior).
 * Never trust a client-supplied creditCost.
 */
export function resolveToolCreditCost(toolId: string): number | null {
  const tier = getToolPricingTier(toolId);
  if (!tier) return null;
  return creditCostForTier(tier);
}

export function isToolClassified(toolId: string): boolean {
  return getToolPricingTier(toolId) != null;
}

export { CREDIT_COST, CORE_TOOLS, PRO_TOOLS, ADVANCED_TOOLS, DECISION_TOOLS };
