/**
 * Comparison-tool outputs that may be negative (signed net positions).
 * Rent vs buy net positions are relative economics, not spend amounts.
 */

export const SIGNED_CURRENCY_OUTPUT_IDS = new Set<string>([
  "rentNetPosition",
  "buyNetPosition",
  "netDifference",
  "recommendedPriceDifference",
]);

export function allowsSignedCurrencyOutput(variableId: string): boolean {
  return SIGNED_CURRENCY_OUTPUT_IDS.has(variableId);
}
