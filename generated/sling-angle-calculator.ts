// Auto-generated from sling-angle-calculator-schema.json
import * as z from 'zod';

export interface Sling_angle_calculatorInput {
  loadWeight: number;
  numberOfSlingLegs: number;
  slingAngle: number;
  safetyFactor: number;
  dynamicFactor: number;
  efficiencyFactor: number;
  dataConfidence?: number;
}

export const Sling_angle_calculatorInputSchema = z.object({
  loadWeight: z.number().default(1000),
  numberOfSlingLegs: z.number().default(2),
  slingAngle: z.number().default(30),
  safetyFactor: z.number().default(5),
  dynamicFactor: z.number().default(1.2),
  efficiencyFactor: z.number().default(0.8),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Sling_angle_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.loadWeight * input.numberOfSlingLegs * input.slingAngle * input.safetyFactor; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.loadWeight * input.numberOfSlingLegs * input.slingAngle * input.safetyFactor * (input.dynamicFactor * (input.efficiencyFactor / 100)); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.dynamicFactor * (input.efficiencyFactor / 100); results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["adjustment_factor"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateSling_angle_calculator(input: Sling_angle_calculatorInput): Sling_angle_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Model uses normalized input chain — validate units","Assumption-heavy without site benchmark"];
  const suggestedActions: string[] = ["Cross-check with historical actuals","Run sensitivity on top 2 inputs"];
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


export interface Sling_angle_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
