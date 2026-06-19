// Auto-generated from paver-patio-calculator-schema.json
import * as z from 'zod';

export interface Paver_patio_calculatorInput {
  patioLength: number;
  patioWidth: number;
  paverLength: number;
  paverWidth: number;
  gap: number;
  wasteFactor: number;
  paverCostPerUnit: number;
  dataConfidence?: number;
}

export const Paver_patio_calculatorInputSchema = z.object({
  patioLength: z.number().default(5),
  patioWidth: z.number().default(4),
  paverLength: z.number().default(0.2),
  paverWidth: z.number().default(0.1),
  gap: z.number().default(0.005),
  wasteFactor: z.number().default(0.05),
  paverCostPerUnit: z.number().default(1),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Paver_patio_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.wasteFactor * input.paverCostPerUnit; results["base_cost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["base_cost"] = 0; }
  try { const v = input.wasteFactor * input.paverCostPerUnit; results["adjusted_cost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["adjusted_cost"] = 0; }
  try { const v = input.wasteFactor * input.paverCostPerUnit * 1 * (input.patioLength * input.patioWidth); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.patioLength; results["factor_patioLength"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["factor_patioLength"] = 0; }
  try { const v = input.patioWidth; results["factor_patioWidth"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["factor_patioWidth"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculatePaver_patio_calculator(input: Paver_patio_calculatorInput): Paver_patio_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["result"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Scrap and rework not in unit price","Volume discount not applied"];
  const suggestedActions: string[] = ["Reconcile unit cost with last PO","Stress-test with +10% waste"];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? Math.max(0, totalWasteCost * (input.dataConfidence / 100))
      : totalWasteCost;
  return {
    totalWasteCost,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Paver_patio_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
