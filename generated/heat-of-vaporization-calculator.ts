// Auto-generated from heat-of-vaporization-calculator-schema.json
import * as z from 'zod';

export interface Heat_of_vaporization_calculatorInput {
  mass: number;
  initialTemp: number;
  boilingPoint: number;
  specificHeat: number;
  latentHeat: number;
  efficiency: number;
  safetyFactor: number;
  dataConfidence?: number;
}

export const Heat_of_vaporization_calculatorInputSchema = z.object({
  mass: z.number().default(1),
  initialTemp: z.number().default(25),
  boilingPoint: z.number().default(100),
  specificHeat: z.number().default(4.18),
  latentHeat: z.number().default(2260),
  efficiency: z.number().default(100),
  safetyFactor: z.number().default(1),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Heat_of_vaporization_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.mass * input.specificHeat * (input.boilingPoint - input.initialTemp); results["heatingEnergy"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["heatingEnergy"] = 0; }
  try { const v = input.mass * input.latentHeat; results["vaporizationEnergy"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["vaporizationEnergy"] = 0; }
  try { const v = (asFormulaNumber(results["heatingEnergy"])) + (asFormulaNumber(results["vaporizationEnergy"])); results["totalTheoretical"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalTheoretical"] = 0; }
  try { const v = (asFormulaNumber(results["totalTheoretical"])) * input.safetyFactor / (input.efficiency / 100); results["totalRequired"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalRequired"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateHeat_of_vaporization_calculator(input: Heat_of_vaporization_calculatorInput): Heat_of_vaporization_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalRequired"]);
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


export interface Heat_of_vaporization_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
