// Auto-generated from sugar-recovery-calculator-schema.json
import * as z from 'zod';

export interface Sugar_recovery_calculatorInput {
  caneWeight: number;
  polCane: number;
  extractionEfficiency: number;
  boilingHouseEfficiency: number;
}

export const Sugar_recovery_calculatorInputSchema = z.object({
  caneWeight: z.number().default(1000),
  polCane: z.number().default(14),
  extractionEfficiency: z.number().default(95),
  boilingHouseEfficiency: z.number().default(90),
});

function evaluateAllFormulas(input: Sugar_recovery_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.caneWeight * input.polCane / 100; results["totalSugar"] = Number.isFinite(v) ? v : 0; } catch { results["totalSugar"] = 0; }
  try { const v = (results["totalSugar"] ?? 0) * input.extractionEfficiency / 100; results["extractedSugar"] = Number.isFinite(v) ? v : 0; } catch { results["extractedSugar"] = 0; }
  try { const v = (results["extractedSugar"] ?? 0) * input.boilingHouseEfficiency / 100; results["recoveredSugar"] = Number.isFinite(v) ? v : 0; } catch { results["recoveredSugar"] = 0; }
  try { const v = (results["totalSugar"] ?? 0) - (results["extractedSugar"] ?? 0); results["extractionLoss"] = Number.isFinite(v) ? v : 0; } catch { results["extractionLoss"] = 0; }
  try { const v = (results["extractedSugar"] ?? 0) - (results["recoveredSugar"] ?? 0); results["boilingLoss"] = Number.isFinite(v) ? v : 0; } catch { results["boilingLoss"] = 0; }
  return results;
}


export function calculateSugar_recovery_calculator(input: Sugar_recovery_calculatorInput): Sugar_recovery_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["recoveredSugar"] ?? 0;
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


export interface Sugar_recovery_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
