// Auto-generated premium calculator: cnc-evrim-sresi
import * as z from 'zod';

export interface CncEvrimSresiInput {
  vc: number;
  fz: number;
  ap: number;
  dtool: number;
  l: number;
  vrapid: number;
  takımDegisim: number;
  yuklemeBosaltma: number;
}

export const CncEvrimSresiInputSchema = z.object({
  vc: z.number().min(0).default(0),
  fz: z.number().min(0).default(0),
  ap: z.number().min(0).default(0),
  dtool: z.number().min(0).default(0),
  l: z.number().min(0).default(0),
  vrapid: z.number().min(0).default(0),
  takımDegisim: z.number().min(0).default(0),
  yuklemeBosaltma: z.number().min(0).default(0),
});

function toNumericFormulaValue(value) {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input) {
  const results = {};
  try { const v = input.l * input.d * input.vF * input.aP; results["tCut"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["tCut"] = Number.NaN; }
  try { const v = input.fZ * input.z * input.n; results["vF"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["vF"] = Number.NaN; }
  try { const v = input.vC * input.dTool; results["n"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["n"] = Number.NaN; }
  try { const v = input.distanceRapid * input.vRapid; results["tRapid"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["tRapid"] = Number.NaN; }
  try { const v = input.changes * input.timePerChange; results["tToolchange"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["tToolchange"] = Number.NaN; }
  try { const v = input.tCut * input.tRapid * input.tToolchange * input.tNoncutting * input.tLoadUnload; results["tTotal"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["tTotal"] = Number.NaN; }
  try { const v = input.planned * input.downtime; results["oEEAvailability"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["oEEAvailability"] = Number.NaN; }
  return results;
}

export function calculateCncEvrimSresi(input) {
  return evaluateAllFormulas(input);
}
