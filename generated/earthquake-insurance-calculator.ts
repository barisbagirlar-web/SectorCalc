// Auto-generated from earthquake-insurance-calculator-schema.json
import * as z from 'zod';

export interface Earthquake_insurance_calculatorInput {
  buildingValue: number;
  seismicZone: number;
  constructionType: number;
  buildingAge: number;
  deductible: number;
}

export const Earthquake_insurance_calculatorInputSchema = z.object({
  buildingValue: z.number().default(500000),
  seismicZone: z.number().default(1),
  constructionType: z.number().default(1),
  buildingAge: z.number().default(10),
  deductible: z.number().default(2),
});

function evaluateAllFormulas(input: Earthquake_insurance_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 0.002 * input.buildingValue; results["basePremium"] = Number.isFinite(v) ? v : 0; } catch { results["basePremium"] = 0; }
  try { const v = input.seismicZone * input.constructionType; results["riskFactor"] = Number.isFinite(v) ? v : 0; } catch { results["riskFactor"] = 0; }
  try { const v = (results["basePremium"] ?? 0) * (results["riskFactor"] ?? 0); results["riskAdjustedPremium"] = Number.isFinite(v) ? v : 0; } catch { results["riskAdjustedPremium"] = 0; }
  try { const v = 1 + input.buildingAge * 0.01; results["ageFactor"] = Number.isFinite(v) ? v : 0; } catch { results["ageFactor"] = 0; }
  try { const v = (results["riskAdjustedPremium"] ?? 0) * (results["ageFactor"] ?? 0); results["ageAdjustedPremium"] = Number.isFinite(v) ? v : 0; } catch { results["ageAdjustedPremium"] = 0; }
  try { const v = 1 - input.deductible / 100; results["deductibleFactor"] = Number.isFinite(v) ? v : 0; } catch { results["deductibleFactor"] = 0; }
  try { const v = (results["ageAdjustedPremium"] ?? 0) * (results["deductibleFactor"] ?? 0); results["finalPremium"] = Number.isFinite(v) ? v : 0; } catch { results["finalPremium"] = 0; }
  return results;
}


export function calculateEarthquake_insurance_calculator(input: Earthquake_insurance_calculatorInput): Earthquake_insurance_calculatorOutput {
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


export interface Earthquake_insurance_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
