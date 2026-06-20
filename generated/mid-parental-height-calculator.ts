// Auto-generated from mid-parental-height-calculator-schema.json
import * as z from 'zod';

export interface Mid_parental_height_calculatorInput {
  fatherHeight: number;
  motherHeight: number;
  childSex: number;
  resultUnit: number;
  dataConfidence?: number;
}

export const Mid_parental_height_calculatorInputSchema = z.object({
  fatherHeight: z.number().default(180),
  motherHeight: z.number().default(165),
  childSex: z.number().default(1),
  resultUnit: z.number().default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Mid_parental_height_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.childSex === 1 ? (input.fatherHeight + input.motherHeight + 13) / 2 : (input.fatherHeight + input.motherHeight - 13) / 2; results["midHeightCm"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["midHeightCm"] = Number.NaN; }
  try { const v = input.resultUnit === 1 ? (toNumericFormulaValue(results["midHeightCm"])) / 2.54 : (toNumericFormulaValue(results["midHeightCm"])); results["outputHeight"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["outputHeight"] = Number.NaN; }
  try { const v = 'Baba boyu: ' + input.fatherHeight + ' cm'; results["breakdownStep1"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["breakdownStep1"] = Number.NaN; }
  try { const v = 'Anne boyu: ' + input.motherHeight + ' cm'; results["breakdownStep2"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["breakdownStep2"] = Number.NaN; }
  return results;
}


export function calculateMid_parental_height_calculator(input: Mid_parental_height_calculatorInput): Mid_parental_height_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["midHeightCm"]);
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


export interface Mid_parental_height_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
