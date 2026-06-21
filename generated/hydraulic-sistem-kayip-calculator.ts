// Auto-generated premium calculator: hydraulic-sistem-kayip
import * as z from 'zod';

export interface HydraulicSistemKayipInput {
  basınc: number;
  pompaDebisi: number;
  kacak: number;
  boruDusum: number;
  vanaKayıp: number;
  saat: number;
  verim: number;
  tarif: number;
}

export const HydraulicSistemKayipInputSchema = z.object({
  basınc: z.number().min(0).default(0),
  pompaDebisi: z.number().min(0).default(0),
  kacak: z.number().min(0).default(0),
  boruDusum: z.number().min(0).default(0),
  vanaKayıp: z.number().min(0).default(0),
  saat: z.number().min(0).default(0),
  verim: z.number().min(0).default(0),
  tarif: z.number().min(0).default(0),
});

function toNumericFormulaValue(value) {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input) {
  const results = {};
  try { const v = input.qLeak * input.p; results["lossLeak"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["lossLeak"] = Number.NaN; }
  try { const v = input.deltaPPipe * input.qFlow; results["lossFric"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["lossFric"] = Number.NaN; }
  try { const v = input.deltaPValve * input.qFlow; results["lossValve"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["lossValve"] = Number.NaN; }
  try { const v = input.lossLeak * input.lossFric * input.lossValve; results["heat"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["heat"] = Number.NaN; }
  try { const v = input.pOut * input.pIn; results["eff"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["eff"] = Number.NaN; }
  try { const v = input.heat * input.hours * input.elecRate; results["costLoss"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["costLoss"] = Number.NaN; }
  try { const v = input.tAvg * input.thresh * input.fluidCost; results["degrade"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["degrade"] = Number.NaN; }
  try { const v = input.heat * input.cOP * input.elecRate; results["cool"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["cool"] = Number.NaN; }
  return results;
}

export function calculateHydraulicSistemKayip(input) {
  return evaluateAllFormulas(input);
}
