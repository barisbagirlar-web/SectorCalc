/**
 * Sector-Specific Naive Cost Calculators & Margin Leak Detectors (Stubs)
 */

import type {
 MarginCoreInputValues,
 MarginLeakItem,
} from "@/lib/types/margincore-engine";

export const VERDICT_LABELS: Record<string, { accept: string; caution: string; reject: string }> = {};

export const NAIVE_COST_CALCULATORS: Record<string, (inputs: MarginCoreInputValues) => number> = {};

export const MARGIN_LEAK_DETECTORS: Record<
 string,
 (inputs: MarginCoreInputValues, naiveCost: number) => MarginLeakItem[]
> = {};

export function getNaiveCostCalculator(sectorSlug: string): (inputs: MarginCoreInputValues) => number {
 return NAIVE_COST_CALCULATORS[sectorSlug] ?? ((inputs) => {
 // Fallback: sum all numeric inputs that look like costs
 let total = 0;
 for (const [key, val] of Object.entries(inputs)) {
 if (typeof val === "number" && /cost|price|fee|rate|overhead/i.test(key)) {
 total += val;
 }
 }
 return total || 100;
 });
}

/** Get margin leak detector for a sector */
export function getMarginLeakDetector(
 sectorSlug: string,
): (inputs: MarginCoreInputValues, naiveCost: number) => MarginLeakItem[] {
 return MARGIN_LEAK_DETECTORS[sectorSlug] ?? (() => []);
}

/** Get verdict labels for a sector */
export function getVerdictLabels(sectorSlug: string): { accept: string; caution: string; reject: string } {
 return VERDICT_LABELS[sectorSlug] ?? { accept: "SAFE", caution: "CAUTION", reject: "REJECT" };
}