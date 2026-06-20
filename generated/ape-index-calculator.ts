// Auto-generated from ape-index-calculator-schema.json
import * as z from 'zod';

export interface Ape_index_calculatorInput {
  heightFt: number;
  heightIn: number;
  armspanFt: number;
  armspanIn: number;
  dataConfidence?: number;
}

export const Ape_index_calculatorInputSchema = z.object({
  heightFt: z.number().default(5),
  heightIn: z.number().default(9),
  armspanFt: z.number().default(5),
  armspanIn: z.number().default(9),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Ape_index_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.heightFt * 12 + input.heightIn; results["totalHeightInches"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalHeightInches"] = Number.NaN; }
  try { const v = input.armspanFt * 12 + input.armspanIn; results["totalArmspanInches"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalArmspanInches"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalArmspanInches"])) / (toNumericFormulaValue(results["totalHeightInches"])); results["apeIndexRatio"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["apeIndexRatio"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalArmspanInches"])) - (toNumericFormulaValue(results["totalHeightInches"])); results["apeIndexDiff"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["apeIndexDiff"] = Number.NaN; }
  return results;
}


export function calculateApe_index_calculator(input: Ape_index_calculatorInput): Ape_index_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalHeightInches"]);
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


export interface Ape_index_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
