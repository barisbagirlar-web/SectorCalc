// Auto-generated premium calculator: muda-atk-maliyet
import * as z from 'zod';

export interface MudaAtkMaliyetInput {
  asırı UretimAdedi: number;
  beklemeHareketSuresi: number;
  tasımaMesafesiSefer: number;
  fazla IslemSuresi: number;
  hatalıAdet: number;
  birimStokTasımaIscilikMaliyetleri: number;
}

export const MudaAtkMaliyetInputSchema = z.object({
  asırı UretimAdedi: z.number().min(0).default(0),
  beklemeHareketSuresi: z.number().min(0).default(0),
  tasımaMesafesiSefer: z.number().min(0).default(0),
  fazla IslemSuresi: z.number().min(0).default(0),
  hatalıAdet: z.number().min(0).default(0),
  birimStokTasımaIscilikMaliyetleri: z.number().min(0).default(0),
});

function toNumericFormulaValue(value) {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input) {
  const results = {};
  try { const v = input.excessUnits * input.unitCost; results["overproduction"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["overproduction"] = Number.NaN; }
  try { const v = input.waitingHours * input.laborRate * input.machineRate; results["waiting"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["waiting"] = Number.NaN; }
  try { const v = input.transportDistance * input.costPerMeter * input.trips; results["transport"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["transport"] = Number.NaN; }
  try { const v = input.actualTime * input.standardTime * input.laborRate; results["overprocessing"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["overprocessing"] = Number.NaN; }
  try { const v = input.excessInventory * input.holdingCostRate * input.time; results["inventory"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["inventory"] = Number.NaN; }
  try { const v = input.unnecessaryMotionTime * input.laborRate; results["motion"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["motion"] = Number.NaN; }
  try { const v = input.defectUnits * input.materialCost * input.reworkCost; results["defects"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["defects"] = Number.NaN; }
  try { const v = input.overproduction * input.waiting * input.transport * input.overprocessing * input.inventory * input.motion * input.defects; results["totalMudaCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalMudaCost"] = Number.NaN; }
  return results;
}

export function calculateMudaAtkMaliyet(input) {
  return evaluateAllFormulas(input);
}
