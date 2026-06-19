// Auto-generated from thrust-calculator-schema.json
import * as z from 'zod';

export interface Thrust_calculatorInput {
  massFlowRate: number;
  exhaustVelocity: number;
  exitPressure: number;
  ambientPressure: number;
  exitArea: number;
  dataConfidence?: number;
}

export const Thrust_calculatorInputSchema = z.object({
  massFlowRate: z.number().default(1),
  exhaustVelocity: z.number().default(1000),
  exitPressure: z.number().default(101325),
  ambientPressure: z.number().default(101325),
  exitArea: z.number().default(0.01),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Thrust_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.massFlowRate * input.exhaustVelocity; results["momentumThrust"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["momentumThrust"] = 0; }
  try { const v = (input.exitPressure - input.ambientPressure) * input.exitArea; results["pressureThrust"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["pressureThrust"] = 0; }
  try { const v = input.massFlowRate * input.exhaustVelocity + (input.exitPressure - input.ambientPressure) * input.exitArea; results["totalThrust"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalThrust"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateThrust_calculator(input: Thrust_calculatorInput): Thrust_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalThrust"]);
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


export interface Thrust_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
