// Auto-generated from heart-rate-recovery-calculator-schema.json
import * as z from 'zod';

export interface Heart_rate_recovery_calculatorInput {
  peakHR: number;
  hr1min: number;
  hr2min: number;
  restingHR: number;
  dataConfidence?: number;
}

export const Heart_rate_recovery_calculatorInputSchema = z.object({
  peakHR: z.number().default(160),
  hr1min: z.number().default(140),
  hr2min: z.number().default(120),
  restingHR: z.number().default(70),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Heart_rate_recovery_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.peakHR - input.hr1min; results["recovery1min"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["recovery1min"] = 0; }
  try { const v = input.peakHR - input.hr2min; results["recovery2min"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["recovery2min"] = 0; }
  try { const v = ((asFormulaNumber(results["recovery1min"])) + (asFormulaNumber(results["recovery2min"]))) / 2; results["averageRecovery"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["averageRecovery"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateHeart_rate_recovery_calculator(input: Heart_rate_recovery_calculatorInput): Heart_rate_recovery_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["recovery1min"]);
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


export interface Heart_rate_recovery_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
