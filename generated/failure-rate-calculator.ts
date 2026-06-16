// Auto-generated from failure-rate-calculator-schema.json
import * as z from 'zod';

export interface Failure_rate_calculatorInput {
  numFailures: number;
  totalTime: number;
  numUnits: number;
  dutyCycle: number;
}

export const Failure_rate_calculatorInputSchema = z.object({
  numFailures: z.number().default(5),
  totalTime: z.number().default(8760),
  numUnits: z.number().default(1),
  dutyCycle: z.number().default(100),
});

function evaluateAllFormulas(input: Failure_rate_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.totalTime * input.numUnits * (input.dutyCycle / 100); results["effectiveOperatingHours"] = Number.isFinite(v) ? v : 0; } catch { results["effectiveOperatingHours"] = 0; }
  try { const v = input.numFailures / (results["effectiveOperatingHours"] ?? 0); results["failureRatePerHour"] = Number.isFinite(v) ? v : 0; } catch { results["failureRatePerHour"] = 0; }
  try { const v = (results["effectiveOperatingHours"] ?? 0) / input.numFailures; results["mtbfHours"] = Number.isFinite(v) ? v : 0; } catch { results["mtbfHours"] = 0; }
  try { const v = (results["failureRatePerHour"] ?? 0) * 1000000; results["failureRateFPMH"] = Number.isFinite(v) ? v : 0; } catch { results["failureRateFPMH"] = 0; }
  try { const v = (results["failureRatePerHour"] ?? 0) * 1000000000; results["failureRateFIT"] = Number.isFinite(v) ? v : 0; } catch { results["failureRateFIT"] = 0; }
  return results;
}


export function calculateFailure_rate_calculator(input: Failure_rate_calculatorInput): Failure_rate_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["Failure"] ?? 0;
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  const dataConfidenceAdjusted =
    typeof (input as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as Record<string, unknown>).dataConfidence as number) / 100)
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
