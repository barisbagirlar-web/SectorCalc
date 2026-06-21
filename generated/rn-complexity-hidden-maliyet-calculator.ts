// Auto-generated premium calculator: rn-complexity-hidden-maliyet
import * as z from 'zod';

export interface RnComplexityHiddenMaliyetInput {
  sKUSayısı: number;
  bOMDerinligi: number;
  degisimSayısıMaliyeti: number;
  toplamGuvenlikStogu: number;
  dolaylıGiderler: number;
  karmasıklıkSurucuOranı: number;
}

export const RnComplexityHiddenMaliyetInputSchema = z.object({
  sKUSayısı: z.number().min(0).default(0),
  bOMDerinligi: z.number().min(0).default(0),
  degisimSayısıMaliyeti: z.number().min(0).default(0),
  toplamGuvenlikStogu: z.number().min(0).default(0),
  dolaylıGiderler: z.number().min(0).default(0),
  karmasıklıkSurucuOranı: z.number().min(0).default(0),
});

function toNumericFormulaValue(value) {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input) {
  const results = {};
  try { const v = input.numberOfSKUs * input.averageBOMDepth; results["complexityIndex"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["complexityIndex"] = Number.NaN; }
  try { const v = input.changeovers * input.setupCostPerChange; results["setupCostComplexity"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["setupCostComplexity"] = Number.NaN; }
  try { const v = input.safetyStockAllSKUs * input.holdingRate; results["inventoryCostComplexity"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["inventoryCostComplexity"] = Number.NaN; }
  try { const v = input.totalIndirectCosts * input.complexityDriverPct; results["overheadAllocation"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["overheadAllocation"] = Number.NaN; }
  try { const v = input.setupCostComplexity * input.inventoryCostComplexity * input.overheadAllocation * input.traditionalOverhead; results["hiddenCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["hiddenCost"] = Number.NaN; }
  try { const v = input.revenueSKU * input.directCostSKU * input.hiddenCostSKU; results["profitabilityPerSKU"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["profitabilityPerSKU"] = Number.NaN; }
  return results;
}

export function calculateRnComplexityHiddenMaliyet(input) {
  return evaluateAllFormulas(input);
}
