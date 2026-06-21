// Auto-generated premium calculator: baaba-noktasi
import * as z from 'zod';

export interface BaabaNoktasiInput {
  sabitMaliyetler: number;
  birimDegiskenMaliyet: number;
  birimFiyat: number;
  guncelHacim: number;
  guncelGelir: number;
  hedefKar: number;
}

export const BaabaNoktasiInputSchema = z.object({
  sabitMaliyetler: z.number().min(0).default(0),
  birimDegiskenMaliyet: z.number().min(0).default(0),
  birimFiyat: z.number().min(0).default(0),
  guncelHacim: z.number().min(0).default(0),
  guncelGelir: z.number().min(0).default(0),
  hedefKar: z.number().min(0).default(0),
});

function toNumericFormulaValue(value) {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input) {
  const results = {};
  try { const v = input.fixedCosts * input.unitPrice * input.unitVariableCost; results["bEPUnits"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["bEPUnits"] = Number.NaN; }
  try { const v = input.fixedCosts * input.cMR; results["bEPRevenue"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["bEPRevenue"] = Number.NaN; }
  try { const v = input.unitPrice * input.unitVariableCost; results["cMR"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["cMR"] = Number.NaN; }
  try { const v = input.actualSales * input.bEPUnits; results["marginOfSafetyPercent"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["marginOfSafetyPercent"] = Number.NaN; }
  try { const v = input.contributionMargin * input.netOperatingIncome; results["operatingLeverage"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["operatingLeverage"] = Number.NaN; }
  try { const v = input.fixedCosts * input.targetProfit * input.unitContributionMargin; results["targetProfitUnits"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["targetProfitUnits"] = Number.NaN; }
  return results;
}

export function calculateBaabaNoktasi(input) {
  return evaluateAllFormulas(input);
}
