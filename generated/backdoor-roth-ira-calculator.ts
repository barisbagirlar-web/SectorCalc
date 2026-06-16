// Auto-generated from backdoor-roth-ira-calculator-schema.json
import * as z from 'zod';

export interface Backdoor_roth_ira_calculatorInput {
  traditionalIraBalance: number;
  afterTaxBasis: number;
  conversionAmount: number;
  marginalTaxRate: number;
}

export const Backdoor_roth_ira_calculatorInputSchema = z.object({
  traditionalIraBalance: z.number().default(1000),
  afterTaxBasis: z.number().default(0),
  conversionAmount: z.number().default(6000),
  marginalTaxRate: z.number().default(24),
});

function evaluateAllFormulas(input: Backdoor_roth_ira_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.conversionAmount * (1 - input.afterTaxBasis / input.traditionalIraBalance); results["taxableAmount"] = Number.isFinite(v) ? v : 0; } catch { results["taxableAmount"] = 0; }
  try { const v = (results["taxableAmount"] ?? 0) * input.marginalTaxRate / 100; results["taxDue"] = Number.isFinite(v) ? v : 0; } catch { results["taxDue"] = 0; }
  try { const v = input.afterTaxBasis / input.traditionalIraBalance * 100; results["afterTaxBasisPct"] = Number.isFinite(v) ? v : 0; } catch { results["afterTaxBasisPct"] = 0; }
  return results;
}


export function calculateBackdoor_roth_ira_calculator(input: Backdoor_roth_ira_calculatorInput): Backdoor_roth_ira_calculatorOutput {
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


export interface Backdoor_roth_ira_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
