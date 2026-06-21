// Auto-generated premium calculator: darboaz-yatirim
import * as z from 'zod';

export interface DarboazYatirimInput {
  tasarımGercekKapasite: number;
  talep: number;
  darbogazSuresi: number;
  taktTime: number;
  oEE: number;
  yatırımBedeli: number;
  marj: number;
}

export const DarboazYatirimInputSchema = z.object({
  tasarımGercekKapasite: z.number().min(0).default(0),
  talep: z.number().min(0).default(0),
  darbogazSuresi: z.number().min(0).default(0),
  taktTime: z.number().min(0).default(0),
  oEE: z.number().min(0).default(0),
  yatırımBedeli: z.number().min(0).default(0),
  marj: z.number().min(0).default(0),
});

function toNumericFormulaValue(value) {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input) {
  const results = {};
  try { const v = input.actualOutput * input.designCapacity; results["utilization"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["utilization"] = Number.NaN; }
  try { const v = input.demand * input.defectRate; results["throughput"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["throughput"] = Number.NaN; }
  try { const v = input.availableTime * input.demand; results["taktTime"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["taktTime"] = Number.NaN; }
  try { const v = input.bottleneckCycle * input.taktTime; results["cycleTimeGap"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["cycleTimeGap"] = Number.NaN; }
  try { const v = input.cycleTimeGap * input.demand * input.unitMargin; results["costOfConstraint"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["costOfConstraint"] = Number.NaN; }
  try { const v = input.throughputIncrease * input.margin * input.days * input.upgradeCost; results["rOI"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["rOI"] = Number.NaN; }
  try { const v = input.upgradeCost * input.monthlyGain; results["payback"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["payback"] = Number.NaN; }
  return results;
}

export function calculateDarboazYatirim(input) {
  return evaluateAllFormulas(input);
}
