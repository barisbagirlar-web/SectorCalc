// Auto-generated premium calculator: tohum-oran
import * as z from 'zod';

export interface TohumOranInput {
  alanM2: number;
  hedefBitkiSayısıM2: number;
  CimlenmeTarla CıkısOranı: number;
  tohumKgFiyatı: number;
  mahsulPiyasaFiyatıCurrencykg: number;
  hedefVerimKg: number;
}

export const TohumOranInputSchema = z.object({
  alanM2: z.number().min(0).default(0),
  hedefBitkiSayısıM2: z.number().min(0).default(0),
  CimlenmeTarla CıkısOranı: z.number().min(0).default(0),
  tohumKgFiyatı: z.number().min(0).default(0),
  mahsulPiyasaFiyatıCurrencykg: z.number().min(0).default(0),
  hedefVerimKg: z.number().min(0).default(0),
});

function toNumericFormulaValue(value) {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input) {
  const results = {};
  try { const v = input.area * input.desiredPlantsPerSqm; results["targetPlantPopulation"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["targetPlantPopulation"] = Number.NaN; }
  try { const v = input.targetPlantPopulation * input.germinationRate * input.fieldEmergenceRate; results["seedRequirement"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["seedRequirement"] = Number.NaN; }
  try { const v = input.seedRequirement * input.pricePerKg; results["seedCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["seedCost"] = Number.NaN; }
  try { const v = input.f * input.plantPopulation * input.soilFertility * input.water; results["optimalYield"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["optimalYield"] = Number.NaN; }
  try { const v = input.targetYield * input.actualYield * input.cropPrice; results["financialLossUnder"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["financialLossUnder"] = Number.NaN; }
  try { const v = input.actualSeed * input.optimalSeed * input.seedCost; results["financialLossOver"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["financialLossOver"] = Number.NaN; }
  try { const v = input.optimalYield * input.cropPrice * input.seedCost; results["rOISeed"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["rOISeed"] = Number.NaN; }
  return results;
}

export function calculateTohumOran(input) {
  return evaluateAllFormulas(input);
}
