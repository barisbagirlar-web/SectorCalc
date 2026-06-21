// Auto-generated premium calculator: enflasyon-eskalasyon
import * as z from 'zod';

export interface EnflasyonEskalasyonInput {
  bazMalzeme: number;
  malzemeEnflasyon: number;
  baz Iscilik: number;
  UcretArtıs: number;
  sure: number;
  risk: string;
  nominalGenelEnflasyon: number;
}

export const EnflasyonEskalasyonInputSchema = z.object({
  bazMalzeme: z.number().min(0).default(0),
  malzemeEnflasyon: z.number().min(0).default(0),
  baz Iscilik: z.number().min(0).default(0),
  UcretArtıs: z.number().min(0).default(0),
  sure: z.number().min(0).default(0),
  risk: z.number().min(0).default(0),
  nominalGenelEnflasyon: z.number().min(0).default(0),
});

function toNumericFormulaValue(value) {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input) {
  const results = {};
  try { const v = input.inflMat * input.years; results["escMat"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["escMat"] = Number.NaN; }
  try { const v = input.inflLab * input.years; results["escLab"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["escLab"] = Number.NaN; }
  try { const v = input.baseMat * input.escMat * input.baseLab * input.escLab; results["baseAdj"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["baseAdj"] = Number.NaN; }
  try { const v = input.nominal * input.infl; results["realDisc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["realDisc"] = Number.NaN; }
  try { const v = input.cash * input.esc * input.nom * input.t; results["nPVNom"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["nPVNom"] = Number.NaN; }
  try { const v = input.cash * input.real * input.t; results["nPVReal"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["nPVReal"] = Number.NaN; }
  try { const v = input.baseAdj * input.confFactor; results["contingency"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["contingency"] = Number.NaN; }
  try { const v = input.baseAdj * input.contingency; results["total"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["total"] = Number.NaN; }
  return results;
}

export function calculateEnflasyonEskalasyon(input) {
  return evaluateAllFormulas(input);
}
