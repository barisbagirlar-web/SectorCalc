// Auto-generated from standard-form-calculator-schema.json
import * as z from 'zod';

export interface Standard_form_calculatorInput {
  number: number;
  sigFig: number;
  notationMode: number;
  roundingMode: number;
}

export const Standard_form_calculatorInputSchema = z.object({
  number: z.number().default(0),
  sigFig: z.number().default(3),
  notationMode: z.number().default(0),
  roundingMode: z.number().default(0),
});

function evaluateAllFormulas(input: Standard_form_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.number === 0 ? 0 : (input.notationMode === 0 ? Math.floor(Math.log10(Math.abs(input.number))) : Math.floor(Math.log10(Math.abs(input.number)) / 3) * 3); results["exponent"] = Number.isFinite(v) ? v : 0; } catch { results["exponent"] = 0; }
  try { const v = (function() { if (number === 0) return 0; var exp = number === 0 ? 0 : (notationMode === 0 ? Math.floor(Math.log10(Math.abs(number))) : Math.floor(Math.log10(Math.abs(number)) / 3) * 3); var m = number / Math.pow(10, exp); if (m === 0) return 0; var d = Math.ceil(Math.log10(Math.abs(m))); var power = sigFig - d; var mag = Math.pow(10, power); return Math.round(m * mag) / mag; })(); results["mantissa"] = Number.isFinite(v) ? v : 0; } catch { results["mantissa"] = 0; }
  try { const v = (results["mantissa"] ?? 0) + ' × 10^' + (results["exponent"] ?? 0); results["primary"] = Number.isFinite(v) ? v : 0; } catch { results["primary"] = 0; }
  return results;
}


export function calculateStandard_form_calculator(input: Standard_form_calculatorInput): Standard_form_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["primary"] ?? 0;
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


export interface Standard_form_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
