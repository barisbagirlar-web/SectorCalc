// Auto-generated premium calculator: vsm-finansal-dntrc
import * as z from 'zod';

export interface VsmFinansalDntrcInput {
  toplamLeadTimeGun: number;
  katmaDegerliSureDk: number;
  wIPStokDegeri: number;
  gunlukTasımaMaliyeti: number;
  eskiYeni CevrimSuresiDk: number;
  yıllıkHacim: number;
  kalite IyilestirmeTasarrufu: number;
}

export const VsmFinansalDntrcInputSchema = z.object({
  toplamLeadTimeGun: z.number().min(0).default(0),
  katmaDegerliSureDk: z.number().min(0).default(0),
  wIPStokDegeri: z.number().min(0).default(0),
  gunlukTasımaMaliyeti: z.number().min(0).default(0),
  eskiYeni CevrimSuresiDk: z.number().min(0).default(0),
  yıllıkHacim: z.number().min(0).default(0),
  kalite IyilestirmeTasarrufu: z.number().min(0).default(0),
});

function toNumericFormulaValue(value) {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input) {
  const results = {};
  try { const v = input.wIPInventory * input.dailyCarryingCost * input.totalLeadTimeDays; results["leadTimeCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["leadTimeCost"] = Number.NaN; }
  try { const v = input.valueAddedTime * input.totalLeadTime; results["valueAddedRatio"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["valueAddedRatio"] = Number.NaN; }
  try { const v = input.totalLeadTime * input.valueAddedTime * input.costPerMinute; results["nonValueAddedCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["nonValueAddedCost"] = Number.NaN; }
  try { const v = input.oldWIP * input.newWIP * input.carryingRate; results["inventoryReductionSavings"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["inventoryReductionSavings"] = Number.NaN; }
  try { const v = input.oldCycleTime * input.newCycleTime * input.annualVolume * input.laborRate; results["productivityGain"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["productivityGain"] = Number.NaN; }
  try { const v = input.inventoryReductionSavings * input.productivityGain * input.qualityImprovementSavings; results["totalFinancialImpact"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalFinancialImpact"] = Number.NaN; }
  return results;
}

export function calculateVsmFinansalDntrc(input) {
  return evaluateAllFormulas(input);
}
