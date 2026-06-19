// Auto-generated from pneumatic-calculator-schema.json
import * as z from 'zod';

export interface Pneumatic_calculatorInput {
  boreDiameter: number;
  rodDiameter: number;
  pressure: number;
  stroke: number;
  cyclesPerMinute: number;
  safetyFactor: number;
  dataConfidence?: number;
}

export const Pneumatic_calculatorInputSchema = z.object({
  boreDiameter: z.number().default(50),
  rodDiameter: z.number().default(20),
  pressure: z.number().default(6),
  stroke: z.number().default(100),
  cyclesPerMinute: z.number().default(30),
  safetyFactor: z.number().default(10),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Pneumatic_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.boreDiameter * input.rodDiameter * input.pressure * input.stroke; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.boreDiameter * input.rodDiameter * input.pressure * input.stroke * (input.cyclesPerMinute * (input.safetyFactor / 100)); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.cyclesPerMinute * (input.safetyFactor / 100); results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["adjustment_factor"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculatePneumatic_calculator(input: Pneumatic_calculatorInput): Pneumatic_calculatorOutput {
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


export interface Pneumatic_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
