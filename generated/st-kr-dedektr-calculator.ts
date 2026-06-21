// Auto-generated premium calculator: st-kr-dedektr
import * as z from 'zod';

export interface StKrDedektrInput {
  gunlukSutVerimiKg: number;
  yagProteinOranı: number;
  yemTuketimiKg: number;
  yemMaliyetiCurrencykg: number;
  sCCSomatikHucre: number;
  saglıkUremeMaliyeti: number;
  sutAlımFiyatıCurrencykg: number;
  cezaEsigi: number;
}

export const StKrDedektrInputSchema = z.object({
  gunlukSutVerimiKg: z.number().min(0).default(0),
  yagProteinOranı: z.number().min(0).default(0),
  yemTuketimiKg: z.number().min(0).default(0),
  yemMaliyetiCurrencykg: z.number().min(0).default(0),
  sCCSomatikHucre: z.number().min(0).default(0),
  saglıkUremeMaliyeti: z.number().min(0).default(0),
  sutAlımFiyatıCurrencykg: z.number().min(0).default(0),
  cezaEsigi: z.number().min(0).default(0),
});

function toNumericFormulaValue(value) {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input) {
  const results = {};
  try { const v = input.milkYield * input.fatYield; results["fatCorrectedMilk"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["fatCorrectedMilk"] = Number.NaN; }
  try { const v = input.milkYield * input.proteinYield; results["proteinCorrectedMilk"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["proteinCorrectedMilk"] = Number.NaN; }
  try { const v = input.totalFeedCost * input.milkYield; results["feedCostPerLiter"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["feedCostPerLiter"] = Number.NaN; }
  try { const v = input.milkPrice * input.milkYield * input.totalFeedCost; results["incomeOverFeedCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["incomeOverFeedCost"] = Number.NaN; }
  try { const v = input.incomeOverFeedCost * input.vetCost * input.breedingCost * input.laborCost; results["marginPerCow"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["marginPerCow"] = Number.NaN; }
  try { const v = input.marginPerCow * input.fixedOverhead; results["herdProfitability"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["herdProfitability"] = Number.NaN; }
  try { const v = input.sCC * input.threshold * input.milkYield * input.penaltyRate; results["somaticCellPenalty"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["somaticCellPenalty"] = Number.NaN; }
  return results;
}

export function calculateStKrDedektr(input) {
  return evaluateAllFormulas(input);
}
