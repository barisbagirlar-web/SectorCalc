// Auto-generated from import-tax-calculator-schema.json
import * as z from 'zod';

export interface Import_tax_calculatorInput {
  cifValue: number;
  customsDutyRate: number;
  vatRate: number;
  exchangeRate: number;
  additionalTaxRate: number;
}

export const Import_tax_calculatorInputSchema = z.object({
  cifValue: z.number().default(0),
  customsDutyRate: z.number().default(0),
  vatRate: z.number().default(0),
  exchangeRate: z.number().default(1),
  additionalTaxRate: z.number().default(0),
});

function evaluateAllFormulas(input: Import_tax_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.exchangeRate * (input.cifValue * input.customsDutyRate / 100 + (input.cifValue + input.cifValue * input.customsDutyRate / 100) * (input.vatRate + input.additionalTaxRate) / 100); results["primary"] = Number.isFinite(v) ? v : 0; } catch { results["primary"] = 0; }
  try { const v = input.cifValue; results["breakdown"] = Number.isFinite(v) ? v : 0; } catch { results["breakdown"] = 0; }
  results["G_mr_k_Vergisi__Yerel_"] = 0;
  try { const v = KDV (Yerel); results["KDV__Yerel_"] = Number.isFinite(v) ? v : 0; } catch { results["KDV__Yerel_"] = 0; }
  results["Ek_Vergi__Yerel_"] = 0;
  results["result"] = 0;
  return results;
}


export function calculateImport_tax_calculator(input: Import_tax_calculatorInput): Import_tax_calculatorOutput {
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


export interface Import_tax_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
