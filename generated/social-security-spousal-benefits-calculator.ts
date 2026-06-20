// Auto-generated from social-security-spousal-benefits-calculator-schema.json
import * as z from 'zod';

export interface Social_security_spousal_benefits_calculatorInput {
  primaryPIA: number;
  spousePIA: number;
  spouseFilingAge: number;
  spouseFRA: number;
  dataConfidence?: number;
}

export const Social_security_spousal_benefits_calculatorInputSchema = z.object({
  primaryPIA: z.number().default(2000),
  spousePIA: z.number().default(0),
  spouseFilingAge: z.number().default(62),
  spouseFRA: z.number().default(67),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Social_security_spousal_benefits_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.primaryPIA * input.spousePIA * input.spouseFilingAge * input.spouseFRA; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["normalized_product"] = Number.NaN; }
  try { const v = input.primaryPIA * input.spousePIA * input.spouseFilingAge * input.spouseFRA; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculateSocial_security_spousal_benefits_calculator(input: Social_security_spousal_benefits_calculatorInput): Social_security_spousal_benefits_calculatorOutput {
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


export interface Social_security_spousal_benefits_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
