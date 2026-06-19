// Auto-generated from spring-force-calculator-schema.json
import * as z from 'zod';

export interface Spring_force_calculatorInput {
  springConstant: number;
  displacement: number;
  wireDiameter: number;
  coilDiameter: number;
  activeCoils: number;
  shearModulus: number;
  dataConfidence?: number;
}

export const Spring_force_calculatorInputSchema = z.object({
  springConstant: z.number().default(0),
  displacement: z.number().default(10),
  wireDiameter: z.number().default(2),
  coilDiameter: z.number().default(20),
  activeCoils: z.number().default(10),
  shearModulus: z.number().default(80000),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Spring_force_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.springConstant * input.displacement * input.wireDiameter * input.coilDiameter; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.springConstant * input.displacement * input.wireDiameter * input.coilDiameter * (input.activeCoils * input.shearModulus); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.activeCoils * input.shearModulus; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["adjustment_factor"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateSpring_force_calculator(input: Spring_force_calculatorInput): Spring_force_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["result"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Model uses normalized input chain — validate units","Assumption-heavy without site benchmark"];
  const suggestedActions: string[] = ["Cross-check with historical actuals","Run sensitivity on top 2 inputs"];
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


export interface Spring_force_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
