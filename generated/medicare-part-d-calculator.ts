// Auto-generated from medicare-part-d-calculator-schema.json
import * as z from 'zod';

export interface Medicare_part_d_calculatorInput {
  annualDrugCost: number;
  deductible: number;
  initialCoinsurance: number;
  catastrophicThreshold: number;
  catastrophicCoinsurance: number;
}

export const Medicare_part_d_calculatorInputSchema = z.object({
  annualDrugCost: z.number().default(5000),
  deductible: z.number().default(590),
  initialCoinsurance: z.number().default(25),
  catastrophicThreshold: z.number().default(2000),
  catastrophicCoinsurance: z.number().default(5),
});

function evaluateAllFormulas(input: Medicare_part_d_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.min(input.annualDrugCost, input.deductible); results["OOP_deductible"] = Number.isFinite(v) ? v : 0; } catch { results["OOP_deductible"] = 0; }
  try { const v = input.annualDrugCost - (results["OOP_deductible"] ?? 0); results["remainingAfterDeductible"] = Number.isFinite(v) ? v : 0; } catch { results["remainingAfterDeductible"] = 0; }
  try { const v = input.catastrophicThreshold - (results["OOP_deductible"] ?? 0); results["OOP_to_reach_threshold"] = Number.isFinite(v) ? v : 0; } catch { results["OOP_to_reach_threshold"] = 0; }
  try { const v = Math.min((results["remainingAfterDeductible"] ?? 0), (results["OOP_to_reach_threshold"] ?? 0) / (input.initialCoinsurance / 100)); results["initialCoverageDrugCost"] = Number.isFinite(v) ? v : 0; } catch { results["initialCoverageDrugCost"] = 0; }
  try { const v = (results["initialCoverageDrugCost"] ?? 0) * (input.initialCoinsurance / 100); results["OOP_initial"] = Number.isFinite(v) ? v : 0; } catch { results["OOP_initial"] = 0; }
  try { const v = (results["OOP_deductible"] ?? 0) + (results["OOP_initial"] ?? 0); results["OOP_so_far"] = Number.isFinite(v) ? v : 0; } catch { results["OOP_so_far"] = 0; }
  try { const v = input.annualDrugCost - (results["OOP_deductible"] ?? 0) - (results["initialCoverageDrugCost"] ?? 0); results["catastrophicDrugCost"] = Number.isFinite(v) ? v : 0; } catch { results["catastrophicDrugCost"] = 0; }
  try { const v = (results["catastrophicDrugCost"] ?? 0) * (input.catastrophicCoinsurance / 100); results["OOP_catastrophic"] = Number.isFinite(v) ? v : 0; } catch { results["OOP_catastrophic"] = 0; }
  try { const v = (results["OOP_deductible"] ?? 0) + (results["OOP_initial"] ?? 0) + (results["OOP_catastrophic"] ?? 0); results["totalOOP"] = Number.isFinite(v) ? v : 0; } catch { results["totalOOP"] = 0; }
  return results;
}


export function calculateMedicare_part_d_calculator(input: Medicare_part_d_calculatorInput): Medicare_part_d_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalOOP"] ?? 0;
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


export interface Medicare_part_d_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
