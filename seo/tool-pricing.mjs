/**
 * Tool session-tier SSOT for discovery + catalog injectors.
 * Credit quantities must match src/billing/domain/packages.ts + functions/src/domain/packages.ts.
 * Guard: scripts/verify-tool-pricing-ssot.mjs
 *
 * Rubric (higher when all rise): defendable-decision stakes × engine depth × cost-of-being-wrong.
 */
export const TIER_CREDITS = Object.freeze({
  FREE: 0,
  CORE: 3,
  PRO: 7,
  ADVANCED: 15,
  DECISION: 30, // reserved — no tools assigned yet
});

/** @typedef {'FREE'|'CORE'|'PRO'|'ADVANCED'|'DECISION'} PricingTier */

/**
 * @type {Readonly<Record<string, { tier: PricingTier; monetizationEnabled: boolean }>>}
 */
export const TOOL_PRICING = Object.freeze({
  'SC-001': { tier: 'FREE', monetizationEnabled: false },
  'SC-010': { tier: 'CORE', monetizationEnabled: true },
  'SC-012': { tier: 'PRO', monetizationEnabled: true },
  'SC-028': { tier: 'FREE', monetizationEnabled: false },
  'SC-037': { tier: 'CORE', monetizationEnabled: true },
  'SC-038': { tier: 'CORE', monetizationEnabled: true },
  'SC-021': { tier: 'PRO', monetizationEnabled: true },
  'SC-022': { tier: 'PRO', monetizationEnabled: true },
  'SC-023': { tier: 'CORE', monetizationEnabled: true },
  'SC-024': { tier: 'CORE', monetizationEnabled: true },
  'SC-025': { tier: 'PRO', monetizationEnabled: true },
  'SC-026': { tier: 'ADVANCED', monetizationEnabled: true },
  'SC-027': { tier: 'FREE', monetizationEnabled: false },
  'SC-030': { tier: 'FREE', monetizationEnabled: false },
  'SC-031': { tier: 'ADVANCED', monetizationEnabled: true },
  'SC-032': { tier: 'ADVANCED', monetizationEnabled: true },
  'SC-035': { tier: 'PRO', monetizationEnabled: true },
  'SC-039': { tier: 'FREE', monetizationEnabled: false },
  'SC-040': { tier: 'PRO', monetizationEnabled: true },
  'SC-008': { tier: 'ADVANCED', monetizationEnabled: true },
  'SC-020': { tier: 'ADVANCED', monetizationEnabled: true },
  'SC-029': { tier: 'ADVANCED', monetizationEnabled: true },
  'SC-033': { tier: 'ADVANCED', monetizationEnabled: true },
  'SC-034': { tier: 'ADVANCED', monetizationEnabled: true },
  'SC-036': { tier: 'ADVANCED', monetizationEnabled: true },
});

export function resolveToolCost(toolId) {
  const row = TOOL_PRICING[toolId];
  if (!row) return null;
  return {
    tier: row.tier,
    creditCost: TIER_CREDITS[row.tier],
    monetizationEnabled: row.monetizationEnabled,
  };
}

export function isCreditRequired(toolId) {
  const row = resolveToolCost(toolId);
  if (!row) return false;
  if (row.tier === 'FREE' || row.creditCost <= 0) return false;
  return row.monetizationEnabled;
}

/** Sitemap / discovery rank: lower = earlier. */
export function tierSitemapRank(toolId) {
  const row = TOOL_PRICING[toolId];
  if (!row || row.tier === 'FREE') return 0;
  if (row.tier === 'CORE') return 1;
  if (row.tier === 'PRO') return 2;
  if (row.tier === 'ADVANCED') return 3;
  return 4;
}

/**
 * @param {PricingTier} tier
 * @returns {string[]}
 */
export function toolIdsForTier(tier) {
  return Object.entries(TOOL_PRICING)
    .filter(([, v]) => v.tier === tier)
    .map(([id]) => id)
    .sort();
}

export const SESSION_TIER_ORDER = Object.freeze(['CORE', 'PRO', 'ADVANCED']);
