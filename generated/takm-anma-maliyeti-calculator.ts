// Auto-generated premium calculator: takm-anma-maliyeti
import * as z from 'zod';

export interface TakmAnmaMaliyetiInput {
  kesmeSuresiDk: number;
  takım OmruDk: number;
  taylor UssuN: number;
  takımDegisimSuresiDk: number;
  ucInsertFiyatı: number;
  kenarSayısı: number;
  makineSaatlik Ucreti: number;
}

export const TakmAnmaMaliyetiInputSchema = z.object({
  kesmeSuresiDk: z.number().min(0).default(0),
  takım OmruDk: z.number().min(0).default(0),
  taylor UssuN: z.number().min(0).default(0),
  takımDegisimSuresiDk: z.number().min(0).default(0),
  ucInsertFiyatı: z.number().min(0).default(0),
  kenarSayısı: z.number().min(0).default(0),
  makineSaatlik Ucreti: z.number().min(0).default(0),
});

function toNumericFormulaValue(value) {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input) {
  const results = {};
  try { const v = input.insertCost * input.edges * input.machiningTime * input.toolLife; results["toolCostPerPart"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["toolCostPerPart"] = Number.NaN; }
  try { const v = input.toolChangeTime * input.machineRate * input.machiningTime * input.toolLife; results["changeCostPerPart"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["changeCostPerPart"] = Number.NaN; }
  try { const v = input.toolCostPerPart * input.changeCostPerPart; results["totalToolingCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalToolingCost"] = Number.NaN; }
  try { const v = input.flankWear * input.machiningTime; results["wearRate"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["wearRate"] = Number.NaN; }
  try { const v = input.n * input.toolChangeTime * input.insertCost * input.edges * input.machineRate; results["optimalToolLife"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["optimalToolLife"] = Number.NaN; }
  try { const v = input.expectedLife * input.actualLife * input.insertCost; results["costOfPrematureFailure"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["costOfPrematureFailure"] = Number.NaN; }
  return results;
}

export function calculateTakmAnmaMaliyeti(input) {
  return evaluateAllFormulas(input);
}
