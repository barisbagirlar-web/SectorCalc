// Auto-generated from flood-insurance-calculator-schema.json
import * as z from 'zod';

export interface Flood_insurance_calculatorInput {
  propertyValue: number;
  floodZoneFactor: number;
  coverageAmount: number;
  deductible: number;
  buildingTypeFactor: number;
  ageOfBuilding: number;
  dataConfidence?: number;
}

export const Flood_insurance_calculatorInputSchema = z.object({
  propertyValue: z.number().default(500000),
  floodZoneFactor: z.number().default(0.02),
  coverageAmount: z.number().default(400000),
  deductible: z.number().default(5000),
  buildingTypeFactor: z.number().default(1.2),
  ageOfBuilding: z.number().default(10),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Flood_insurance_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.propertyValue * input.floodZoneFactor * input.buildingTypeFactor; results["basePremium"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["basePremium"] = Number.NaN; }
  try { const v = input.deductible * 0.02; results["deductibleCredit"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["deductibleCredit"] = Number.NaN; }
  try { const v = 1 - (input.ageOfBuilding * 0.005); results["depreciationFactor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["depreciationFactor"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["basePremium"])) * (toNumericFormulaValue(results["depreciationFactor"])) - (toNumericFormulaValue(results["deductibleCredit"])); results["finalPremium"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["finalPremium"] = Number.NaN; }
  return results;
}


export function calculateFlood_insurance_calculator(input: Flood_insurance_calculatorInput): Flood_insurance_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["finalPremium"]);
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


export interface Flood_insurance_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
