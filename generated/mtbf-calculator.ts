// Auto-generated from mtbf-calculator-schema.json
import * as z from 'zod';

export interface Mtbf_calculatorInput {
  operatingHours: number;
  unitCount: number;
  failureCount: number;
  repairHours: number;
  dataConfidence?: number;
}

export const Mtbf_calculatorInputSchema = z.object({
  operatingHours: z.number().default(8760),
  unitCount: z.number().default(1),
  failureCount: z.number().default(5),
  repairHours: z.number().default(50),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Mtbf_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.operatingHours * input.unitCount; results["totalOperationalTime"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalOperationalTime"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalOperationalTime"])) / input.failureCount; results["MTBF"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["MTBF"] = Number.NaN; }
  try { const v = input.repairHours / input.failureCount; results["MTTR"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["MTTR"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["MTBF"])) / ((toNumericFormulaValue(results["MTBF"])) + (toNumericFormulaValue(results["MTTR"]))); results["Availability"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Availability"] = Number.NaN; }
  return results;
}


export function calculateMtbf_calculator(input: Mtbf_calculatorInput): Mtbf_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["MTBF"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? totalWasteCost * (input.dataConfidence / 100)
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


export interface Mtbf_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
