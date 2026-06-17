// @ts-nocheck
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

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Backdoor_roth_ira_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.conversionAmount * (1 - input.afterTaxBasis / input.traditionalIraBalance); results["taxableAmount"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["taxableAmount"] = 0; }
  try { const v = (asFormulaNumber(results["taxableAmount"])) * input.marginalTaxRate / 100; results["taxDue"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["taxDue"] = 0; }
  try { const v = input.afterTaxBasis / input.traditionalIraBalance * 100; results["afterTaxBasisPct"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["afterTaxBasisPct"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateBackdoor_roth_ira_calculator(input: Backdoor_roth_ira_calculatorInput): Backdoor_roth_ira_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["taxDue"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof (input as unknown as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as unknown as Record<string, unknown>).dataConfidence as number) / 100)
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
