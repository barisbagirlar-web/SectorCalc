// Auto-generated premium calculator: filament-recycling
import * as z from 'zod';

export interface FilamentRecyclingInput {
  safFiyatFire: number;
  toplamaPellet: number;
  verim: number;
  enerji: number;
  mukavemetKayıp: number;
  karbon: number;
}

export const FilamentRecyclingInputSchema = z.object({
  safFiyatFire: z.number().min(0).default(0),
  toplamaPellet: z.number().min(0).default(0),
  verim: z.number().min(0).default(0),
  enerji: z.number().min(0).default(0),
  mukavemetKayıp: z.number().min(0).default(0),
  karbon: z.number().min(0).default(0),
});

function toNumericFormulaValue(value) {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input) {
  const results = {};
  try { const v = input.priceV * input.scrapV * input.transpV; results["costVirgin"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["costVirgin"] = Number.NaN; }
  try { const v = input.collect * input.sort * input.pellet * input.yield; results["costRecyc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["costRecyc"] = Number.NaN; }
  try { const v = input.tensileV * input.tensileR * input.appFactor; results["qualPenalty"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["qualPenalty"] = Number.NaN; }
  try { const v = input.energyV * input.energyR * input.energyCost; results["energySav"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["energySav"] = Number.NaN; }
  try { const v = input.cO2V * input.cO2R * input.carbonPrice; results["carbonCred"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["carbonCred"] = Number.NaN; }
  try { const v = input.costRecyc * input.qualPenalty * input.energySav * input.carbonCred; results["totalR"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalR"] = Number.NaN; }
  try { const v = input.costV * input.totalR * input.vol * input.capex; results["rOI"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["rOI"] = Number.NaN; }
  return results;
}

export function calculateFilamentRecycling(input) {
  return evaluateAllFormulas(input);
}
