// Auto-generated premium calculator: tekrarlayan-maliyet-rca
import * as z from 'zod';

export interface TekrarlayanMaliyetRcaInput {
  yıllıkFrekans: number;
  olayBasınaMaliyet: number;
  duzelticiAksiyonYatırımı: number;
  IskontoOranıR: number;
  analiz OmruNYıl: number;
}

export const TekrarlayanMaliyetRcaInputSchema = z.object({
  yıllıkFrekans: z.number().min(0).default(0),
  olayBasınaMaliyet: z.number().min(0).default(0),
  duzelticiAksiyonYatırımı: z.number().min(0).default(0),
  IskontoOranıR: z.number().min(0).default(0),
  analiz OmruNYıl: z.number().min(0).default(0),
});

function toNumericFormulaValue(value) {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input) {
  const results = {};
  try { const v = input.frequency * input.costPerEvent; results["recurringCostAnnual"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["recurringCostAnnual"] = Number.NaN; }
  try { const v = input.recurringCostAnnual * input.r * input.n; results["presentValueRecurring"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["presentValueRecurring"] = Number.NaN; }
  try { const v = input.correctiveActionCost * input.implementationCost; results["rootCauseInvestment"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["rootCauseInvestment"] = Number.NaN; }
  try { const v = input.rootCauseInvestment * input.recurringCostAnnual; results["paybackPeriod"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["paybackPeriod"] = Number.NaN; }
  try { const v = input.presentValueRecurring * input.rootCauseInvestment; results["nPVElimination"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["nPVElimination"] = Number.NaN; }
  try { const v = input.rootCauseInvestment * input.costPerEvent; results["breakevenFrequency"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["breakevenFrequency"] = Number.NaN; }
  return results;
}

export function calculateTekrarlayanMaliyetRca(input) {
  return evaluateAllFormulas(input);
}
