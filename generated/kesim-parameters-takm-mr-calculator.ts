// Auto-generated premium calculator: kesim-parameters-takm-mr
import * as z from 'zod';

export interface KesimParametersTakmMrInput {
  kesmeHızıVc: number;
  IlerlemeF: number;
  derinlikAp: number;
  taylorSabitleriC: number;
  n: number;
  m: number;
  k: number;
  takımUcuMaliyeti: number;
  kenarSayısı: number;
  takımDegisimSuresi: number;
  makine Ucreti: number;
}

export const KesimParametersTakmMrInputSchema = z.object({
  kesmeHızıVc: z.number().min(0).default(0),
  IlerlemeF: z.number().min(0).default(0),
  derinlikAp: z.number().min(0).default(0),
  taylorSabitleriC: z.number().min(0).default(0),
  n: z.number().min(0).default(0),
  m: z.number().min(0).default(0),
  k: z.number().min(0).default(0),
  takımUcuMaliyeti: z.number().min(0).default(0),
  kenarSayısı: z.number().min(0).default(0),
  takımDegisimSuresi: z.number().min(0).default(0),
  makine Ucreti: z.number().min(0).default(0),
});

function toNumericFormulaValue(value) {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input) {
  const results = {};
  try { const v = input.c * input.vC * input.n * input.f * input.m * input.aP * input.k; results["toolLifeT"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["toolLifeT"] = Number.NaN; }
  try { const v = input.t1 * input.t2 * input.v1 * input.v2; results["taylorExponentN"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["taylorExponentN"] = Number.NaN; }
  try { const v = input.toolCost * input.edges * input.machiningTime * input.toolLife; results["costPerPartTool"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["costPerPartTool"] = Number.NaN; }
  try { const v = input.n * input.toolChangeTime * input.toolCost * input.edges * input.machineRate; results["optimalToolLifeCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["optimalToolLifeCost"] = Number.NaN; }
  try { const v = input.c * input.optimalToolLifeCost * input.n; results["optimalVc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["optimalVc"] = Number.NaN; }
  try { const v = input.machiningTime * input.toolLife * input.toolChangeTime; results["productionRate"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["productionRate"] = Number.NaN; }
  return results;
}

export function calculateKesimParametersTakmMr(input) {
  return evaluateAllFormulas(input);
}
