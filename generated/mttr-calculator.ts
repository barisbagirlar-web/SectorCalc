// Auto-generated from mttr-calculator-schema.json
import * as z from 'zod';

export interface Mttr_calculatorInput {
  repairTime: number;
  adminDelay: number;
  logisticsDelay: number;
  numberOfRepairs: number;
  dataConfidence?: number;
}

export const Mttr_calculatorInputSchema = z.object({
  repairTime: z.number().default(10),
  adminDelay: z.number().default(2),
  logisticsDelay: z.number().default(1),
  numberOfRepairs: z.number().default(5),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Mttr_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.repairTime + input.adminDelay + input.logisticsDelay) / input.numberOfRepairs; results["mttr"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["mttr"] = 0; }
  try { const v = input.repairTime + input.adminDelay + input.logisticsDelay; results["totalDowntime"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalDowntime"] = 0; }
  try { const v = input.numberOfRepairs; results["numberOfRepairs"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["numberOfRepairs"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateMttr_calculator(input: Mttr_calculatorInput): Mttr_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["mttr"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
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


export interface Mttr_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
