// Auto-generated premium calculator: reete-maliyet-check
import * as z from 'zod';

export interface ReeteMaliyetCheckInput {
  giren CıkanAgırlık: number;
  fireScrap: number;
  receteOranları: number;
  teorikVerim: number;
  hammaddeOrtalamaFiyatları: number;
  hedefBirimMaliyet: number;
}

export const ReeteMaliyetCheckInputSchema = z.object({
  giren CıkanAgırlık: z.number().min(0).default(0),
  fireScrap: z.number().min(0).default(0),
  receteOranları: z.number().min(0).default(0),
  teorikVerim: z.number().min(0).default(0),
  hammaddeOrtalamaFiyatları: z.number().min(0).default(0),
  hedefBirimMaliyet: z.number().min(0).default(0),
});

function toNumericFormulaValue(value) {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input) {
  const results = {};
  try { const v = input.formulationPctI * input.ingredientPriceI; results["theoreticalCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["theoreticalCost"] = Number.NaN; }
  try { const v = input.totalMaterialConsumed * input.avgPrice * input.totalOutput; results["actualCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["actualCost"] = Number.NaN; }
  try { const v = input.actualCost * input.theoreticalCost; results["variance"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["variance"] = Number.NaN; }
  try { const v = input.actualYield * input.theoreticalCost; results["yieldLossCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["yieldLossCost"] = Number.NaN; }
  try { const v = input.inputWeight * input.outputWeight * input.knownScrap; results["evaporationLoss"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["evaporationLoss"] = Number.NaN; }
  try { const v = input.actualOutput * input.theoreticalOutput; results["efficiency"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["efficiency"] = Number.NaN; }
  try { const v = input.actualCost * input.outputWeight; results["costPerKg"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["costPerKg"] = Number.NaN; }
  return results;
}

export function calculateReeteMaliyetCheck(input) {
  return evaluateAllFormulas(input);
}
