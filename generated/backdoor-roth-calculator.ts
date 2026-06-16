// Auto-generated from backdoor-roth-calculator-schema.json
import * as z from 'zod';

export interface Backdoor_roth_calculatorInput {
  totalIraBalance: number;
  afterTaxBasis: number;
  conversionAmount: number;
  taxRate: number;
}

export const Backdoor_roth_calculatorInputSchema = z.object({
  totalIraBalance: z.number().default(100000),
  afterTaxBasis: z.number().default(5000),
  conversionAmount: z.number().default(7000),
  taxRate: z.number().default(0.24),
});

function evaluateAllFormulas(input: Backdoor_roth_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.totalIraBalance > 0 ? input.afterTaxBasis / input.totalIraBalance : 0; results["nonTaxableRatio"] = Number.isFinite(v) ? v : 0; } catch { results["nonTaxableRatio"] = 0; }
  try { const v = input.conversionAmount * (results["nonTaxableRatio"] ?? 0); results["nonTaxableAmount"] = Number.isFinite(v) ? v : 0; } catch { results["nonTaxableAmount"] = 0; }
  try { const v = input.conversionAmount - (results["nonTaxableAmount"] ?? 0); results["taxableAmount"] = Number.isFinite(v) ? v : 0; } catch { results["taxableAmount"] = 0; }
  try { const v = (results["taxableAmount"] ?? 0) * input.taxRate; results["taxDue"] = Number.isFinite(v) ? v : 0; } catch { results["taxDue"] = 0; }
  try { const v = input.conversionAmount; results["rothAmount"] = Number.isFinite(v) ? v : 0; } catch { results["rothAmount"] = 0; }
  return results;
}


export function calculateBackdoor_roth_calculator(input: Backdoor_roth_calculatorInput): Backdoor_roth_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["taxDue"] ?? 0;
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


export interface Backdoor_roth_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
