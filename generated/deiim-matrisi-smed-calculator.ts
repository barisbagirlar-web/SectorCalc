// Auto-generated premium calculator: deiim-matrisi-smed
import * as z from 'zod';

export interface DeiimMatrisiSmedInput {
  IcDısAyarSuresi: number;
  aylıkDegisim: number;
  donusturmeOranı: number;
  yıllıkTalep: number;
  tasımaMaliyeti: number;
  makine Ucreti: number;
}

export const DeiimMatrisiSmedInputSchema = z.object({
  IcDısAyarSuresi: z.number().min(0).default(0),
  aylıkDegisim: z.number().min(0).default(0),
  donusturmeOranı: z.number().min(0).default(0),
  yıllıkTalep: z.number().min(0).default(0),
  tasımaMaliyeti: z.number().min(0).default(0),
  makine Ucreti: z.number().min(0).default(0),
});

function toNumericFormulaValue(value) {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input) {
  const results = {};
  try { const v = input.setupStopped; results["tInternal"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["tInternal"] = Number.NaN; }
  try { const v = input.setupRunning; results["tExternal"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["tExternal"] = Number.NaN; }
  try { const v = input.tInternal * input.tExternal; results["tTotal"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["tTotal"] = Number.NaN; }
  try { const v = input.tInternal * input.conversionRate * input.tExternal; results["tTarget"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["tTarget"] = Number.NaN; }
  try { const v = input.demand * input.setupCost * input.holdingCost; results["eBQ"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["eBQ"] = Number.NaN; }
  try { const v = input.tTotal * input.machineRate * input.labor; results["setupCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["setupCost"] = Number.NaN; }
  try { const v = input.tTotal * input.tTarget * input.freq * input.rate; results["annualSavings"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["annualSavings"] = Number.NaN; }
  try { const v = input.tTotal * input.tTarget * input.freq * input.available; results["capacityGain"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["capacityGain"] = Number.NaN; }
  return results;
}

export function calculateDeiimMatrisiSmed(input) {
  return evaluateAllFormulas(input);
}
