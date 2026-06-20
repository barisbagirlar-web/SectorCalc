// Auto-generated from non-inverting-amplifier-calculator-schema.json
import * as z from 'zod';

export interface Non_inverting_amplifier_calculatorInput {
  vin: number;
  r1: number;
  r2: number;
  vcc: number;
  vee: number;
  headroom: number;
  dataConfidence?: number;
}

export const Non_inverting_amplifier_calculatorInputSchema = z.object({
  vin: z.number().default(1),
  r1: z.number().default(10000),
  r2: z.number().default(10000),
  vcc: z.number().default(15),
  vee: z.number().default(-15),
  headroom: z.number().default(1.5),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Non_inverting_amplifier_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 1 + input.r2 / input.r1; results["gain"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["gain"] = Number.NaN; }
  try { const v = input.vin * (1 + input.r2 / input.r1); results["vout_ideal"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["vout_ideal"] = Number.NaN; }
  try { const v = input.vcc - input.headroom; results["vhigh"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["vhigh"] = Number.NaN; }
  try { const v = input.vee + input.headroom; results["vlow"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["vlow"] = Number.NaN; }
  try { const v = ((toNumericFormulaValue(results["vout_ideal"])) > (toNumericFormulaValue(results["vhigh"])) || (toNumericFormulaValue(results["vout_ideal"])) < (toNumericFormulaValue(results["vlow"]))) ? 1 : 0; results["is_clipping"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["is_clipping"] = Number.NaN; }
  return results;
}


export function calculateNon_inverting_amplifier_calculator(input: Non_inverting_amplifier_calculatorInput): Non_inverting_amplifier_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["is_clipping"]);
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


export interface Non_inverting_amplifier_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
