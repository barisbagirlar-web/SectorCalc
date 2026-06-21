// Auto-generated premium calculator: spc-signal-delay-maliyet
import * as z from 'zod';

export interface SpcSignalDelayMaliyetInput {
  alphaBetaRiskleri: number;
  OrneklemeAralıgıSaat: number;
  UretimHızıAdetsaat: number;
  hataOranıOOC: number;
  hataBasınaMaliyet: number;
  arastırma Isciligi: number;
}

export const SpcSignalDelayMaliyetInputSchema = z.object({
  alphaBetaRiskleri: z.number().min(0).default(0),
  OrneklemeAralıgıSaat: z.number().min(0).default(0),
  UretimHızıAdetsaat: z.number().min(0).default(0),
  hataOranıOOC: z.number().min(0).default(0),
  hataBasınaMaliyet: z.number().min(0).default(0),
  arastırma Isciligi: z.number().min(0).default(0),
});

function toNumericFormulaValue(value) {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input) {
  const results = {};
  try { const v = input.alpha; results["aRLInControl"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["aRLInControl"] = Number.NaN; }
  try { const v = input.beta; results["aRLOutOfControl"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["aRLOutOfControl"] = Number.NaN; }
  try { const v = input.aRLOutOfControl * input.samplingInterval; results["detectionDelayHours"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["detectionDelayHours"] = Number.NaN; }
  try { const v = input.detectionDelayHours * input.productionRate * input.defectRateOOC; results["defectsProduced"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["defectsProduced"] = Number.NaN; }
  try { const v = input.defectsProduced * input.costPerDefect; results["costDelay"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["costDelay"] = Number.NaN; }
  try { const v = input.falseAlarmRate * input.samplingFrequency * input.laborRate; results["investigationCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["investigationCost"] = Number.NaN; }
  try { const v = input.samplingCost * input.productionRate * input.costDelay * input.shiftMagnitude; results["optimalInterval"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["optimalInterval"] = Number.NaN; }
  return results;
}

export function calculateSpcSignalDelayMaliyet(input) {
  return evaluateAllFormulas(input);
}
