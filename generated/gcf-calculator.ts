// Auto-generated from gcf-calculator-schema.json
import * as z from 'zod';

export interface Gcf_calculatorInput {
  number1: number;
  number2: number;
  number3: number;
  number4: number;
}

export const Gcf_calculatorInputSchema = z.object({
  number1: z.number().default(0),
  number2: z.number().default(0),
  number3: z.number().default(0),
  number4: z.number().default(0),
});

function evaluateAllFormulas(input: Gcf_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (() => { (numbers => { const gcd = (a,b) => b ? gcd(b,a%b) : a; return numbers.reduce(gcd); })([number1, number2, number3, number4].filter(n => n != null && !isNaN(n))) })(); results["gcf"] = Number.isFinite(v) ? v : 0; } catch { results["gcf"] = 0; }
  try { const v = (() => { (numbers => { if(numbers.length === 0) return ['No numbers provided']; const g = (nums => { const gcd = (a,b) => b ? gcd(b,a%b) : a; return nums.reduce(gcd); })(numbers); return ['The GCF of ' + numbers.join(', ') + ' is ' + g + '.']; })([number1, number2, number3, number4].filter(n => n != null && !isNaN(n))) })(); results["breakdown"] = Number.isFinite(v) ? v : 0; } catch { results["breakdown"] = 0; }
  return results;
}


export function calculateGcf_calculator(input: Gcf_calculatorInput): Gcf_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["gcf"] ?? 0;
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


export interface Gcf_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
