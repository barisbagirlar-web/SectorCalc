// Auto-generated premium calculator: environmental-fire
import * as z from 'zod';

export interface EnvironmentalFireInput {
  tehlikesizTehlikeliGeriDonusum: number;
  havaEmisyon: number;
  depolamaBertarafBedeli: number;
  hurdaGelir: number;
  cezaRisk: number;
}

export const EnvironmentalFireInputSchema = z.object({
  tehlikesizTehlikeliGeriDonusum: z.number().min(0).default(0),
  havaEmisyon: z.number().min(0).default(0),
  depolamaBertarafBedeli: z.number().min(0).default(0),
  hurdaGelir: z.number().min(0).default(0),
  cezaRisk: z.number().min(0).default(0),
});

function toNumericFormulaValue(value) {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input) {
  const results = {};
  try { const v = input.waste * input.dispFee; results["costDisp"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["costDisp"] = Number.NaN; }
  try { const v = input.hazMass * input.hazFee * input.surcharge; results["costHaz"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["costHaz"] = Number.NaN; }
  try { const v = input.recycMass * input.sortCost * input.scrapRev; results["costRecyc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["costRecyc"] = Number.NaN; }
  try { const v = input.air * input.carbonPrice * input.water * input.treatCost; results["costEmis"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["costEmis"] = Number.NaN; }
  try { const v = input.probViolation * input.fine; results["penaltyRisk"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["penaltyRisk"] = Number.NaN; }
  try { const v = input.disp * input.haz * input.recyc * input.emis * input.penalty; results["total"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["total"] = Number.NaN; }
  try { const v = input.totalWaste * input.volume; results["wasteIntensity"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["wasteIntensity"] = Number.NaN; }
  try { const v = input.recyc * input.totalWaste; results["circularity"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["circularity"] = Number.NaN; }
  return results;
}

export function calculateEnvironmentalFire(input) {
  return evaluateAllFormulas(input);
}
