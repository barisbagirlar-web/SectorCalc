// Auto-generated from failure-rate-calculator-schema.json
import * as z from 'zod';

export interface Failure_rate_calculatorInput {
  numFailures: number;
  totalTime: number;
  numUnits: number;
  dutyCycle: number;
  dataConfidence?: number;
}

export const Failure_rate_calculatorInputSchema = z.object({
  numFailures: z.number().default(5),
  totalTime: z.number().default(8760),
  numUnits: z.number().default(1),
  dutyCycle: z.number().default(100),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Failure_rate_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.totalTime * input.numUnits * (input.dutyCycle / 100); results["effectiveOperatingHours"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["effectiveOperatingHours"] = 0; }
  try { const v = input.numFailures / (asFormulaNumber(results["effectiveOperatingHours"])); results["failureRatePerHour"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["failureRatePerHour"] = 0; }
  try { const v = (asFormulaNumber(results["effectiveOperatingHours"])) / input.numFailures; results["mtbfHours"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["mtbfHours"] = 0; }
  try { const v = (asFormulaNumber(results["failureRatePerHour"])) * 1000000; results["failureRateFPMH"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["failureRateFPMH"] = 0; }
  try { const v = (asFormulaNumber(results["failureRatePerHour"])) * 1000000000; results["failureRateFIT"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["failureRateFIT"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateFailure_rate_calculator(input: Failure_rate_calculatorInput): Failure_rate_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["failureRateFIT"]);
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


export interface Failure_rate_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
