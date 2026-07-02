/**
 * SectorCalc Pro - pricing copy lock (Revenue Flow v1A).
 * Canonical pricing lives in revenue-tools.ts; re-exported here for pricing pages.
 */

export {
 revenueLegalDisclaimer as REVENUE_LEGAL_DISCLAIMER,
 sectorCalcProPricing,
 sectorCalcProPricing as SECTORCALC_PRO,
} from "@/lib/features/tools/revenue-tools";

import {
 revenueLegalDisclaimer,
 sectorCalcProPricing,
} from "@/lib/features/tools/revenue-tools";

export const REVENUE_LEGAL_DISCLAIMER_PAID =
 `${revenueLegalDisclaimer} Digital product. No refunds.`;

export const SECTORCALC_PRO_PRICE = sectorCalcProPricing.priceMonthly;
export const SECTORCALC_PRO_PRICE_LABEL = `$${sectorCalcProPricing.priceMonthly}/month`;

/** @deprecated Use sectorCalcProPricing from revenue-tools */
export const SECTORCALC_PRO_PRICING = {
 id: "pro" as const,
 name: sectorCalcProPricing.planName,
 price: sectorCalcProPricing.priceMonthly,
 priceLabel: SECTORCALC_PRO_PRICE_LABEL,
 tagline: sectorCalcProPricing.headline,
 description: sectorCalcProPricing.description,
 features: sectorCalcProPricing.bullets.slice(0, 5),
 freePlanContrast: [
 "No safe price or accept/reject verdict",
 "No decision summaries",
 "No export",
 ],
 laterRelease: sectorCalcProPricing.bullets.slice(5),
} as const;

export const FREE_PLAN_PRICING = {
 id: "free" as const,
 name: "Free",
 priceLabel: "$0",
 period: "forever",
 description:
 "Quick sector checks - limited inputs, directional numbers and early risk signals.",
 features: [
 "Seventeen industry quick-check calculators",
 "2–3 inputs per tool",
 "Risk or preview signals",
 "No account required",
 ],
} as const;
