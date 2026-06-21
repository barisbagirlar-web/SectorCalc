// Auto-generated premium calculator: i-verim-orani-irr
import * as z from 'zod';

export interface IVerimOraniIrrInput {
  baslangıc: number;
  nakitAkısları: number;
  OmurN: number;
  kalıntı: number;
  wACC: number;
  yenidenYatırım: number;
  Iskonto: number;
}

export const IVerimOraniIrrInputSchema = z.object({
  baslangıc: z.number().min(0).default(0),
  nakitAkısları: z.number().min(0).default(0),
  OmurN: z.number().min(0).default(0),
  kalıntı: z.number().min(0).default(0),
  wACC: z.number().min(0).default(0),
  yenidenYatırım: z.number().min(0).default(0),
  Iskonto: z.number().min(0).default(0),
});

function toNumericFormulaValue(value) {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input) {
  const results = {};
  try { const v = input.cashT * input.r * input.t; results["nPV"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["nPV"] = Number.NaN; }
  try { const v = input.r * input.where; results["iRR"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["iRR"] = Number.NaN; }
  try { const v = input.fVPos * input.pVNeg * input.n; results["mIRR"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["mIRR"] = Number.NaN; }
  try { const v = input.yearBefore * input.unrecovered * input.cashRec; results["payback"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["payback"] = Number.NaN; }
  try { const v = input.pVFuture * input.initInv; results["pI"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["pI"] = Number.NaN; }
  try { const v = input.r * input.n; results["annuity"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["annuity"] = Number.NaN; }
  try { const v = input.deltaIRR * input.deltaVar; results["sens"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sens"] = Number.NaN; }
  return results;
}

export function calculateIVerimOraniIrr(input) {
  return evaluateAllFormulas(input);
}
