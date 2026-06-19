// Auto-generated from import-tax-calculator-schema.json
import * as z from 'zod';

export interface Import_tax_calculatorInput {
  cifValue: number;
  customsDutyRate: number;
  vatRate: number;
  exchangeRate: number;
  additionalTaxRate: number;
  dataConfidence?: number;
}

export const Import_tax_calculatorInputSchema = z.object({
  cifValue: z.number().default(0),
  customsDutyRate: z.number().default(0),
  vatRate: z.number().default(0),
  exchangeRate: z.number().default(1),
  additionalTaxRate: z.number().default(0),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Import_tax_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.exchangeRate * (input.cifValue * input.customsDutyRate / 100 + (input.cifValue + input.cifValue * input.customsDutyRate / 100) * (input.vatRate + input.additionalTaxRate) / 100); results["primary"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["primary"] = 0; }
  try { const v = input.cifValue; results["breakdown"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["breakdown"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateImport_tax_calculator(input: Import_tax_calculatorInput): Import_tax_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["breakdown"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? Math.max(0, totalWasteCost * (input.dataConfidence / 100))
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
