// Auto-generated from flat-rate-vat-calculator-schema.json
import * as z from 'zod';

export interface Flat_rate_vat_calculatorInput {
  grossTurnover: number;
  flatRatePercentage: number;
  standardVatRate: number;
  dataConfidence?: number;
}

export const Flat_rate_vat_calculatorInputSchema = z.object({
  grossTurnover: z.number().default(1000),
  flatRatePercentage: z.number().default(13),
  standardVatRate: z.number().default(20),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Flat_rate_vat_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.grossTurnover * input.flatRatePercentage / 100; results["vatPayable"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["vatPayable"] = 0; }
  try { const v = input.grossTurnover * input.standardVatRate / (100 + input.standardVatRate); results["vatCharged"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["vatCharged"] = 0; }
  try { const v = (input.grossTurnover * input.standardVatRate / (100 + input.standardVatRate)) - (input.grossTurnover * input.flatRatePercentage / 100); results["surplus"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["surplus"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateFlat_rate_vat_calculator(input: Flat_rate_vat_calculatorInput): Flat_rate_vat_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["vatPayable"]));
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


export interface Flat_rate_vat_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
