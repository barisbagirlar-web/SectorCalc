// Auto-generated from mileage-reimbursement-calculator-schema.json
import * as z from 'zod';

export interface Mileage_reimbursement_calculatorInput {
  distance: number;
  ratePerKm: number;
  tolls: number;
  parking: number;
  flatAllowance: number;
}

export const Mileage_reimbursement_calculatorInputSchema = z.object({
  distance: z.number().default(100),
  ratePerKm: z.number().default(0.5),
  tolls: z.number().default(0),
  parking: z.number().default(0),
  flatAllowance: z.number().default(0),
});

function evaluateAllFormulas(input: Mileage_reimbursement_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.distance * input.ratePerKm + input.tolls + input.parking + input.flatAllowance; results["totalReimbursement"] = Number.isFinite(v) ? v : 0; } catch { results["totalReimbursement"] = 0; }
  try { const v = input.distance * input.ratePerKm; results["mileageCost"] = Number.isFinite(v) ? v : 0; } catch { results["mileageCost"] = 0; }
  try { const v = input.tolls; results["tolls"] = Number.isFinite(v) ? v : 0; } catch { results["tolls"] = 0; }
  try { const v = input.parking; results["parking"] = Number.isFinite(v) ? v : 0; } catch { results["parking"] = 0; }
  try { const v = input.flatAllowance; results["flatAllowance"] = Number.isFinite(v) ? v : 0; } catch { results["flatAllowance"] = 0; }
  return results;
}


export function calculateMileage_reimbursement_calculator(input: Mileage_reimbursement_calculatorInput): Mileage_reimbursement_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalReimbursement"] ?? 0;
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


export interface Mileage_reimbursement_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
