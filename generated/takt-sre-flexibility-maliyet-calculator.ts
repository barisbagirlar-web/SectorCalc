// Auto-generated premium calculator: takt-sre-flexibility-maliyet
import * as z from 'zod';

export interface TaktSreFlexibilityMaliyetInput {
  CevrimSureleriArray: number;
  kullanılabilirSureDk: number;
  musteriTalebiAdet: number;
  operatorSayısı: number;
  CaprazEgitimSaati: number;
  IscilikDengeKaybıMaliyeti: number;
}

export const TaktSreFlexibilityMaliyetInputSchema = z.object({
  CevrimSureleriArray: z.number().min(0).default(0),
  kullanılabilirSureDk: z.number().min(0).default(0),
  musteriTalebiAdet: z.number().min(0).default(0),
  operatorSayısı: z.number().min(0).default(0),
  CaprazEgitimSaati: z.number().min(0).default(0),
  IscilikDengeKaybıMaliyeti: z.number().min(0).default(0),
});

function toNumericFormulaValue(value) {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input) {
  const results = {};
  try { const v = input.availableTime * input.customerDemand; results["taktTime"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["taktTime"] = Number.NaN; }
  try { const v = input.cycleTimeI; results["cycleTimeFlexibility"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["cycleTimeFlexibility"] = Number.NaN; }
  try { const v = input.taktTime * input.cycleTimeI * input.laborRate; results["balanceLoss"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["balanceLoss"] = Number.NaN; }
  try { const v = input.operators * input.trainingHours * input.trainerRate; results["crossTrainingCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["crossTrainingCost"] = Number.NaN; }
  try { const v = input.crossTrainingCost * input.annualProduction; results["flexibilityPremium"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["flexibilityPremium"] = Number.NaN; }
  try { const v = input.demand * input.capacity * input.overtimeRate * input.idleLaborCost; results["volumeVariationCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["volumeVariationCost"] = Number.NaN; }
  return results;
}

export function calculateTaktSreFlexibilityMaliyet(input) {
  return evaluateAllFormulas(input);
}
