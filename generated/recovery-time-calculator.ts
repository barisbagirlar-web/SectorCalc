// Auto-generated from recovery-time-calculator-schema.json
import * as z from 'zod';

export interface Recovery_time_calculatorInput {
  detectionTime: number;
  responseTime: number;
  repairTime: number;
  restartTime: number;
  verificationTime: number;
}

export const Recovery_time_calculatorInputSchema = z.object({
  detectionTime: z.number().default(0.5),
  responseTime: z.number().default(0.5),
  repairTime: z.number().default(2),
  restartTime: z.number().default(0.5),
  verificationTime: z.number().default(0.5),
});

function evaluateAllFormulas(input: Recovery_time_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.detectionTime + input.responseTime + input.repairTime + input.restartTime + input.verificationTime; results["totalRecoveryTime"] = Number.isFinite(v) ? v : 0; } catch { results["totalRecoveryTime"] = 0; }
  try { const v = (input.detectionTime / (results["totalRecoveryTime"] ?? 0)) * 100; results["detectionPercentage"] = Number.isFinite(v) ? v : 0; } catch { results["detectionPercentage"] = 0; }
  try { const v = (input.responseTime / (results["totalRecoveryTime"] ?? 0)) * 100; results["responsePercentage"] = Number.isFinite(v) ? v : 0; } catch { results["responsePercentage"] = 0; }
  try { const v = (input.repairTime / (results["totalRecoveryTime"] ?? 0)) * 100; results["repairPercentage"] = Number.isFinite(v) ? v : 0; } catch { results["repairPercentage"] = 0; }
  try { const v = (input.restartTime / (results["totalRecoveryTime"] ?? 0)) * 100; results["restartPercentage"] = Number.isFinite(v) ? v : 0; } catch { results["restartPercentage"] = 0; }
  try { const v = (input.verificationTime / (results["totalRecoveryTime"] ?? 0)) * 100; results["verificationPercentage"] = Number.isFinite(v) ? v : 0; } catch { results["verificationPercentage"] = 0; }
  return results;
}


export function calculateRecovery_time_calculator(input: Recovery_time_calculatorInput): Recovery_time_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalRecoveryTime"] ?? 0;
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


export interface Recovery_time_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
