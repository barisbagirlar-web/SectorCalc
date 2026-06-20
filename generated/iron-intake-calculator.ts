// Auto-generated from iron-intake-calculator-schema.json
import * as z from 'zod';

export interface Iron_intake_calculatorInput {
  oreMass: number;
  ironConcentration: number;
  moistureContent: number;
  recoveryRate: number;
  dataConfidence?: number;
}

export const Iron_intake_calculatorInputSchema = z.object({
  oreMass: z.number().default(100),
  ironConcentration: z.number().default(62),
  moistureContent: z.number().default(8),
  recoveryRate: z.number().default(95),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Iron_intake_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.oreMass * (1 - input.moistureContent / 100); results["dryMass"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["dryMass"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["dryMass"])) * (input.ironConcentration / 100); results["ironMass"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["ironMass"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["ironMass"])) * (input.recoveryRate / 100); results["netIron"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["netIron"] = Number.NaN; }
  return results;
}


export function calculateIron_intake_calculator(input: Iron_intake_calculatorInput): Iron_intake_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["netIron"]);
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


export interface Iron_intake_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
