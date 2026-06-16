// Auto-generated from flood-insurance-calculator-schema.json
import * as z from 'zod';

export interface Flood_insurance_calculatorInput {
  propertyValue: number;
  floodZoneFactor: number;
  coverageAmount: number;
  deductible: number;
  buildingTypeFactor: number;
  ageOfBuilding: number;
}

export const Flood_insurance_calculatorInputSchema = z.object({
  propertyValue: z.number().default(500000),
  floodZoneFactor: z.number().default(0.02),
  coverageAmount: z.number().default(400000),
  deductible: z.number().default(5000),
  buildingTypeFactor: z.number().default(1.2),
  ageOfBuilding: z.number().default(10),
});

function evaluateAllFormulas(input: Flood_insurance_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.max(0.8, 1 - input.ageOfBuilding * 0.005); results["depreciationFactor"] = Number.isFinite(v) ? v : 0; } catch { results["depreciationFactor"] = 0; }
  try { const v = input.coverageAmount * input.floodZoneFactor * input.buildingTypeFactor * (results["depreciationFactor"] ?? 0); results["basePremium"] = Number.isFinite(v) ? v : 0; } catch { results["basePremium"] = 0; }
  try { const v = input.deductible * 0.02; results["deductibleCredit"] = Number.isFinite(v) ? v : 0; } catch { results["deductibleCredit"] = 0; }
  try { const v = (results["basePremium"] ?? 0) - (results["deductibleCredit"] ?? 0); results["finalPremium"] = Number.isFinite(v) ? v : 0; } catch { results["finalPremium"] = 0; }
  return results;
}


export function calculateFlood_insurance_calculator(input: Flood_insurance_calculatorInput): Flood_insurance_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["finalPremium"] ?? 0;
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


export interface Flood_insurance_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
