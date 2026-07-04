/**
 * Free traffic calculators - permanently purged. All exports return empty.
 */

export const FREE_TRAFFIC_CALCULATORS: readonly any[] = [];
export const FREE_TRAFFIC_CALCULATOR_SLUGS: readonly string[] = [];

export function hasDedicatedTrafficCalculator(_slug: string): boolean { return false; }
export function listFreeTrafficCalculatorSlugs(): string[] { return []; }
export function calculateFreeTrafficTool(_slug: string, _values: any, _locale?: string): any {
  return { headline: "N/A", primaryLabel: "Status", primaryValue: "N/A", secondaryValues: [], explanation: "Free tools purged.", missingFactors: [], legalNote: "" };
}
export type FreeTrafficInputValues = Record<string, number | string>;
export type FreeTrafficResult = Record<string, any>;
export type FreeTrafficCalculatorEntry = any;
