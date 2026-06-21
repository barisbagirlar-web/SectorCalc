// Auto-generated premium calculator: depo-yerleimi
import * as z from 'zod';

export interface DepoYerleimiInput {
  tabanAlanı: number;
  depolamaOranı: number;
  rafSeviye: number;
  palet Olcu: string;
  koridor: number;
  forklift: string;
  gunlukSevkıyat: number;
}

export const DepoYerleimiInputSchema = z.object({
  tabanAlanı: z.number().min(0).default(0),
  depolamaOranı: z.number().min(0).default(0),
  rafSeviye: z.number().min(0).default(0),
  palet Olcu: z.number().min(0).default(0),
  koridor: z.number().min(0).default(0),
  forklift: z.number().min(0).default(0),
  gunlukSevkıyat: z.number().min(0).default(0),
});

function toNumericFormulaValue(value) {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input) {
  const results = {};
  try { const v = input.footprint * input.utilRate; results["storageArea"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["storageArea"] = Number.NaN; }
  try { const v = input.storageArea * input.palletFootprint * input.aisleFactor; results["palletPositions"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["palletPositions"] = Number.NaN; }
  try { const v = input.palletPositions * input.rackLevels; results["verticalCap"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["verticalCap"] = Number.NaN; }
  try { const v = input.doors * input.turnaroundLoad * input.turnaroundUnload; results["throughputCap"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["throughputCap"] = Number.NaN; }
  try { const v = input.freq * input.dist; results["travelDist"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["travelDist"] = Number.NaN; }
  try { const v = input.lines * input.travelTime; results["pickEfficiency"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["pickEfficiency"] = Number.NaN; }
  try { const v = input.actualVol * input.rackVol; results["cubeUtil"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["cubeUtil"] = Number.NaN; }
  try { const v = input.facilityCost * input.palletPositions; results["costPerPos"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["costPerPos"] = Number.NaN; }
  return results;
}

export function calculateDepoYerleimi(input) {
  return evaluateAllFormulas(input);
}
