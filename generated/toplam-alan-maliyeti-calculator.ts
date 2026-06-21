// Auto-generated premium calculator: toplam-alan-maliyeti
import * as z from 'zod';

export interface ToplamAlanMaliyetiInput {
  brutMaasIkramiyeMesai: number;
  yanHaklar: number;
  yasalKesintiOranları: number;
  devamsızlıkSaati: number;
  turnoverOranı: number;
  IseAlımEgitimMaliyeti: number;
  UretkenSaat: number;
}

export const ToplamAlanMaliyetiInputSchema = z.object({
  brutMaasIkramiyeMesai: z.number().min(0).default(0),
  yanHaklar: z.number().min(0).default(0),
  yasalKesintiOranları: z.number().min(0).default(0),
  devamsızlıkSaati: z.number().min(0).default(0),
  turnoverOranı: z.number().min(0).default(0),
  IseAlımEgitimMaliyeti: z.number().min(0).default(0),
  UretkenSaat: z.number().min(0).default(0),
});

function toNumericFormulaValue(value) {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input) {
  const results = {};
  try { const v = input.basePay * input.bonuses * input.overtime; results["grossSalary"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["grossSalary"] = Number.NaN; }
  try { const v = input.grossSalary * input.socialSecurity * input.unemployment * input.taxes; results["statutoryCosts"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["statutoryCosts"] = Number.NaN; }
  try { const v = input.healthInsurance * input.retirement * input.meals * input.transport; results["benefits"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["benefits"] = Number.NaN; }
  try { const v = input.absentHours * input.fullyBurdenedRate; results["absenteeismCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["absenteeismCost"] = Number.NaN; }
  try { const v = input.recruitment * input.training * input.turnoverRate; results["turnoverCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["turnoverCost"] = Number.NaN; }
  try { const v = input.grossSalary * input.statutoryCosts * input.benefits * input.absenteeismCost * input.turnoverCost; results["totalEmployeeCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalEmployeeCost"] = Number.NaN; }
  try { const v = input.totalEmployeeCost * input.productiveHours; results["costPerHour"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["costPerHour"] = Number.NaN; }
  return results;
}

export function calculateToplamAlanMaliyeti(input) {
  return evaluateAllFormulas(input);
}
