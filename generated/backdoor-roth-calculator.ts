// Auto-generated from backdoor-roth-calculator-schema.json
import * as z from 'zod';

export interface Backdoor_roth_calculatorInput {
  totalIraBalance: number;
  afterTaxBasis: number;
  conversionAmount: number;
  taxRate: number;
  dataConfidence?: number;
}

export const Backdoor_roth_calculatorInputSchema = z.object({
  totalIraBalance: z.number().default(100000),
  afterTaxBasis: z.number().default(5000),
  conversionAmount: z.number().default(7000),
  taxRate: z.number().default(0.24),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Backdoor_roth_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.totalIraBalance > 0 ? input.afterTaxBasis / input.totalIraBalance : 0; results["nonTaxableRatio"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["nonTaxableRatio"] = 0; }
  try { const v = input.conversionAmount * (asFormulaNumber(results["nonTaxableRatio"])); results["nonTaxableAmount"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["nonTaxableAmount"] = 0; }
  try { const v = input.conversionAmount - (asFormulaNumber(results["nonTaxableAmount"])); results["taxableAmount"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["taxableAmount"] = 0; }
  try { const v = (asFormulaNumber(results["taxableAmount"])) * input.taxRate; results["taxDue"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["taxDue"] = 0; }
  try { const v = input.conversionAmount; results["rothAmount"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["rothAmount"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateBackdoor_roth_calculator(input: Backdoor_roth_calculatorInput): Backdoor_roth_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["taxDue"]);
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


export interface Backdoor_roth_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
