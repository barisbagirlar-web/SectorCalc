// Auto-generated premium calculator: talep-forecast-stok-maliyet
import * as z from 'zod';

export interface TalepForecastStokMaliyetInput {
  tahminGercekTalepArray: number;
  leadTimeGun: number;
  zSkoru: number;
  stdDev: number;
  birimMaliyet: number;
  tasımaOranı: number;
  stoksuzKalmaCezası: number;
}

export const TalepForecastStokMaliyetInputSchema = z.object({
  tahminGercekTalepArray: z.number().min(0).default(0),
  leadTimeGun: z.number().min(0).default(0),
  zSkoru: z.number().min(0).default(0),
  stdDev: z.number().min(0).default(0),
  birimMaliyet: z.number().min(0).default(0),
  tasımaOranı: z.number().min(0).default(0),
  stoksuzKalmaCezası: z.number().min(0).default(0),
});

function toNumericFormulaValue(value) {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input) {
  const results = {};
  try { const v = input.actualDemand * input.forecastDemand; results["forecastError"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["forecastError"] = Number.NaN; }
  try { const v = input.zScore * input.stdDevForecastError * input.leadTime; results["safetyStock"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["safetyStock"] = Number.NaN; }
  try { const v = input.safetyStock * input.unitCost * input.holdingRate; results["carryingCostSafety"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["carryingCostSafety"] = Number.NaN; }
  try { const v = input.actualDemand * input.forecastDemand * input.safetyStock * input.penaltyCost; results["stockoutCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["stockoutCost"] = Number.NaN; }
  try { const v = input.carryingCostSafety * input.stockoutCost * input.forecastingSystemCost; results["totalForecastCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalForecastCost"] = Number.NaN; }
  return results;
}

export function calculateTalepForecastStokMaliyet(input) {
  return evaluateAllFormulas(input);
}
