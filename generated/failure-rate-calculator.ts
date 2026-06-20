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

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Failure_rate_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.totalTime * input.numUnits * (input.dutyCycle / 100); results["effectiveOperatingHours"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["effectiveOperatingHours"] = Number.NaN; }
  try { const v = input.numFailures / (toNumericFormulaValue(results["effectiveOperatingHours"])); results["failureRatePerHour"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["failureRatePerHour"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["effectiveOperatingHours"])) / input.numFailures; results["mtbfHours"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["mtbfHours"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["failureRatePerHour"])) * 1000000; results["failureRateFPMH"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["failureRateFPMH"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["failureRatePerHour"])) * 1000000000; results["failureRateFIT"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["failureRateFIT"] = Number.NaN; }
  return results;
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
