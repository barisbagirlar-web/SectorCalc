// Auto-generated premium calculator: mahsul-verim-kayb-analizr
import * as z from 'zod';

export interface MahsulVerimKaybAnalizrInput {
  genetikPotansiyelKgda: number;
  CevreFaktoru: number;
  hasatEdilenKg: number;
  zararlıHavaBesinKayıpOranları: number;
  piyasaFiyatıCurrencykg: number;
  mudahaleMaliyeti: number;
}

export const MahsulVerimKaybAnalizrInputSchema = z.object({
  genetikPotansiyelKgda: z.number().min(0).default(0),
  CevreFaktoru: z.number().min(0).default(0),
  hasatEdilenKg: z.number().min(0).default(0),
  zararlıHavaBesinKayıpOranları: z.number().min(0).default(0),
  piyasaFiyatıCurrencykg: z.number().min(0).default(0),
  mudahaleMaliyeti: z.number().min(0).default(0),
});

function toNumericFormulaValue(value) {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input) {
  const results = {};
  try { const v = input.geneticPotential * input.environmentFactor; results["potentialYield"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["potentialYield"] = Number.NaN; }
  try { const v = input.harvestedWeight * input.area; results["actualYield"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["actualYield"] = Number.NaN; }
  try { const v = input.potentialYield * input.actualYield; results["yieldGap"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["yieldGap"] = Number.NaN; }
  try { const v = input.pestDamagePct * input.potentialYield; results["lossPest"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["lossPest"] = Number.NaN; }
  try { const v = input.weatherStressPct * input.potentialYield; results["lossWeather"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["lossWeather"] = Number.NaN; }
  try { const v = input.nutrientDeficiencyPct * input.potentialYield; results["lossNutrient"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["lossNutrient"] = Number.NaN; }
  try { const v = input.yieldGap * input.marketPrice; results["financialLoss"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["financialLoss"] = Number.NaN; }
  try { const v = input.financialLossRecovered * input.interventionCost; results["rOIIntervention"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["rOIIntervention"] = Number.NaN; }
  return results;
}

export function calculateMahsulVerimKaybAnalizr(input) {
  return evaluateAllFormulas(input);
}
