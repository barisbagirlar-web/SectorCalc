// Auto-generated premium calculator: basin-vessel-kalinlik
import * as z from 'zod';

export interface BasinVesselKalinlikInput {
  IcBasıncP: number;
  IcYarıcapR: number;
  kapakTipi: string;
  malzeme: string;
  tasarımSıcaklıgı: number;
  gerilmeS: number;
  kaynakVerimiE: number;
  korozyonPayıCA: number;
}

export const BasinVesselKalinlikInputSchema = z.object({
  IcBasıncP: z.number().min(0).default(0),
  IcYarıcapR: z.number().min(0).default(0),
  kapakTipi: z.number().min(0).default(0),
  malzeme: z.number().min(0).default(0),
  tasarımSıcaklıgı: z.number().min(0).default(0),
  gerilmeS: z.number().min(0).default(0),
  kaynakVerimiE: z.number().min(0).default(0),
  korozyonPayıCA: z.number().min(0).default(0),
});

function toNumericFormulaValue(value) {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input) {
  const results = {};
  try { const v = input.p * input.r * input.s * input.e * input.cA; results["tShell"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["tShell"] = Number.NaN; }
  try { const v = input.p * input.r * input.s * input.e * input.cA; results["tSphere"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["tSphere"] = Number.NaN; }
  try { const v = input.p * input.d * input.s * input.e * input.cA; results["tHeadEllip"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["tHeadEllip"] = Number.NaN; }
  try { const v = input.l * input.r; results["m"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["m"] = Number.NaN; }
  try { const v = input.p * input.l * input.m * input.s * input.e * input.cA; results["tHeadTori"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["tHeadTori"] = Number.NaN; }
  try { const v = input.s * input.e * input.t * input.cA * input.r; results["mAWP"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["mAWP"] = Number.NaN; }
  return results;
}

export function calculateBasinVesselKalinlik(input) {
  return evaluateAllFormulas(input);
}
