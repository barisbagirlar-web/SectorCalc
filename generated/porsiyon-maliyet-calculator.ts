// Auto-generated premium calculator: porsiyon-maliyet
import * as z from 'zod';

export interface PorsiyonMaliyetInput {
  receteMiktarları: number;
  hazırlıkSuresi: number;
  fireYield: number;
  hammaddeBirimFiyatları: number;
  IscilikSaati: number;
  overheadOranı: number;
  hedefFoodCost: number;
  menuFiyatı: number;
}

export const PorsiyonMaliyetInputSchema = z.object({
  receteMiktarları: z.number().min(0).default(0),
  hazırlıkSuresi: z.number().min(0).default(0),
  fireYield: z.number().min(0).default(0),
  hammaddeBirimFiyatları: z.number().min(0).default(0),
  IscilikSaati: z.number().min(0).default(0),
  overheadOranı: z.number().min(0).default(0),
  hedefFoodCost: z.number().min(0).default(0),
  menuFiyatı: z.number().min(0).default(0),
});

function toNumericFormulaValue(value) {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input) {
  const results = {};
  try { const v = input.quantityI * input.unitPriceI; results["ingredientCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["ingredientCost"] = Number.NaN; }
  try { const v = input.ingredientCost * input.yieldPct; results["yieldAdjustedCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["yieldAdjustedCost"] = Number.NaN; }
  try { const v = input.prepTime * input.laborRate; results["laborCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["laborCost"] = Number.NaN; }
  try { const v = input.ingredientCost * input.laborCost * input.overheadPct; results["overhead"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["overhead"] = Number.NaN; }
  try { const v = input.yieldAdjustedCost * input.laborCost * input.overhead; results["totalPortionCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalPortionCost"] = Number.NaN; }
  try { const v = input.totalPortionCost * input.menuPrice; results["foodCostPct"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["foodCostPct"] = Number.NaN; }
  try { const v = input.totalPortionCost * input.targetFoodCostPct; results["menuPriceTarget"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["menuPriceTarget"] = Number.NaN; }
  try { const v = input.menuPrice * input.totalPortionCost; results["margin"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["margin"] = Number.NaN; }
  return results;
}

export function calculatePorsiyonMaliyet(input) {
  return evaluateAllFormulas(input);
}
