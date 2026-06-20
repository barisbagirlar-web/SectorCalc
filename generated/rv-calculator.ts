// Auto-generated from rv-calculator-schema.json
import * as z from 'zod';

export interface Rv_calculatorInput {
  failureRate: number;
  downtimeHours: number;
  costPerHour: number;
  detectionProbability: number;
  dataConfidence?: number;
}

export const Rv_calculatorInputSchema = z.object({
  failureRate: z.number().default(0.5),
  downtimeHours: z.number().default(8),
  costPerHour: z.number().default(1000),
  detectionProbability: z.number().default(0.7),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Rv_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.failureRate * input.downtimeHours * input.costPerHour; results["grossExpectedLoss"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["grossExpectedLoss"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["grossExpectedLoss"])) * input.detectionProbability; results["detectionSavings"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["detectionSavings"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["grossExpectedLoss"])) - (toNumericFormulaValue(results["detectionSavings"])); results["annualExpectedLoss"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["annualExpectedLoss"] = Number.NaN; }
  return results;
}


export function calculateRv_calculator(input: Rv_calculatorInput): Rv_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["annualExpectedLoss"]);
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


export interface Rv_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
