// Auto-generated premium calculator: restaurant-men-marj-kaak
import * as z from 'zod';

export interface RestaurantMenMarjKaakInput {
  satılan UrunAdetleri: number;
  baslangıcBitisStok: number;
  porsiyonMaliyetleri: number;
  kayıtlıFire: number;
  IkramIptalTutarı: number;
  toplamYemekSatısı: number;
}

export const RestaurantMenMarjKaakInputSchema = z.object({
  satılan UrunAdetleri: z.number().min(0).default(0),
  baslangıcBitisStok: z.number().min(0).default(0),
  porsiyonMaliyetleri: z.number().min(0).default(0),
  kayıtlıFire: z.number().min(0).default(0),
  IkramIptalTutarı: z.number().min(0).default(0),
  toplamYemekSatısı: z.number().min(0).default(0),
});

function toNumericFormulaValue(value) {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input) {
  const results = {};
  try { const v = input.itemsSoldI * input.portionCostI; results["theoreticalFoodCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["theoreticalFoodCost"] = Number.NaN; }
  try { const v = input.beginningInventory * input.purchases * input.endingInventory; results["actualFoodCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["actualFoodCost"] = Number.NaN; }
  try { const v = input.actualFoodCost * input.theoreticalFoodCost; results["variance"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["variance"] = Number.NaN; }
  try { const v = input.variance * input.totalFoodSales; results["variancePct"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["variancePct"] = Number.NaN; }
  try { const v = input.recordedWaste * input.avgPortionCost; results["wasteCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["wasteCost"] = Number.NaN; }
  try { const v = input.variance * input.wasteCost * input.compMeals; results["theftLoss"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["theftLoss"] = Number.NaN; }
  try { const v = input.theoreticalFoodCost * input.totalFoodSales; results["idealMargin"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["idealMargin"] = Number.NaN; }
  try { const v = input.actualFoodCost * input.totalFoodSales; results["actualMargin"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["actualMargin"] = Number.NaN; }
  return results;
}

export function calculateRestaurantMenMarjKaak(input) {
  return evaluateAllFormulas(input);
}
