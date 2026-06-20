// Auto-generated from opportunity-zone-calculator-schema.json
import * as z from 'zod';

export interface Opportunity_zone_calculatorInput {
  initialCapitalGain: number;
  federalTaxRate: number;
  stateTaxRate: number;
  holdingYears: number;
  annualAppreciation: number;
  dataConfidence?: number;
}

export const Opportunity_zone_calculatorInputSchema = z.object({
  initialCapitalGain: z.number().default(100000),
  federalTaxRate: z.number().default(23.8),
  stateTaxRate: z.number().default(5),
  holdingYears: z.number().default(10),
  annualAppreciation: z.number().default(7),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Opportunity_zone_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.federalTaxRate + input.stateTaxRate) / 100; results["combinedTaxRate"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["combinedTaxRate"] = Number.NaN; }
  try { const v = input.initialCapitalGain * (toNumericFormulaValue(results["combinedTaxRate"])); results["originalTax"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["originalTax"] = Number.NaN; }
  try { const v = input.holdingYears >= 7 ? 0.15 : (input.holdingYears >= 5 ? 0.10 : 0); results["stepUpRatio"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["stepUpRatio"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["stepUpRatio"])) * input.initialCapitalGain * (toNumericFormulaValue(results["combinedTaxRate"])); results["stepUpSavings"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["stepUpSavings"] = Number.NaN; }
  return results;
}


export function calculateOpportunity_zone_calculator(input: Opportunity_zone_calculatorInput): Opportunity_zone_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["combinedTaxRate"]);
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


export interface Opportunity_zone_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
