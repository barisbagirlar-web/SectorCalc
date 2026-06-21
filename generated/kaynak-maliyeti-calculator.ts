// Auto-generated premium calculator: kaynak-maliyeti
import * as z from 'zod';

export interface KaynakMaliyetiInput {
  toplamKaynakMetresi: number;
  vardiyaSuresi: number;
  IlerlemeHızıCmmin: number;
  arkSuresiOranı: number;
  dolguGazEnerjiMaliyeti: number;
  IscilikOverhead: number;
}

export const KaynakMaliyetiInputSchema = z.object({
  toplamKaynakMetresi: z.number().min(0).default(0),
  vardiyaSuresi: z.number().min(0).default(0),
  IlerlemeHızıCmmin: z.number().min(0).default(0),
  arkSuresiOranı: z.number().min(0).default(0),
  dolguGazEnerjiMaliyeti: z.number().min(0).default(0),
  IscilikOverhead: z.number().min(0).default(0),
});

function toNumericFormulaValue(value) {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input) {
  const results = {};
  try { const v = input.arcTime * input.totalShiftTime; results["operatingFactor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["operatingFactor"] = Number.NaN; }
  try { const v = input.weightDeposited * input.arcTime; results["depositionRate"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["depositionRate"] = Number.NaN; }
  try { const v = input.length * input.travelSpeed * input.laborRate * input.overheadRate * input.operatingFactor * input.fillerCost * input.gasCost * input.powerCost; results["totalJointCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalJointCost"] = Number.NaN; }
  try { const v = input.totalJointCost * input.length; results["costPerMeter"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["costPerMeter"] = Number.NaN; }
  try { const v = input.fillerCost * input.totalJointCost; results["consumableCostPct"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["consumableCostPct"] = Number.NaN; }
  try { const v = input.laborCost * input.totalJointCost; results["laborCostPct"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["laborCostPct"] = Number.NaN; }
  return results;
}

export function calculateKaynakMaliyeti(input) {
  return evaluateAllFormulas(input);
}
