// Auto-generated from hydraulic-calculator-schema.json
import * as z from 'zod';

export interface Hydraulic_calculatorInput {
  pressure: number;
  flowRate: number;
  efficiency: number;
  boreDia: number;
  rodDia: number;
  dataConfidence?: number;
}

export const Hydraulic_calculatorInputSchema = z.object({
  pressure: z.number().default(100),
  flowRate: z.number().default(50),
  efficiency: z.number().default(85),
  boreDia: z.number().default(80),
  rodDia: z.number().default(40),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Hydraulic_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.pressure * input.flowRate) / (600 * (input.efficiency / 100)); results["power"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["power"] = Number.NaN; }
  try { const v = (input.pressure * Math.PI * input.boreDia**2) / 40000; results["pushForce"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["pushForce"] = Number.NaN; }
  try { const v = (input.pressure * Math.PI * (input.boreDia**2 - input.rodDia**2)) / 40000; results["pullForce"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["pullForce"] = Number.NaN; }
  return results;
}


export function calculateHydraulic_calculator(input: Hydraulic_calculatorInput): Hydraulic_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["power"]);
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


export interface Hydraulic_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
