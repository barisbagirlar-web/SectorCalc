// Auto-generated premium calculator: ati-alani
import * as z from 'zod';

export interface AtiAlaniInput {
  uzunlukGenislik: number;
  sacakPayı: number;
  CatıTipi: string;
  egimAcısı: number;
  karYukuBolgesi: string;
  fireOranı: number;
}

export const AtiAlaniInputSchema = z.object({
  uzunlukGenislik: z.number().min(0).default(0),
  sacakPayı: z.number().min(0).default(0),
  CatıTipi: z.number().min(0).default(0),
  egimAcısı: z.number().min(0).default(0),
  karYukuBolgesi: z.number().min(0).default(0),
  fireOranı: z.number().min(0).default(0),
});

function toNumericFormulaValue(value) {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input) {
  const results = {};
  try { const v = input.length * input.width; results["areaFootprint"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["areaFootprint"] = Number.NaN; }
  try { const v = input.footprint * input.pitchAngle; results["areaGable"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["areaGable"] = Number.NaN; }
  try { const v = input.perimeter * input.overhangWidth; results["overhangArea"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["overhangArea"] = Number.NaN; }
  try { const v = input.areaRoof * input.wasteFactor; results["totalMaterialArea"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalMaterialArea"] = Number.NaN; }
  try { const v = input.length * input.width; results["ridgeLength"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["ridgeLength"] = Number.NaN; }
  try { const v = input.materialWeight * input.totalArea; results["loadDead"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["loadDead"] = Number.NaN; }
  try { const v = input.groundSnow * input.exposure * input.thermal * input.slope; results["loadSnow"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["loadSnow"] = Number.NaN; }
  return results;
}

export function calculateAtiAlani(input) {
  return evaluateAllFormulas(input);
}
