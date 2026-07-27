/**
 * SectorCalc credit package SSOT (server-authoritative quantities).
 * Monetary price lives in Paddle; credits + packageKey live here.
 */

export type CreditPackageKey = 'STARTER' | 'WORKSHOP' | 'PROFESSIONAL' | 'TEAM_WALLET';

export type PricingTier = 'FREE' | 'CORE' | 'PRO' | 'ADVANCED' | 'DECISION';

/** Previously flagged IDs — cleared after sandbox qty locked to 1..1 and billing_cycle=null verified. */
export const INVALID_PADDLE_PRICE_IDS: readonly string[] = [];

export interface CreditPackageDef {
  key: CreditPackageKey;
  credits: number;
  /** Display-only USD label; Paddle is monetary authority. */
  displayPriceUsd: string;
  /** Expected Paddle unit_price.amount in minor units (USD cents). */
  expectedMinorUnits: string;
  badge?: string;
}

export const CREDIT_PACKAGES: Record<CreditPackageKey, CreditPackageDef> = {
  STARTER: {
    key: 'STARTER',
    credits: 20,
    displayPriceUsd: '$15',
    expectedMinorUnits: '1500'
  },
  WORKSHOP: {
    key: 'WORKSHOP',
    credits: 100,
    displayPriceUsd: '$59',
    expectedMinorUnits: '5900',
    badge: 'MOST POPULAR'
  },
  PROFESSIONAL: {
    key: 'PROFESSIONAL',
    credits: 300,
    displayPriceUsd: '$149',
    expectedMinorUnits: '14900',
    badge: 'BEST VALUE'
  },
  TEAM_WALLET: {
    key: 'TEAM_WALLET',
    credits: 1000,
    displayPriceUsd: '$399',
    expectedMinorUnits: '39900'
  }
};

export const PACKAGE_KEYS = Object.keys(CREDIT_PACKAGES) as CreditPackageKey[];

export const TIER_CREDITS: Record<PricingTier, number> = {
  FREE: 0,
  CORE: 3,
  PRO: 7,
  ADVANCED: 15,
  DECISION: 30
};

/**
 * Tool monetization map (server SSOT).
 * Mandate (2026-07-27): every live tool requires credits for calculation.
 * Future free tools: set monetizationEnabled:false OR tier:'FREE' (creditCost 0).
 */
export const TOOL_PRICING: Record<string, { tier: PricingTier; monetizationEnabled: boolean }> = {
  'SC-001': { tier: 'CORE', monetizationEnabled: true },
  'SC-010': { tier: 'CORE', monetizationEnabled: true },
  'SC-012': { tier: 'CORE', monetizationEnabled: true },
  'SC-028': { tier: 'CORE', monetizationEnabled: true },
  'SC-037': { tier: 'CORE', monetizationEnabled: true },
  'SC-038': { tier: 'CORE', monetizationEnabled: true },
  'SC-021': { tier: 'PRO', monetizationEnabled: true },
  'SC-022': { tier: 'PRO', monetizationEnabled: true },
  'SC-023': { tier: 'PRO', monetizationEnabled: true },
  'SC-024': { tier: 'PRO', monetizationEnabled: true },
  'SC-025': { tier: 'PRO', monetizationEnabled: true },
  'SC-026': { tier: 'PRO', monetizationEnabled: true },
  'SC-027': { tier: 'PRO', monetizationEnabled: true },
  'SC-030': { tier: 'PRO', monetizationEnabled: true },
  'SC-031': { tier: 'PRO', monetizationEnabled: true },
  'SC-032': { tier: 'PRO', monetizationEnabled: true },
  'SC-035': { tier: 'PRO', monetizationEnabled: true },
  'SC-039': { tier: 'PRO', monetizationEnabled: true },
  'SC-040': { tier: 'PRO', monetizationEnabled: true },
  'SC-008': { tier: 'ADVANCED', monetizationEnabled: true },
  'SC-020': { tier: 'ADVANCED', monetizationEnabled: true },
  'SC-029': { tier: 'ADVANCED', monetizationEnabled: true },
  'SC-033': { tier: 'ADVANCED', monetizationEnabled: true },
  'SC-034': { tier: 'ADVANCED', monetizationEnabled: true },
  'SC-036': { tier: 'ADVANCED', monetizationEnabled: true }
};

export function isCreditPackageKey(v: unknown): v is CreditPackageKey {
  return typeof v === 'string' && v in CREDIT_PACKAGES;
}

export function resolveToolCost(toolId: string): { tier: PricingTier; creditCost: number; monetizationEnabled: boolean } | null {
  const row = TOOL_PRICING[toolId];
  if (!row) return null;
  return {
    tier: row.tier,
    creditCost: TIER_CREDITS[row.tier],
    monetizationEnabled: row.monetizationEnabled
  };
}

/** True when this tool must debit a professional session before calculation. */
export function isCreditRequired(toolId: string): boolean {
  const row = resolveToolCost(toolId);
  if (!row) return false;
  if (row.tier === 'FREE' || row.creditCost <= 0) return false;
  return row.monetizationEnabled;
}

export function assertNoInvalidPriceMapping(priceByKey: Partial<Record<CreditPackageKey, string>>): string[] {
  const errors: string[] = [];
  for (const key of PACKAGE_KEYS) {
    const id = priceByKey[key];
    if (!id) {
      errors.push(`${key}: missing Paddle price ID`);
      continue;
    }
    if ((INVALID_PADDLE_PRICE_IDS as readonly string[]).includes(id)) {
      errors.push(`${key}: maps to INVALID price ID ${id}`);
    }
    if (!id.startsWith('pri_')) {
      errors.push(`${key}: malformed price ID ${id}`);
    }
  }
  return errors;
}
