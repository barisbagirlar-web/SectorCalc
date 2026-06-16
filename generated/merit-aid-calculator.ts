// Auto-generated from merit-aid-calculator-schema.json
import * as z from 'zod';

export interface Merit_aid_calculatorInput {
  coa: number;
  meritCapPercent: number;
  otherAid: number;
  efc: number;
}

export const Merit_aid_calculatorInputSchema = z.object({
  coa: z.number().default(50000),
  meritCapPercent: z.number().default(50),
  otherAid: z.number().default(0),
  efc: z.number().default(20000),
});

function evaluateAllFormulas(input: Merit_aid_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.coa * (input.meritCapPercent / 100); results["maxMerit"] = Number.isFinite(v) ? v : 0; } catch { results["maxMerit"] = 0; }
  try { const v = Math.max(0, input.coa - input.otherAid); results["availableForMerit"] = Number.isFinite(v) ? v : 0; } catch { results["availableForMerit"] = 0; }
  try { const v = Math.min((results["maxMerit"] ?? 0), (results["availableForMerit"] ?? 0)); results["meritAwarded"] = Number.isFinite(v) ? v : 0; } catch { results["meritAwarded"] = 0; }
  try { const v = input.coa - input.otherAid - (results["meritAwarded"] ?? 0); results["remainingCost"] = Number.isFinite(v) ? v : 0; } catch { results["remainingCost"] = 0; }
  try { const v = Math.min(input.efc, (results["remainingCost"] ?? 0)); results["outOfPocket"] = Number.isFinite(v) ? v : 0; } catch { results["outOfPocket"] = 0; }
  try { const v = Math.max(0, (results["remainingCost"] ?? 0) - input.efc); results["unmetNeed"] = Number.isFinite(v) ? v : 0; } catch { results["unmetNeed"] = 0; }
  return results;
}


export function calculateMerit_aid_calculator(input: Merit_aid_calculatorInput): Merit_aid_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["meritAwarded"] ?? 0;
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


export interface Merit_aid_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
