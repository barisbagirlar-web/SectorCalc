/**
 * Phase 2 money-page SSOT helpers.
 * Tier-A calculator pages must satisfy the 16-block search→revenue contract.
 */
import { publishedCalculators } from './registry.mjs';
import { QUERY_OWNERSHIP } from './query-ownership.mjs';

/** Ordered Phase-2 Tier-A money page primaryEntity ids (mandate list). */
export const TIER_A_MONEY_ENTITIES = Object.freeze([
  'tolerance-stack-up',
  'cnc-feeds-speeds',
  'machine-hour-rate',
  'quote-pricing',
  'true-labor-cost',
  'oee-teep',
  'bearing-life-l10',
  'bolt-torque-preload',
  'bolted-joint',
  'pipe-wall-thickness',
  'pressure-vessel-shell',
  'weld-heat-input',
]);

/** Contract block ids verified by verify:seo:money (02 = live calculator UI). */
export const MONEY_BLOCKS = Object.freeze([
  '01', // direct answer (near H1)
  '02', // working calculator (DOM presence)
  '03', // decision supported
  '04', // required inputs
  '05', // formula / method
  '06', // worked example (engine-generated)
  '07', // result interpretation
  '08', // sensitivity
  '09', // assumptions
  '10', // model boundaries / limitations
  '11', // common mistakes
  '12', // standard / reference scope
  '13', // A1-A5 audit explanation
  '14', // related glossary
  '15', // related guide / calculators
  '16', // commercial next step
]);

export function tierAMoneyCalculators() {
  const byEntity = new Map(publishedCalculators().map((p) => [p.primaryEntity, p]));
  return TIER_A_MONEY_ENTITIES.map((entity) => {
    const page = byEntity.get(entity);
    if (!page) throw new Error(`Tier-A money entity missing from registry: ${entity}`);
    if (page.revenueTier !== 'A') throw new Error(`${entity} is not revenueTier A`);
    return page;
  });
}

export function ownershipForPath(canonicalPath) {
  return QUERY_OWNERSHIP.find((c) => c.owner === canonicalPath) || null;
}

export function findPrimaryQueryConflicts() {
  return QUERY_OWNERSHIP.filter((c) => TIER_A_MONEY_ENTITIES.some((e) => {
    const page = publishedCalculators().find((p) => p.primaryEntity === e);
    return page && c.owner === page.canonicalPath;
  })).flatMap((c) => {
    const rivals = QUERY_OWNERSHIP.filter(
      (o) => o.clusterId !== c.clusterId && o.primaryQuery.toLowerCase() === c.primaryQuery.toLowerCase(),
    );
    return rivals.map((r) => ({ primaryQuery: c.primaryQuery, owners: [c.owner, r.owner] }));
  });
}
