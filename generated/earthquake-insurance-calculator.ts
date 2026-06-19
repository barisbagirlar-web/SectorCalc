// Auto-generated from earthquake-insurance-calculator-schema.json
import * as z from 'zod';

export interface Earthquake_insurance_calculatorInput {
  buildingValue: number;
  seismicZone: number;
  constructionType: number;
  buildingAge: number;
  deductible: number;
  dataConfidence?: number;
}

export const Earthquake_insurance_calculatorInputSchema = z.object({
  buildingValue: z.number().default(500000),
  seismicZone: z.number().default(1),
  constructionType: z.number().default(1),
  buildingAge: z.number().default(10),
  deductible: z.number().default(2),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Earthquake_insurance_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 0.002 * input.buildingValue; results["basePremium"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["basePremium"] = 0; }
  try { const v = input.seismicZone * input.constructionType; results["riskFactor"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["riskFactor"] = 0; }
  try { const v = (asFormulaNumber(results["basePremium"])) * (asFormulaNumber(results["riskFactor"])); results["riskAdjustedPremium"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["riskAdjustedPremium"] = 0; }
  try { const v = 1 + input.buildingAge * 0.01; results["ageFactor"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["ageFactor"] = 0; }
  try { const v = (asFormulaNumber(results["riskAdjustedPremium"])) * (asFormulaNumber(results["ageFactor"])); results["ageAdjustedPremium"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["ageAdjustedPremium"] = 0; }
  try { const v = 1 - input.deductible / 100; results["deductibleFactor"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["deductibleFactor"] = 0; }
  try { const v = (asFormulaNumber(results["ageAdjustedPremium"])) * (asFormulaNumber(results["deductibleFactor"])); results["finalPremium"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["finalPremium"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateEarthquake_insurance_calculator(input: Earthquake_insurance_calculatorInput): Earthquake_insurance_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["finalPremium"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? Math.max(0, totalWasteCost * (input.dataConfidence / 100))
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
