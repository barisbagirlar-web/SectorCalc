// Auto-generated premium calculator: diki-hatti-dengeleyici
import * as z from 'zod';

export interface DikiHattiDengeleyiciInput {
  sMVSureleri: number;
  vardiyaDurus: number;
  hedefAdet: number;
  operator: number;
  hedefVerim: number;
  hata: number;
}

export const DikiHattiDengeleyiciInputSchema = z.object({
  sMVSureleri: z.number().min(0).default(0),
  vardiyaDurus: z.number().min(0).default(0),
  hedefAdet: z.number().min(0).default(0),
  operator: z.number().min(0).default(0),
  hedefVerim: z.number().min(0).default(0),
  hata: z.number().min(0).default(0),
});

function toNumericFormulaValue(value) {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input) {
  const results = {};
  try { const v = input.availableTime * input.demand; results["taktTime"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["taktTime"] = Number.NaN; }
  try { const v = input.sMV; results["cycleTotal"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["cycleTotal"] = Number.NaN; }
  try { const v = input.cycleTotal * input.taktTime; results["theoOperators"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["theoOperators"] = Number.NaN; }
  try { const v = input.theoOperators; results["actOperators"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["actOperators"] = Number.NaN; }
  try { const v = input.cycleTotal * input.actOperators * input.taktTime; results["lineEff"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["lineEff"] = Number.NaN; }
  try { const v = input.lineEff; results["balanceDelay"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["balanceDelay"] = Number.NaN; }
  try { const v = input.maxCycle * input.cycleI * input.actOperators; results["smoothness"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["smoothness"] = Number.NaN; }
  try { const v = input.bottleneck * input.takt * input.demand; results["wIP"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["wIP"] = Number.NaN; }
  return results;
}

export function calculateDikiHattiDengeleyici(input) {
  return evaluateAllFormulas(input);
}
