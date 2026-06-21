// Auto-generated premium calculator: makine-ekonomik-mr
import * as z from 'zod';

export interface MakineEkonomikMrInput {
  IlkMaliyetPiyasaDegeri: number;
  kalıntıDeger: number;
  yıllık IsletmeBakımMaliyetleri: number;
  IskontoOranıI: number;
  analizPeriyoduN: number;
  yeniMakineTeklifi: number;
}

export const MakineEkonomikMrInputSchema = z.object({
  IlkMaliyetPiyasaDegeri: z.number().min(0).default(0),
  kalıntıDeger: z.number().min(0).default(0),
  yıllık IsletmeBakımMaliyetleri: z.number().min(0).default(0),
  IskontoOranıI: z.number().min(0).default(0),
  analizPeriyoduN: z.number().min(0).default(0),
  yeniMakineTeklifi: z.number().min(0).default(0),
});

function toNumericFormulaValue(value) {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input) {
  const results = {};
  try { const v = input.initialCost * input.salvageValue * input.a * input.p * input.i * input.n; results["eUACCapital"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["eUACCapital"] = Number.NaN; }
  try { const v = input.opCostT * input.p * input.f * input.i * input.t * input.a * input.n; results["eUACOperating"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["eUACOperating"] = Number.NaN; }
  try { const v = input.eUACCapital * input.eUACOperating; results["totalEUAC"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalEUAC"] = Number.NaN; }
  try { const v = input.n * input.where * input.totalEUAC * input.is * input.mINIMUM; results["economicLife"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["economicLife"] = Number.NaN; }
  try { const v = input.currentMarketValue * input.a * input.p * input.i * input.n * input.opCostDefender; results["defenderEUAC"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["defenderEUAC"] = Number.NaN; }
  try { const v = input.eUACNewMachine; results["challengerEUAC"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["challengerEUAC"] = Number.NaN; }
  try { const v = input.defenderEUAC * input.challengerEUAC * input.replace * input.keep; results["replacementDecision"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["replacementDecision"] = Number.NaN; }
  return results;
}

export function calculateMakineEkonomikMr(input) {
  return evaluateAllFormulas(input);
}
