// @ts-nocheck
// Auto-generated from rv-calculator-schema.json
import * as z from 'zod';

export interface Rv_calculatorInput {
  failureRate: number;
  downtimeHours: number;
  costPerHour: number;
  detectionProbability: number;
}

export const Rv_calculatorInputSchema = z.object({
  failureRate: z.number().default(0.5),
  downtimeHours: z.number().default(8),
  costPerHour: z.number().default(1000),
  detectionProbability: z.number().default(0.7),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Rv_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.failureRate * input.downtimeHours * input.costPerHour; results["grossExpectedLoss"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["grossExpectedLoss"] = 0; }
  try { const v = (asFormulaNumber(results["grossExpectedLoss"])) * input.detectionProbability; results["detectionSavings"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["detectionSavings"] = 0; }
  try { const v = (asFormulaNumber(results["grossExpectedLoss"])) - (asFormulaNumber(results["detectionSavings"])); results["annualExpectedLoss"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["annualExpectedLoss"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateRv_calculator(input: Rv_calculatorInput): Rv_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["annualExpectedLoss"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof (input as unknown as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as unknown as Record<string, unknown>).dataConfidence as number) / 100)
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
