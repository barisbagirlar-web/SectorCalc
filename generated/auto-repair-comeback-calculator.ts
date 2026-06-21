// Auto-generated premium calculator: auto-repair-comeback
import * as z from 'zod';

export interface AutoRepairComebackInput {
  tamamlananRO: number;
  geriDonusRO: number;
  teshisSuresi: number;
  IsrafParcaDegeri: number;
  korfezDolulukSuresi: number;
  churnOlasılıgı: number;
}

export const AutoRepairComebackInputSchema = z.object({
  tamamlananRO: z.number().min(0).default(0),
  geriDonusRO: z.number().min(0).default(0),
  teshisSuresi: z.number().min(0).default(0),
  IsrafParcaDegeri: z.number().min(0).default(0),
  korfezDolulukSuresi: z.number().min(0).default(0),
  churnOlasılıgı: z.number().min(0).default(0),
});

function toNumericFormulaValue(value) {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input) {
  const results = {};
  try { const v = input.comebackOrders * input.totalCompleted; results["comebackRate"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["comebackRate"] = Number.NaN; }
  try { const v = input.comebackOrders * input.diagTime * input.repairTime * input.laborRate; results["comebackCostDirect"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["comebackCostDirect"] = Number.NaN; }
  try { const v = input.comebackOrders * input.wastedPartsValue; results["comebackCostParts"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["comebackCostParts"] = Number.NaN; }
  try { const v = input.comebackOrders * input.bayOccupancyHours * input.revenuePerBayHour; results["comebackCostOpportunity"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["comebackCostOpportunity"] = Number.NaN; }
  try { const v = input.comebackOrders * input.totalCompleted; results["dPMO"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["dPMO"] = Number.NaN; }
  try { const v = input.direct * input.parts * input.warranty * input.goodwill * input.opportunity; results["totalCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalCost"] = Number.NaN; }
  return results;
}

export function calculateAutoRepairComeback(input) {
  return evaluateAllFormulas(input);
}
