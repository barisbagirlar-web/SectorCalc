// Auto-generated premium calculator: fabrika-yerleim-mesafe
import * as z from 'zod';

export interface FabrikaYerleimMesafeInput {
  akısMatrisi: number;
  koordinatX: number;
  y: number;
  alanlar: number;
  tasımaMaliyet: number;
  ekipman: string;
  koridor: number;
  bitisiklik: number;
}

export const FabrikaYerleimMesafeInputSchema = z.object({
  akısMatrisi: z.number().min(0).default(0),
  koordinatX: z.number().min(0).default(0),
  y: z.number().min(0).default(0),
  alanlar: z.number().min(0).default(0),
  tasımaMaliyet: z.number().min(0).default(0),
  ekipman: z.number().min(0).default(0),
  koridor: z.number().min(0).default(0),
  bitisiklik: z.number().min(0).default(0),
});

function toNumericFormulaValue(value) {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input) {
  const results = {};
  try { const v = input.xI * input.xJ * input.yI * input.yJ; results["distIj"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["distIj"] = Number.NaN; }
  try { const v = input.flowIj * input.distIj * input.costPerDist; results["flowCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["flowCost"] = Number.NaN; }
  try { const v = input.flowIj * input.adjFactorIj; results["adjScore"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["adjScore"] = Number.NaN; }
  try { const v = input.equipArea * input.facArea; results["spaceUtil"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["spaceUtil"] = Number.NaN; }
  try { const v = input.flowCost * input.handRate; results["matHandCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["matHandCost"] = Number.NaN; }
  try { const v = input.crossTraffic * input.aisleCap; results["congestion"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["congestion"] = Number.NaN; }
  try { const v = input.matHand * input.space * input.congestion; results["totalCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalCost"] = Number.NaN; }
  return results;
}

export function calculateFabrikaYerleimMesafe(input) {
  return evaluateAllFormulas(input);
}
