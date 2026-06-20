// Auto-generated from recovery-time-calculator-schema.json
import * as z from 'zod';

export interface Recovery_time_calculatorInput {
  detectionTime: number;
  responseTime: number;
  repairTime: number;
  restartTime: number;
  verificationTime: number;
  dataConfidence?: number;
}

export const Recovery_time_calculatorInputSchema = z.object({
  detectionTime: z.number().default(0.5),
  responseTime: z.number().default(0.5),
  repairTime: z.number().default(2),
  restartTime: z.number().default(0.5),
  verificationTime: z.number().default(0.5),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Recovery_time_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.detectionTime + input.responseTime + input.repairTime + input.restartTime + input.verificationTime; results["totalRecoveryTime"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalRecoveryTime"] = Number.NaN; }
  try { const v = (input.detectionTime / (toNumericFormulaValue(results["totalRecoveryTime"]))) * 100; results["detectionPercentage"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["detectionPercentage"] = Number.NaN; }
  try { const v = (input.responseTime / (toNumericFormulaValue(results["totalRecoveryTime"]))) * 100; results["responsePercentage"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["responsePercentage"] = Number.NaN; }
  try { const v = (input.repairTime / (toNumericFormulaValue(results["totalRecoveryTime"]))) * 100; results["repairPercentage"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["repairPercentage"] = Number.NaN; }
  try { const v = (input.restartTime / (toNumericFormulaValue(results["totalRecoveryTime"]))) * 100; results["restartPercentage"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["restartPercentage"] = Number.NaN; }
  try { const v = (input.verificationTime / (toNumericFormulaValue(results["totalRecoveryTime"]))) * 100; results["verificationPercentage"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["verificationPercentage"] = Number.NaN; }
  return results;
}


export function calculateRecovery_time_calculator(input: Recovery_time_calculatorInput): Recovery_time_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalRecoveryTime"]);
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


export interface Recovery_time_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
