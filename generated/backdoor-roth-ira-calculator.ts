// Auto-generated from backdoor-roth-ira-calculator-schema.json
import * as z from 'zod';

export interface Backdoor_roth_ira_calculatorInput {
  traditionalIraBalance: number;
  afterTaxBasis: number;
  conversionAmount: number;
  marginalTaxRate: number;
  dataConfidence?: number;
}

export const Backdoor_roth_ira_calculatorInputSchema = z.object({
  traditionalIraBalance: z.number().default(1000),
  afterTaxBasis: z.number().default(0),
  conversionAmount: z.number().default(6000),
  marginalTaxRate: z.number().default(24),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Backdoor_roth_ira_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.conversionAmount * (1 - input.afterTaxBasis / input.traditionalIraBalance); results["taxableAmount"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["taxableAmount"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["taxableAmount"])) * input.marginalTaxRate / 100; results["taxDue"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["taxDue"] = Number.NaN; }
  try { const v = input.afterTaxBasis / input.traditionalIraBalance * 100; results["afterTaxBasisPct"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["afterTaxBasisPct"] = Number.NaN; }
  return results;
}


export function calculateBackdoor_roth_ira_calculator(input: Backdoor_roth_ira_calculatorInput): Backdoor_roth_ira_calculatorOutput {
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


export interface Backdoor_roth_ira_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
