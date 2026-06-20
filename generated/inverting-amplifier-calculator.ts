// Auto-generated from inverting-amplifier-calculator-schema.json
import * as z from 'zod';

export interface Inverting_amplifier_calculatorInput {
  vin: number;
  rin: number;
  rf: number;
  vcc_plus: number;
  vcc_minus: number;
  dataConfidence?: number;
}

export const Inverting_amplifier_calculatorInputSchema = z.object({
  vin: z.number().default(1),
  rin: z.number().default(1000),
  rf: z.number().default(10000),
  vcc_plus: z.number().default(15),
  vcc_minus: z.number().default(-15),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Inverting_amplifier_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = -(input.rf/input.rin)*input.vin; results["vout_ideal"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["vout_ideal"] = Number.NaN; }
  try { const v = -(input.rf/input.rin)*input.vin; results["vout_ideal_aux"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["vout_ideal_aux"] = Number.NaN; }
  return results;
}


export function calculateInverting_amplifier_calculator(input: Inverting_amplifier_calculatorInput): Inverting_amplifier_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["vout_ideal_aux"]);
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


export interface Inverting_amplifier_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
