// Auto-generated premium calculator: aql-sampling-risk-maliyet
import * as z from 'zod';

export interface AqlSamplingRiskMaliyetInput {
  partiBuyukluguN: number;
  muayeneSeviyesi: string;
  aQL: number;
  lTPD: number;
  birimMuayeneMaliyeti: number;
  kacanHataMaliyeti: number;
}

export const AqlSamplingRiskMaliyetInputSchema = z.object({
  partiBuyukluguN: z.number().min(0).default(0),
  muayeneSeviyesi: z.number().min(0).default(0),
  aQL: z.number().min(0).default(0),
  lTPD: z.number().min(0).default(0),
  birimMuayeneMaliyeti: z.number().min(0).default(0),
  kacanHataMaliyeti: z.number().min(0).default(0),
});

function toNumericFormulaValue(value) {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input) {
  const results = {};
  try { const v = input.lotSize * input.inspectionLevel; results["codeLetter"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["codeLetter"] = Number.NaN; }
  try { const v = input.codeLetter * input.aQL; results["n"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["n"] = Number.NaN; }
  try { const v = input.codeLetter * input.aQL; results["ac"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["ac"] = Number.NaN; }
  try { const v = input.ac * input.n * input.pAQL; results["paProducer"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["paProducer"] = Number.NaN; }
  try { const v = input.paProducer; results["alpha"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["alpha"] = Number.NaN; }
  try { const v = input.ac * input.n * input.pLTPD; results["paConsumer"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["paConsumer"] = Number.NaN; }
  try { const v = input.paConsumer; results["beta"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["beta"] = Number.NaN; }
  try { const v = input.n * input.pa; results["aTI"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["aTI"] = Number.NaN; }
  try { const v = input.n * input.p * input.pa * input.detectionRate * input.costPerDefect; results["totalRiskCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalRiskCost"] = Number.NaN; }
  return results;
}

export function calculateAqlSamplingRiskMaliyet(input) {
  return evaluateAllFormulas(input);
}
