// Auto-generated from atm-to-psi-calculator-schema.json
import * as z from 'zod';

export interface Atm_to_psi_calculatorInput {
  atm: number;
  conversionFactor: number;
  precision: number;
  offset: number;
}

export const Atm_to_psi_calculatorInputSchema = z.object({
  atm: z.number().default(1),
  conversionFactor: z.number().default(14.6959),
  precision: z.number().default(2),
  offset: z.number().default(0),
});

function evaluateAllFormulas(input: Atm_to_psi_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.atm * input.conversionFactor; results["rawPsi"] = Number.isFinite(v) ? v : 0; } catch { results["rawPsi"] = 0; }
  try { const v = (results["rawPsi"] ?? 0) + input.offset; results["psiWithOffset"] = Number.isFinite(v) ? v : 0; } catch { results["psiWithOffset"] = 0; }
  try { const v = Math.round((results["psiWithOffset"] ?? 0) * Math.pow(10, input.precision)) / Math.pow(10, input.precision); results["psi"] = Number.isFinite(v) ? v : 0; } catch { results["psi"] = 0; }
  try { const v = input.atm; results["atm"] = Number.isFinite(v) ? v : 0; } catch { results["atm"] = 0; }
  try { const v = input.conversionFactor; results["conversionFactor"] = Number.isFinite(v) ? v : 0; } catch { results["conversionFactor"] = 0; }
  try { const v = input.offset; results["offset"] = Number.isFinite(v) ? v : 0; } catch { results["offset"] = 0; }
  return results;
}


export function calculateAtm_to_psi_calculator(input: Atm_to_psi_calculatorInput): Atm_to_psi_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["psi"] ?? 0;
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  const dataConfidenceAdjusted =
    typeof (input as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as Record<string, unknown>).dataConfidence as number) / 100)
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
