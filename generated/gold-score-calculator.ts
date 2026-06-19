// Auto-generated from gold-score-calculator-schema.json
import * as z from 'zod';

export interface Gold_score_calculatorInput {
  weight: number;
  purity: number;
  marketPrice: number;
  makingChargePercent: number;
  taxRatePercent: number;
  dataConfidence?: number;
}

export const Gold_score_calculatorInputSchema = z.object({
  weight: z.number().default(10),
  purity: z.number().default(24),
  marketPrice: z.number().default(50),
  makingChargePercent: z.number().default(5),
  taxRatePercent: z.number().default(20),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Gold_score_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.weight * (input.purity / 24) * input.marketPrice; results["goldContentValue"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["goldContentValue"] = 0; }
  try { const v = (asFormulaNumber(results["goldContentValue"])) * (input.makingChargePercent / 100); results["makingCharges"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["makingCharges"] = 0; }
  try { const v = ((asFormulaNumber(results["goldContentValue"])) + (asFormulaNumber(results["makingCharges"]))) * (input.taxRatePercent / 100); results["taxAmount"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["taxAmount"] = 0; }
  try { const v = (asFormulaNumber(results["goldContentValue"])) + (asFormulaNumber(results["makingCharges"])) + (asFormulaNumber(results["taxAmount"])); results["totalCost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  try { const v = ((asFormulaNumber(results["goldContentValue"])) / (asFormulaNumber(results["totalCost"]))) * 100; results["goldScore"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["goldScore"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateGold_score_calculator(input: Gold_score_calculatorInput): Gold_score_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["goldScore"]);
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


export interface Gold_score_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
