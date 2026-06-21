// Auto-generated premium calculator: malzeme-replacement-maliyet
import * as z from 'zod';

export interface MalzemeReplacementMaliyetInput {
  mevcutAlternatifMalzemeMaliyetiCurrencykg: number;
  agırlıklar: number;
  IslemeBakımImhaMaliyetleri: number;
  kalifikasyonTestMaliyeti: number;
  yakıtTasarrufuParametreleri: number;
  toolingYatırımı: number;
}

export const MalzemeReplacementMaliyetInputSchema = z.object({
  mevcutAlternatifMalzemeMaliyetiCurrencykg: z.number().min(0).default(0),
  agırlıklar: z.number().min(0).default(0),
  IslemeBakımImhaMaliyetleri: z.number().min(0).default(0),
  kalifikasyonTestMaliyeti: z.number().min(0).default(0),
  yakıtTasarrufuParametreleri: z.number().min(0).default(0),
  toolingYatırımı: z.number().min(0).default(0),
});

function toNumericFormulaValue(value) {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input) {
  const results = {};
  try { const v = input.matCostCurrent * input.processingCostCurrent * input.lifecycleMaintCurrent * input.disposalCostCurrent; results["tCOCurrent"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["tCOCurrent"] = Number.NaN; }
  try { const v = input.matCostAlt * input.processingCostAlt * input.lifecycleMaintAlt * input.disposalCostAlt; results["tCOAlternative"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["tCOAlternative"] = Number.NaN; }
  try { const v = input.weightCurrent * input.weightAlt; results["weightSavings"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["weightSavings"] = Number.NaN; }
  try { const v = input.weightSavings * input.fuelFactor * input.lifecycleDistance * input.fuelPrice; results["fuelSavings"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["fuelSavings"] = Number.NaN; }
  try { const v = input.tCOCurrent * input.tCOAlternative * input.fuelSavings * input.qualityPremium; results["netBenefit"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["netBenefit"] = Number.NaN; }
  try { const v = input.toolingCostAlt * input.qualificationCost * input.annualNetBenefit; results["payback"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["payback"] = Number.NaN; }
  return results;
}

export function calculateMalzemeReplacementMaliyet(input) {
  return evaluateAllFormulas(input);
}
