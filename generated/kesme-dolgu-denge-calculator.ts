// Auto-generated premium calculator: kesme-dolgu-denge
import * as z from 'zod';

export interface KesmeDolguDengeInput {
  enkesitAlanlarıKesimDolgu: number;
  IstasyonMesafeleri: number;
  SismeKuculmeFaktorleri: number;
  nakliyeBirimFiyatı: number;
  OduncDepoAlanıMesafesi: number;
}

export const KesmeDolguDengeInputSchema = z.object({
  enkesitAlanlarıKesimDolgu: z.number().min(0).default(0),
  IstasyonMesafeleri: z.number().min(0).default(0),
  SismeKuculmeFaktorleri: z.number().min(0).default(0),
  nakliyeBirimFiyatı: z.number().min(0).default(0),
  OduncDepoAlanıMesafesi: z.number().min(0).default(0),
});

function toNumericFormulaValue(value) {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input) {
  const results = {};
  try { const v = input.areaCutI * input.distanceI; results["volumeCut"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["volumeCut"] = Number.NaN; }
  try { const v = input.areaFillI * input.distanceI; results["volumeFill"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["volumeFill"] = Number.NaN; }
  try { const v = input.compactedVolume * input.looseVolume; results["shrinkageFactor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["shrinkageFactor"] = Number.NaN; }
  try { const v = input.looseVolume * input.bankVolume; results["swellFactor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["swellFactor"] = Number.NaN; }
  try { const v = input.volumeCut * input.volumeFill * input.shrinkageFactor; results["netBalance"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["netBalance"] = Number.NaN; }
  try { const v = input.volumeFill * input.shrinkageFactor * input.volumeCut; results["borrowRequired"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["borrowRequired"] = Number.NaN; }
  try { const v = input.volumeCut * input.volumeFill * input.shrinkageFactor; results["wasteRequired"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["wasteRequired"] = Number.NaN; }
  try { const v = input.volumeI * input.distanceI * input.unitHaulCost; results["haulCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["haulCost"] = Number.NaN; }
  return results;
}

export function calculateKesmeDolguDenge(input) {
  return evaluateAllFormulas(input);
}
