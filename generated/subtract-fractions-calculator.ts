// Auto-generated from subtract-fractions-calculator-schema.json
import * as z from 'zod';

export interface Subtract_fractions_calculatorInput {
  numerator1: number;
  denominator1: number;
  numerator2: number;
  denominator2: number;
  simplify: number;
  decimalPrecision: number;
}

export const Subtract_fractions_calculatorInputSchema = z.object({
  numerator1: z.number().default(0),
  denominator1: z.number().default(1),
  numerator2: z.number().default(0),
  denominator2: z.number().default(1),
  simplify: z.number().default(1),
  decimalPrecision: z.number().default(2),
});

function evaluateAllFormulas(input: Subtract_fractions_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.denominator1 * input.denominator2; results["commonDen"] = Number.isFinite(v) ? v : 0; } catch { results["commonDen"] = 0; }
  try { const v = input.numerator1 * input.denominator2; results["num1"] = Number.isFinite(v) ? v : 0; } catch { results["num1"] = 0; }
  try { const v = input.numerator2 * input.denominator1; results["num2"] = Number.isFinite(v) ? v : 0; } catch { results["num2"] = 0; }
  try { const v = (results["num1"] ?? 0) - (results["num2"] ?? 0); results["resultNum"] = Number.isFinite(v) ? v : 0; } catch { results["resultNum"] = 0; }
  try { const v = (results["commonDen"] ?? 0); results["resultDen"] = Number.isFinite(v) ? v : 0; } catch { results["resultDen"] = 0; }
  try { const v = (input.denominator1 == 0 || input.denominator2 == 0) ? true : false; results["error"] = Number.isFinite(v) ? v : 0; } catch { results["error"] = 0; }
  try { const v = (() => { ((a, b) => { return a = Math.abs(a); b = Math.abs(b); while(b) { let t = b; b = a % b; a = t; } return a;; })(a, b) })(); results["gcd"] = Number.isFinite(v) ? v : 0; } catch { results["gcd"] = 0; }
  try { const v = (() => { error ? 0 : (() => { let g = simplify ? gcd(resultNum, resultDen) : 1; let num = resultNum / g; let den = resultDen / g; if (den < 0) { num = -num; den = -den; } return num; })() })(); results["simpNum"] = Number.isFinite(v) ? v : 0; } catch { results["simpNum"] = 0; }
  try { const v = (() => { error ? 0 : (() => { let g = simplify ? gcd(resultNum, resultDen) : 1; let den = resultDen / g; if (den < 0) { den = -den; } return den; })() })(); results["simpDen"] = Number.isFinite(v) ? v : 0; } catch { results["simpDen"] = 0; }
  try { const v = (results["error"] ?? 0) ? null : ((results["simpDen"] ?? 0) !== 0 ? (results["simpNum"] ?? 0) / (results["simpDen"] ?? 0) : null); results["decimalResult"] = Number.isFinite(v) ? v : 0; } catch { results["decimalResult"] = 0; }
  try { const v = (input.decimalPrecision && (results["decimalResult"] ?? 0) !== null) ? Math.round((results["decimalResult"] ?? 0) * Math.pow(10, input.decimalPrecision)) / Math.pow(10, input.decimalPrecision) : (results["decimalResult"] ?? 0); results["decimalRounded"] = Number.isFinite(v) ? v : 0; } catch { results["decimalRounded"] = 0; }
  results["_Step_1__Cross_multiply______numerator1_"] = 0;
  results["_Step_2__Simplify_intermediate______num1"] = 0;
  results["_simplify____Step_3__GCD_______gcd_resul"] = 0;
  results["_Decimal_______decimalRounded_____null__"] = 0;
  results["result"] = 0;
  return results;
}


export function calculateSubtract_fractions_calculator(input: Subtract_fractions_calculatorInput): Subtract_fractions_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["result"] ?? 0;
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


export interface Subtract_fractions_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
