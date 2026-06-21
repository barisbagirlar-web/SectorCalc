// Auto-generated premium calculator: yangn-hidrant-ak
import * as z from 'zod';

export interface YangnHidrantAkInput {
  hidrant CapıMm: number;
  statikPitotBasıncBar: number;
  akısKatsayısıCd: number;
  boruUzunluguCapı: number;
  surtunmeKatsayısıF: number;
  gerekliAkısLmin: number;
  gerekliBasıncBar: number;
}

export const YangnHidrantAkInputSchema = z.object({
  hidrant CapıMm: z.number().min(0).default(0),
  statikPitotBasıncBar: z.number().min(0).default(0),
  akısKatsayısıCd: z.number().min(0).default(0),
  boruUzunluguCapı: z.number().min(0).default(0),
  surtunmeKatsayısıF: z.number().min(0).default(0),
  gerekliAkısLmin: z.number().min(0).default(0),
  gerekliBasıncBar: z.number().min(0).default(0),
});

function toNumericFormulaValue(value) {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input) {
  const results = {};
  try { const v = input.cD * input.d * input.pPitot; results["flowRateQ"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["flowRateQ"] = Number.NaN; }
  try { const v = input.pStatic * input.flowRateQ * input.coefficient; results["residualPressure"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["residualPressure"] = Number.NaN; }
  try { const v = input.flowRateQ * input.pStatic * input.pResidual; results["availableFlowAt20psi"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["availableFlowAt20psi"] = Number.NaN; }
  try { const v = input.f * input.length * input.diameter * input.velocity; results["frictionLoss"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["frictionLoss"] = Number.NaN; }
  try { const v = input.elevationHead * input.frictionLoss * input.nozzlePressure; results["requiredPumpHead"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["requiredPumpHead"] = Number.NaN; }
  try { const v = input.availableFlowAt20psi * input.requiredFlow * input.pASS * input.fAIL; results["compliance"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["compliance"] = Number.NaN; }
  return results;
}

export function calculateYangnHidrantAk(input) {
  return evaluateAllFormulas(input);
}
