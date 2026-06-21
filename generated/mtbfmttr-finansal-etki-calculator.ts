// Auto-generated premium calculator: mtbfmttr-finansal-etki
import * as z from 'zod';

export interface MtbfmttrFinansalEtkiInput {
  mTBFSaat: number;
  mTTRSaat: number;
  arızaSayısı: number;
  durusSaatMaliyeti: number;
  ortalamaTamir IscilikParca: number;
  toplam CalısmaSuresi: number;
  hedefAvailability: number;
}

export const MtbfmttrFinansalEtkiInputSchema = z.object({
  mTBFSaat: z.number().min(0).default(0),
  mTTRSaat: z.number().min(0).default(0),
  arızaSayısı: z.number().min(0).default(0),
  durusSaatMaliyeti: z.number().min(0).default(0),
  ortalamaTamir IscilikParca: z.number().min(0).default(0),
  toplam CalısmaSuresi: z.number().min(0).default(0),
  hedefAvailability: z.number().min(0).default(0),
});

function toNumericFormulaValue(value) {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input) {
  const results = {};
  try { const v = input.mTBF * input.mTTR; results["availability"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["availability"] = Number.NaN; }
  try { const v = input.totalTime * input.availability; results["expectedDowntime"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["expectedDowntime"] = Number.NaN; }
  try { const v = input.expectedDowntime * input.costPerHour; results["downtimeCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["downtimeCost"] = Number.NaN; }
  try { const v = input.totalTime * input.mTBF; results["failureFrequency"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["failureFrequency"] = Number.NaN; }
  try { const v = input.failureFrequency * input.mTTR * input.laborRate * input.partsCost; results["repairCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["repairCost"] = Number.NaN; }
  try { const v = input.downtimeCost * input.repairCost; results["totalReliabilityCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalReliabilityCost"] = Number.NaN; }
  try { const v = input.oldCost * input.newCost * input.investmentCost; results["rOIImprovement"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["rOIImprovement"] = Number.NaN; }
  try { const v = input.totalTime * input.targetAvailability; results["targetMTBF"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["targetMTBF"] = Number.NaN; }
  return results;
}

export function calculateMtbfmttrFinansalEtki(input) {
  return evaluateAllFormulas(input);
}
