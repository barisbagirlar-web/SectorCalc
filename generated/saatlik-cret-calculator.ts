// Auto-generated premium calculator: saatlik-cret
import * as z from 'zod';

export interface SaatlikCretInput {
  brutMaas: number;
  Ikramiye: number;
  yanHaklar: number;
  IsverenVergiOranı: number;
  yıllıkHaftaSaat: number;
  IzinHaftası: number;
  atılZaman: number;
  hedefKarMarjı: number;
}

export const SaatlikCretInputSchema = z.object({
  brutMaas: z.number().min(0).default(0),
  Ikramiye: z.number().min(0).default(0),
  yanHaklar: z.number().min(0).default(0),
  IsverenVergiOranı: z.number().min(0).default(0),
  yıllıkHaftaSaat: z.number().min(0).default(0),
  IzinHaftası: z.number().min(0).default(0),
  atılZaman: z.number().min(0).default(0),
  hedefKarMarjı: z.number().min(0).default(0),
});

function toNumericFormulaValue(value) {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input) {
  const results = {};
  try { const v = input.baseSalary * input.bonuses; results["grossAnnualSalary"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["grossAnnualSalary"] = Number.NaN; }
  try { const v = input.grossAnnualSalary * input.taxRate; results["employerTaxes"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["employerTaxes"] = Number.NaN; }
  try { const v = input.healthInsurance * input.retirementMatch * input.paidTimeOffCost; results["benefits"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["benefits"] = Number.NaN; }
  try { const v = input.grossAnnualSalary * input.employerTaxes * input.benefits; results["totalLaborCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalLaborCost"] = Number.NaN; }
  try { const v = input.weeksPerYear * input.vacationWeeks * input.hoursPerWeek * input.idleTimePct; results["productiveHours"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["productiveHours"] = Number.NaN; }
  try { const v = input.totalLaborCost * input.productiveHours; results["fullyBurdenedHourlyRate"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["fullyBurdenedHourlyRate"] = Number.NaN; }
  try { const v = input.fullyBurdenedHourlyRate * input.targetMargin; results["marginRate"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["marginRate"] = Number.NaN; }
  return results;
}

export function calculateSaatlikCret(input) {
  return evaluateAllFormulas(input);
}
