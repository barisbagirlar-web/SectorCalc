// Auto-generated premium calculator: beton-hacmi
import * as z from 'zod';

export interface BetonHacmiInput {
  dosemeUzunlukGenislikKalınlık: number;
  temelKolonSayısı: number;
  betonSınıfı: string;
  yogunluk: number;
  fireOranı: number;
  birimFiyat: number;
}

export const BetonHacmiInputSchema = z.object({
  dosemeUzunlukGenislikKalınlık: z.number().min(0).default(0),
  temelKolonSayısı: z.number().min(0).default(0),
  betonSınıfı: z.number().min(0).default(0),
  yogunluk: z.number().min(0).default(0),
  fireOranı: z.number().min(0).default(0),
  birimFiyat: z.number().min(0).default(0),
});

function toNumericFormulaValue(value) {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input) {
  const results = {};
  try { const v = input.length * input.width * input.thickness; results["vSlab"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["vSlab"] = Number.NaN; }
  try { const v = input.length * input.width * input.depth * input.count; results["vFooting"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["vFooting"] = Number.NaN; }
  try { const v = input.diameter * input.height * input.count; results["vColumn"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["vColumn"] = Number.NaN; }
  try { const v = input.length * input.height * input.thickness; results["vWall"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["vWall"] = Number.NaN; }
  try { const v = input.vGeometric * input.wasteFactor; results["vTotal"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["vTotal"] = Number.NaN; }
  try { const v = input.vTotal * input.density; results["weight"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["weight"] = Number.NaN; }
  try { const v = input.vTotal * input.truckCapacity; results["truckLoads"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["truckLoads"] = Number.NaN; }
  try { const v = input.vTotal * input.unitPrice * input.pumpCost; results["totalCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalCost"] = Number.NaN; }
  return results;
}

export function calculateBetonHacmi(input) {
  return evaluateAllFormulas(input);
}
