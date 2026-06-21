// Auto-generated premium calculator: kaynak-mukavemeti
import * as z from 'zod';

export interface KaynakMukavemetiInput {
  kaynakBoyuLeg: number;
  uzunluk: number;
  uygulananYukMoment: number;
  elektrod CekmeDayanımı: number;
  malzemeAkma: number;
  nDTHataOranı: number;
  guvenlikFaktoruHedefi: number;
}

export const KaynakMukavemetiInputSchema = z.object({
  kaynakBoyuLeg: z.number().min(0).default(0),
  uzunluk: z.number().min(0).default(0),
  uygulananYukMoment: z.number().min(0).default(0),
  elektrod CekmeDayanımı: z.number().min(0).default(0),
  malzemeAkma: z.number().min(0).default(0),
  nDTHataOranı: z.number().min(0).default(0),
  guvenlikFaktoruHedefi: z.number().min(0).default(0),
});

function toNumericFormulaValue(value) {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input) {
  const results = {};
  try { const v = input.leg; results["throatThickness"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["throatThickness"] = Number.NaN; }
  try { const v = input.throatThickness * input.length; results["areaShear"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["areaShear"] = Number.NaN; }
  try { const v = input.tensileStrengthElectrode; results["allowableShearStress"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["allowableShearStress"] = Number.NaN; }
  try { const v = input.areaShear * input.allowableShearStress; results["maxLoadShear"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["maxLoadShear"] = Number.NaN; }
  try { const v = input.maxLoadShear * input.appliedLoad; results["safetyFactor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["safetyFactor"] = Number.NaN; }
  try { const v = input.appliedMoment * input.throatThickness * input.momentOfInertia; results["bendingStress"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["bendingStress"] = Number.NaN; }
  try { const v = input.shearStress * input.bendingStress; results["combinedStress"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["combinedStress"] = Number.NaN; }
  return results;
}

export function calculateKaynakMukavemeti(input) {
  return evaluateAllFormulas(input);
}
