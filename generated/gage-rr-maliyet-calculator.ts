// Auto-generated premium calculator: gage-rr-maliyet
import * as z from 'zod';

export interface GageRrMaliyetInput {
  parcaN: number;
  operator: number;
  tekrarR: number;
  veri: number;
  tolerans: number;
  yanlısKabulRed: number;
  toplamKalite: number;
}

export const GageRrMaliyetInputSchema = z.object({
  parcaN: z.number().min(0).default(0),
  operator: z.number().min(0).default(0),
  tekrarR: z.number().min(0).default(0),
  veri: z.number().min(0).default(0),
  tolerans: z.number().min(0).default(0),
  yanlısKabulRed: z.number().min(0).default(0),
  toplamKalite: z.number().min(0).default(0),
});

function toNumericFormulaValue(value) {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input) {
  const results = {};
  try { const v = input.rangeAvg * input.d2Star; results["eV"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["eV"] = Number.NaN; }
  try { const v = input.rangeOps * input.d2Star * input.eV * input.n * input.r; results["aV"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["aV"] = Number.NaN; }
  try { const v = input.eV * input.aV; results["gRR"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["gRR"] = Number.NaN; }
  try { const v = input.rangeParts * input.d2Star; results["pV"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["pV"] = Number.NaN; }
  try { const v = input.gRR * input.pV; results["tV"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["tV"] = Number.NaN; }
  try { const v = input.gRR * input.tV; results["pctGRR"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["pctGRR"] = Number.NaN; }
  try { const v = input.falseAcc * input.escapeCost * input.falseRej * input.scrapCost; results["costError"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["costError"] = Number.NaN; }
  try { const v = input.gRR; results["optTol"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["optTol"] = Number.NaN; }
  try { const v = input.pctGRR * input.totalQualCost; results["finImpact"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["finImpact"] = Number.NaN; }
  return results;
}

export function calculateGageRrMaliyet(input) {
  return evaluateAllFormulas(input);
}
