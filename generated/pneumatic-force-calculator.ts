// Auto-generated from pneumatic-force-calculator-schema.json
import * as z from 'zod';

export interface Pneumatic_force_calculatorInput {
  systemPressure: number;
  boreDiameter: number;
  rodDiameter: number;
  cylinderCount: number;
  safetyFactor: number;
  efficiency: number;
  dataConfidence?: number;
}

export const Pneumatic_force_calculatorInputSchema = z.object({
  systemPressure: z.number().default(6),
  boreDiameter: z.number().default(50),
  rodDiameter: z.number().default(25),
  cylinderCount: z.number().default(1),
  safetyFactor: z.number().default(1.5),
  efficiency: z.number().default(0.9),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Pneumatic_force_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.systemPressure * input.boreDiameter * input.rodDiameter * input.cylinderCount; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["normalized_product"] = Number.NaN; }
  try { const v = input.systemPressure * input.boreDiameter * input.rodDiameter * input.cylinderCount * (input.safetyFactor * (input.efficiency / 100)); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  try { const v = input.safetyFactor * (input.efficiency / 100); results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["adjustment_factor"] = Number.NaN; }
  return results;
}


export function calculatePneumatic_force_calculator(input: Pneumatic_force_calculatorInput): Pneumatic_force_calculatorOutput {
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


export interface Pneumatic_force_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
