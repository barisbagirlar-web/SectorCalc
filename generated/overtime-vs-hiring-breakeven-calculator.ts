// Auto-generated premium calculator: overtime-vs-hiring-breakeven
import * as z from 'zod';

export interface OvertimeVsHiringBreakevenInput {
  IseAlımEgitimMaliyeti: number;
  yanHaklar: number;
  normalFazlaMesai Ucreti: number;
  mesai Carpanı: number;
  yorgunlukHataOranı: number;
  hataMaliyeti: number;
  beklenenMesaiSaati: number;
}

export const OvertimeVsHiringBreakevenInputSchema = z.object({
  IseAlımEgitimMaliyeti: z.number().min(0).default(0),
  yanHaklar: z.number().min(0).default(0),
  normalFazlaMesai Ucreti: z.number().min(0).default(0),
  mesai Carpanı: z.number().min(0).default(0),
  yorgunlukHataOranı: z.number().min(0).default(0),
  hataMaliyeti: z.number().min(0).default(0),
  beklenenMesaiSaati: z.number().min(0).default(0),
});

function toNumericFormulaValue(value) {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input) {
  const results = {};
  try { const v = input.regularRate * input.overtimeMultiplier * input.burdenRate; results["overtimeCostHour"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["overtimeCostHour"] = Number.NaN; }
  try { const v = input.recruitment * input.onboarding * input.training * input.rampUpProductivityLoss; results["hiringCostTotal"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["hiringCostTotal"] = Number.NaN; }
  try { const v = input.regularRate * input.annualHours * input.burdenRate * input.benefits; results["annualNewHireCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["annualNewHireCost"] = Number.NaN; }
  try { const v = input.hiringCostTotal * input.annualNewHireCost * input.annualHours * input.overtimeCostHour; results["breakevenHours"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["breakevenHours"] = Number.NaN; }
  try { const v = input.expectedOvertimeHours * input.breakevenHours * input.hire * input.overtime; results["decision"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["decision"] = Number.NaN; }
  try { const v = input.overtimeHours * input.fatigueDefectRate * input.defectCost; results["qualityCostOT"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["qualityCostOT"] = Number.NaN; }
  return results;
}

export function calculateOvertimeVsHiringBreakeven(input) {
  return evaluateAllFormulas(input);
}
