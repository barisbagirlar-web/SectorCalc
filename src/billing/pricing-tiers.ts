/**
 * Credit pricing tier SSOT — never hard-code numeric costs in calculator UIs.
 */
import type { PricingTier } from './types.js';

export const CREDIT_COST = {
  FREE: 0,
  CORE: 3,
  PRO: 7,
  ADVANCED: 15,
  DECISION: 30
} as const satisfies Record<PricingTier, number>;

export function creditCostForTier(tier: PricingTier): number {
  return CREDIT_COST[tier];
}
