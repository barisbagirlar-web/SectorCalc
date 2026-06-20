// Auto-generated from atm-to-psi-calculator-schema.json
import * as z from 'zod';

export interface Atm_to_psi_calculatorInput {
  atm: number;
  conversionFactor: number;
  precision: number;
  offset: number;
  dataConfidence?: number;
}

export const Atm_to_psi_calculatorInputSchema = z.object({
  atm: z.number().default(1),
  conversionFactor: z.number().default(14.6959),
  precision: z.number().default(2),
  offset: z.number().default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Atm_to_psi_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.atm * input.conversionFactor; results["rawPsi"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["rawPsi"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["rawPsi"])) + input.offset; results["psiWithOffset"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["psiWithOffset"] = Number.NaN; }
  try { const v = input.atm; results["atm"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["atm"] = Number.NaN; }
  try { const v = input.conversionFactor; results["conversionFactor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["conversionFactor"] = Number.NaN; }
  try { const v = input.offset; results["offset"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["offset"] = Number.NaN; }
  return results;
}


export function calculateAtm_to_psi_calculator(input: Atm_to_psi_calculatorInput): Atm_to_psi_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["offset"]);
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


export interface Atm_to_psi_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
