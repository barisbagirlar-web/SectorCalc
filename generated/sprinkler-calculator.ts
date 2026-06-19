// Auto-generated from sprinkler-calculator-schema.json
import * as z from 'zod';

export interface Sprinkler_calculatorInput {
  designArea: number;
  density: number;
  kFactor: number;
  numSprinklers: number;
  safetyFactor: number;
  pipeFrictionLoss: number;
  dataConfidence?: number;
}

export const Sprinkler_calculatorInputSchema = z.object({
  designArea: z.number().default(1500),
  density: z.number().default(0.1),
  kFactor: z.number().default(5.6),
  numSprinklers: z.number().default(12),
  safetyFactor: z.number().default(1.1),
  pipeFrictionLoss: z.number().default(5),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Sprinkler_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.designArea * input.density * input.safetyFactor; results["totalFlow"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalFlow"] = 0; }
  try { const v = (asFormulaNumber(results["totalFlow"])) / input.numSprinklers; results["flowPerSprinkler"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["flowPerSprinkler"] = 0; }
  try { const v = ((asFormulaNumber(results["flowPerSprinkler"])) / input.kFactor) ** 2; results["requiredPressure"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["requiredPressure"] = 0; }
  try { const v = (asFormulaNumber(results["requiredPressure"])) + input.pipeFrictionLoss; results["totalPressure"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalPressure"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateSprinkler_calculator(input: Sprinkler_calculatorInput): Sprinkler_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["totalFlow"]));
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


export interface Sprinkler_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
