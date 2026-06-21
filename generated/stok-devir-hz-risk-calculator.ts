// Auto-generated premium calculator: stok-devir-hz-risk
import * as z from 'zod';

export interface StokDevirHzRiskInput {
  cOGS: number;
  ortalamaStok: number;
  yaslandırmaDagılımı: number;
  wACC: number;
  depolama: number;
  sigortaOranları: number;
  sektorBenchmark: number;
  fireObsolescenceOranları: number;
  kurtarılanDegerOranı: number;
}

export const StokDevirHzRiskInputSchema = z.object({
  cOGS: z.number().min(0).default(0),
  ortalamaStok: z.number().min(0).default(0),
  yaslandırmaDagılımı: z.number().min(0).default(0),
  wACC: z.number().min(0).default(0),
  depolama: z.number().min(0).default(0),
  sigortaOranları: z.number().min(0).default(0),
  sektorBenchmark: z.number().min(0).default(0),
  fireObsolescenceOranları: z.number().min(0).default(0),
  kurtarılanDegerOranı: z.number().min(0).default(0),
});

function toNumericFormulaValue(value) {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input) {
  const results = {};
  try { const v = input.cOGS * input.averageInventory; results["inventoryTurnover"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["inventoryTurnover"] = Number.NaN; }
  try { const v = input.inventoryTurnover; results["daysSalesInventory"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["daysSalesInventory"] = Number.NaN; }
  try { const v = input.agingBracketI * input.obsolescenceRateI * input.inventoryValueI; results["obsolescenceRisk"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["obsolescenceRisk"] = Number.NaN; }
  try { const v = input.averageInventory * input.wACC * input.storage * input.insurance * input.obsolescence; results["carryingCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["carryingCost"] = Number.NaN; }
  try { const v = input.industryBenchmark * input.adjustmentFactor; results["optimalTurnover"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["optimalTurnover"] = Number.NaN; }
  try { const v = input.turnover * input.maxThreshold * input.high * input.low; results["stockoutRisk"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["stockoutRisk"] = Number.NaN; }
  try { const v = input.slowMovingInventory * input.salvageValuePct; results["liquidationLoss"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["liquidationLoss"] = Number.NaN; }
  return results;
}

export function calculateStokDevirHzRisk(input) {
  return evaluateAllFormulas(input);
}
