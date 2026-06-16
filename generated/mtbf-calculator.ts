// Auto-generated from mtbf-calculator-schema.json
import * as z from 'zod';

export interface Mtbf_calculatorInput {
  operatingHours: number;
  unitCount: number;
  failureCount: number;
  repairHours: number;
}

export const Mtbf_calculatorInputSchema = z.object({
  operatingHours: z.number().default(8760),
  unitCount: z.number().default(1),
  failureCount: z.number().default(5),
  repairHours: z.number().default(50),
});

function evaluateAllFormulas(input: Mtbf_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.operatingHours * input.unitCount; results["totalOperationalTime"] = Number.isFinite(v) ? v : 0; } catch { results["totalOperationalTime"] = 0; }
  try { const v = (results["totalOperationalTime"] ?? 0) / input.failureCount; results["MTBF"] = Number.isFinite(v) ? v : 0; } catch { results["MTBF"] = 0; }
  try { const v = input.repairHours / input.failureCount; results["MTTR"] = Number.isFinite(v) ? v : 0; } catch { results["MTTR"] = 0; }
  try { const v = (results["MTBF"] ?? 0) / ((results["MTBF"] ?? 0) + (results["MTTR"] ?? 0)); results["Availability"] = Number.isFinite(v) ? v : 0; } catch { results["Availability"] = 0; }
  return results;
}


export function calculateMtbf_calculator(input: Mtbf_calculatorInput): Mtbf_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["MTBF"] ?? 0;
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


export interface Mtbf_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
