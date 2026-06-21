// Auto-generated premium calculator: oee-ve-durma-sresi
import * as z from 'zod';

export interface OeeVeDurmaSresiInput {
  planlıGercek CalısmaSuresi: number;
  Ideal Cevrim: number;
  toplamSaglamAdet: number;
  dakikaBasınaDurusMaliyeti: number;
  birimMaliyet: number;
  takvimSuresiAllTime: number;
}

export const OeeVeDurmaSresiInputSchema = z.object({
  planlıGercek CalısmaSuresi: z.number().min(0).default(0),
  Ideal Cevrim: z.number().min(0).default(0),
  toplamSaglamAdet: z.number().min(0).default(0),
  dakikaBasınaDurusMaliyeti: z.number().min(0).default(0),
  birimMaliyet: z.number().min(0).default(0),
  takvimSuresiAllTime: z.number().min(0).default(0),
});

function toNumericFormulaValue(value) {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input) {
  const results = {};
  try { const v = input.operatingTime * input.plannedProductionTime; results["availability"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["availability"] = Number.NaN; }
  try { const v = input.idealCycleTime * input.totalCount * input.operatingTime; results["performance"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["performance"] = Number.NaN; }
  try { const v = input.goodCount * input.totalCount; results["quality"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["quality"] = Number.NaN; }
  try { const v = input.availability * input.performance * input.quality; results["oEE"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["oEE"] = Number.NaN; }
  try { const v = input.oEE * input.plannedProductionTime * input.allTime; results["tEEP"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["tEEP"] = Number.NaN; }
  try { const v = input.plannedProductionTime * input.operatingTime * input.costPerMinute; results["downtimeCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["downtimeCost"] = Number.NaN; }
  try { const v = input.operatingTime * input.idealCycleTime * input.totalCount * input.costPerMinute; results["speedLoss"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["speedLoss"] = Number.NaN; }
  try { const v = input.totalCount * input.goodCount * input.unitCost; results["qualityLoss"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["qualityLoss"] = Number.NaN; }
  return results;
}

export function calculateOeeVeDurmaSresi(input) {
  return evaluateAllFormulas(input);
}
