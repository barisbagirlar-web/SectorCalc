// Auto-generated premium calculator: cnc-ileme-maliyeti
import * as z from 'zod';

export interface CncIlemeMaliyetiInput {
  kgFiyat: number;
  yogunluk: number;
  makine Ucreti: number;
  takım Omru: number;
  takımMaliyeti: number;
  enerjiTarifesi: number;
  gider Carpanı: number;
}

export const CncIlemeMaliyetiInputSchema = z.object({
  kgFiyat: z.number().min(0).default(0),
  yogunluk: z.number().min(0).default(0),
  makine Ucreti: z.number().min(0).default(0),
  takım Omru: z.number().min(0).default(0),
  takımMaliyeti: z.number().min(0).default(0),
  enerjiTarifesi: z.number().min(0).default(0),
  gider Carpanı: z.number().min(0).default(0),
});

function toNumericFormulaValue(value) {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input) {
  const results = {};
  try { const v = input.volumeRaw * input.density * input.pricePerKg * input.scrapRate; results["costMaterial"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["costMaterial"] = Number.NaN; }
  try { const v = input.tTotal * input.machineRate; results["costMachining"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["costMachining"] = Number.NaN; }
  try { const v = input.tCut * input.toolLife * input.toolCost; results["costTooling"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["costTooling"] = Number.NaN; }
  try { const v = input.tTotal * input.elecRate; results["costEnergy"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["costEnergy"] = Number.NaN; }
  try { const v = input.tTotal * input.overheadRate; results["costOverhead"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["costOverhead"] = Number.NaN; }
  try { const v = input.material * input.machining * input.tooling * input.energy * input.overhead * input.quality; results["totalUnitCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalUnitCost"] = Number.NaN; }
  return results;
}

export function calculateCncIlemeMaliyeti(input) {
  return evaluateAllFormulas(input);
}
